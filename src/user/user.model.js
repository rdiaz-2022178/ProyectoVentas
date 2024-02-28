import { Schema, model } from "mongoose"

const userSchema = Schema({
    name: {
        type: String,
        require: [true, "Name is require"]
    },
    lastname: {
        type: String,
        require: [true, "Lastname is require"]
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "Username is require"]
    },
    email:{
        type: String,
        require: [true, "Username is require"]
    },
    password: {
        type: String,
        require: [true, "password is require"]
    },
    role: {
        type: String,
        uppercase: true,
        enum: ['ADMIN', 'CLIENT'],
        require: [true, "role is require"]
    }
}, {
    versionKey: false
})

export default model('user', userSchema)