const productModel = require("../model/productmodel")

const createProduct = async (req, res) => {
  try {
    const newlyInsertProduct = await productModel.create(req.body);
    res.json({
      success: true,
      message: "Product created successfully",
      data: newlyInsertProduct._id,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    
    const pageSize = req.query.pageSize;// No of items per page
    const pageNumber = req.query.pageNumber;// The current page no
    const minPrice = req.query.minPrice;
    const sortBy = req.query.sort === "ASC" ? 1 : req.query.sort === "DSC" ? -1 : 1;//// 1 for ascending, -1 for descending
 
    const productList = await productModel.find({price:{$gte:minPrice}}).sort({price:sortBy}).limit(pageSize).skip((pageNumber-1)*pageSize)
    res.json({
      success: true,
      message: "Product retrieved successfully",
      data: productList,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to retrieve product",
      error: error.message,
    });
  }
};

const editProduct = async (req,res)=>{
  try{
    const productId = req.params.productId;
    const update = await productModel.findByIdAndUpdate(productId,{$set:req.body})
    res.json({
      success:true,
      message:"Product updated successfully",
      })
  }catch{
    res.json({
      success:false,
      message:"Failed to update product",
      })
  }
}

const deleteProduct = async (req,res)=>{
  try{
    const productId = req.params.productId;
    const deleteProduct = await productModel.findByIdAndDelete(productId,{$set:req.body})
    res.json({
      success:true,
      message:"Product deleted successfully",
      })
  }catch{
    res.json({
      success:false,
      message:"Failed to delete product",
      })
  }
}

const productController = {
  createProduct,
  getProduct,
  editProduct,
  deleteProduct
};

module.exports = productController
