const Wishlist = require("../models/Wishlist");
// Middleware function for getting a specific wishlist item
async function getWishlistItem(req, res, next) {
  let wishlistItem = null;
  try {
    wishlistItem = await Wishlist.findById(req.params.id)
      .populate("productId")
      .populate("userId");
    if (wishlistItem == null) {
      return res.status(404).json({ message: "Cant find wishlist item" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.wishlistItem = wishlistItem;

  next();
}

module.exports = getWishlistItem;
