"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const food_service_1 = __importDefault(require("../services/food.service"));
class FoodController {
    constructor() {
        this.foodService = new food_service_1.default();
        this.getFoods = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const size = parseInt(req.query.size) || 10;
                const foods = await this.foodService.getFoods(page, size);
                res.json(foods);
            }
            catch (error) {
                next(error);
            }
        };
        this.createFood = async (req, res, next) => {
            try {
                const foodData = req.body;
                res.json(await this.foodService.creatNew(foodData));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = FoodController;
