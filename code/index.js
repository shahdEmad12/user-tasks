import express from "express"
import db_connection from "./DB/connection.js"
import userRouter from "./src/modules/user/user.routes.js"
import taskRouter  from "./src/modules/task/task.route.js"
import {asyncHandler} from './src/middlewares/globalResponse.js'
import {config} from 'dotenv'
config({path:'./config/dev.config.env'})
const app = express()
const port = process.env.PORT
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use('/user', userRouter)
app.use('/task', taskRouter)
app.use(asyncHandler)
db_connection() 
app.listen(port, ()=> console.log(`server running on port ${port}`))