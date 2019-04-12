import React from 'react';
import BookingItem from './booking-item/booking-item';
import './booking-list.css';

const BookingList = ({ bookings, cancel }) =>
  <ul className="bookings__list">
    {bookings.map(booking => <BookingItem booking={booking} cancel={cancel}></BookingItem>)}
  </ul>

export default BookingList;