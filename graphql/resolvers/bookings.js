const Event = require("../../models/event");
const Booking = require("../../models/booking");

const { findUser, mapBooking, mapEvent } = require("../../helpers/merge");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();

      return bookings ? bookings.map(booking => mapBooking(booking)) : new Error("Bookings not found!");
    }
    catch (error) {
      throw error;
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

        const b = await booking.save();

        return mapBooking(b);
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

      const event = mapEvent(booking.event);

      await Booking.deleteOne({ _id: args.booking });

      return { ...event, user: findUser.bind(this, event.user) };
    } catch (error) {
      throw error;
    }
  },
}