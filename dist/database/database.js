"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
/* constants */
const PATH = 'mongodb://localhost:27017/foodbot';
exports.dbConnection = {
    url: PATH,
    options: {
        autoIndex: true
    }
};
