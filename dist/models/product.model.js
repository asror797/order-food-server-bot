"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const product_interface_1 = require("../interfaces/product.interface");
const productSchema = new mongoose_1.Schema({
    amount: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: true
    },
    min_amount: {
        type: Number,
        default: 0
    },
    cost: {
        type: Number,
        default: 0
    },
    unit: {
        type: String,
        enum: Object.values(product_interface_1.Units),
        required: true
    },
    org: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Org',
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});
const productModel = (0, mongoose_1.model)('Product', productSchema);
exports.default = productModel;
