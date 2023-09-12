"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_interface_1 = require("../interfaces/user.interface");
const userSchema = new mongoose_1.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    phone_number: {
        type: String,
    },
    telegram_id: {
        type: Number,
        nullable: false
    },
    is_active: {
        type: Boolean,
        default: false
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    org: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Org',
    },
    roles: {
        type: [
            {
                type: String,
                enum: Object.values(user_interface_1.UserRole),
            },
        ],
        default: [user_interface_1.UserRole.USER],
    },
    balance: {
        type: Number,
        default: 0
    },
    language_code: {
        type: String,
        default: 'uz'
    }
}, {
    versionKey: false,
    timestamps: true
});
const userModel = (0, mongoose_1.model)('User', userSchema);
exports.default = userModel;
