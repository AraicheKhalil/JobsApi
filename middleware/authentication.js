const jwt = require('jsonwebtoken')
const BadRequest = require('../errors/bad-request')
const unauthenticated = require('../errors/unauthenticated')
const User = require('../models/userModel')
const secret = process.env.JWT_SECRET


const authenticationMiddeware = async (req,res,next) => {
    const authHeader  = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')){
        throw new BadRequest('No token provided')
    }

    const token = authHeader.split(' ')[1]

    try {
        const encodedPayload = jwt.verify(token,secret)
        const {id} = encodedPayload;
        const user = await User.findById(id).select('-password') 
        // -select for remove paasword
        // her we create new key object called user and get it id and username
        req.user = user 
        next()
    } catch (error) {
        throw new unauthenticated('Not authorized to access this route')   
    }
}

module.exports = authenticationMiddeware