"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const mongoose_1 = require("mongoose");
const database_1 = require("./database/database");
const bot_1 = __importDefault(require("./bot/bot"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
class App {
    constructor(routes) {
        this.app = (0, express_1.default)();
        this.port = 9000;
        this.bot = bot_1.default;
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initialieErrorHandling();
        this.initializeSwagger();
        this.initializeBot();
    }
    async connectToDatabase() {
        try {
            await (0, mongoose_1.connect)(database_1.dbConnection.url, database_1.dbConnection.options);
            console.log('Connected to database');
        }
        catch (error) {
            console.log(error);
        }
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is runing at ${this.port}`);
        });
    }
    initializeMiddlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use('/uploads', express_1.default.static('uploads'));
    }
    initializeRoutes(routes) {
        routes.forEach(route => {
            this.app.use('/', route.router);
        });
    }
    initialieErrorHandling() {
        this.app.use(error_middleware_1.default);
    }
    initializeBot() {
        bot_1.default.initialize();
    }
    initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'REST API',
                    version: '1.0.0',
                    description: 'Woodline Kitchen Bot REST Api',
                },
            },
            apis: ['swagger.yaml'],
        };
        const specs = (0, swagger_jsdoc_1.default)(options);
        this.app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
    }
}
exports.default = App;
