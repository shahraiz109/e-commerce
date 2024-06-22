const Inbox = require("../models/inbox");
const Withdraw = require("../models/adminwithdraw");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const express = require("express");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const Shope = require("../models/shope");
const router = express.Router();

// create withraw request //

router.post(
  "/create-withdraw-request",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const { amount } = req.body;

      const data = {
        seller: req.seller._id,
        amount,
      };

      const withdraw = await Withdraw.create(data);

      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all withdraws --- admnin

router.get(
  "/get-all-withdraw-request",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const withdraws = await Withdraw.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        withdraws,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//  update withdraw request //

router.put("/update-withdraw-request/:id",isAuthenticated,isAdmin("Admin"),catchAsyncError(async(req,res,next)=>{
  try{
   
     const {sellerId}= req.body;

     const withdraw= await Withdraw.findByIdAndUpdate(req.params.id,{
      status:"succeed",
      updatedAt: Date.now()
     },{new: true})

     const seller= await Shope.findById(sellerId)

     const transection = {
       _id: withdraw._id,
       amount: withdraw.amount,
       updatedAt: withdraw.updatedAt,
       status: withdraw.status,
     };

     seller.transections = [...seller.transections, transection];

     await seller.save()

  }catch(error){
    return next(new ErrorHandler(error.message, 500));
  }
}))

module.exports = router;
