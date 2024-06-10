import {Router} from 'express'
import * as userController from './user.controller.js'
import expressAsyncHandler from 'express-async-handler'
import {auth} from '../../middlewares/auth.middleware.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import * as validationSchemas from './user.validationSchemas.js'
import { multerMiddleHost, multerMiddleLocal } from '../../middlewares/multer.js'
import {allowedExtensions} from '../../utils/allowedExtensions.js'
const route = Router()

route.post('/', validationMiddleware(validationSchemas.signUpSchema), expressAsyncHandler(userController.signUp))
route.post('/signin', validationMiddleware(validationSchemas.signInSchema), expressAsyncHandler(userController.signIn))
route.get('/', auth(), expressAsyncHandler(userController.getUserProfile))
route.put('/', auth(), validationMiddleware(validationSchemas.updateUserSchema), expressAsyncHandler(userController.updateUser))
route.put('/pass', auth(), validationMiddleware(validationSchemas.updatePassSchema), expressAsyncHandler(userController.updatePassword))
route.delete('/', auth(), expressAsyncHandler(userController.deleteUser))
route.put('/soft', auth(), expressAsyncHandler(userController.softDeleteUser))

route.post('/upload', multerMiddleLocal({extensions : allowedExtensions.image, filePath: 'users/profiles'}).single('profile'), expressAsyncHandler(userController.fileUpload))
route.post('/uploadCloud', multerMiddleHost({extensions : allowedExtensions.image}).single('profile'), expressAsyncHandler(userController.fileUploadCloud))
route.delete('/destroyCloud', expressAsyncHandler(userController.fileDestroyCloud))
export default route