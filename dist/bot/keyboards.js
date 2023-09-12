"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodMenu = exports.MainMenu = exports.ShareContact = void 0;
exports.ShareContact = {
    keyboard: [
        [
            {
                text: "Sahare contact",
                request_contact: true
            }
        ]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
};
exports.MainMenu = {
    keyboard: [
        [
            {
                text: "🍽 Menu"
            },
            {
                text: "💰 Balans"
            }
        ],
        [
            {
                text: "✍️Izoh qoldirish"
            },
            {
                text: "Buyurtmalarim"
            }
        ]
    ],
    resize_keyboard: true
};
exports.FoodMenu = {
    keyboard: [
        [
            {
                text: "Asosiy menu"
            },
            {
                text: "🛒 Savat"
            }
        ],
        [
            {
                text: "🍰 Desert"
            },
            {
                text: "🥤Ichimlik"
            }
        ],
        [
            {
                text: "🌮 Gazaklar"
            }
        ]
    ],
    resize_keyboard: true,
};
