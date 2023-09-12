"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = __importDefault(require("../models/product.model"));
class ProductService {
    constructor() {
        this.products = product_model_1.default;
    }
    async getProducts(page, size) {
        const skip = (page - 1) * size;
        const products = await this.products.find()
            .select('-updatedAt')
            .skip(skip)
            .populate('org', 'name_org')
            .limit(size)
            .exec();
        return products;
    }
    async createNew(productData) {
        console.log(productData);
        const newProduct = await this.products.create(productData);
        return newProduct;
    }
    async increaseAmount() {
    }
}
exports.default = ProductService;
