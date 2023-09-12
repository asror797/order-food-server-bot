"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_service_1 = __importDefault(require("../services/order.service"));
class OrderController {
    constructor() {
        this.orderService = new order_service_1.default();
        this.getWithPagination = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const size = parseInt(req.query.size) || 10;
            }
            catch (error) {
                next(error);
            }
        };
        this.createOrder = async (req, res, next) => {
            try {
                // res.json()
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = OrderController;
