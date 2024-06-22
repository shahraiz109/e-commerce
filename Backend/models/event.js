const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter yuor event product name"],
  },
  description: {
    type: String,
    required: [true, "please enter yuor event product description"],
  },
  category: {
    type: String,
    required: [true, "please enter yuor event product category"],
  },
  start_Date:{
    type:Date,
    required:true,
  },
    
  finish_Date:{
    type:Date,
    required:true,
  },
status:{
    type:String,
    default:"Running"
},
  tags: {
    type: String,
    required: [true, "please enter yuor event product tag!"],
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "please enter event product price with discount"],
  },
  stock: {
    type: Number,
    required: [true, "please enter event product stock!"],
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
  sold_out: {
    type: String,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports= mongoose.model("Event", eventSchema)