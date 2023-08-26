import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    joiningDate: {
        type: String,
    },
    jobTitle: {
        type: String
    },
    department: {
        type: String
    },
    role: {
        type: String,
        enum: ['Employee', "Admin"],
        default: 'Employee'
    },
    refKey: {
        type: Boolean,
        default: false
    }
},{timestamps: true});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;