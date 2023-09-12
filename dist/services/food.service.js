"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpException_1 = require("../exceptions/httpException");
const food_model_1 = __importDefault(require("../models/food.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
class FoodService {
    constructor() {
        this.foods = food_model_1.default;
        this.products = product_model_1.default;
    }
    async getFoods(page, size) {
        const skip = (page - 1) * size;
        const foods = await this.foods.find()
            .select('-updatedAt')
            .skip(skip)
            .limit(size)
            .populate('products.product', 'name cost')
            .exec();
        const formattedFoods = foods.map(food => (Object.assign(Object.assign({}, food.toObject()), { products: food.products.map(productItem => ({
                product: productItem.product,
                amount: productItem.amount,
            })) })));
        return formattedFoods;
    }
    async getFoodsForBot(getFood) {
        const { page, size, org, category } = getFood;
        const Page = page || 1;
        const Size = size || 10;
        const skip = (Page - 1) * Size;
        const foods = await this.foods.find({
            org: org,
            category: category
        })
            .skip(skip)
            .limit(Size)
            .exec();
        console.log(foods);
        return foods;
    }
    async creatNew(foodData) {
        const { name, org, cost, category, products } = foodData;
        const productObjects = [];
        for (const { product, amount } of products) {
            const Product = await this.products.findById(product);
            if (!Product)
                throw new httpException_1.httException(400, `Product with ID ${product} not found`);
            productObjects.push({ product: Product['_id'], amount: amount });
        }
        const newFood = await this.foods.create({
            name,
            cost,
            org,
            category,
            products: productObjects,
        });
        return newFood;
    }
    async getByCategory(category, org) {
        const foods = await this.foods.find({
            category: category,
            org: org
        });
        console.log(foods);
        return foods;
    }
}
exports.default = FoodService;
