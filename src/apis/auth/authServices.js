import EmailVerification from "../../../model/emailVerification";
import commonService from "../../../utils/commonService";
import AccessToken from "../../../model/accessToken";
import RefreshToken from "../../../model/refreshToken";
import { sendMail } from "../../common/sendEmail";
import { BCRYPT, JWT } from "../../common/constants/constants";
import { randomStringGenerator, randomNumberGenerator } from "../../common/helper";
import Employee from "../../../model/employees";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "../../../src/common/exceptions/errorException";
import RegisterResource from "./resources/registerResource";
import { baseUrl } from "../../common/constants/configConstants";
import Customer from "../../../model/stripeCustomer";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


class authServices {


    static async sendOtpToEmail(data, res) {
        const { email } = data

        try {
            const OTP = await randomNumberGenerator(4)

            await commonService.createOne(EmailVerification, {
                email: email,
                emailOTP: OTP
            });

            const obj = {
                to: email,
                subject: `Welcome to ${process.env.APP_NAME}`,
                data: { OTP }
            }

            sendMail(obj, 'otpVerification');
        } catch (err) {
            return res.send({ message: "Something went wrong" })
        }
    }



    static async emailVerifyOTP(data, req, res) {
        const { email, otp } = data;

        const findEmail = await commonService.findOne(EmailVerification, { email: email });
        console.log(findEmail);
        if (otp == findEmail.emailOTP) {
            await commonService.findOneAndDelete(EmailVerification, { email: email })
            console.log("same otp")
        } else {
            throw new ConflictException("otp are not match")
        }
    }



    static async register(data, req, res) {
        const { firstName, lastName, email, password, confirmPassword, joiningDate, jobTitle, department } = data;
        // try {
        const existEmail = await commonService.findOne(Employee, { email: email, });
        if (existEmail) {
            throw new ConflictException("This employee is already register | please login here")
        } else {
            if (password === confirmPassword) {
                const hashPass = await bcrypt.hash(password, BCRYPT.SALT_ROUND);
                const employeesRegister = await commonService.createOne(Employee, {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashPass,
                    joiningDate: joiningDate,
                    jobTitle: jobTitle,
                    department: department
                });

                //stripe
                const customer = await stripe.customers.create({
                    name : employeesRegister.firstName + " " + employeesRegister.lastName,
                    email : employeesRegister.email
                });

                await commonService.createOne(Customer, {
                    employeeId : employeesRegister._id,
                    customerId : customer.id
                });



                const authentication = await authServices.generateTokenPairs(employeesRegister._id);

                return { ...new RegisterResource(employeesRegister), authentication };
            } else {
                throw new ConflictException("Password or confirm Password are not match");
            }
        }
    }


    static async login(data, req, res) {
        const { email, password } = data
        const findEmployee = await commonService.findOne(Employee, { email: email })
        if (!findEmployee) throw new NotFoundException("This email id is not registered. please register first")

        const isPasswordMatch = await bcrypt.compare(password, findEmployee.password);
        if (!isPasswordMatch) throw new BadRequestException("Invalid password")

        const authentication = await authServices.generateTokenPairs(findEmployee._id)
        return { ...new RegisterResource(findEmployee), authentication }
    }



    static async logout(req) {
        const token = await req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.decode(token)
        const decodedData = await JSON.parse(decodedToken.data);
        const findToken = await commonService.findOne(AccessToken, { token: decodedData.jti });
        if (!findToken) {
            throw new UnauthorizedException("This access token is expired , please login !")
        }
        await commonService.deleteById(AccessToken, { _id: findToken._id });
        await commonService.findOneAndDelete(RefreshToken, { accessToken: findToken.token });
        return
    }




    static async forgotPassword(data) {
        const { email } = data;
        const findEmployee = await commonService.findOne(Employee, { email: email });
        if (!findEmployee) {
            throw new NotFoundException("This email is not register");
        } else {
            const token = jwt.sign({ id: findEmployee._id }, JWT.SECRET, { expiresIn: 300 });
            const link = baseUrl(`api/v1/auth/forgotPage/${token}`);

            const obj = {
                to: email,
                subject: `Welcome to ${process.env.APP_NAME}`,
                data: { link }
            }

            await commonService.findOneAndUpdate(Employee, findEmployee._id, {
                refKey: true
            });

            sendMail(obj, 'forgotPassword');
        }
    }





    static async forgotPage(token, req, res) {
        try {
            const verifyToken = jwt.verify(token, JWT.SECRET);
            const forgotRefKey = await commonService.findOne(Employee, { _id: verifyToken.id });
            if (verifyToken) {
                return res.render('forgotPassword/resetPassword', { layout: "forgotPassword/resetPassword", "forgotPassRefKey": forgotRefKey })
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).send({ message: "Your link has been expired" });
            }
            return res.status(403).send({ message: "Invalid token" });
        }
    }






    static async resetPassword(token, data, req, res) {
        const { newPassword, confirmPassword } = data;
        const isValid = jwt.verify(token, JWT.SECRET);
        if (isValid) {
            if (newPassword == "" || confirmPassword == "") {
                req.flash('error', 'New Password and Confirm Password is required');
                return res.redirect("back");
            } else {
                if (newPassword.length < 8) {
                    req.flash('error', 'Your password needs to be at least 8 characters long');
                    return res.redirect("back");
                } else {
                    if (newPassword === confirmPassword) {
                        const hashPass = await bcrypt.hash(newPassword, BCRYPT.SALT_ROUND);
                        const findId = await commonService.updateById(Employee, isValid.id, { password: hashPass, refKey: false });
                        if (findId) {
                            req.flash('success', 'Password has been changed');
                            return res.redirect('back');
                        }
                    } else {
                        req.flash('error', 'password and confirm password does not match');
                        return res.redirect('back');
                    }
                }
            }

        } else {
            req.flash('error', 'Link has been Expired');
            return res.redirect('back');
        }
    }



    static async profile(auth, req, res) {
        const profile = await commonService.findById(Employee, {
            _id: auth
        })

        if (!profile) {
            throw new BadRequestException("profile not found");
        } else {
            return {
                ...new RegisterResource(profile)
            }
        }
    }



    static async changePassword(data, auth, req, res) {
        const { oldPassword, newPassword, confirmPassword } = data;

        if (newPassword != confirmPassword) {
            res.send({ message: "newPassword and confirm password not match" })
        }

        const findEmployee = await commonService.findById(Employee, { _id: auth })

        console.log(findEmployee.password)

        if (!findEmployee) {
            res.send({ message: "Employee not found" })
        }

        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, findEmployee.password)
        if (!isOldPasswordCorrect) {
            res.send({ message: "your old password is not correct please try again!!!" })
        } else {

            const hashpass = await bcrypt.hash(newPassword, BCRYPT.SALT_ROUND);

            const changePassword = await commonService.updateById(Employee, {_id: auth}, {
                password : hashpass
            })
            res.send({ message: "password changed" })
        }
    }




    static async generateTokenPairs(authUser) {
        const { accessToken, expiresAt } = await this.generateAccessToken(authUser)
        if (accessToken) { var refreshToken = await this.generateRefreshToken(accessToken) }
        return { accessToken, refreshToken, expiresAt }
    }



    static async generateAccessToken(user) {
        const jti = randomStringGenerator()
        const data = await JSON.stringify({ user, jti });
        const accessToken = jwt.sign({ data }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN });
        const decodedToken = jwt.decode(accessToken)
        // store : access token 
        await commonService.createOne(AccessToken, {
            token: jti,
            userId: user
        })
        return { accessToken, expiresAt: decodedToken.exp }
    };




    static async generateRefreshToken(accessToken) {
        const refreshToken = randomStringGenerator()
        const decodedToken = jwt.decode(accessToken)
        const accessJti = await JSON.parse(decodedToken.data);
        // store : refresh token 
        commonService.createOne(RefreshToken, {
            token: refreshToken,
            accessToken: accessJti.jti
        });
        return refreshToken
    };



}

export default authServices;