import { Message } from 'node-telegram-bot-api'

export class BotService {
  public async checkAuthuser(msg: Message) {
    console.log(msg)
  }
}
