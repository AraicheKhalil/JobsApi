const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
        company : {
            type : String,
            required : [true, 'Please, Provide Company name'],
            maxlength : 50
        },
        position : {
            type : String,
            required : [true, 'Please, Provide Position'],
            maxlength : 100
        },
        status : {
            type : String,
            enum : ['interview','declined','pending'],
            default : 'pending'
        },
        createdBy:{
            type : mongoose.Types.ObjectId,
            ref : 'User',
            required : [true,"Please, Provide Name"]
        }
    },
    {timestamps : true}
)


module.exports = mongoose.model('job',JobSchema)
