import TelegramBot from 'node-telegram-bot-api'
import { CallbackQuery, Message } from 'node-telegram-bot-api'
import { BOT_TOKEN } from '@config'
import { UserService } from '@services'
import { BotTextes } from './text'

class TelegramBotApi {
  private bot: TelegramBot
  private userService = new UserService()
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
      if (data.isExist === true && data.user) {
        if (data.user.role == 'cook' && chatType == 'private')
          await this.handleCookMessages(msg)
        if (data.user.role == 'user' && chatType == 'private')
          await this.handleUserMessages(msg)
      } else {
        this.bot.sendMessage(chatId, `Siz ro'yhatdan otmagansiz`)
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

      if (data.isExist) {
        console.log(data.user)
      } else {
        this.bot.sendMessage(msg.chat.id, BotTextes.askContact.uz, {
          reply_markup: {
            keyboard: [[{ text: 'share contact', request_contact: true }]],
            resize_keyboard: true
          },
          parse_mode: 'HTML'
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
      console.log(msg)
    } catch (error) {
      console.log(error)
    }
  }

  private async handleUserMessages(msg: Message): Promise<void> {
    try {
      console.log(msg)
    } catch (error) {
      console.log(error)
    }
  }
}

if (!BOT_TOKEN) throw new Error('Bot Token Not Found')
export const botInstance = new TelegramBotApi(BOT_TOKEN)
