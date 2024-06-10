import Joi from "joi"

export const addTaskSchema = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.string().valid('toDo','doing','done'),
        userID: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        assignTo: Joi.string().required(),
        deadline: Joi.date().required(),
    })
}

export const updateTaskSchema = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.string().valid('toDo','doing','done'),
        assignTo: Joi.string().required(),
    })
}

export const deleteTaskSchema = {
    params: Joi.object({
        taskId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
}