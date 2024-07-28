const express = require("express")

const router = express.Router()

const controller = require("../controller/usercontroller")
const authMiddleware = require("../middlewares/authmiddleware")

router.post("/signup",controller.signUp)

router.post("/login",controller.login)

router.post("/logout",authMiddleware,controller.logout)

module.exports = router