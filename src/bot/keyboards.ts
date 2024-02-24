import { ReplyKeyboardMarkup, SendMessageOptions } from 'node-telegram-bot-api'

// interface Keyboard {
//   text: string
//   callback_data: string
// }

export const MainMenuKeyboard: SendMessageOptions = {
  reply_markup: {
    keyboard: [[{ text: 'Buyurtma berish' }, { text: 'Balans' }]],
    resize_keyboard: true
  },
  parse_mode: 'HTML'
}

export const CookMainkeyboard: SendMessageOptions = {
  reply_markup: {
    keyboard: [
      [{ text: 'Yangi elon yaratish' }, { text: 'yaratilgan elon korish' }]
    ],
    resize_keyboard: true
  },
  parse_mode: 'HTML'
}

export const ShareContactKeyboard: ReplyKeyboardMarkup = {
  keyboard: [
    [
      {
        text: 'Telefon raqam yuborish 📞',
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
        text: '🍽 Menu'
      },
      {
        text: '💰 Balans'
      }
    ],
    [
      {
        text: '✍️Izoh qoldirish'
      },
      {
        text: 'Buyurtmalarim'
      }
    ]
  ],
  resize_keyboard: true
}

export const FoodMenu: ReplyKeyboardMarkup = {
  keyboard: [
    [
      {
        text: 'Asosiy menu'
      },
      {
        text: '🛒 Savat'
      }
    ],
    [
      {
        text: '🍰 Desert'
      },
      {
        text: '🥤Ichimlik'
      }
    ],
    [
      {
        text: '🌮 Gazaklar'
      }
    ]
  ],
  resize_keyboard: true
}

export const SendNote: ReplyKeyboardMarkup = {
  keyboard: [
    [
      {
        text: 'Yuborish'
      }
    ]
  ]
}

export const CookMenu: ReplyKeyboardMarkup = {
  keyboard: [
    [
      {
        text: 'Yangi Buyurtma'
      },
      {
        text: "Buyurtmalarni ko'rish"
      }
    ]
  ],
  resize_keyboard: true
}

interface TextCallBack {
  text: string
  callback_data: string
}

interface CallBack {
  id: string
  name: string
  cost: number
}

export function formatter(data: CallBack[]) {
  const keys: any = []

  data.map((e) => {
    keys.push([
      {
        text: `${e.name} - ${e.cost} so'm`,
        callback_data: `food-${e.id}`
      }
    ])
  })

  return keys
}

export function KeyboardInline(data: string[]) {
  const keys: any = []

  if (data.length > 0) {
    data.map((e: any) => {
      keys.push({
        tex: `${e.name}`,
        callback_data: `lunch-${e['_id']}`
      })
    })
  }
}

export function KeyboardFormatter(current: number, pageData: string[]) {
  const keys: any = []
  const countData = pageData.length
  console.log(countData)

  if (countData <= 5) {
    const row: any[] = []
    pageData.map((e, i) => {
      row.push([
        {
          text: `${i + 1}`,
          callback_data: `food-${e}`
        }
      ])
    })
    keys.push(row)
    return keys
  }

  if (countData > 5 && countData <= 10) {
    let row: TextCallBack[] = []
    pageData.map((e, i) => {
      row.push({
        text: `${i + 1}`,
        callback_data: `food-${e}`
      })
      if (row.length == 5) {
        keys.push(row)
        row = []
      }

      if (pageData.indexOf(e) == pageData.length - 1) {
        keys.push(row)
      }
    })

    return keys
  }
}
