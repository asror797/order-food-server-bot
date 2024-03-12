import { InlineKeyboardButton, SendMessageOptions } from 'node-telegram-bot-api'
import { botTexts } from './text'
import { botCallbackData } from './constants'

export const MainMenuKeyboard: SendMessageOptions = {
  reply_markup: {
    keyboard: [
      [
        { text: botTexts.userNewOrder.uz },
        { text: botTexts.userCheckBalance.uz }
      ],
      [
        { text: botTexts.feedbackAction.uz },
        { text: botTexts.settingsAction.uz }
      ],
      [
        { text: botTexts.myOrders.uz }
      ]
    ],
    resize_keyboard: true
  },
  parse_mode: 'HTML'
}

export const FoodCategoryMenuKeyboard: SendMessageOptions = {
  reply_markup: {
    keyboard: [
      [{ text: botTexts.backAction.uz }, { text: botTexts.storeAction.uz }],
      [
        { text: botTexts.dessertCategory.uz },
        { text: botTexts.drinkCategory.uz }
      ],
      [{ text: botTexts.snackCategory.uz }]
    ],
    resize_keyboard: true
  },
  parse_mode: 'HTML'
}

export const ViewFoodKeyboard: SendMessageOptions = {
  reply_markup: {
    keyboard: [
      [{ text: botTexts.backAction.uz }, { text: botTexts.storeAction.uz }]
    ],
    resize_keyboard: true
  },
  parse_mode: 'HTML'
}

export const CountFoodAmountComponent: InlineKeyboardButton[] = [
  { text: '-', callback_data: botCallbackData.decreaseAmount },
  { text: '1', callback_data: botCallbackData.showCount },
  { text: '+', callback_data: botCallbackData.increaseAmount }
]

export const CookMainMenu: SendMessageOptions = {
  reply_markup: {
    keyboard: [
      [{ text: botTexts.cookNewPoll.uz }, { text: botTexts.cookViewPoll.uz }]
    ],
    resize_keyboard: true
  },
  parse_mode: 'HTML'
}

export const CreateMealPoll: SendMessageOptions = {
  reply_markup: {
    keyboard: [
      [{ text: botTexts.createMealPoll.uz }],
      [{ text: botTexts.backAction.uz }]
    ],
    resize_keyboard: true
  },
  parse_mode: 'HTML'
}

export const ShareContactKeyboard: SendMessageOptions = {
  reply_markup: {
    keyboard: [
      [
        {
          text: botTexts.sendPhoneNumber.uz,
          request_contact: true
        }
      ]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  },
  parse_mode: 'HTML'
}
