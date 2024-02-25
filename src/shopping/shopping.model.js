import {Schema, model} from 'mongoose'

const shoppingSchema = Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: [true, "User is require"]
    },
    products:[{
        product:{
            type: Schema.Types.ObjectId,
            ref: 'product',
            require: [true, "Product is require"]
        },
        quantity:{
            type: Number,
            default: 1,
            require: [true, "Quantity is require"]
        }
    }]
    
},{
    versionKey: false
})

export default model('shopping', shoppingSchema)