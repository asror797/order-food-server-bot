"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = (error, req, res, next) => {
    try {
        const status = error.status || 500;
        const message = error.message || "something went wrong";
        res.status(status).json({
            message: message,
            status: status
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = errorMiddleware;
