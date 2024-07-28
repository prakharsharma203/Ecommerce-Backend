const userModel = require("../model/usermodel");
const productModel = require("../model/productmodel");

const addtoWishlist = async (req, res) => {
  try {
    // Validate if productId belongs to the products collection
    const product = await productModel.findById(req.body.productId);
    if (!product) {
      return res.json({
        status: false,
        message: "Product not found",
      });
    }
    
    const wishlist = await userModel.findByIdAndUpdate(req.user._id, {
      $push: { wishlist: req.body.productId },
    });
    res.json({
      status: true,
      message: "Product added to wishlist",
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const removefromWishlist = async (req, res) => {
  try {
    // Validate if productId belongs to the products collection
    const product = await productModel.findById(req.body.productId);
    if (!product) {
      return res.json({
        status: false,
        message: "Product not found",
      });
    }
    await userModel.findByIdAndUpdate(req.user._id, {
      $pull: { wishlist: req.body.productId },
    });
    res.json({
      status: true,
      message: "Product removed from wishlist",
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await userModel
      .findById(req.user._id)
      .select("wishlist")
      .populate("wishlist");
    res.json({
      status: true,
      message: "Wishlist fetched successfully",
      results: wishlist,
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const wishlistController = {
  addtoWishlist,
  removefromWishlist,
  getWishlist,
};

module.exports = wishlistController;
