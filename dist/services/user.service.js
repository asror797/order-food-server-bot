"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const httpException_1 = require("../exceptions/httpException");
const phoneNumberFormatter_1 = require("../utils/phoneNumberFormatter");
class UserService {
    constructor() {
        this.users = user_model_1.default;
    }
    async isExist(telegramID) {
        const isExist = await this.users.findOne({
            telegram_id: telegramID
        });
        if (isExist) {
            return {
                data: isExist,
                message: "user exist",
            };
        }
        else {
            return {
                data: null,
                message: "user not found",
            };
        }
    }
    async registirNewUser(userData) {
        const phone_number = (0, phoneNumberFormatter_1.formatPhoneNumber)(userData.phone_number);
        const newUser = await this.users.create(Object.assign(Object.assign({}, userData), { phone_number }));
        return newUser;
    }
    async getUsers(page, size) {
        const skip = (page - 1) * size;
        const users = await this.users.find()
            .select('-updatedAt')
            .skip(skip)
            .limit(size)
            .populate('org', 'name_org')
            .exec();
        return users;
    }
    async getBalance(telegramID) {
        const user = await this.users.findOne({
            telegram_id: telegramID
        });
        return user;
    }
    async updateUser(userData) {
        const updatedUser = await this.users.findByIdAndUpdate(userData['_id'], userData);
        return updatedUser;
    }
    async changeStatus(userData) {
        const { user, type } = userData;
        const isExist = await this.users.findById(user);
        if (!isExist)
            throw new httpException_1.httException(400, 'user not exist');
        if (type == 'verify') {
            return await this.users.findOneAndUpdate({
                _id: user
            }, {
                is_active: true,
                is_verified: true
            });
        }
        else {
            return {};
        }
    }
}
exports.default = UserService;
