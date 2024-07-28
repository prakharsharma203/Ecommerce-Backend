const userModel = require("../model/usermodel");
const productModel = require("../model/productmodel");

const addtoCart = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.productId);
    if (!product) {
      return res.json({
        status: false,
        message: "Product not found",
      });
    }
    
    const cartItem = {
      _id: req.body.productId,
      quantity: req.body.quantity || 1,
    };
    const cart = await userModel.findByIdAndUpdate(req.user._id, {
      $push: { cart: cartItem },
    });
    res.json({
      status: true,
      message: "Product added to cart successfully",
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

const removeCart = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.productId);
    if (!product) {
      return res.json({
        status: false,
        message: "Product not found",
      });
    }
    await userModel.findByIdAndUpdate(req.user._id, {
      $pull: { cart: { _id: req.body.productId } },
    });
    res.json({
      status: true,
      message: "Product removed from cart successfully",
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("cart._id")
      .select("cart");
    res.json({
      status: true,
      message: "Cart fetched successfully",
      data: user.cart,
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

const cartController = {
  addtoCart,
  removeCart,
  getCart,
};

module.exports = cartController;
