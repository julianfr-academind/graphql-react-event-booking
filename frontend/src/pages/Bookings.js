import React, { Component } from "react";
import Spinner from "../components/spinner/spinner";
import AuthContext from '../context/auth-context';

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });

    const query = {
      query: `
      query {
        bookings {
          _id
          createdAt
          event {
            _id
            title
            date
          }
        }
      }
    `};

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
      .then(result => this.setState({ isLoading: false, bookings: result.data.bookings }))
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  renderBookings = () => this.state.bookings.map(booking =>
    <li key={booking._id}>
      {booking.event.title} - {new Date(booking.event.date).toLocaleDateString()}
    </li>);


  render = () =>
    <React.Fragment>
      {this.state.isLoading
        ? <Spinner />
        : <ul>{this.renderBookings()}</ul>}
    </React.Fragment>;
}

export default BookingsPage;