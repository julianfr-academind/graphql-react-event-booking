const mongoose = require("mongoose");

const User = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
});

module.exports = mongoose.model("User", User);