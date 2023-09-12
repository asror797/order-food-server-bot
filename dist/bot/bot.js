"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const user_service_1 = __importDefault(require("../services/user.service"));
const keyboards_1 = require("./keyboards");
const food_service_1 = __importDefault(require("../services/food.service"));
class BotService {
    constructor(token) {
        this.token = token;
        this.users = new user_service_1.default();
        this.foods = new food_service_1.default();
        this.bot = new node_telegram_bot_api_1.default(token, { polling: true });
        // this.initialize()
    }
    initialize() {
        this.bot.on('message', this.handleMessage.bind(this));
        this.bot.on('callback_query', this.handleCallbackQuery.bind(this));
        this.bot.on('inline_query', this.handleInlineQuery.bind(this));
        this.bot.on('polling_error', this.handlePollingError.bind(this));
        this.bot.on('contact', this.registerUser.bind(this));
        this.bot.on('polling_error', (error) => {
            console.error(`Polling error: ${error.message}`);
        });
        console.log('Bot initialized');
    }
    async registerUser(msg) {
        const contact = msg.contact;
        try {
            // const contact = msg.contact;
            if (contact === null || contact === void 0 ? void 0 : contact.user_id) {
                const isExist = await this.users.isExist(contact.user_id);
                if (isExist.data) {
                    this.bot.sendMessage(contact.user_id, "Siz ro'yxatdan o'tgansiz");
                }
                else {
                    const user = await this.users.registirNewUser({
                        first_name: contact.first_name || "",
                        last_name: contact.last_name || "",
                        phone_number: contact.phone_number || "",
                        telegram_id: contact.user_id
                    });
                    this.bot.sendMessage(user.telegram_id, "Siz ro'yxatdan o'tdingiz", { reply_markup: keyboards_1.MainMenu });
                }
            }
        }
        catch (error) {
            console.log(error);
            if (contact === null || contact === void 0 ? void 0 : contact.user_id) {
                this.bot.sendMessage(contact.user_id, 'Something went wrong try again :(');
            }
        }
    }
    async handleMessage(msg) {
        var _a;
        const chatId = msg.chat.id;
        const messageText = msg.text || '';
        try {
            if (messageText.startsWith('/start')) {
                const isExist = await this.users.isExist(chatId);
                console.log(isExist);
                if (isExist.data) {
                    this.bot.sendMessage(chatId, 'Xush kelibsiz', { reply_markup: keyboards_1.MainMenu });
                }
                else {
                    console.log(msg);
                    this.bot.sendMessage(chatId, "Siz ro‘yxatdan o‘tmagansiz", { reply_markup: keyboards_1.ShareContact });
                }
            }
            else if (messageText.startsWith('/help')) {
                // Handle the /help command
                this.bot.sendMessage(chatId, 'Available commands:\n/help - Show this help message\n/echo [text] - Echo your message');
            }
            else if (messageText.startsWith('/echo')) {
                // Handle the /echo command
                const echoMessage = (_a = messageText.split('/echo')[1]) === null || _a === void 0 ? void 0 : _a.trim();
                if (echoMessage) {
                    this.bot.sendMessage(chatId, `You said: ${echoMessage}`);
                }
                else {
                    this.bot.sendMessage(chatId, 'Please provide text to echo.');
                }
            }
            else if (messageText == '🍽 Menu') {
                this.bot.sendMessage(chatId, 'Buyurma bering', { reply_markup: keyboards_1.FoodMenu });
            }
            else if (messageText == 'Asosiy menu') {
                this.bot.sendMessage(chatId, 'Buyurma bering', { reply_markup: keyboards_1.MainMenu });
            }
            else if (messageText == '💰 Balans') {
                const userBalance = await this.users.getBalance(chatId);
                if (userBalance) {
                    this.bot.sendMessage(chatId, `<b>Ism</b>: ${userBalance.first_name} ${userBalance.last_name}\n<b>Balans</b>: ${userBalance.balance} So'm\n<b>Status</b>: ${userBalance.is_active ? "tasdiqlangan" : "tasdiqlanmagan"}`, { parse_mode: "HTML" });
                }
                else {
                    this.bot.sendMessage(chatId, 'Foydalanuvchi topilmadi');
                }
            }
            else if (messageText == '🥤Ichimlik') {
                const user = await this.users.isExist(chatId);
                console.log(user);
                if (user.data) {
                    const foods = await this.foods.getFoodsForBot({
                        org: user.data.org,
                        category: 'drinks'
                    });
                    console.log(foods);
                    this.bot.sendMessage(chatId, `Ichimliklar: \n ${foods.map((e, i) => `\n${i + 1}. ${e.name} - ${e.cost} so'm`)}`);
                }
                else {
                    this.bot.sendMessage(chatId, 'Siz Tasdiqlanmagansiz');
                }
            }
            else if (messageText == '🛒 Savat') {
                this.bot.sendMessage(chatId, "Bo'sh", { reply_markup: keyboards_1.FoodMenu });
            }
            else if (messageText == '🌮 Gazaklar') {
                const user = await this.users.isExist(chatId);
                console.log(user);
                if (user.data) {
                    const foods = await this.foods.getFoodsForBot({
                        org: user.data.org,
                        category: 'snacks'
                    });
                    console.log(foods);
                    this.bot.sendMessage(chatId, `Gazaklar: \n ${foods.map((e, i) => `\n${i + 1}. ${e.name} - ${e.cost} so'm`)}`);
                }
                else {
                    this.bot.sendMessage(chatId, 'Siz Tasdiqlanmagansiz');
                }
            }
            else if (messageText == '🍰 Desert') {
                const user = await this.users.isExist(chatId);
                console.log(user);
                if (user.data) {
                    const foods = await this.foods.getFoodsForBot({
                        org: user.data.org,
                        category: 'dessert'
                    });
                    console.log(foods);
                    this.bot.sendMessage(chatId, `Dessertlar: \n ${foods.map((e, i) => `\n${i + 1}. ${e.name} - ${e.cost} so'm`)}`);
                }
                else {
                    this.bot.sendMessage(chatId, 'Siz Tasdiqlanmagansiz');
                }
            }
            else {
                // Handle other messages
                this.bot.sendMessage(chatId, 'I do not understand that command. Type /help for a list of available commands.');
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    handleCallbackQuery(callbackQuery) {
        var _a;
        const chatId = (_a = callbackQuery.message) === null || _a === void 0 ? void 0 : _a.chat.id;
        const data = callbackQuery.data;
        // Handle callback queries if needed
    }
    handleInlineQuery(query) {
        const inlineQueryId = query.id;
        const queryText = query.query;
        // Handle inline queries if needed
    }
    handlePollingError(error) {
        console.error(`Polling error: ${error.message}`);
    }
    sendText(id, message) {
        this.bot.sendMessage(id, message);
    }
}
const token = '5398672106:AAF_zgtGfTYwu9_F-uTg1S1LrbhLzR2VKkk';
const botService = new BotService(token);
exports.default = botService;
