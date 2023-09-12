"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpException_1 = require("../exceptions/httpException");
const jsonwebtoken_1 = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
    var _a;
    try {
        const Authorization = ((_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1]) || null;
        if (!Authorization)
            throw new httpException_1.httException(401, 'unauthorized');
        const url = req.url;
        if (url == '/docs' || url == '/auth/login') {
            return next();
        }
        else {
            if (Authorization) {
                const verificationResponse = (0, jsonwebtoken_1.verify)(Authorization, 'secret_key');
                if (verificationResponse) {
                    req.user = verificationResponse;
                    next();
                }
                else {
                    next(new httpException_1.httException(401, 'Wrong authenticaton token'));
                }
            }
        }
    }
    catch (error) {
        next(error);
    }
};
exports.default = authMiddleware;
