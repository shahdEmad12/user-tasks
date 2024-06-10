import {Schema, model} from 'mongoose'
const userSchema = new Schema({
    userName:
        {
            firstName:{
                type: String,
                required: true
            },
            secondName:{
                type: String,
                required: true
            }
        },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    passwordHashed:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        min:12,
        max:100
    },
    gender:{
        type: String,
        enum:['female','male'],
        default: 'female'
    },
    phone:{
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },

},{
    timestamps: true
})

const User = model('User', userSchema)

export default User