const Job = require('../models/jobs')
const {StatusCodes} = require('http-status-codes')
const { NotFoundError } = require('../errors/not-found')
const { BadRequest } = require('../errors/bad-request')


const getAllJobs = async (req,res) => {
    req.body.createdBy = req.user.id
    const jobs = await Job.find({createdBy : req.user.id}).sort("createdAt")
    res.status(StatusCodes.OK).json({JobLength : jobs.length ,jobs : jobs})
}

const getJob = async (req,res) => {
    const {user : {id:userId},params : {id:jobId}} = req ;
    const job = await Job.findOne({_id:jobId, createdBy : userId})
    if (!job){
        console.log(`this ${job}`);
        throw new BadRequest(`No Job with This Id : ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job : job})
}

const createJob = async (req,res) => {
    req.body.createdBy = req.user.id
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json(job)
}

const updateJob = async (req,res) => {
    const {
        body : {company,position} ,
        user : {id:userId} ,
        params : {id:jobId} ,
    } = req

    if (company === '' || position === ''){
        throw new BadRequest("company and position fiels cannots be empty")
    }

    const job = await Job.findByIdAndUpdate(
        {_id : jobId , createdBy : userId },
        req.body ,
        { new : true, runValidators : true }
    )

    if (!job){
        throw new NotFoundError(`No Job with This Id : ${jobId}`)
    }
    
    res.status(StatusCodes.OK).json(job)
}

const deleteJob = async (req,res) => {
    const {
        user : {id:userId} ,
        params : {id:jobId} ,
    } = req

    const job = await Job.findByIdAndDelete({_id : jobId, createdBy : userId  },req.body)
    if (!job){
        throw new NotFoundError(`No Job with This Id : ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

module.exports = {
    getAllJobs,
    createJob,
    getJob,
    deleteJob,
    updateJob
}
