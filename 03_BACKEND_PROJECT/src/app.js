import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true}

))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true
    
}))

app.use(express.static("public"))

app.use(cookieParser())

//routes
import UserRouter from './routes/user.route.js'
import SubscriberRouter from './routes/subscriber.route.js'
app.use("/api/v2/users",UserRouter)
app.use("api/v2/subscribers", SubscriberRouter)

export default router



