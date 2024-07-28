const express = require("express");

const productController = require("../controller/productcontroller")
const authMiddleware = require("../middlewares/authmiddleware")
const roleMiddleware = require("../middlewares/rolemiddleware")

const router = express.Router();

router.post("/create",authMiddleware,roleMiddleware(["SELLER","ADMIN"]),productController.createProduct);

router.get("/list",authMiddleware,productController.getProduct);

router.put("/edit/:productId",authMiddleware,roleMiddleware(["SELLER"]),productController.editProduct)

router.delete("/delete/:productId",authMiddleware,roleMiddleware(["SELLER","ADMIN"]),productController.deleteProduct)

module.exports = router;