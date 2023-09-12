"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
class UserRoute {
    constructor() {
        this.path = '/user';
        this.router = (0, express_1.Router)();
        this.userController = new user_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/:telegramid`, this.userController.findUser);
        this.router.get(`${this.path}`, this.userController.getUsers);
        this.router.put(`${this.path}/status`, this.userController.updateStatus);
        this.router.put(`${this.path}/`, this.userController.updateInfoUser);
    }
}
exports.default = UserRoute;
