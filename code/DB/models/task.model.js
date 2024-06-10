import mongoose, {Schema, model} from 'mongoose'
const taskSchema = new Schema({
    title:
        {
        type: String,
        required: true
        },
    description:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum:['toDo','doing','done'],
        default: 'toDo'
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    assignTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deadline:{
        type: Date,
        required: true
    },

},{
    timestamps: true
})

const Task = model('Task', taskSchema)
export default Task