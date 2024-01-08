const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { isEmail } = require('validator')
const unauthenticated = require('../errors/unauthenticated')


const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true , "Please, Provide name"],
        minlength : 3,
        maxlength : 50
    },
    email : {
        type : String,
        required : [true, "Please, Provide your email"],
        validate : [isEmail , "Please, Entre The Correct email"],
        unique : true,
    },
    password : {
        type : String,
        required : [true, "Please, Provide your Password"],
        minlength : 6,
        maxlength : 20, 

    }
})

UserSchema.pre('save',async function(next) {
    const saltkey = await bcrypt.genSalt()
    this.password = await bcrypt.hash( this.password, saltkey)
    next()
})

UserSchema.statics.login = async function(email,password){
    const user = await this.findOne({email})

    if (user){
        const auth = await bcrypt.compare(password,user.password)
        if (auth){
            return user
        }
        throw new unauthenticated("your password is uncorrect")
    }
    throw new unauthenticated("Invalid Credentials")
}



module.exports = mongoose.model("user",UserSchema)

// in some cases the next() can be automatic in a middleware, we dont need to write it