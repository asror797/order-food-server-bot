"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_service_1 = __importDefault(require("../services/redis.service"));
class SettingsController {
    constructor() {
        this.saveOtpInfo = async (req, res, next) => {
            try {
                const otpServiceInfo = req.body;
                res.json(await redis_service_1.default.saveOtpServiceInfo(otpServiceInfo));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = SettingsController;
