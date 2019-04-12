import React, { Component } from "react";
import BookingList from "../components/bookings/booking-list/booking-list";
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

  cancel = booking => {
    this.setState({ isLoading: true });

    const query = {
      query: `
      mutation {
        deleteBooking(booking:"${booking}") {
          _id
          title
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
      .then(result => this.setState(prevState => ({ isLoading: false, bookings: prevState.bookings.filter(b => b._id !== booking) })))
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  render = () =>
    <React.Fragment>
      {this.state.isLoading
        ? <Spinner />
        : <BookingList bookings={this.state.bookings} cancel={this.cancel}></BookingList>}
    </React.Fragment>;
}

export default BookingsPage;