const express= require("express")
const ErrorHandler = require("./middleware/error")

const app=express()
const cookieParse= require("cookie-parser")
const bodyParser= require("body-parser")
const cors= require("cors")

app.use(
  cors({
    origin: `http://localhost:3000`,
    // credentials:true,
  })
);
app.use(express.json())
app.use(cookieParse())

app.use("/",express .static("uploads"))
app.use(bodyParser.urlencoded({extended:true}))


// config //

if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path:"config/.env"
    })
}

// imports routes//
 const user= require("./controllers/user")
  const shope = require("./controllers/shope");
   const product = require("./controllers/product");
    const event = require("./controllers/event");
    const inbox= require("./controllers/inbox")
    const withdraw = require("./controllers/adminwithdraw");


 app.use("/api/v2/user", user)
app.use("/api/v2/shop", shope);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/inbox", inbox);
app.use("/api/v2/withdraw", withdraw);

// ErrorHandeling//
app.use(ErrorHandler)

module.exports= app