const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400); // BAD REQUEST
};

const handleDuplicateFieldsDB = (err) => {

  // returns an array
  const mess = err.message;
  const idx = mess.indexOf('{');

  const x = mess.substring(idx+1 , mess.length-1);
  
  const message = `Duplicate field value : ${x}. Please use another value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  // fetch all the three error objects using map
  const errors = Object.values(err.error).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;

  return new AppError(message, 400);
};

const handleJWTError = (err) => {
  return new AppError("Invalid token. Please login again!", 401);
};

const handleJWTExpiredError = (err) => {
  return new AppError("Your Token has expired! Please log in again.", 401);
};

// run the code in production env
/*

const sendErrorDev = (err , res) => {

    res.status(err.statusCode).json({

        status : err.status,
        error : err, // --------> Complete error
        message : err.message,
        stack : err.stack
    })

}

const sendErrorProd = (err , res) => {
    
    // Operational , trusted error : send message to client in the production env
    if (err.isOperational) {

        res.status(err.statusCode).json({

            status : err.status,
            message : err.message,
            
        })
    } else {

        // 1) Log the error
        console.error('Error 💥' , err);  // for the developer  


        // 2) Send generic message  
        res.status(500).json({

            status : 'error',
            message : 'Something went very wrong'
        })
    }
}

*/

// ----------- Lec_15 ----------
// Rendering Error Pages

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err, // --------> Complete error
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.error("ERROR 💥", err);

    // RENDERED ERROR PAGE.
    res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message, // Sending msg becoz we are in the dev mode.
    });
  }
};



const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {

    
    console.log(err);
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR 💥", err);
  // 2) Send generic message
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};


module.exports = (err, req, res, next) => {

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // sendErrorDev (err , res);
    sendErrorDev(err, req, res); // ---> Lec_15
  } else if (process.env.NODE_ENV === "production") {


    let error = { ...err };
    error.message = err.message;
    
    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }

    if (error.code === 11000) {

      error = handleDuplicateFieldsDB(error);
      
    }

    if (error.name === "ValidationError") {

      error = handleValidationErrorDB(error);
    }

    if (err.name === "JsonWebTokenError") {
      error = handleJWTError(error);
    }

    if (err.name === "TokenExpiredError") {
      error = handleJWTExpiredError(error);
    }

    // sendErrorProd (error , res);

    sendErrorProd(error, req, res); // ---> Lec_15
  }
};
