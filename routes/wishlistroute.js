const express = require("express");

const wishlistController = require("../controller/wishlistcontroller");
const authMiddleware = require("../middlewares/authmiddleware")


const router = express.Router();

router.get("/",authMiddleware,wishlistController.getWishlist)

router.post("/add",authMiddleware,wishlistController.addtoWishlist)

router.post("/remove",authMiddleware,wishlistController.removefromWishlist)

module.exports = router