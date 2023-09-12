"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendotp = void 0;
const redis_service_1 = __importDefault(require("../services/redis.service"));
const sendotp = async () => {
    const token = await redis_service_1.default.getOtpToken();
};
exports.sendotp = sendotp;
const refreshToken = async () => {
};
