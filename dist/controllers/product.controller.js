"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = __importDefault(require("../services/product.service"));
class ProductController {
    constructor() {
        this.productService = new product_service_1.default();
        this.getProducts = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const size = parseInt(req.query.size) || 10;
                res.json(await this.productService.getProducts(page, size));
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        };
        this.createProduct = async (req, res, next) => {
            var _a;
            try {
                const bodyData = req.body;
                const productData = Object.assign(Object.assign({}, bodyData), { org: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.org) || req.body.org });
                res.json(await this.productService.createNew(productData));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = ProductController;
