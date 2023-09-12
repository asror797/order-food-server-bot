"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const org_model_1 = __importDefault(require("../models/org.model"));
class OrgService {
    constructor() {
        this.orgs = org_model_1.default;
    }
    async get(page, size) {
        const skip = (page - 1) * size;
        const products = await this.orgs.find()
            .select('-updatedAt')
            .skip(skip)
            .limit(size)
            .exec();
        return products;
    }
    async createOrg(name) {
        const newOrg = await this.orgs.create({
            name_org: name
        });
        return newOrg;
    }
    update() {
    }
    delete() {
    }
}
exports.default = OrgService;
