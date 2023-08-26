import mongoose from "mongoose";

const stripeCustomerSchema = mongoose.Schema({
    employeeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Employee"
    },
    customerId : {
        type : String,
        trim : true
    },
}, { timestamps: true });

const Customer = mongoose.model('stripecustomer', stripeCustomerSchema);

export default Customer;