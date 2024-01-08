let User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes")
const BadRequest  = require('../errors/bad-request')

const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
const lifeTime = process.env.JWT_LIFETIME
// const ehd = async () => {
//     const user = await User.deleteMany({})
//     // return user
// }
// ehd()

const createToken = async (id,username) => {
    const token = await jwt.sign({id, username},secret,{expiresIn : lifeTime })
    return token
}

const register = async (req,res) => {

        const user = await User.create({...req.body})
        const token = await createToken(user._id,user.username)
        res.setHeader("jwt",`Bearer ${token}`)
        res.status(StatusCodes.CREATED).json({user : {name : `Hello, ${user.username}`},token : token})
}


const login = async (req,res) => {
    const {email,password} = req.body
    // if ( !email || !password ) {
    //     throw new BadRequest("please, entre your email and password")
    // }

    const user = await User.login(email,password) 
    const token = await createToken(user._id)
    res.status(StatusCodes.OK).json({user : {name : `Hello, ${user.username}`},token : token})   
}


module.exports = { register, login };