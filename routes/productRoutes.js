const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Get all products
router.get("/", getAllProducts);

// Get a specific product
router.get("/:id", getProduct);

// Create a new product
router.post("/", createProduct);

// Update a specific product
router.patch("/:id", updateProduct);

// Delete a specific product
router.delete("/:id", deleteProduct);

module.exports = router;
