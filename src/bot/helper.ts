import { KeyboardButton, ReplyKeyboardMarkup } from 'node-telegram-bot-api'
import { botTexts } from './text'

export const KeyboardMaker = (payload: {
  data: any[]
}): ReplyKeyboardMarkup => {
  const buttonrow: ReplyKeyboardMarkup = { keyboard: [], resize_keyboard: true }
  let singlerow: KeyboardButton[] = []
  payload.data.map((e, index: number) => {
    singlerow.push({
      text: e.name
    })

    if (singlerow.length == 2 || index === payload.data.length - 1) {
      buttonrow.keyboard.push([...singlerow])
      singlerow = []
    }
  })

  buttonrow.keyboard.unshift([{ text: botTexts.backAction.uz }])

  return buttonrow
}

export const FormatNumberWithSpaces = (payload: number) => {
  const strNumber = String(payload)

  const [integerPart, decimalPart] = strNumber.split('.')

  let formattedIntegerPart = ''
  for (let i = integerPart.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) {
      formattedIntegerPart = ' ' + formattedIntegerPart
    }
    formattedIntegerPart = integerPart[i] + formattedIntegerPart
  }

  let formattedNumber = formattedIntegerPart
  if (decimalPart) {
    formattedNumber += '.' + decimalPart
  }

  return formattedNumber
}
