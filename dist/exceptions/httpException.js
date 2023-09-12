"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httException = void 0;
class httException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.httException = httException;
