
import authServices from "./authServices";

class authController {


    
    static async sendOtpToEmail(req, res) {
        const data = await authServices.sendOtpToEmail(req.body, res);
        return res.send({ message: "OTP send to your email address" })
    }


    
    static async emailVerifyOTP(req, res) {
        const data = await authServices.emailVerifyOTP(req.body, req, res);
        return res.send({ message: "OTP verification successfully" });
    }


    static async register(req, res) {
        const data = await authServices.register(req.body, req, res);
        return res.send({ message: "Employee register successfully", data });
    }



    static async login(req, res) {
        const data = await authServices.login(req.body, req, res);
        return res.send({ message: "Login successfully", data });
    }


    static async logout(req, res) {
        await authServices.logout(req);
        return res.send({ message: "Logged out successfully" });
    }


    static async forgotPassword(req, res) {
        await authServices.forgotPassword(req.body);
        return res.send({ message: "Reset password link has been sent to the email address" });
    }


  
    static async forgotPage(req, res) {
        await authServices.forgotPage(req.params.token, req, res)
    }



    static async resetPassword(req, res) {
        await authServices.resetPassword(req.params.token, req.body, req, res);
    }

    static async profile(req,res){
        const data = await authServices.profile(req.user,req,res)
        return res.send({ message: "Employee profile ", data });
    }


    static async changePassword(req,res){
        const data = await authServices.changePassword(req.body, req.user, req, res)
        return res.send({ message: "password change sucessfully", data });
    }

}

export default authController;