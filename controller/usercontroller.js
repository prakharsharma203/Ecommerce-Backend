const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/usermodel");

const signUp = async (req, res) => {
  try {
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(req.body.password, salt);
    // console.log("Plain Text Password", req.body.password);
    // console.log("Hashed Password", hashPassword);
    
    const newlyInserted = await UserModel.create({...req.body,role:"CUSTOMER",password:hashPassword});
    res.json({
      status: "success",
      message: "Registration completed, please login to continue",
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: "An error occurred while registering the user",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    // User not registered
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }
    const passwordMatching = await bcrypt.compare(req.body.password,user.password)
    // console.log(passwordMatching);
    if (!passwordMatching) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }


    const cuurentTimeInSeconds = Math.floor(new Date().getTime()/1000);
    const expiriTimeInSeconds =  cuurentTimeInSeconds+7200;//2hr from now

    const jwtPayload = {
      userId:user._id,
      role:user.role,
      mobileNo: user.mobileNo,
      exp: expiriTimeInSeconds
    }

    const token = jwt.sign(jwtPayload,"MY_SECRET_KEY")
    const updateUser = await UserModel.findByIdAndUpdate(user._id,{$set:{token}})
    //Save token in DB
    res.json({
      status: "success",
      message: "Login successful",
      token:token,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: "An error occurred while logging in the user",
      error: error.message,
    });
  }
};

const logout = async (req,res)=>{
  try{
    const userId = req.user._id
    console.log(userId);
    const user =  await UserModel.findByIdAndUpdate(userId,{
      $unset:{token:"-"}
    });
    if(!user){
      return res.json({
        status:404,
        message:"User not found"
        });
    }
    res.json({
      status:"success",
      message:"Logout successful"
      });
  }catch(err){
    res.json({
      status:"failed",
      message:"An error occurred while logging out the user",
      error:err.message
      });
  }
}

const controller = {
  signUp,
  login,
  logout
};

module.exports = controller;
