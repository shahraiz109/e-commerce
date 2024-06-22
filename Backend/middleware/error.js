const ErrorHandler= require("../utils/ErrorHandler")

module.exports=(err,req,resp,next)=> {
    err.statusCode=err.statusCode || 500
    err.message=err.message || "internal server error"

    // wrong mongodb id//
    if(err.name === "CastError"){
        const message=`resource not found by this id.. Invalid ${err.path}`
        err=new ErrorHandler(message,400)
    }

    // duplicate key//

    if(err.code===11000){
        const message=`duplicate key ${Object.keys(err.keyVlue)} Entered`
        err=new ErrorHandler(message,400)
    }

    // wrong jwt error//
    if(err.name==="JsonWebTokenError"){
        const message=`your url is incorrect please provide correct url`
        err=new ErrorHandler(message,400)
    }

    // expired jwt//
    if(err.name=== "ExpiredToken"){
        const message= `your url has been expired please try again latter`
        err=new ErrorHandler(message,400)
    }

    resp.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}