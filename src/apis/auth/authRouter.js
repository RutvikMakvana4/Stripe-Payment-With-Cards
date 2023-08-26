import express from "express";
import asyncWrap from "express-async-wrapper";
import authController from "./authController";

const routes = express.Router();
import authentication from "../../common/middleware/authentication";    
import validator from "../../common/config/joiValidation";
import { registerDto, otpSendToEmail, emailVerifyOtpDto } from "./dtos/registerDto";
import {loginDto} from "./dtos/loginDto"

routes.post('/send-otp-email', validator.body(otpSendToEmail), asyncWrap(authController.sendOtpToEmail));
routes.post('/emailVerifyOTP', validator.body(emailVerifyOtpDto), asyncWrap(authController.emailVerifyOTP));

routes.post('/register', validator.body(registerDto), asyncWrap(authController.register))
routes.post('/login', validator.body(loginDto), asyncWrap(authController.login));
routes.post('/logout', authentication, asyncWrap(authController.logout));

routes.post('/forgot-password', asyncWrap(authController.forgotPassword));
routes.get('/forgotPage/:token', asyncWrap(authController.forgotPage));
routes.post('/forgotPage/:token', asyncWrap(authController.resetPassword));

routes.get('/profile',authentication, asyncWrap(authController.profile));

routes.post('/change-password',authentication, asyncWrap(authController.changePassword));

module.exports = routes;