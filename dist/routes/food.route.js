"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const food_controller_1 = __importDefault(require("../controllers/food.controller"));
class FoodRoute {
    constructor() {
        this.path = '/food';
        this.router = (0, express_1.Router)();
        this.foodController = new food_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.foodController.getFoods);
        this.router.post(`${this.path}`, this.foodController.createFood);
    }
}
exports.default = FoodRoute;
