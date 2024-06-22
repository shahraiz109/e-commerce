const Inbox = require("../models/inbox");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const express = require("express");
const { isSeller } = require("../middleware/auth");
const router = express.Router();

// create a new inbox chat //

router.post(
  "/inbox-message",
  catchAsyncError(async (req, res, next) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;
      const isInboxExist = await Inbox.findOne({ groupTitle });

      if (!isInboxExist) {
        return next(
          new ErrorHandler("Chat group already exist with this seller")
        );
      }

      const inbox = await Inbox.create({
        members: [userId, sellerId],
        groupTitle: groupTitle,
      });

      res.status(201).json({
        success: true,
        inbox,
      });
    } catch (error) {
      return next(new ErrorHandler(error.response.message), 500);
    }
  })
);

// get seller conversation //

router.post(
  "/get-all-conversation-seller",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const inbox = await Inbox.find(
        {
          members: {
            $in: [req.params.sellerId],
          },
        }.sort({ updatedAt: -1, createdAt: -1 })
      );

      res.status(201).json({
        success: true,
        inbox,
      });
    } catch (error) {
      return next(new ErrorHandler(error.response.message), 500);

    }
  })
);

module.exports = router;
