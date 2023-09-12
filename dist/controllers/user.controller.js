"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    constructor() {
        this.userService = new user_service_1.default();
        this.getUsers = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const size = parseInt(req.query.size) || 10;
                res.json(await this.userService.getUsers(page, size));
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        };
        this.findUser = async (req, res, next) => {
            try {
                const telegram_id = Number(req.params.telegramid);
                res.json(await this.userService.isExist(telegram_id));
            }
            catch (error) {
                next(error);
            }
        };
        this.createUser = async (req, res, next) => {
            try {
                const userData = req.body;
                const newUser = await this.userService.registirNewUser(userData);
                res.json(newUser);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        };
        this.updateStatus = async (req, res, next) => {
            try {
                const userData = req.body.data;
                res.json(await this.userService.changeStatus(userData));
            }
            catch (error) {
                next(error);
            }
        };
        this.updateInfoUser = async (req, res, next) => {
            try {
                const userData = req.body;
                res.json(await this.userService.updateUser(userData));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = UserController;
