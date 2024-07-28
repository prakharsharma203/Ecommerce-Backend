const orderModel = require("../model/ordermodel");
const productModel = require("../model/productmodel");
const couponModel = require("../model/couponmodel");
const Razorpay = require("razorpay");

const dotenv = require("dotenv")

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.SECRET_ID,
});

const placeOrder = async (req, res) => {
  /**
   * 1. Check if the items are in stock
   * 2. Calculate the total amount of the order
   * 3. Check mode of payment if COD, no change, if ONLINE, then redirect the user to payment gateway
   * 4. Place order (Save details into DB)
   * 5. Send a order confirmation email / SMS
   * 6. Reduce inventory / stock
   */
  try {
    const productIds = req.body.items.map((productid) => productid.product);
    const productList = await productModel.find({ _id: productIds });

    // 1. Check if the items are in stock
    const itemInStock = req.body.items.every(
      (p) =>
        productList.find((product) => product._id == p.product).stock >= p.qty
    );

    if (!itemInStock) {
      return res.status(400).send({ message: "Items are not in stock" });
    }

    // 2. Calculate the total amount of the order
    let totalAmount = productList.reduce((total, product) => {
      const productQty = req.body.items.find(
        (p) => p.product == product._id
      ).qty;
      return total + product.price * productQty;
    }, 0);

    // Adding delivery charges if applicable
    if (totalAmount < 500) {
      totalAmount += 50; // Delivery Charges
    }

    // If the order total is above 1000, then do not allow the user to place COD Orders
    // 3. Check mode of payment
    // if (modeOfPayment === "COD" && totalAmount > 1000) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "COD not available for orders above 1000",
    //   });
    // }

    // Apply coupon if provided
    let coupon = null;
    const couponCode = req.body.couponCode;
    if (couponCode) {
      coupon = await couponModel.findOne({ code: couponCode });

      if (!coupon || !coupon.isActive || coupon.expirationDate < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired coupon" });
      }

      if (coupon.type === "percentage") {
        totalAmount -= (totalAmount * coupon.discount) / 100;
      } else if (coupon.type === "flat") {
        totalAmount -= coupon.discount;
      }

      // Ensure total amount is not negative
      totalAmount = Math.floor(Math.max(totalAmount, 0));
      coupon.isActive = false;
      coupon.save();
    }

    const orderDetails = {
      items: req.body.items,
      totalAmount: totalAmount,
      coupon: coupon ? coupon._id : null,
      deliveryAddress: req.body.deliveryAddress,
      billingAddress: req.body.deliveryAddress, // Same as delivery address
      modeOfPayment: req.body.modeOfPayment,
      orderStatus: "PENDING",
      user: req.user._id,
    };

    const { _id } = await orderModel.create(orderDetails);

    if (req.body.modeOfPayment === "ONLINE") {
      // Redirect the user to payment Gateway
      const paymentIntegration = {
        amount: Math.ceil(totalAmount * 100), // amount in the smallest currency unit (paisa)
        currency: "INR",
        receipt: _id, // place your actual order id here
      };
      try {
        const pgResponse = await razorpay.orders.create(paymentIntegration);
        console.log("Payment Gateway Response: ", pgResponse);
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Payment gateway error",
          error: err.message,
        });
      }
    }

    // Todo: Send an email with order confirmation

    req.body.items.forEach(async (product) => {
      await productModel.findByIdAndUpdate(product.product, {
        $inc: { stock: -product.qty },
      });
    });

    res.json({
      success: true,
      message: "Order placed successfully",
      data: _id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const orderController = {
  placeOrder,
};

module.exports = orderController;
