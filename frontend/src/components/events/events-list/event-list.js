import React from 'react';
import EventItem from './event-item/event-item';
import './event-list.css';

const EventList = props => {
  const events = props.events.map(event =>
    <EventItem
      key={event._id}
      event={event._id}
      title={event.title}
      price={event.price}
      date={event.date}
      user={props.authUser}
      creator={event.user._id}
      onDetail={props.onViewDetail}
    ></EventItem>
  );

  return <ul className="event__list">{events}</ul>;
}

export default EventList;