"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const org_controller_1 = __importDefault(require("../controllers/org.controller"));
class OrgRoute {
    constructor() {
        this.path = '/org';
        this.router = (0, express_1.Router)();
        this.orgController = new org_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.orgController.get);
        this.router.post(`${this.path}`, this.orgController.createOrg);
    }
}
exports.default = OrgRoute;
