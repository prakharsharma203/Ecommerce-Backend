const express = require("express")

const couponController = require("../controller/couponcontroller")
const authMiddleware = require("../middlewares/authmiddleware")
const router = express.Router()

router.post("/create",authMiddleware,couponController.createCoupon)

router.post("/validate",authMiddleware,couponController.validateCoupon)

module.exports = router