import React from 'react';
import './event-item.css';

const EventItem = props => {
  return <li key={props.event} className="event__list-item">
    <div  >
      <h1>{props.title}</h1>
      <h2>${props.price} - {new Date(props.date).toLocaleDateString()}</h2>
    </div>
    <div>
      {props.user === props.creator
        ? <p>You're the owner of this event</p>
        : <button className="btn" onClick={props.onDetail.bind(this, props.event)}>view Details</button>}
    </div>
  </li>
};

export default EventItem;