const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
  createUser: async args => {
    try {
      const user = await User.findOne({ email: args.user.email });

      if (user) throw new Error("User already exists!");

      const password = await bcrypt.hash(args.user.password, 12);

      const createdUser = await new User({ email: args.user.email, password: password, }).save();

      return { email: createdUser.email, _id: createdUser.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });

      if (!user) return new Error("Invalid credentials");

      const authorized = await bcrypt.compare(password, user.password);

      if (!authorized) return new Error("Invalid credentials");

      const token = jwt.sign({ user: user.id, email: user.email }, "somesupersecretkey", { expiresIn: "1h" });

      return {
        user: user.id,
        token: token,
        expiration: 1,
      }

    } catch (err) {
      throw err;
    }
  },
}