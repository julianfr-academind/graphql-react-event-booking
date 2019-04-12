import React, { Component } from "react";
import Backdrop from '../components/backdrop/Backdrop';
import EventList from "../components/events/events-list/event-list";
import Modal from '../components/modal/Modal';
import Spinner from "../components/spinner/spinner";
import AuthContext from "../context/auth-context";
import './Events.css';

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
  };

  isActive = true;

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
      .then(result => {
        this.setState(prevState => {
          const events = [...prevState.events];

          events.push({
            _id: this.context.user,
            title: result.data.createEvent.title,
            description: result.data.createEvent.description,
            date: result.data.createEvent.date,
            price: result.data.createEvent.price,
            user: {
              _id: this.context.user,
            }
          });

          return { creating: false, events }
        });
      })
      .catch(err => console.log(err));
  }

  fetchEvents() {
    this.setState({ isLoading: true });

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
        if (this.isActive) this.setState({ events, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false })
      });
  }

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  }

  showDetailHandler = event => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === event);
      return { selectedEvent };
    });
  }

  bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    };

    this.setState({ isLoading: true });

    const query = {
      query: `
        mutation {
          createBooking(event:"${this.state.selectedEvent._id}"){
            _id
            createdAt
            updatedAt
          }
        }
      `
    };

    fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.context.token,
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(data => {
        console.log(data.data);
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false })
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render = () => (
    <React.Fragment>
      {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
      {this.state.creating &&
        <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
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
      {this.state.selectedEvent &&
        <Modal title={this.state.selectedEvent.title} canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.bookEventHandler} confirmText={this.context.token ? "Book" : "Confirm"}>
          <h1>{this.state.selectedEvent.title}</h1>
          <h2>${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
          <p>{this.state.selectedEvent.description}</p>
        </Modal>}
      {this.context.token && <div className="events-control">
        <p>Share your own Events!</p>
        <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
      </div>}
      {this.state.isLoading
        ? <Spinner />
        : <EventList events={this.state.events} authUser={this.context.user} onViewDetail={this.showDetailHandler}></EventList>}
    </React.Fragment>
  );
}

export default EventsPage;