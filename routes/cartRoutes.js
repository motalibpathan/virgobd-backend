// cartRoutes.js
const express = require("express");
const cartController = require("../controllers/cartController");
const requireAuth = require("../middlewares/requireAuth");

const cartRouter = express.Router();

cartRouter.use(requireAuth);

cartRouter.get("/", cartController.getCart);
cartRouter.post("/add", cartController.addToCart);
cartRouter.post("/remove", cartController.removeFromCart);

module.exports = cartRouter;
