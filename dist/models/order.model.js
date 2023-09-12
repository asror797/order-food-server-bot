"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    total_cost: {
        type: Number,
        required: true
    },
    client: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    foods: {
        type: [
            {
                food: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'Food',
                    required: true
                },
                amount: {
                    type: Number,
                    default: 1
                }
            }
        ]
    },
    is_canceled: {
        type: Boolean,
        default: false
    },
    is_accepted: {
        type: Boolean,
        default: false
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
const orderModel = (0, mongoose_1.model)('Order', orderSchema);
exports.default = orderModel;
