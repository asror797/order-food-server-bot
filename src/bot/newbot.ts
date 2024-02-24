import TelegramBot from 'node-telegram-bot-api'
import { CallbackQuery, Message } from 'node-telegram-bot-api'
import { BOT_TOKEN } from '@config'
import { UserService } from '@services'
import { BotTextes } from './text'
import {
  MainMenuKeyboard,
  CookMainkeyboard,
  ShareContactKeyboard
} from './keyboards'

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
        console.log(data.user)
        this.bot.sendMessage(
          msg.chat.id,
          'Xush kelibsiz buyurtma berishga tayyor',
          MainMenuKeyboard
        )
      } else if (data.isExist && data.user && data.user.role == 'cook') {
        this.bot.sendMessage(
          msg.chat.id,
          BotTextes.cookMainMenu.uz,
          CookMainkeyboard
        )
      } else {
        this.bot.sendMessage(
          msg.chat.id,
          BotTextes.askContact.uz,
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
      this.bot.sendMessage(msg.chat.id, 'Oshxonanni tanlang', {
        reply_markup: {
          keyboard: [
            [{ text: 'Ortasaroy' }, { text: 'Kokakola' }],
            [{ text: 'Orqaga' }]
          ],
          resize_keyboard: true
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
}

if (!BOT_TOKEN) throw new Error('Bot Token Not Found')
export const botInstance = new TelegramBotApi(BOT_TOKEN)
