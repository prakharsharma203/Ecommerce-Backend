const express = require("express")

const authMidlleware = require("../middlewares/authmiddleware")
const orderController = require("../controller/ordercontroller")

const router = express.Router();

router.post("/",authMidlleware,orderController.placeOrder)

module.exports = router;