const catchAsyncError = require("../middleware/catchAsyncError");
const Shope = require("../models/shope");
const ErrorHandler = require("../utils/ErrorHandler");
const express= require ("express")
const router= express.Router()
const {upload}= require("../middleware/multer");
const Event = require("../models/event");




router.post(
  "/create-event",
  upload.array("images"),
  catchAsyncError(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shope.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("please enter valid shop id!", 400));
      } else {
        const files = req.files;
        const imageUrls = files.map((file) => `${file.filename}`);
        const eventData = req.body;
        eventData.images = imageUrls;
        eventData.shop = shop;

        const product = await Event.create(eventData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(err, 400));
    }
  })
);

module.exports= router  