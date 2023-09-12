"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    constructor() {
        this.authService = new auth_service_1.default();
        // public sendOtp = (req:Request,res:Response,next:NextFunction) => {
        //   try {
        //     const phone_number: string = req.body.phone_number
        //     res.json(this.authService.loginAdmin(phone_number))
        //   } catch (error) {
        //     next(error)
        //   }
        // }
        this.LoginSuperAdmin = (req, res, next) => {
            try {
                const adminData = req.body;
                res.json(this.authService.loginAdmin(adminData));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = AuthController;
