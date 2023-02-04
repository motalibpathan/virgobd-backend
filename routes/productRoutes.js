const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const requireAuth = require("../middlewares/requireAuth");

// Get all products
router.get("/", getAllProducts);

// Get a specific product
router.get("/:id", getProduct);

// Create a new product
router.post("/", requireAuth, createProduct);

// Update a specific product
router.patch("/:id", requireAuth, updateProduct);

// Delete a specific product
router.delete("/:id", requireAuth, deleteProduct);

module.exports = router;
