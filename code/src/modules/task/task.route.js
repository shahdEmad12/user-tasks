import { Router } from "express"
import * as taskController from './task.controller.js'
import expressAsyncHandler from 'express-async-handler'
import {auth} from '../../middlewares/auth.middleware.js'
import { validationMiddleware } from "../../middlewares/validation.middleware.js"
import { addTaskSchema, deleteTaskSchema, updateTaskSchema } from './task.validationSchemas.js'
const route = Router()

route.post('/', auth(),validationMiddleware(addTaskSchema), expressAsyncHandler(taskController.addTask))
route.put('/:taskId', auth(), validationMiddleware(updateTaskSchema),expressAsyncHandler(taskController.updateTask))
route.delete('/:taskId', auth(), validationMiddleware(deleteTaskSchema),expressAsyncHandler(taskController.deleteTask))
route.get('/allTasks', expressAsyncHandler(taskController.getAllTasks))
route.get('/task1', auth(), expressAsyncHandler(taskController.listTask))
route.get('/after', expressAsyncHandler(taskController.taskAfterDeadline))



export default route