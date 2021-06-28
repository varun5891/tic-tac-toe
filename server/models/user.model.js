import mongoose from "mongoose";

const opts = { toJSON: { virtuals: true } };

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    status: String,
    email: String,
    password: String,
    registrationdate: Date,
    lastlogindate: Date,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  }, opts)
);

export default User;