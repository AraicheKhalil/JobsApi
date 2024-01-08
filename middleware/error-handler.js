const CustomAPIError = require('../errors/custom-api')
const {StatusCodes} = require('http-status-codes')

const errorHandler = (err, req, res, next) => {
  
    let CostumError = {
      statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg : err.message || 'Somthing went wrong try again later',
    }

    // if (err instanceof CustomAPIError){
    //   return res.status(err.statusCode).json({ msg: err});
    // }

    if (err.code && err.code === 11000){
      CostumError.msg = `This a Compte is already registerd , try another value`
      CostumError.statusCode = 400
    }

    if (err.name === 'ValidationError') {
      CostumError.msg = Object.values(err.errors)
        .map((item) => item.message)
        .join(',')
      CostumError.statusCode = 400
    }

    if (err.name === 'CastError') {
      CostumError.msg = `No item found with id : ${err.value}`
      CostumError.statusCode = 404
    }

    // return res.status(500).json({err })
    return res.status(CostumError.statusCode).json({err : CostumError.msg})


};

module.exports = errorHandler