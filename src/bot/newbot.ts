import TelegramBot from 'node-telegram-bot-api'
import { BOT_TOKEN } from '@config'
import { botTexts } from './text'
import { botSteps, categoryEnum } from './constants'
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

        // await this.storeService.editStep({
        //   telegramId: msg.chat.id,
        //   step: 'select-order'
        // })
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
      } else {
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

  private handleCallbackQuery(msg: CallbackQuery) {
    try {
      console.log(msg.data)
    } catch (error) {
      console.log(error)
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
      const userStep = await this.storeService.getStep({
        telegramId: msg.chat.id
      })

      if (msg.text == botTexts.userNewOrder.uz) {
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

      if (userStep == botSteps.selectOrg) {
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

      if (userStep.split('/')[0] == botSteps.selectCategory) {
        if (!userStep.split('/')[1]) throw new Error('OrgId not found')
        if (msg.text == botTexts.backAction.uz) {
          this.bot.sendMessage(msg.chat.id, 'Buyurtma bering', MainMenuKeyboard)
        } else {
          let category: string | undefined

          switch (msg.text) {
            case botTexts.dessertCategory.uz:
              category = categoryEnum.dessert
              break
            case botTexts.snackCategory.uz:
              category = categoryEnum.snack
              break
            case botTexts.dessertCategory.uz:
              category = categoryEnum.dessert
              break
            case botTexts.backAction.uz:
              category = categoryEnum.dessert
              break
          }

          const foods = await this.foodService.foodRetrieveAll({
            pageNumber: 1,
            pageSize: 30,
            category: category,
            org: userStep.split('/')[1]
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
              caption: `Mahsulot nomi: <b>${food.foodList[0].name}</b>\nOshxona: <b>${food.foodList[0].org}</b>\nNarxi: <b>${FormatNumberWithSpaces(food.foodList[0].cost)} so'm</b>`,
              reply_markup: this.#_inlineKeyboardMaker({ id: 'sasas' }),
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
        [{ text: 'Store', callback_data: payload.id }]
      ]
    }
  }
}

if (!BOT_TOKEN) throw new Error('Bot Token Not Found')
export const botInstance = new TelegramBotApi(BOT_TOKEN)
