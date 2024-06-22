const express= require("express")
const router = express.Router()
const Product= require("../models/product")
const {upload}= require("../middleware/multer")
const catchAsyncError = require("../middleware/catchAsyncError")
const ErrorHandler = require("../utils/ErrorHandler")
const Shope = require("../models/shope")




//  create product//

router.post("/create-product" , upload.array("images"), catchAsyncError(async(req,res,next)=>{
    try{

    const shopId= req.body.shopId;
    const shop= await Shope.findById(shopId)
    if(!shop){
           return next(new ErrorHandler("please enter valid shop id!", 400));
    }else{
        const files= req.files;
        const imageUrls= files.map((file)=> `${file.filename}`)
        const productData= req.body
        productData.images= imageUrls
        productData.shop= shop

        const product= await Product.create(productData)

        res.status(201).json({
            success:true,
            product,
        })
    }

    }catch(error){
        return next(new ErrorHandler(err, 400))
    }
}))

// get all products for a shop//

router.get("/get-all-products-shop/:id", catchAsyncError(async(req,res,next)=>{
    try{

        const products= await Product.find({shopId: req.params.id})

        res.status(201).json({
            success:true,
            products

        })

    }catch(error){
            return next(new ErrorHandler(err, 400));
    }
}))

module.exports= router;