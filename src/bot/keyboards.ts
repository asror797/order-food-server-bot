import { ReplyKeyboardMarkup } from "node-telegram-bot-api";

interface Keyboard {
  text: string;
  callback_data: string;
}


export const ShareContact: ReplyKeyboardMarkup = {
  keyboard: [
    [
      {
        text: "Sahare contact",
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
        text:"🍽 Menu"
      },
      {
        text:"💰 Balans"
      }
    ],
    [
      {
        text:"✍️Izoh qoldirish"
      },
      {
        text:"Buyurtmalarim"
      }
    ]
  ],
  resize_keyboard: true
}


export const FoodMenu: ReplyKeyboardMarkup = {
  keyboard: [
    [
      {
        text:"Asosiy menu"
      },
      {
        text:"🛒 Savat"
      }
    ],
    [
      {
        text:"🍰 Desert"
      },
      {
        text:"🥤Ichimlik"
      }
    ],
    [
      {
        text:"🌮 Gazaklar"
      }
    ]
  ],
  resize_keyboard: true,
}


export const SendNote: ReplyKeyboardMarkup = {
  keyboard: [
    [
      {
        text:'Yuborish'
      }
    ]
  ]
}



// export function PaginationInlineKeyboard(current:number,maxPage: number,data: string[]) {
//   const keys = []
// }



interface TextCallBack {
  text: string;
  callback_data: string
}


function isLastElement(array:string[], index:number) {
  return index === array.length - 1;
}

export function KeyboardFormatter(current: number, pageData: string[]) {
  const keys:any = []
  const countData = pageData.length;
  console.log(countData)

  if(countData <= 5) {
    const row:TextCallBack[] = []
    pageData.map((e,i) => {
      row.push({
        text:`${i+1}`,
        callback_data:e
      })
    });
    keys.push(row)
    return keys
  }
  
  if(countData > 5 && countData <= 10) {
    let row:TextCallBack[] = []
    pageData.map((e,i) => {
      row.push({
        text: `${i+1}`,
        callback_data:e
      });
      if(row.length == 5) {
        keys.push(row)
        row = []
      }

      if(pageData.indexOf(e) == pageData.length - 1) {
        keys.push(row)
      }
    })

    return keys
  }
  
}