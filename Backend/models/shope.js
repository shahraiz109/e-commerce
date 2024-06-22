const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const shopeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your shope name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your shope email!"],
  },
  password: {
    type: String,
    // required: [true, "Please enter your password"],
    // minLength: [4, "Password should be greater than 4 characters"],
    // select: false,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "seller",
  },

  avatar: {
    type: String,
    // required:true,
    // public_id: {
    //   type: String,
    //   required: true,
    // },
    // url: {
    //   type: String,
    //   required: true,
    // },
  },
  zipCode: {
    type: Number,
    required: true,
  },
  withdrawMethod: {
    type: Object,
  },
  transections: [
    {
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: "Processing",
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

shopeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
shopeSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
shopeSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Shope", shopeSchema);
