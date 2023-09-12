"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const food_interface_1 = require("../interfaces/food.interface");
const foodSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        default: 0
    },
    products: {
        type: [
            {
                product: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                amount: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: []
    },
    org: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Org',
        required: true
    },
    category: {
        type: String,
        enum: Object.values(food_interface_1.Category)
    }
}, {
    versionKey: false,
    timestamps: true
});
const foodModel = (0, mongoose_1.model)('Food', foodSchema);
exports.default = foodModel;
