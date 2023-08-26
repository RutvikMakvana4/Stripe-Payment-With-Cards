import mongoose from "mongoose";

const cardSchema = mongoose.Schema({
    employeeId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Employee"
    },
    customerId : {
        type : String,
        trim : true
    },
    cardId : {
        type : String,
        trim : true
    },
    fullName : {
        type : String,
        trim :true
    },
    lastNumber : {
        type : String,
        trim : true
    },
    expMonth : {
        type : Number,
        trim :true
    },
    expYear : {
        type : Number,
        trim : true
    },
    brand : {
        type : String,
        trim : true
    },
    isDefault : {
        type : Boolean,
        default: false
    }
}, { timestamps : true});

const Card = mongoose.model('stripecard', cardSchema);

export default Card;