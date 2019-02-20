const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");

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

  createEvent: async args => {
    const event = new Event({
      title: args.event.title,
      description: args.event.description,
      price: +args.event.price,
      date: new Date().toISOString(),
      user: "5c656eb62b75bd2650daa55b",
    });

    try {
      const user = await User.findById("5c656eb62b75bd2650daa55b");

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
}