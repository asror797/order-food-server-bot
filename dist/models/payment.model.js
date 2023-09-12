"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    client: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    org: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Org',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});
const paymentModel = (0, mongoose_1.model)('Payment', paymentSchema);
exports.default = paymentModel;
