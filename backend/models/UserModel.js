const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      unique: true,
      required: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Please enter a valid email address",
      ],
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\+91[1-9]\d{9}$/.test(v); // Phone number should be exactly 10 digits and not start with 0
        },
        message: "Phone number must be 10 digits and should not start with 0",
      },
    },

    password: { type: String, required: true },
    profileImage: { type: String },
    location: { type: String },
    age: { type: Number },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", UserSchema);
