const express = require("express");
const {
  signupUser,
  loginUser,
  updateUser,
  singleUser,
  googleSignup,
  facebookSignup,
  getCurrentUser,
} = require("../controllers/userController");

const requireAuth = require("../middlewares/requireAuth");

// express router
const router = express();

// signup user
router.post("/signup", signupUser);

// google signup
router.post("/google", googleSignup);
router.post("/facebook", facebookSignup);

// login user
router.post("/login", loginUser);

// single user
router.get("/user", requireAuth, getCurrentUser);

// single user
router.get("/user/:id", requireAuth, singleUser);

// update user
router.patch("/updatedUser/:id", requireAuth, updateUser);

// export router
module.exports = router;
