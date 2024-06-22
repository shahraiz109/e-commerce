const app = require("./app");
const connectDatabase = require("./db/Darabase");
const cloudinary= require("cloudinary")



// handling uncaught exception//

process.on("uncaughtException", (err) =>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server for handeling the uncauhght exception`)
})

// config//
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// connectdb//

connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// server//
const server=app.listen(process.env.PORT, ()=>{
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})

// undefined promise rejection//

process.on("unhandeledRejection", (err) => {
  console.log(`shutting down the server for ${err.message}`)
  console.log(`shutting the server for promise rejection`)

  server.close(()=>{
    process.exit(1)
  })
})