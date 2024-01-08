require('dotenv').config();
require('express-async-errors');

const express = require('express')
const app = express()


const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xxs = require('xss-clean')
const cors = require('cors')


const ConnectToDB = require('./DB/connect')
const authRoutes = require('./routes/auth')
const jobsRoutes = require('./routes/jobs')
const notFound = require('./middleware/notFound') ;
const errorHandlerMiddleware = require('./middleware/error-handler') ;
const authenticationMiddeware = require('./middleware/authentication')

app.set('trust proxy',1)
app.use(rateLimit(
    {
        windowMs : 15 * 60 * 1000 ,// 15 min
        max : 100, // limit each IP to 100 request per windowMs
    }
))
app.use(helmet())
app.use(xxs())
app.use(cors())
app.use(express.json())

// routes
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/jobs',authenticationMiddeware,jobsRoutes)
app.use(notFound)
app.use(errorHandlerMiddleware)
// app.get('/',(req,res) => res.setHeader(""))

const start = () => {
    try {
        ConnectToDB(process.env.MONGO_URL)
        app.listen(process.env.PORT || 3000 , () => console.log('server runing'))
    } catch (error) {
        console.log(error);
    }
}


start()

