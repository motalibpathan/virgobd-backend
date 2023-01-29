const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

// statics signup method
userSchema.statics.signup = async function ({
  name,
  phone,
  email,
  password,
  avatar,
}) {
  const exists = await this.findOne({ email });

  // Input field check
  if (!name || !email || !password) {
    throw Error("All fields must be filled");
  }

  // check the email is exists or not
  if (exists) {
    throw Error("Email already in use");
  }

  // random password generate & add hash in the password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // create a user with name, email, password
  const user = await this.create({
    name,
    email,
    password: hash,
    phone,
    avatar,
  });

  return user;
};

// statics login
userSchema.statics.login = async function (email, password) {
  // Input fields check
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("User doesn't exist!");
  }

  // compare the password
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Email or password do not match!");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
