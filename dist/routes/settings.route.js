"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_controller_1 = __importDefault(require("../controllers/settings.controller"));
class SettingsRoute {
    constructor() {
        this.path = '/settings';
        this.router = (0, express_1.Router)();
        this.settingsController = new settings_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/otp-info`, this.settingsController.saveOtpInfo);
    }
}
exports.default = SettingsRoute;
