const User = require("../models/user");
const Event = require("../models/event");

const { dateToString } = require("./date");

const mapEvent = event => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    user: findUser.bind(this, event._doc.user),
  };
};

const mapBooking = booking => {
  return {
    ...booking._doc,
    event: findEvent.bind(this, booking.event),
    user: findUser.bind(this, booking.user),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

const findUser = async user => {
  try {
    const u = await User.findById(user);

    return {
      ...u._doc,
      events: findEvents(u.events)
    };
  } catch (err) {
    throw err;
  }
};

const findEvents = async events => {
  try {
    const e = await Event.find({ _id: { $in: events } });

    return e.map(event => mapEvent(event));
  } catch (err) {
    throw err;
  }
};

const findEvent = async event => {
  try {
    const e = await Event.findById(event);

    return mapEvent(e);
  } catch (error) {
    throw error;
  }
};

module.exports = { mapEvent, mapBooking, findUser, findEvent, findEvents }