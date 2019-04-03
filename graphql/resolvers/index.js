const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

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

    return e.map(event => ({
      ...event._doc,
      date: new Date(event._doc.date).toISOString(),
      user: findUser(event._doc.user),
    }));
  } catch (err) {
    throw err;
  }
};

const findEvent = async event => {
  try {
    const foundEvent = await Event.findById(event);

    return {
      ...foundEvent._doc,
      date: new Date(foundEvent._doc.date).toISOString(),
      user: findUser(foundEvent._doc.user),
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();

      return events.map(event => ({
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        user: findUser(event._doc.user),
      }));
    } catch (err) {
      throw err;
    }
  },

  bookings: async () => {
    try {
      const bookings = await Booking.find();

      if (bookings) {
        return bookings.map(booking => ({
          ...booking._doc,
          event: findEvent.bind(this, booking.event),
          user: findUser.bind(this, booking.user),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        }));
      } else {
        return new Error("Bookings not found!")
      }
    } catch (error) {
      throw error;
    }
  },

  createEvent: async args => {
    const event = new Event({
      title: args.event.title,
      description: args.event.description,
      price: +args.event.price,
      date: new Date().toISOString(),
      user: "5c6d63af8367d62d6c62deb1",
    });

    try {
      const user = await User.findById("5c6d63af8367d62d6c62deb1");

      if (!user) throw new Error("User doesn't exists.");

      const result = await event.save();

      const createdEvent = { ...result._doc, user: findUser(result._doc.user) };

      user.events.push(createdEvent);

      await user.save();

      return createdEvent;
    } catch (err) {
      throw err;
    }
  },

  createUser: async args => {
    try {
      const user = await User.findOne({ email: args.user.email });

      if (user) throw new Error("User already exists.");

      const password = await bcrypt.hash(args.user.password, 12);

      const createdUser = await new User({ email: args.user.email, password: password, }).save();

      return { email: createdUser.email, _id: createdUser.id };
    } catch (err) {
      throw err;
    }
  },

  createBooking: async args => {
    try {
      const event = await Event.findById(args.event);

      if (event) {
        const booking = new Booking({
          user: "5c6d63af8367d62d6c62deb1",
          event,
        });

        const createdBooking = await booking.save();

        return {
          ...createdBooking._doc,
          event,
          user: findUser.bind(this, booking.user),
          createdAt: new Date(createdBooking._doc.createdAt).toISOString(),
          updatedAt: new Date(createdBooking._doc.updatedAt).toISOString(),
        };
      }
      else {
        throw new Error("Event not found!");
      }
    } catch (error) {
      throw error;
    }
  },

  deleteBooking: async args => {
    try {
      const booking = await Booking.findById(args.booking).populate("event");

      if (!booking) return new Error("Booking not found!");

      const event = { ...booking.event._doc };
      console.log(event);

      await Booking.deleteOne({ _id: args.booking });

      return { ...event, user: findUser.bind(this, event.user) };
    } catch (error) {
      throw error;
    }
  }
}