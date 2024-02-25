import { KeyboardButton, ReplyKeyboardMarkup } from 'node-telegram-bot-api'
import { BotTextes } from './text'
import { OrgList } from '@interfaces'

export const KeyboardMaker = (payload: {
  data: OrgList[]
}): ReplyKeyboardMarkup => {
  const buttonrow: ReplyKeyboardMarkup = { keyboard: [], resize_keyboard: true }
  console.log(payload.data)

  let singlerow: KeyboardButton[] = []
  for (let i = 0; i < payload.data.length; i++) {
    const e = payload.data[i]
    if (singlerow.length == 2) {
      buttonrow.keyboard.push(singlerow)
      singlerow = []
    } else if (payload.data.length == 1) {
      singlerow.push({
        text: e.name_org
      })
      buttonrow.keyboard.push(singlerow)
    }
  }

  buttonrow.keyboard.unshift([{ text: BotTextes.backAction.uz }])

  return buttonrow
}
