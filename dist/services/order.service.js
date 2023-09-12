"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpException_1 = require("../exceptions/httpException");
const food_model_1 = __importDefault(require("../models/food.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
class OrderService {
    constructor() {
        this.orders = order_model_1.default;
        this.foods = food_model_1.default;
    }
    async getOrders() {
        return await this.orders.find().exec();
    }
    async getOrderForBot() {
    }
    async createOrder(orderData) {
        const { foods, client, org } = orderData;
        const foodObjects = [];
        let total_cost = 0;
        for (const { food, amount } of foods) {
            const isExist = await this.foods.findById(food);
            if (!isExist)
                throw new httpException_1.httException(400, `This food ${food} not found`);
            foodObjects.push({ food: isExist['_id'], amount: amount });
            total_cost = total_cost + isExist.cost * amount;
        }
        const newOrder = await this.orders.create({
            client,
            org,
            total_cost,
            foods: foodObjects
        });
        return newOrder;
    }
}
exports.default = OrderService;
