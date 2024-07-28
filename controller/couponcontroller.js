const couponModel = require("../model/couponmodel");

const createCoupon = async (req, res) => {
  try {
    const newCoupon = await couponModel.create(req.body);
    res.json({
      success: true,
      message: "Coupon created scucessfully",
      data: newCoupon,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await couponModel.findOne({code});

    if (!coupon || !coupon.isActive || coupon.expirationDate < Date.now()) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired coupon" });
    }
    res.json({
      success: true,
      message: "Coupon is valid",
      data: coupon,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const couponController = {
  createCoupon,
  validateCoupon,
};

module.exports = couponController;
