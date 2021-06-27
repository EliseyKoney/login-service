import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import routes from './routes/routes.js'
import secureRoute from './routes/secure-routes.js'
import './auth/auth.js'

dotenv.config()


export default function run() {

    mongoose.connect(process.env.MONGO_URL, {
        auth: {
            authSource: "admin"
        },
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASS,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10, 							// Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, 		// Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000,
    })
    mongoose.set("useCreateIndex", true)

    mongoose.connection.on('error', error => console.log(error))
    mongoose.Promise = global.Promise


    const app = express()

    app.use(bodyParser.urlencoded({extended: false}))

    app.use('/', routes)

    // Plug in the JWT strategy as a middleware so only verified users can access this route.
    app.use('/user', passport.authenticate('jwt', {session: false}), secureRoute)

    // Handle errors.
    app.use(function (err, req, res, next) {
        res.status(err.status || 500)
        res.json({error: err})
    })

    app.listen(3000, () => {
        console.log('Server started.')
    })
}