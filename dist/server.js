"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const food_route_1 = __importDefault(require("./routes/food.route"));
const org_route_1 = __importDefault(require("./routes/org.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const settings_route_1 = __importDefault(require("./routes/settings.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const app = new app_1.default([
    new user_route_1.default(),
    new auth_route_1.default(),
    new org_route_1.default(),
    new product_route_1.default(),
    new food_route_1.default(),
    new settings_route_1.default(),
    new product_route_1.default()
]);
app.listen();
