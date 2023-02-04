// external imports
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
require("dotenv").config();

// internal imports
const UserModel = require("../models/userModel");

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

const createToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// signup controller
const signupUser = async (req, res) => {
  // get all info from user
  const { name, email, password, phone } = req.body;

  try {
    const user = await UserModel.signup({ name, email, password, phone });
    const {
      password: pw,
      __v,
      createdAt,
      updatedAt,
      ...rest
    } = user.toObject();
    const token = createToken({ _id: user._id });
    res.status(200).json({
      success: true,
      data: { user: rest, token },
      message: "Login successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//google signup
const googleSignup = async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
    const response = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
    });

    const { email_verified, name, email, picture } = response.payload;

    if (email_verified) {
      const exist = await UserModel.findOne({ email });
      if (exist) {
        const {
          password: pw,
          __v,
          createdAt,
          updatedAt,
          ...rest
        } = exist.toObject();
        const token = createToken({ _id: exist._id });
        return res.status(200).json({
          success: true,
          data: { user: rest, token },
          message: "Google Login successful",
        });
      }
      const password = email + process.env.JWT_SECRET;
      const user = await UserModel.signup({
        name,
        email,
        password,
        avatar: picture,
      });
      const {
        password: pw,
        __v,
        createdAt,
        updatedAt,
        ...rest
      } = user.toObject();
      const token = createToken({ _id: user._id });
      res.status(200).json({
        success: true,
        data: { user: rest, token },
        message: "Google Signup successful",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//facebook signup

const facebookSignup = async (req, res) => {
  const access_token = req.body.access_token;
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v9.0/me?fields=id,name,email,picture.type(large)&access_token=${access_token}`
    );
    const { data } = response;
    const { name, email, picture } = data;

    const exist = await UserModel.findOne({ email });
    if (exist) {
      const {
        password: pw,
        __v,
        createdAt,
        updatedAt,
        ...rest
      } = exist.toObject();
      const token = createToken({ _id: exist._id });
      return res.status(200).json({
        success: true,
        data: { user: rest, token },
        message: "Facebook Login successful",
      });
    }
    const password = email + process.env.JWT_SECRET;
    const user = await UserModel.signup({
      name,
      email,
      password,
      avatar: picture.data.url,
    });
    const {
      password: pw,
      __v,
      createdAt,
      updatedAt,
      ...rest
    } = user.toObject();
    const token = createToken({ _id: user._id });
    res.status(200).json({
      success: true,
      data: { user: rest, token },
      message: "Facebook Signup successful",
    });
  } catch (err) {
    if (err) return res.status(500).json({ message: "Authentication Error" });
  }
};

// login controller
const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await UserModel.login(phone, password);

    // create a token
    const token = createToken({ _id: user._id });
    const {
      password: pw,
      __v,
      createdAt,
      updatedAt,
      ...rest
    } = user.toObject();
    res.status(200).json({
      success: true,
      data: { user: rest, token },
      message: "Login successful",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// get single user
const singleUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user._id !== id && req.user.role === "user") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access!",
      });
    }
    const user = await UserModel.findById({ _id: id });
    if (!user) {
      return res.status(400).json({ success: false, error: "Not such a user" });
    } else {
      res.status(200).json({
        success: true,
        data: user,
        message: "This is a single user",
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// get current user
const getCurrentUser = async (req, res) => {
  const { password, ...rest } = req.user.toObject();
  res.send({ status: true, data: { user: rest } });
};

// update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name: req.body?.name,
          email: req.body?.email,
          password: req.body?.password,
          phone2: req.body?.phone2,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
    const { password: pw, ...rest } = user.toObject();
    res.status(200).json({
      success: true,
      data: rest,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// export module
module.exports = {
  signupUser,
  loginUser,
  updateUser,
  singleUser,
  googleSignup,
  facebookSignup,
  getCurrentUser,
};
