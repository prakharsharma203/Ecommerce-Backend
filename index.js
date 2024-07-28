const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const app = express();

const userRoutes = require("./routes/userroute")
const productRoutes = require("./routes/productroute")
const wishlistRoutes = require("./routes/wishlistroute")
const cartRoutes = require("./routes/cartroute")
const orderRoutes = require("./routes/orderroute")
const couponRoutes = require("./routes/couponroute")

//Env configuration
dotenv.config()

//Middleware
app.use(express.json())

//API Routes
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/product",productRoutes)
app.use("/api/v1/wishlist",wishlistRoutes)
app.use("/api/v1/cart",cartRoutes)
app.use("/api/v1/order",orderRoutes)
app.use("/api/v1/coupon",couponRoutes)

//DB Connection
mongoose
  .connect(process.env.DATABASE_URI)
  .then(()=> console.log("DB Connected Successfully"))
  .catch((err)=> console.log("Error connecting DB",err))

app.listen("10000",()=>{
    console.log("Server is running on port 10000");
})