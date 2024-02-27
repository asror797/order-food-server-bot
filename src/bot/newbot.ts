import TelegramBot from 'node-telegram-bot-api'
import { BOT_TOKEN } from '@config'
import { botTexts } from './text'
import { botCallbackData, botSteps, categoryEnum } from './constants'
import { FormatNumberWithSpaces, KeyboardMaker } from './helper'
import type {
  CallbackQuery,
  InlineKeyboardMarkup,
  Message
} from 'node-telegram-bot-api'
import {
  FoodService,
  OrderService,
  OrgService,
  StoreService,
  UserService
} from '@services'
import {
  MainMenuKeyboard,
  CookMainkeyboard,
  ShareContactKeyboard,
  FoodCategoryMenuKeyboard,
  ViewFoodKeyboard,
  CountFoodAmountComponent
} from './keyboards'

class TelegramBotApi {
  private bot: TelegramBot
  private userService = new UserService()
  private orgService = new OrgService()
  private foodService = new FoodService()
  private orderService = new OrderService()
  private storeService = new StoreService()

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true })
  }

  public initializeBot() {
    this.bot.onText(/\/start/, this.handleStart.bind(this))
    this.bot.on('message', this.handleMessage.bind(this))
    this.bot.on('contact', this.handleContact.bind(this))
    this.bot.on('callback_query', this.handleCallbackQuery.bind(this))
    this.bot.on('polling_error', (error) => {
      console.log(error)
      throw new Error(error?.message)
    })
  }

  private async handleMessage(msg: Message) {
    const chatId = msg.chat.id
    const chatType = msg.chat.type
    try {
      const data = await this.userService.checkUser({ telegramId: chatId })
      if (
        data.isExist &&
        data.user &&
        data.user.is_active &&
        data.user.is_verified
      ) {
        if (
          data.user.role == 'cook' &&
          chatType == 'private' &&
          msg.text !== '/start'
        ) {
          await this.handleCookMessages(msg)
        } else if (
          data.user.role == 'user' &&
          chatType == 'private' &&
          msg.text !== '/start'
        ) {
          await this.handleUserMessages(msg)
        }
      } else {
        this.bot.sendMessage(chatId, `<b>Siz Tasdiqlanmagansiz</b>`, {
          parse_mode: 'HTML'
        })
      }
    } catch (error) {
      console.log(error)
      this.bot.sendMessage(chatId, 'as')
    }
  }

  private async handleContact(msg: Message) {
    try {
      if (!msg.contact) throw new Error('Contact is required')
      await this.userService.registerUser({
        firstName: msg.chat.first_name || '',
        lastName: msg.chat.last_name || '',
        phoneNumber: msg.contact.phone_number,
        telegramId: msg.chat.id
      })
      this.bot.sendMessage(msg.chat.id, `Xush kelibsiz!`, {
        reply_markup: { remove_keyboard: true }
      })
    } catch (error) {
      this.bot.sendMessage(msg.chat.id, botTexts.noContact.uz)
    }
  }

  private async handleStart(msg: Message) {
    try {
      const data = await this.userService.checkUser({ telegramId: msg.chat.id })

      if (data.isExist && data.user && data.user.role == 'user') {
        this.bot.sendMessage(
          msg.chat.id,
          botTexts.userMainMenu.uz,
          MainMenuKeyboard
        )

        await this.storeService.editStep({
          telegramId: msg.chat.id,
          step: botSteps.mainMenu
        })
      } else if (data.isExist && data.user && data.user.role == 'cook') {
        this.bot.sendMessage(
          msg.chat.id,
          botTexts.cookMainMenu.uz,
          CookMainkeyboard
        )

        // await this.storeService.editStep({
        //   telegramId: msg.chat.id,
        //   step: 'select-step'
        // })
      } else if (!data.isExist) {
        this.bot.sendMessage(
          msg.chat.id,
          botTexts.askContact.uz,
          ShareContactKeyboard
        )
      } else if (
        data.user &&
        (data.user?.is_verified == false || data.user?.is_active == false)
      ) {
        this.bot.sendMessage(msg.chat.id, botTexts.noVerified.uz, {
          reply_markup: {
            remove_keyboard: true
          }
        })
      }
    } catch (error) {
      console.log(error)
      this.bot.sendMessage(msg.chat.id, 'hello')
    }
  }

  private async handleCallbackQuery(msg: CallbackQuery) {
    try {
      const user = await this.userService.checkUser({ telegramId: msg.from.id })

      if (
        user.isExist &&
        user.user?.is_active == true &&
        user.user.is_verified == true
      ) {
        if (msg.data?.split('/')[0] == botCallbackData.saveToStore) {
          await this.#_storeFoodToCart(msg)
          console.log(user.user['_id'].toString())
        }
        if (
          msg.data == botCallbackData.decreaseAmount ||
          botCallbackData.increaseAmount ||
          botCallbackData.showCount
        ) {
          this.#_amountChanger({ msg: msg })
        }
      } else {
        this.bot.sendMessage(msg.from.id, botTexts.noVerified.uz)
      }
    } catch (error) {
      console.log(error)
      this.bot.sendMessage(msg.from.id, botTexts.errorMessage.uz, {
        parse_mode: 'HTML'
      })
    }
  }

  private async handleCookMessages(msg: Message): Promise<void> {
    try {
      this.bot.sendMessage(msg.chat.id, 'Salom oshpaz')
    } catch (error) {
      console.log(error)
      this.bot.sendMessage(msg.chat.id, 'Error: ....')
    }
  }

  private async handleUserMessages(msg: Message): Promise<void> {
    try {
      const userStep =
        (await this.storeService.getStep({
          telegramId: msg.chat.id
        })) || ''

      if (userStep == botSteps.mainMenu) {
        if (msg.text == botTexts.userNewOrder.uz) {
          await this.#_OrgMenuComponent(msg)
        } else if (msg.text == botTexts.userCheckBalance.uz) {
          this.bot.sendMessage(msg.chat.id, 'Sizning balas')
        }
      }

      if (userStep == botSteps.selectOrg) {
        if (msg.text == botTexts.backAction.uz) {
          this.bot.sendMessage(
            msg.chat.id,
            botTexts.backMainMenu.uz,
            MainMenuKeyboard
          )

          await this.storeService.editStep({
            telegramId: msg.chat.id,
            step: botSteps.mainMenu
          })
        } else {
          const orgs = await this.orgService.orgRetrieveAll({
            pageNumber: 1,
            pageSize: 1,
            search: msg.text
          })

          if (orgs.orgList.length == 1) {
            this.bot.sendMessage(
              msg.chat.id,
              botTexts.askCategory.uz,
              FoodCategoryMenuKeyboard
            )
            await this.storeService.editStep({
              telegramId: msg.chat.id,
              step: `${botSteps.selectCategory}/${orgs.orgList[0]['_id']}`
            })
          }
        }
      }

      if (userStep.split('/')[0] == botSteps.selectCategory) {
        if (msg.text == botTexts.backAction.uz) {
          await this.#_OrgMenuComponent(msg)
        } else if (msg.text == botTexts.storeAction.uz) {
          this.bot.sendMessage(msg.chat.id, 'Store')
        } else {
          if (!userStep.split('/')[1]) throw new Error('OrgId not found')
          let category: string | undefined
          console.log('User Step:', userStep)

          switch (msg.text) {
            case botTexts.dessertCategory.uz:
              category = categoryEnum.dessert
              break
            case botTexts.snackCategory.uz:
              category = categoryEnum.snack
              break
            case botTexts.drinkCategory.uz:
              category = categoryEnum.drink
              console.log(category, msg.text)
              break
          }

          if (category) {
            const foods = await this.foodService.foodRetrieveAll({
              pageNumber: 1,
              pageSize: 30,
              category: category
            })

            this.bot.sendMessage(msg.chat.id, botTexts.selectFoodAction.uz, {
              reply_markup: KeyboardMaker({ data: foods.foodList })
            })

            await this.storeService.editStep({
              telegramId: msg.chat.id,
              step: `${botSteps.selectFood}/${userStep.split('/')[1]}`
            })
          }
        }
      }

      if (userStep.split('/')[0] == botSteps.selectFood) {
        if (msg.text == botTexts.backAction.uz) {
          this.bot.sendMessage(
            msg.chat.id,
            botTexts.askCategory.uz,
            FoodCategoryMenuKeyboard
          )
          await this.storeService.editStep({
            telegramId: msg.chat.id,
            step: `${botSteps.selectCategory}/${userStep.split('/')[1]}`
          })
        } else if (msg.text == botTexts.storeAction.uz) {
          this.bot.sendMessage(msg.chat.id, 'Store')
        } else {
          const food = await this.foodService.foodRetrieveAll({
            pageNumber: 1,
            pageSize: 1,
            org: userStep.split('/')[1],
            search: msg.text
          })

          if (food.foodList.length == 1) {
            this.bot.sendMessage(
              msg.chat.id,
              botTexts.viewFoodAction.uz,
              ViewFoodKeyboard
            )

            await this.bot.sendPhoto(msg.chat.id, food.foodList[0].img, {
              caption: this.#_foodCaptionGenerator(food.foodList[0]),
              reply_markup: this.#_inlineKeyboardMaker({
                id: userStep.split('/')[1]
              }),
              parse_mode: 'HTML'
            })
          }
        }
      }
    } catch (error) {
      console.log(error)
      this.bot.sendMessage(msg.chat.id, botTexts.errorMessage.uz, {
        parse_mode: 'HTML'
      })
    }
  }

  #_inlineKeyboardMaker(payload: { id: string }): InlineKeyboardMarkup {
    return {
      inline_keyboard: [
        CountFoodAmountComponent,
        [
          {
            text: botTexts.storeToCartAction.uz,
            callback_data: `${botCallbackData.saveToStore}/${payload.id}`
          }
        ]
      ]
    }
  }

  #_foodCaptionGenerator(payload: {
    name: string
    cost: number
    org: string
  }): string {
    return `Mahsulot nomi: <b>${payload.name}</b>\nOshxona: <b>${payload.org}</b>\nNarxi: <b>${FormatNumberWithSpaces(payload.cost)}</b> so'm`
  }

  #_amountChanger(payload: { msg: CallbackQuery }) {
    const message = payload.msg.message
    if (!message?.reply_markup) {
      throw new Error('Message not found')
    }

    const count =
      message.reply_markup.inline_keyboard[0].find(
        (e) => e.callback_data == botCallbackData.showCount
      )?.text || '1'

    if (payload.msg.data == botCallbackData.increaseAmount) {
      if (Number(count) == 10) {
        this.bot.answerCallbackQuery(payload.msg.id, {
          text: 'Maximum equal to 10',
          show_alert: true
        })
      } else {
        this.bot.editMessageReplyMarkup(
          {
            inline_keyboard: [
              [
                { text: '-', callback_data: botCallbackData.decreaseAmount },
                {
                  text: `${Number(count) + 1}`,
                  callback_data: botCallbackData.showCount
                },
                { text: '+', callback_data: botCallbackData.increaseAmount }
              ],
              [...message.reply_markup?.inline_keyboard[1]]
            ]
          },
          {
            chat_id: message.chat.id,
            message_id: message.message_id
          }
        )
      }
    } else if (payload.msg.data == botCallbackData.decreaseAmount) {
      if (Number(count) == 1) {
        this.bot.answerCallbackQuery(payload.msg.id, {
          text: 'Minimum equal to 1',
          show_alert: true
        })
      } else {
        this.bot.editMessageReplyMarkup(
          {
            inline_keyboard: [
              [
                { text: '-', callback_data: botCallbackData.decreaseAmount },
                {
                  text: `${Number(count) - 1}`,
                  callback_data: botCallbackData.showCount
                },
                { text: '+', callback_data: botCallbackData.increaseAmount }
              ],
              [...message.reply_markup?.inline_keyboard[1]]
            ]
          },
          {
            chat_id: message.chat.id,
            message_id: message.message_id
          }
        )
      }
    } else if (payload.msg.data == botCallbackData.showCount) {
      this.bot.answerCallbackQuery(payload.msg.id, {
        text: count,
        show_alert: true
      })
    }
  }

  async #_OrgMenuComponent(msg: Message) {
    const orgs = await this.orgService.orgRetrieveAll({
      pageNumber: 1,
      pageSize: 5
    })

    await this.bot.sendMessage(msg.chat.id, botTexts.askOrg.uz, {
      reply_markup: KeyboardMaker({
        data: orgs.orgList.map((e) => ({ name: e.name_org }))
      })
    })

    await this.storeService.editStep({
      telegramId: msg.chat.id,
      step: botSteps.selectOrg
    })
  }

  async #_storeFoodToCart(msg: CallbackQuery) {
    try {
      if (msg.message?.reply_markup) {
        await this.bot.deleteMessage(msg.from.id, msg.message.message_id)

        const count =
          msg.message.reply_markup?.inline_keyboard[0].find(
            (e) => e.callback_data == botCallbackData.showCount
          )?.text || '1'

        await this.storeService.saveToStoreByOrg({
          amount: Number(count),
          food: '',
          chatId: msg.message.chat.id,
          org: ''
        })

        await this.storeService.editStep({
          telegramId: msg.from.id,
          step: `${botSteps.selectCategory}/${58}`
        })

        this.bot.sendMessage(
          msg.from.id,
          botTexts.storedAction.uz,
          FoodCategoryMenuKeyboard
        )
      }
    } catch (error) {
      console.log(error)
    }
  }
}

if (!BOT_TOKEN) throw new Error('Bot Token Not Found')
export const botInstance = new TelegramBotApi(BOT_TOKEN)
