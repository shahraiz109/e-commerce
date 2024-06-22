const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter yuor product name"],
  },
  description: {
    type: String,
    required: [true, "please enter yuor product description"],
  },
  category: {
    type: String,
    required: [true, "please enter yuor product category"],
  },
  tags: {
    type: String,
    required: [true, "please enter yuor product tag!"],
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "please enter product price with discount"],
  },
  stock: {
    type: Number,
    required: [true, "please enter product stock!"],
  },
  images: [
    {
      type: String,
    },
  ],

  shopId: {
    type: String,
    // required: true,
  },
  shop: {
    type: Object,
    // required: true,
  },
  sold_out:{
    type:String,
    default:0
  },
  createdAt:{
    type: Date,
    default: Date.now(),
  }
});

module.exports= mongoose.model("Product", productSchema)