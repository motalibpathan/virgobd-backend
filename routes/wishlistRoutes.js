const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

// Get all wishlist items for a specific user
router.get("/:userId", requireAuth, getWishlist);

// Add a product to a user's wishlist
router.post("/:userId/:productId", requireAuth, addToWishlist);

// Remove a product from a user's wishlist
router.delete("/:userId/:productId", requireAuth, removeFromWishlist);

module.exports = router;
