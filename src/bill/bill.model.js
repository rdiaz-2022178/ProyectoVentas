import {Schema, model} from 'mongoose'

const billSchema = Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: [true, "User is require"]
    },
    shopping:{
        type: Schema.Types.ObjectId,
        ref: 'shopping',
        require: [true, "shopping is require"]
    },
    quantity:{
        type: Number,
        default: 1,
        require: [true, "Quantity is require"]
    }
})