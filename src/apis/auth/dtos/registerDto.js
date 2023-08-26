import Joi from "joi";

export const registerDto = Joi.object().keys({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(8).trim().required(),
    confirmPassword: Joi.string().min(8).trim().required(),
    joiningDate: Joi.string().trim().required(),
    jobTitle: Joi.string().trim().required(),
    department: Joi.string().trim().required()
});


export const otpSendToEmail = Joi.object().keys({
    email: Joi.string().email().trim().required(),
});


export const emailVerifyOtpDto = Joi.object().keys({
    email: Joi.string().email().trim().required(),
    otp: Joi.number().required(),
});