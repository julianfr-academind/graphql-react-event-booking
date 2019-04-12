
import React from 'react';
import './booking-item.css';

const BookingItem = ({ booking, cancel }) =>
  <li key={booking._id} className="bookings__item" >
    <div className="bookings__item-data">
      {booking.event.title} - {new Date(booking.event.date).toLocaleDateString()}
    </div>
    <div className="bookings__item-actions">
      <button className="btn" onClick={cancel.bind(this, booking._id)}>Cancel</button>
    </div>
  </li>

export default BookingItem;