const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const detailSchema = new mongoose.Schema({
  duration: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  force: {
    type: String,
    required: true,
  },
});

const exerciseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  totalDuration: {
    type: String,
    required: true,
  },
  isPT: {
    type: String,
    required: true,
  },
  detail: {
    type: [detailSchema],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

exerciseSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

exerciseSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;
