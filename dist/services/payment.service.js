"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const payment_model_1 = __importDefault(require("../models/payment.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
class PaymentService {
    constructor() {
        this.userRepo = user_model_1.default;
        this.paymentRepo = payment_model_1.default;
    }
    increase() {
    }
}
exports.default = PaymentService;
