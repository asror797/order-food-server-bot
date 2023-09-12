import { ReplyKeyboardMarkup } from "node-telegram-bot-api";

interface Keyboard {
  text: string;
  callback_data: string;
}


export const ShareContact: ReplyKeyboardMarkup = {
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
}


export const MainMenu: ReplyKeyboardMarkup = {
  keyboard: [
    [
      {
        text:"🍽 Menu"
      },
      {
        text:"💰 Balans"
      }
    ],
    [
      {
        text:"✍️Izoh qoldirish"
      },
      {
        text:"Buyurtmalarim"
      }
    ]
  ],
  resize_keyboard: true
}


export const FoodMenu: ReplyKeyboardMarkup = {
  keyboard: [
    [
      {
        text:"Asosiy menu"
      },
      {
        text:"🛒 Savat"
      }
    ],
    [
      {
        text:"🍰 Desert"
      },
      {
        text:"🥤Ichimlik"
      }
    ],
    [
      {
        text:"🌮 Gazaklar"
      }
    ]
  ],
  resize_keyboard: true,
}



export function PaginationInlineKeyboard(current:number,maxPage: number,data: string[]) {
  const keys = []
}