"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
class OrderRoute {
    constructor() {
        this.path = '/order';
        this.router = (0, express_1.Router)();
        this.orderController = new order_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.orderController.getWithPagination);
        this.router.post(`${this.path}`, this.orderController.createOrder);
    }
}
exports.default = OrderRoute;
