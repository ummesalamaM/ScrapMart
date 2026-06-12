import {config} from 'dotenv'
config()

import express from 'express'
import {ConnectCloudinary} from './config/cloudinary.js'
import {userRouter} from './routes/Authentication.js'
import http from 'http'
import {Server} from 'socket.io'
import { setSocketInstance } from './config/socketServer.js'
import cors from 'cors'
import { ConnectDB } from './config/mongoDB.js'
import scrapRouter from './routes/scrapRoute.js'
import { ioInstance } from './controller/scrapController.js'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
})

ioInstance(io)

ConnectCloudinary()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use('/user', userRouter)
app.use('/scrap', scrapRouter)

ConnectDB()

app.get('/', (req, res) => {
    res.json('landing page is here')
})

server.listen(3000, () => {
    console.log('http://localhost:3000')
})
