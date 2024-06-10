import Task from '../../../DB/models/task.model.js'

//........................add task............................
/**
 * destructuring data from req.body
 * destructuring data from req.authUser ( loggedInUser)
 * create new task
 * return success response
*/
export const addTask = async(req,res,next)=>{
    const {title, description, status , assignTo, deadline} = req.body
    const {_id} = req.authUser
    //create new task
    const adding = await Task.create({title, description, status , userID: _id, assignTo, deadline})
    if(!adding) return next(new Error('adding failed', {cause:400}))
    return res.status(200).json({message:'added successfully', adding})

}

//.......................update task............................
/**
 * destructuring data from req.body
 * destructuring data from req.authUser ( loggedInUser)
 * check if task already exists
 * if exists return error
 * update task data
 * return success response
*/
export const updateTask = async(req,res,next)=>{
    const{taskId}= req.params
    const{title, description, status, assignTo}= req.body
    const{_id} = req.authUser

    //check exsitance of task
    const isTaskExists = await Task.findById({_id:taskId})
    if(!isTaskExists) return next(new Error('task does not exist', {cause:404}))

    //update task data
    const updateTask= await Task.findOneAndUpdate({ userID:_id},{title, description, status, assignTo}, {new: true})
    if(!updateTask) return next(new Error('updating failed', {cause:400}))
    return res.status(200).json({message:'updated successfully', updateTask})

}

//.......................delete task............................
/**
 * destructuring data from req.body
 * destructuring data from req.authUser ( loggedInUser)
 * check if task exists
 * if not exists return error
 * delete task data
 * return success response
*/
export const deleteTask = async(req,res,next)=>{
    const{taskId}= req.params
    const{_id} = req.authUser

    //check existance of task
    const isTaskExists = await Task.findById({_id:taskId})
    if(!isTaskExists) return next(new Error('task does not exist', {cause:404}))

    //deleting task
    const deleteTask= await Task.findOneAndDelete({_id:taskId, userID:_id})
    if(!deleteTask) return next(new Error('deleting failed', {cause:400}))
    return res.status(200).json({message:'deleting successfully', deleteTask})

}

//...........................get all tasks with all users.........................
export const getAllTasks = async (req,res,next)=>{
    const allTasks = await Task.find().populate([{path:'userID'}])
    return res.status(200).json({message:'done', allTasks})
}

//.........................tasks of one user............................
/**
 * destructuring data from req.authUser ( loggedInUser)
 * find data of a specific userid
 * return success response
*/
export const listTask = async (req,res,next)=>{
    const{_id} = req.authUser
    const data = await Task.find({userID:_id})
    res.json({
        message:'done',
        data
    })
}


//.........................after deadline.......................
/**
 * assign a variable that contain the current date
 * find the task that status is not equal done and deadline is less than the current date
 * return response
*/
export const taskAfterDeadline = async (req, res, next) => {
    const currentDate = new Date();
        const tasks = await Task.find({
            status: { $ne: 'done' },
            deadline: { $lt: currentDate }
        });

        res.json({tasks})
}
