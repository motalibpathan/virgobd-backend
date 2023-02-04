const Wishlist = require("../models/wishlistModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// Get all wishlist items for a specific user
exports.getWishlist = async (req, res) => {
  try {
    const userWishlist = await Wishlist.find({
      userId: req.params.userId,
    }).populate("productId");
    res.json({ success: true, data: userWishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add a product to a user's wishlist
exports.addToWishlist = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user)
    return res.status(404).json({ success: false, message: "Invalid User" });

  const product = await Product.findById(req.params.productId);
  if (!product)
    return res.status(404).json({ success: false, message: "Invalid Product" });

  const wishlistItem = new Wishlist({
    userId: req.params.userId,
    productId: req.params.productId,
  });
  try {
    const newWishlistItem = await (
      await wishlistItem.save()
    ).populate("productId");

    res.status(201).json({ success: true, data: newWishlistItem });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Remove a product from a user's wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const removedWishlistItem = await Wishlist.deleteOne({
      userId: req.params.userId,
      productId: req.params.productId,
    });
    if (!removedWishlistItem.deletedCount)
      return res
        .status(404)
        .json({ success: false, message: "Item not found in wishlist" });
    res.json({ success: true, message: "Product removed from wishlist" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
