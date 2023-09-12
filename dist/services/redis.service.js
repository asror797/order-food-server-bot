"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis = __importStar(require("redis"));
const node_fetch_1 = __importDefault(require("node-fetch"));
class RedisService {
    constructor() {
        // this.client = redis.createClient({
        //     socket: {
        //       host: 'redis-15527.c13.us-east-1-3.ec2.cloud.redislabs.com',
        //       port: 15527
        //   },
        //   password:'ov92x5xCUzpDhFEngoBS64euVfIHZUhY'
        // });
        this.client = redis.createClient({
            url: 'redis://localhost:6379',
        });
        this.client.connect();
        this.client.on("connect", () => {
            console.log("Connected to Redis");
        });
        this.client.on("error", (error) => {
            console.error(`Error connecting to Redis: ${error}`);
        });
    }
    static getInstance() {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }
    // public async connection():Promise<any> {
    //   return await this.client.connect()
    // }
    async setValue(key, value) {
        try {
            return await this.client.set(key, value);
        }
        catch (error) {
            console.log(error);
        }
    }
    async getValue(key) {
        try {
            return await this.client.get(key);
        }
        catch (error) {
            console.log(error);
        }
    }
    async getOtpServiceInfo() {
        try {
            return await this.client.get('sms-info');
        }
        catch (error) {
            console.log(error);
        }
    }
    async saveOtpServiceInfo(otpInfo) {
        try {
            const isSaved = await this.client.set('sms-info', JSON.stringify({
                email: otpInfo.email,
                password: otpInfo.password
            }));
            return await this.client.get('sms-info');
        }
        catch (error) {
            console.log(error);
        }
    }
    async refreshOtpToken() {
        try {
            let token = await this.client.get('sms-info');
            if (token) {
                const NewToken = JSON.parse(token);
                const formData = new FormData();
                formData.append("email", NewToken.email);
                formData.append("password", NewToken.password);
                let response = await (0, node_fetch_1.default)('https://notify.eskiz.uz/api/auth/login', {
                    method: "POST",
                    body: JSON.stringify(formData)
                });
                if (response) {
                    await this.setValue('otp-token', `${response}`);
                }
                console.log('token', response);
                return await this.getValue('otp-token');
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async saveLoginInfo(phone_number, code) {
    }
}
exports.default = RedisService.getInstance();
