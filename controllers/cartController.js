const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// Get all cart items for a specific user
exports.getCart = async (req, res) => {
  try {
    const userCart = await Cart.find({
      userId: req.params.userId,
    }).populate("productId");
    res.json({ success: true, data: userCart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add a product to a user's cart
exports.addToCart = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user)
    return res.status(404).json({ success: false, message: "Invalid User" });

  const product = await Product.findById(req.params.productId);
  if (!product)
    return res.status(404).json({ success: false, message: "Invalid Product" });

  const cartItem = new Cart({
    userId: req.params.userId,
    productId: req.params.productId,
    quantity: req.body.quantity,
  });
  try {
    const newCartItem = await cartItem.save();
    res.status(201).json({ success: true, data: newCartItem });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Remove a product from a user's cart
exports.removeFromCart = async (req, res) => {
  try {
    const removedCartItem = await Cart.deleteOne({
      userId: req.params.userId,
      productId: req.params.productId,
    });
    if (!removedCartItem.deletedCount)
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    res.json({ success: true, message: "Product removed from cart" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
