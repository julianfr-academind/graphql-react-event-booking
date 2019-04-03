const Event = require("../../models/event");

const { dateToString } = require("../../helpers/date");
const { mapEvent } = require("../../helpers/merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();

      return events.map(event => mapEvent(event))
    } catch (err) {
      throw err;
    }
  },

  createEvent: async args => {
    const event = new Event({
      title: args.event.title,
      description: args.event.description,
      price: +args.event.price,
      date: dateToString(),
      user: "5c6d63af8367d62d6c62deb1",
    });

    try {
      const user = await User.findById("5c6d63af8367d62d6c62deb1");

      if (!user) throw new Error("User doesn't exists.");

      const e = await event.save();
      const createdEvent = mapEvent(e);

      user.events.push(createdEvent);

      await user.save();

      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
}