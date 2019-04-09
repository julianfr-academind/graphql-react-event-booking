import React, { Component } from "react";
import Backdrop from '../components/backdrop/Backdrop';
import Modal from '../components/modal/Modal';
import AuthContext from "../context/auth-context";
import './Events.css';

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  }

  modalConfirmHandler = () => {
    this.setState({ creating: true });

    const title = this.titleElRef.current.value;
    const price = this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (!title.trim().length || !price.trim().length || !date.trim().length || !description.trim().length) return;

    const mutation = {
      query: `
        mutation {
          createEvent(event: {title:"${title}", description:"${description}", price:${+price}}){
            _id
            title
            description
            date
            price
            user{
              _id
              email
            }
          }
        }
      `
    };

    const token = this.context.token;

    fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(mutation),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(data => {
        this.fetchEvents();
        this.setState({ creating: false });
      })
      .catch(err => console.log(err));
  }

  fetchEvents() {
    const query = {
      query: `
        query {
          events{
            _id
            title
            description
            date
            price
            user{
              _id
              email
            }
          }
        }
      `
    };

    fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(data => {
        const events = data.data.events;
        this.setState({ events });
      })
      .catch(err => console.log(err));
  }

  modalCancelHandler = () => {
    this.setState({ creating: false });
  }

  render() {

    const eventList = this.state.events.map(event => {
      return <li key={event._id} className="events__list-item">{event.title}</li>
    })
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={this.titleElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="title">Price</label>
              <input type="number" id="price" ref={this.priceElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="title">Date</label>
              <input type="datetime-local" id="date" ref={this.dateElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="title">Description</label>
              <textarea id="description" rows="4" ref={this.descriptionElRef} />
            </div>
          </form>
        </Modal>}
        {this.context.token && <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
        </div>}
        <ul className="events__list">
          {eventList}
        </ul>
      </React.Fragment>
    );
  }
}

export default EventsPage;