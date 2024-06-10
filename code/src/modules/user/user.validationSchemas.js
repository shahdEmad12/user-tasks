import joi from 'joi'

export const signUpSchema = {
    body: joi.object({
        userName: joi.object({
            firstName: joi.string().min(3).max(8).required(),
            secondName: joi.string().min(3).max(8).required(),
        }).required(), 
        email: joi.string().email().required(), 
        passwordHashed: joi.string(), 
        age: joi.number().min(15).max(100), 
        gender: joi.string().valid('female','male'), 
        phone: joi.string().required()
    }).with('email', 'passwordHashed')
}

export const signInSchema = {
    body: joi.object({
        email: joi.string().email().required(), 
        passwordHashed: joi.string()
    }).with('email', 'passwordHashed')
}

export const updateUserSchema = {
    body: joi.object({
        userName: joi.object({
            firstName: joi.string().min(3).max(8).required(),
            secondName: joi.string().min(3).max(8).required(),
        }).required(), 
        age: joi.number().min(15).max(100)
    })
}

export const updatePassSchema = {
    body: joi.object({
        passwordHashed: joi.string()
    })
}