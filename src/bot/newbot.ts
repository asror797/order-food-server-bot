import TelegramBot, { CallbackQuery, Message } from 'node-telegram-bot-api'
import { BOT_TOKEN } from '@config'
import { botTexts } from './text'
import { botSteps, categoryEnum } from './constants'
import { KeyboardMaker } from './helper'
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
  FoodCategoryMenuKeyboard
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
      console.log(error)
      this.bot.sendMessage(msg.chat.id, 'share')
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
      } else if (data.isExist && data.user && data.user.role == 'cook') {
        this.bot.sendMessage(
          msg.chat.id,
          botTexts.cookMainMenu.uz,
          CookMainkeyboard
        )
      } else {
        this.bot.sendMessage(
          msg.chat.id,
          botTexts.askContact.uz,
          ShareContactKeyboard
        )
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

      // switch (userStep) {
      //   case 'select':
      //     console.log(userStep)
      //     break
      //   default:
      //     console.log('ok')
      // }

      if (msg.text == botTexts.userNewOrder.uz) {
        const orgs = await this.orgService.orgRetrieveAll({
          pageNumber: 1,
          pageSize: 5
        })

        await this.bot.sendMessage(msg.chat.id, botTexts.askOrg.uz, {
          reply_markup: KeyboardMaker({ data: orgs.orgList })
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
        }

        const foods = await this.foodService.foodRetrieveAll({
          pageNumber: 1,
          pageSize: 20,
          category: category,
          org: userStep.split('/')[1]
        })

        console.log(foods)

        this.bot.sendMessage(msg.chat.id, 'Mahsulotni tanlang', {
          reply_markup: {
            keyboard: [
              [
                { text: botTexts.backAction.uz },
                { text: foods.foodList[0].name }
              ]
            ],
            resize_keyboard: true
          }
        })

        await this.storeService.editStep({
          telegramId: msg.chat.id,
          step: `${botSteps.selectFood}/${userStep.split('/')[1]}`
        })
      }

      if (userStep.split('/')[0] == botSteps.selectFood) {
        const food = await this.foodService.foodRetrieveAll({
          pageNumber: 1,
          pageSize: 1,
          org: userStep.split('/')[1],
          search: msg.text
        })

        if (food.foodList.length == 1) {
          console.log(food.foodList)
          this.bot.sendMessage(msg.chat.id, 'mahsulot soni tanlang', {
            reply_markup: {
              keyboard: [[{ text: 'ok' }]],
              resize_keyboard: true
            }
          })

          await this.bot.sendMessage(msg.chat.id, 'Tanlangan mahsulot', {
            reply_markup: {
              inline_keyboard: [[{ text: 'pepsi', callback_data: 'ds' }]]
            }
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}

if (!BOT_TOKEN) throw new Error('Bot Token Not Found')
export const botInstance = new TelegramBotApi(BOT_TOKEN)
