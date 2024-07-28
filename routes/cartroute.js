const express = require("express")

const authMiddleware = require("../middlewares/authmiddleware")
const cartController = require("../controller/cartcontroller")

const router = express.Router();

router.post("/add",authMiddleware,cartController.addtoCart)

router.post("/remove",authMiddleware,cartController.removeCart)

router.get("/",authMiddleware,cartController.getCart)

module.exports = router
