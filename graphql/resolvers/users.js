const bcrypt = require("bcryptjs");

const User = require("../../models/user");

module.exports = {
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