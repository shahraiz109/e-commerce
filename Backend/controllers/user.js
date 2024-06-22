const express = require("express");
const User = require("../models/user");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const fs = require("fs");
const { upload } = require("../middleware/multer"); // Import the upload middleware
const cloudinary = require("cloudinary");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/create-user", upload.single("avatar"), async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
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

      throw new ErrorHandler("User already exists", 400);
    }

    // const myCloud= await cloudinary.v2.uploader.upload(avatar,{
    //   folder:"avatars"
    // })

    // Assuming your User model has a schema to store avatar file URLs
    // const fileUrl = req.file ? req.file.path : null;

    // Create a new user object and save it to the database
    const user = new User({
      name,
      email,
      password,
      // avatar:{
      //   public_id: myCloud.public_id,
      //   url: myCloud.secure_url,
      // }
    });

    const newUser = await User.create(user);

    console.log("🚀 ~ file: user.js:30 ~ router.post ~ newUser:", newUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log("🚀 ~ file: user.js:35 ~ router.post ~ error:", error);
    // Pass any errors to the error-handling middleware
    return next(error);
  }
});

// ... Rest of your routes

// login user//
router.post(
  "/login-user",
  catchAsyncError(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      res.status(201).json({
        message: "use login successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//  load user//

router.get(
  "/get/user",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.body.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// logout user//

router.get(
  "/logout",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(201).json({
        success: this.true,
        message: "Logout successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user information //

router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const { name, email, password, phoneNumber } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      (user.name = name),
        (user.email = email),
        (user.phoneNumber = user.phoneNumber);

      await user.save();

      rse.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user profile //

router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncError(async (req, res, next) => {
    try {
      const existUser = await User.findById(req.user.id);

      const existAvatarPath = `upload/${existUser.avatar}`;

      fs.unlinkSync(existAvatarPath);

      const fileUrl = path.join(req.file.filename);

      const user = await User.findByIdAndUpdate(req.user.id, {
        avatar: fileUrl,
      });

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user address//

router.put(
  "/update-user-adsresses",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameAddressType = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );

      if (sameAddressType) {
        return next(
          new ErrorHandler(
            `${req.body.addressType} this user address already exist`
          )
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array //
        user.addresses.push(req.body);
      }
      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//  change user password //

router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.body.id).select("+password");

      const isPAsswordMAtched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPAsswordMAtched) {
        return next(new ErrorHandler("Oldpassword is invalid!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler(
            "newpassword and confirm password does not matched!",
            400
          )
        );
      }

      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//  get all orders of seller //

router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncError(async (req, res, next) => {
    try {
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users for admin //

router.get(
  "/admin-all-user",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
