"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orgSchema = new mongoose_1.Schema({
    name_org: {
        type: String
    },
    is_active: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
});
const orgModel = (0, mongoose_1.model)('Org', orgSchema);
exports.default = orgModel;
