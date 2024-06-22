const express = require("express");
const Shope = require("../models/shope");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const fs = require("fs");
const { upload } = require("../middleware/multer"); // Import the upload middleware
const { isAuthenticated, isSeller } = require("../middleware/auth");

const router = express.Router();

router.post("/create-shop", upload.single("avatar"), async (req, res, next) => {
  try {
    const { name, email, password, address, phoneNumber, zipCode } = req.body;

    // Check if the shop with the same email already exists
    const existingShop = await Shope.findOne({ email });

    if (existingShop) {
      // If you want to delete the uploaded file, you need to have req.file defined
      // and access the filename property as shown below
      if (req.file) {
        const filename = req.file.filename;
        const filePath = `uploads/${filename}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "error deleting file" });
          } else {
            res.json({ message: "file deleted successfully" });
          }
        });
      }

      throw new ErrorHandler("Shop already exists", 400);
    }

    // Assuming your Shope model has a schema to store avatar file URLs
    const fileUrl = req.file ? req.file.path : null;

    // Create a new shop object and save it to the database
    const shop = new Shope({
      name,
      email,
      password,
      avatar: fileUrl,
      address,
      phoneNumber,
      zipCode,
    });

    const newShop = await Shope.create(shop);

    res.status(201).json({
      success: true,
      newShop,
    });

    console.log("🚀 ~ file: shope:57 ~ router.post ~ newShop:", newShop);
  } catch (error) {
    console.log("🚀 ~ file: shope.js:35 ~ router.post ~ error:", error);
    // Pass any errors to the error-handling middleware
    return next(error);
  }
});

// ... Rest of your routes

// login user//
router.post(
  "/login-shop",
  catchAsyncError(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await Shope.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("this user not find", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      res.status(201).json({
        message: "user login successfully on his shope",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//  load user//

router.get(
  "/get/seller",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const seller = await Shope.findById(req.body.id);

      if (!seller) {
        return next(new ErrorHandler("seller doesn't exists!", 400));
      }
      res.status(200).json({
        success: true,
        seller,
      });
    } catch {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller payment method //

router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shope.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
