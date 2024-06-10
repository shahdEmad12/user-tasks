import User from '../../../DB/models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import cloudinaryConnection from '../../utils/cloudinary.js'

//................................signup....................................
/***
 * destructuring data from req.body
 * check email is already exists
 * if exists return error
 * hash password
 * create new user
 * return success response
 */
export const signUp =
    async (req,res,next)=>{
        const {userName, email, passwordHashed, age, gender, phone} = req.body
    
        //check email
        const isEmailExists = await User.findOne({email})
        if(isEmailExists) return next(new Error('email is already exists', {cause:400}))
    
        //hash password
        const hashedPassword = bcrypt.hashSync(passwordHashed,+process.env.SALT_ROUNDS)
        //create new user
        const newUser = await User.create({userName, email, passwordHashed:hashedPassword, age, gender, phone})
        if(!newUser) return next(new Error('user registration failed', {cause:500}))
        return res.status(201).json({message:'user registration success', newUser})
    
    }

//................................signin....................................
/***
 * destructuring data from req.body
 * check email is already exists
 * if exists return error
 * comparing hash password
 * create token
 * return success response
 */
export const signIn =
    async (req,res,next)=>{
        const { email, passwordHashed} = req.body

        //check email
        const isEmailExist = await User.findOne({email})
        if(!isEmailExist) return next(new Error('invalid login credentials', {cause:400}))

        //comparing hash password
        const isPasswordMatched = bcrypt.compareSync(passwordHashed, isEmailExist.passwordHashed)
        if(!isPasswordMatched) return next(new Error('invalid login credentials', {cause:400}))

        //create token
        const token = jwt.sign(
            {id:isEmailExist._id, email:isEmailExist.email},
            process.env.LOGIN_SIGNATURE,
            {expiresIn : '1h'}
        )
        return res.status(200).json({message:'user loggedin successfully', token})
    }


//................................update user....................................
/**
 * destructuring data from req.body
 * destructuring data from req.authUser ( loggedInUser)
 * update user data
 * return success response
*/
export const updateUser = async (req,res,next)=>{
    const{age, userName} = req.body
    const{_id} = req.authUser

    //update user data
    const userUpdateData = await User.findByIdAndUpdate(_id, {age, userName}, {new: true})
    if(!userUpdateData) return next(new Error('updating failed', {cause:400}))
    return res.status(200).json({message:'updated successfully', userUpdateData})
}

//................................update password....................................
/**
 * destructuring data from req.body
 * destructuring data from req.authUser ( loggedInUser)
 * creating a variable contains data from req.authUser
 * comparing hash password
 * if exists return error
 * hash the new password
 * update user password
 * return success response
*/
export const updatePassword = async (req,res,next)=>{
    const{passwordHashed} = req.body
    const{_id} = req.authUser
    const user = req.authUser
    //comparing hash password
    const isPasswordExists = bcrypt.compareSync(passwordHashed, user.passwordHashed)
    if(isPasswordExists) return next(new Error('password already exists', {cause:400}))

    //hash the new password
    const hashedPass = bcrypt.hashSync(passwordHashed,+process.env.SALT_ROUNDS)
    //update password
    const userUpdatePass = await User.findByIdAndUpdate(_id, {passwordHashed:hashedPass}, {new: true})
    if(!userUpdatePass) return next(new Error('updating failed', {cause:400}))
    return res.status(200).json({message:'updated successfully', userUpdatePass})
}

//................................delete password....................................
/**
 * destructuring data from req.authUser ( loggedInUser)
 * delete user data
 * return success response
*/
export const deleteUser = async (req,res,next)=>{
    const{_id} = req.authUser

    //delete user data
    const deleting = await User.findByIdAndDelete(_id)
    if(!deleting) return next(new Error('deleting failed', {cause:400}))
    return res.status(200).json({message:'deleting successfully'})
}

//............................. soft delete............................
/**
 * destructuring data from req.authUser ( loggedInUser)
 * update the isDeleted field to true
 * return success response
*/
export const softDeleteUser = async (req, res, next) => {
        const { _id } = req.authUser;

        const deletedUser = await User.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });

        if (!deletedUser) {
            return next(new Error('User not found', { cause: 404 }));
        }

        return res.status(200).json({ message: 'User soft deleted successfully', deletedUser })
}

//..............................pic upload locally.............................
export const fileUpload = (req,res,next)=>{
    return res.status(200).json({message:'user data:', data: req.file})
}

//..............................pic upload cloudinary.............................
export const fileUploadCloud = async (req,res,next)=>{
    const data = await cloudinaryConnection().uploader.upload(req.file.path, {folder: 'general/users', resource_type: 'auto', use_filename: true, unique_filename: false})
    return res.status(200).json({message:'user data:', data})
}

//..............................pic destroy cloudinary.............................
export const fileDestroyCloud = async (req,res,next)=>{

    const deletePic = await cloudinaryConnection().api.delete_resources_by_prefix('general/users/');

    const deleteFolder = await cloudinaryConnection().api.delete_folder('general/users/')

    res.status(200).json({ message: 'Pics and folder deleted successfully', deletePic, deleteFolder });
}
