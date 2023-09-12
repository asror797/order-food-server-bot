"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const otp_service_1 = __importDefault(require("./otp.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const phoneNumberFormatter_1 = require("../utils/phoneNumberFormatter");
const httpException_1 = require("../exceptions/httpException");
class AuthService {
    constructor() {
        this.otpService = new otp_service_1.default();
        this.users = user_model_1.default;
        this.admins = [
            {
                phone_number: '+998913650221',
                password: "12345678"
            }
        ];
    }
    loginAdmin(adminDto) {
        const { phone_number, password } = adminDto;
        // validate phone_number
        const validatedPhoneNumber = (0, phoneNumberFormatter_1.formatPhoneNumber)(phone_number);
        if (!validatedPhoneNumber)
            throw new httpException_1.httException(400, 'invalid format of phone_number');
        const isExist = this.admins.find((e) => e.phone_number == `+998${validatedPhoneNumber}`);
        if (!isExist)
            throw new httpException_1.httException(400, 'not found admin');
        if (password != isExist.password)
            throw new httpException_1.httException(200, 'password or phone_number wrong');
        return {
            token: jsonwebtoken_1.default.sign(JSON.stringify(Object.assign({}, isExist)), 'secret_key')
        };
    }
}
exports.default = AuthService;
