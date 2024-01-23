import TelegramBot, { Message, CallbackQuery } from 'node-telegram-bot-api'
// import {
//   FoodService,
//   LunchService,
//   StoreService,
//   LunchBaseService,
//   OrderService,
//   TripService,
// } from '@services'
import { UserService } from './../services/user.service'
import { FoodService } from './../services/food.service'
import { LunchService } from './../services/lunch.service'
import { StoreService } from './../services/store.service'
import { LunchBaseService } from './../services/lunch-base.service'
import { OrderService } from './../services/order.service'
import { TripService } from './../services/trip.service'
import { IUser } from '../interfaces/user.interface'
import {
  CookMenu,
  FoodMenu,
  MainMenu,
  ShareContact,
  formatter,
} from './keyboards'
import { orgModel } from '@models'


function convertToNewFormat(orgArr:any) {
  const result:any = [];
  let currentRow:any = [];

  orgArr.forEach((org:any, index:any) => {
    const item = {
      text: org.name_org,
      callback_data: `PICKORG-${org._id}-${org.name_org}`,
    };

    currentRow.push(item);

    // Check if the row is complete or if it's the last item in the array
    if (currentRow.length === 2 || index === orgArr.length - 1) {
      result.push([...currentRow]);
      currentRow = [];
    }
  })

  return [...result,[{
    text:"⬅️ Orqaga",
    callback_data:"mainkeyboard-a"
  }]]
}

function convertToNewFormatFoods(orgArr:any) {
  let currentRow:any = [];

  orgArr.forEach((org:any, index:any) => {
    const item = {
      text: org.name,
      callback_data: `sf-${org._id}-${org['_id']}`,
    }

    currentRow.push(item)
  })

  return currentRow
}

class BotService {
  private bot: TelegramBot
  private users = new UserService()
  private foods = new FoodService()
  private store = new StoreService()
  private lunchService = new LunchService()
  private lunchBaseService = new LunchBaseService()
  private orderService = new OrderService()
  private tripService = new TripService()

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true })
  }

  public initialize() {
    this.bot.on('message', this.handleMessage.bind(this))
    this.bot.on('callback_query', this.handleCallbackQuery.bind(this))
    this.bot.on('inline_query', this.handleInlineQuery.bind(this))
    this.bot.on('polling_error', this.handlePollingError.bind(this))
    this.bot.on('contact', this.registerUser.bind(this))
    this.bot.on('polling_error', (error) => {
      console.error(`Polling error: ${error.message}`)
    })
    console.log('Bot initialized')
  }

  private async registerUser(msg: Message) {
    const contact = msg.contact
    try {
      // const contact = msg.contact;
      if (contact?.user_id) {
        const isExist = await this.users.isExist(contact.user_id)
        if (isExist.data) {
          this.bot.sendMessage(contact.user_id, "Siz ro'yxatdan o'tgansiz")
        } else {
          const user = await this.users.registirNewUser({
            first_name: contact.first_name || '',
            last_name: contact.last_name || '',
            phone_number: contact.phone_number || '',
            telegram_id: contact.user_id,
          })
          this.bot.sendMessage(user.telegram_id, "Siz ro'yxatdan o'tdingiz", {
            reply_markup: MainMenu,
          })
        }
      }
    } catch (error) {
      console.log(error)
      if (contact?.user_id) {
        this.bot.sendMessage(
          contact.user_id,
          'Something went wrong try again :(',
        )
      }
    }
  }

  private async handleMessage(msg: Message) {
    const chatId = msg.chat.id
    const messageText = msg.text || ''
    const chatType = msg.chat.type
    interface IisExist {
      message: string
      data: IUser | null | any
    }
    const isExist: IisExist = await this.users.isExist(chatId)
    try {
      if(chatType == 'private') this.handleClientCommands(msg)
      if(chatType == 'group' || chatType == 'supergroup') this.handleGroupCommands(msg)

      // if (msg.chat.type == 'group') {
      //   if (messageText == '/group') {
      //     this.bot.sendMessage(chatId, `Groupd ID: ${chatId}`)
      //   }
      // } else if (isExist.data && isExist.data.roles.indexOf('cook') !== -1) {
      //   if (messageText.startsWith('/start')) {
      //     this.bot.sendMessage(chatId, 'Siz oshpazsiz', {
      //       reply_markup: CookMenu,
      //     })
      //   } else if (messageText == 'Yangi Buyurtma') {
      //     const foods = await this.lunchBaseService.getByOrg(
      //       isExist.data.org['_id'],
      //     )
      //     console.log(foods)

      //     const keys: any = []

      //     foods.map((e: any) => {
      //       keys.push([
      //         {
      //           text: `${e.name}`,
      //           callback_data: `lunch-${e['_id']}`,
      //         },
      //       ])
      //     })

      //     this.bot.sendMessage(chatId, 'Taomni tanlang: ', {
      //       reply_markup: {
      //         inline_keyboard: [...keys],
      //       },
      //     })
      //   } else if (messageText == "Buyurtmalarni ko'rish") {
      //     const trip = await this.tripService.tripRetrieveOne(chatId)
      //     // const agreeusers: any = []
      //     if (trip.status) console.log(trip.data)
      //     let outputStr = '\nSarflanadigan Mahsulotlar:\n\n'
      //     let countLunch = ''

      //     console.log(trip.count)
      //     if (trip.count) {
      //       Object.keys(trip.count).forEach((lunch, e) => {
      //         countLunch += `${e + 1}. ${lunch} - ${
      //           trip.count[lunch].amount
      //         } kishi\n`
      //       })
      //     }

      //     Object.keys(trip.productCount).forEach((product, e) => {
      //       outputStr += `${e + 1}. ${trip.productCount[product].name} - ${
      //         trip.productCount[product].amount
      //       } ${trip.productCount[product].unit}`
      //     })

      //     this.bot.sendMessage(
      //       chatId,
      //       `${trip.data.meal.name}\n${trip.data.candidates.length} ta hohlaydi.\n\nShundan:\n${countLunch} ${outputStr}`,
      //     )

      //     if (!trip.status) {
      //       this.bot.sendMessage(chatId, `Admin malumotlari xato`)
      //     }
      //   }
      // } else {
      //   if (messageText.startsWith('/start')) {
      //     if (isExist.data) {
      //       this.bot.sendMessage(chatId, 'Xush kelibsiz', {
      //         reply_markup: {
      //           keyboard: [
      //             [
      //               {
      //                 text: "🍽 Menu",
      //               }
      //             ]
      //           ],
      //           remove_keyboard: true
      //         },
      //       })
      //     } else {
      //       console.log(msg)
      //       this.bot.sendMessage(chatId, 'Siz ro‘yxatdan o‘tmagansiz', {
      //         reply_markup: ShareContact,
      //       })
      //     }
      //   } else if (messageText.startsWith('/help')) {
      //     // Handle the /help command
      //     this.bot.sendMessage(
      //       chatId,
      //       'Available commands:\n/help - Show this help message\n/echo [text] - Echo your message',
      //     )
      //   } else if (messageText.startsWith('/echo')) {
      //     // Handle the /echo command
      //     const echoMessage = messageText.split('/echo')[1]?.trim()
      //     if (echoMessage) {
      //       this.bot.sendMessage(chatId, `You said: ${echoMessage}`)
      //     } else {
      //       this.bot.sendMessage(chatId, 'Please provide text to echo.')
      //     }
      //   } else if (messageText == '🍽 Menu') {
      //     // await this.bot.deleteMessage(chatId,msg.message_id)
      //     this.bot.sendMessage(chatId, 'Oshxonani tanlang:', {
      //       reply_markup: {
      //         inline_keyboard: [
      //           [
      //             {
      //               text:"Ortga qaytish",
      //               web_app: {
      //                 url:"https://woodlinepro.uz/"
      //               }
      //             }
      //           ]
      //         ]
      //       },
      //     })
          
      //   } else if (messageText == 'Asosiy menu') {
      //     if (isExist.data && isExist.data.roles.indexOf('cook') !== -1) {
      //       this.bot.sendMessage(
      //         chatId,
      //         `Assalomu alaykum ${isExist.data.first_name}`,
      //         {
      //           reply_markup: CookMenu,
      //         },
      //       )
      //     } else {
      //       this.bot.sendMessage(chatId, 'Buyurtma bering', {
      //         reply_markup: MainMenu,
      //       })
      //     }
      //   } else if (messageText == '💰 Balans') {
      //     await this.bot.deleteMessage(chatId, msg.message_id)
      //     const userBalance: IUser | null = await this.users.getBalance(chatId)
      //     if (userBalance) {
      //       this.bot.sendMessage(
      //         chatId,
      //         `<b>Ism</b>: ${userBalance.first_name} ${
      //           userBalance.last_name
      //         }\n<b>Balans</b>: ${userBalance.balance} So'm\n<b>Status</b>: ${
      //           userBalance.is_active ? 'tasdiqlangan' : 'tasdiqlanmagan'
      //         }`,
      //         { parse_mode: 'HTML' },
      //       )
      //     } else {
      //       this.bot.sendMessage(chatId, 'Foydalanuvchi topilmadi')
      //     }
      //   } else if (messageText == '🥤Ichimlik') {
      //     // await this.bot.deleteMessage(chatId,msg.message_id)
      //     const user = await this.users.isExist(chatId)

      //     console.log(user)

      //     if (user.data) {
      //       const foods = await this.foods.getFoodsForBot({
      //         org: user.data.org,
      //         category: 'drinks',
      //       })
      //       console.log(foods)
      //       const data: any[] = []
      //       foods.map((e) => {
      //         data.push({
      //           id: e['_id'],
      //           name: e.name,
      //           cost: e.cost,
      //         })
      //       })
      //       console.log(formatter(data))
      //       this.bot.sendMessage(chatId, `Ichimliklar: `, {
      //         reply_markup: { inline_keyboard: [...formatter(data)] },
      //       })
      //     } else {
      //       this.bot.sendMessage(chatId, 'Siz Tasdiqlanmagansiz')
      //     }
      //   } else if (messageText == '🛒 Savat') {
      //     // await this.bot.deleteMessage(chatId,msg.message_id-2)
      //     const store = await this.store.getStore(`${chatId}`)
      //     if (store.length == 0) {
      //       this.bot.sendMessage(chatId, "Bo'sh", { reply_markup: FoodMenu })
      //     } else {
      //       const textStore: string[] = []
      //       let total_cost: number = 0
      //       store.map((e: any, i: number) => {
      //         textStore.push(
      //           `\n${i + 1}. ${e.food.food} -- ${e.food.cost} so'm -- ${
      //             e.amount
      //           } ta`,
      //         )
      //         total_cost = total_cost + e.food.cost * e.amount
      //       })

      //       textStore.push(`\n\n Jami: ${total_cost} so'm`)
      //       this.bot.sendMessage(chatId, textStore.join(''), {
      //         reply_markup: {
      //           inline_keyboard: [
      //             [
      //               {
      //                 text: "Bo'shatish",
      //                 callback_data: 'clear-store',
      //               },
      //               {
      //                 text: 'Sotib olish',
      //                 callback_data: 'buy-order',
      //               },
      //             ],
      //           ],
      //         },
      //         parse_mode: 'HTML',
      //       })
      //     }
      //   } else if (messageText == '🌮 Gazaklar') {
      //     const user = await this.users.isExist(chatId)

      //     console.log(user)

      //     if (user.data) {
      //       const foods = await this.foods.getFoodsForBot({
      //         org: user.data.org,
      //         category: 'snacks',
      //       })
      //       console.log(foods)
      //       const data: any[] = []
      //       foods.map((e) => {
      //         data.push({
      //           id: e['_id'],
      //           name: e.name,
      //           cost: e.cost,
      //         })
      //       })
      //       this.bot.sendMessage(chatId, `Gazaklar: `, {
      //         reply_markup: { inline_keyboard: [...formatter(data)] },
      //         parse_mode: 'HTML',
      //       })
      //     } else {
      //       this.bot.sendMessage(chatId, 'Siz Tasdiqlanmagansiz')
      //     }
      //   } else if (messageText == '🍰 Desert') {
      //     const user = await this.users.isExist(chatId)

      //     console.log(user)

      //     if (user.data) {
      //       const foods = await this.foods.getFoodsForBot({
      //         org: user.data.org,
      //         category: 'dessert',
      //       })
      //       console.log(foods)
      //       const data: any[] = []

      //       foods.map((e) => {
      //         data.push({
      //           id: e['_id'],
      //           name: e.name,
      //           cost: e.cost,
      //         })
      //       })
      //       this.bot.sendMessage(chatId, `Dessertlar: `, {
      //         reply_markup: { inline_keyboard: [...formatter(data)] },
      //       })
      //     } else {
      //       this.bot.sendMessage(chatId, 'Siz Tasdiqlanmagansiz')
      //     }
      //   } else if (messageText == 'Buyurtmalarim') {
      //   } else {
      //     this.bot.sendMessage(
      //       chatId,
      //       'I do not understand that command. Type /help for a list of available commands.',
      //     )
      //   }
      // }
    } catch (error) {
      console.log(error)
    }
  }

  private async handleClientCommands(payload:any) {
    const textMessage = payload.text || ''
    const chatId = payload.chat.id

    if(textMessage.startsWith('/start')) {
      this.bot.sendMessage(chatId,'Xush kelibsiz!\nДобро пожаловать!',{
        reply_markup: {
          keyboard: [
            [
              {
                text:"Buyurtma Berish 🛒"
              },
              {
                text:"Balans 💰"
              }
            ]
          ],
          resize_keyboard: true
        }
      })
    }
    if(textMessage == 'Buyurtma Berish 🛒') {
      const orgs = await orgModel.find().select('name_org').exec()
      const sentMessage = await this.bot.sendMessage(chatId,'<i>Loading...</i>',{
        parse_mode: 'HTML',
        reply_markup: {
          remove_keyboard: true
        }
      })
      this.bot.deleteMessage(chatId,sentMessage.message_id)
      this.bot.sendMessage(chatId,'Oshxonani tanlang:',{
        reply_markup: {
          inline_keyboard: convertToNewFormat(orgs)
        }
      })
    }
    if(textMessage == '💰 Balans') {
      this.bot.sendMessage(chatId,'')
    }

    if(textMessage == 'Savat') {
      this.bot.sendMessage(chatId,'')
    }

  }

  private async handleGroupCommands(payload:any) {
    this.bot.sendMessage(payload.chat.id,`${payload.chat.id}`)
  }

  private async handleCallbackQuery(callbackQuery: CallbackQuery) {
    console.log(callbackQuery)
    const chatId = callbackQuery.message?.chat.id
    const data = callbackQuery.data

    const splited = data?.split('-')[0]
    const ID = data?.split('-')[1]

    try {

      if(splited == 'PICKORG' && chatId && callbackQuery.message?.text) {

        await this.bot.editMessageText(`Tanlangan oshxona: <b>${data?.split('-')[2]}</b> \nNima buyurtma qilmoqchisiz: `,{
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text:"Savat🛒",
                  callback_data:`viewstore-${ID}`
                },
                {
                  text:"🍰Desert",
                  callback_data:`pk-dessert-${ID}`
                }
              ],
              [
                {
                  text:"🥤Ichimlik",
                  callback_data:`pk-drinks-${ID}`
                },
                {
                  text:"🍟Gazak",
                  callback_data:`pk-snack-${ID}`
                }
              ],
              [
                {
                  text:"⬅️Orqaga",
                  callback_data:"back-org"
                }
              ]
            ]
          }
        })
      }

      if(splited == 'back' && data?.split('-')[1] == 'org' && chatId && callbackQuery.message) {
        const orgs = await orgModel.find().select('name_org').exec()
        console.log(orgs)
        this.bot.editMessageText('Oshxonani tanlang',{
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          reply_markup: {
            inline_keyboard: convertToNewFormat(orgs)
          }
        })
      }

      if(splited == 'pk' && chatId && callbackQuery.message && ID) {
        const foods = await this.foods.getFoodsForBot({org: `${data?.split('-')[2]}`, category: ID, })
        console.log(foods)
        const FormatedFoods = convertToNewFormatFoods(foods)
        await this.bot.editMessageText(`Mahsulotni tanlang: `,{
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          reply_markup: {
            inline_keyboard: [
              [
                ...FormatedFoods
              ],
              [
                {
                  text:"⬅️Orqaga",
                  callback_data:`backmenu-${data?.split('-')[2]}`
                }
              ],
            ]
          }
        })
      }

      if(splited == 'backmenu' && chatId && callbackQuery.message && ID) {
        const Org = await orgModel.findById(ID).select('name_org').exec()
        if(!Org) {
          throw new Error('Org not found')
        }
        await this.bot.editMessageText(`Tanlangan Oshxona: <b>${Org.name_org}</b>\nNima buyurtma qilmoqchisiz:`,{
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text:"Savat🛒",
                  callback_data:`viewstore-${ID}`
                },
                {
                  text:"🍰Desert",
                  callback_data:`pk-dessert-${ID}`
                }
              ],
              [
                {
                  text:"🥤Ichimlik",
                  callback_data:`pk-drinks-${ID}`
                },
                {
                  text:"🍟Gazak",
                  callback_data:`pk-snack-${ID}`
                }
              ],
              [
                {
                  text:"⬅️Orqaga",
                  callback_data:"back-org"
                }
              ]
            ]
          }
        })
      }

      if(splited == 'sf' && chatId && callbackQuery.message && ID && data) {
        const food = await this.foods.getById(ID)
        console.log(food)
        await this.bot.editMessageText(`Mahsulot: <b>Snackers</b>\nNarxi: <b>21 000 uzs </b>`,{
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          parse_mode:'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '-',
                  callback_data: 'decrease',
                },
                {
                  text: '1',
                  callback_data: 'count',
                },
                {
                  text: '+',
                  callback_data: 'increase',
                },
              ],
              [
                {
                  text: "⬅️Orqaga qaytish",
                  callback_data: `pk-${food.category}-${food.org['_id']}`,
                },
                {
                  text: "Savatga Qo'shish 🛒",
                  callback_data: `store-${data.split('-')[1]}-${food.org}`,
                },
              ],
            ]
          }
        })
      }

      if (splited == 'remove' && chatId && callbackQuery.message) {
        await this.bot.deleteMessage(chatId, callbackQuery.message?.message_id)
      }

      if (splited == 'canceltrip' && ID) {
        const updatedTrip = await this.tripService.cancelAgreeClient({
          trip: ID,
          client: data.split('-')[2],
        })
        console.log('Canceled', updatedTrip)
      }

      if(splited == 'viewstore' && chatId && data && callbackQuery.message) {
        const store = await this.store.getStoreByOrg({chatId:chatId,org:data.split('-')[1]})
        console.log(store)

        const contentText:string[] = []

        store.map((e:any,index:number) => {
          contentText.push(`${index+1}. <b>${e.food.food}</b> - x<b>${e.amount}</b>\nNarxi: <b>${e.food.cost} s</b>`)
        })

        if(store.length > 0) {
          await this.bot.editMessageText(`<b>Savat:</b>\n\n${contentText.length > 0 ? contentText.join('\n\n') : ''} \n\nJami: <b>54000 s</b>`,{
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            parse_mode:'HTML',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text:"Savat bo'shatish",
                    callback_data: `clear-${data.split('-')[1]}`
                  },
                  {
                    text:"Sotib olish",
                    callback_data: `buy-${data.split('-')[1]}`
                  }
                ],
                [
                  {
                    text:"⬅️Orqaga",
                    callback_data: `backmenu-${data.split('-')[1]}`
                  }
                ]
              ]
            }
          })
        } else {
          await this.bot.editMessageText(`Savat bo'sh`,{
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            parse_mode:'HTML',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text:"⬅️Orqaga",
                    callback_data: `backmenu-${data.split('-')[1]}`
                  }
                ]
              ]
            }
          })
        }
      }


      if (splited == 'agree' && ID && chatId && callbackQuery.message) {
        await this.bot.deleteMessage(chatId, callbackQuery.message?.message_id)

        console.log(ID)

        this.bot.sendMessage(chatId, 'ok')
        // const Trip = await this.tripService.agreeClient(ID,chatId)

        // if(Trip.status && Trip.data) {
        //   const {  user ,trip , org} = Trip.data
        //   console.log('User',user)
        //   console.log('Trip',trip)
        //   console.log('Org',org)
        //   if(user) {
        //     this.bot.sendMessage(chatId,`${trip?.meal?.name} Qabul qilindi`,{
        //       reply_markup: {
        //         inline_keyboard: [
        //           [
        //             {
        //               text:'Olish uchun keldim',
        //               callback_data:`ask-${trip['_id']}-${user['_id']}`
        //             }
        //           ]
        //         ]
        //       }
        //     })
        //     this.bot.sendMessage(org.group_b_id,`Kimga: \n👤: ${user?.first_name} ${user?.last_name}\n📞: +998${user?.phone_number} \n`,{
        //       reply_markup: {
        //         inline_keyboard: [
        //           [
        //             {
        //               text:'Bajarish ✅',
        //               callback_data:'remove'
        //             }
        //           ],
        //           [
        //             {
        //               text:'Bekor qilish ❌',
        //               callback_data:`canceltrip-${trip['_id']}-${chatId}`
        //             }
        //           ]
        //         ]
        //       }
        //     })
        //   }
        // } else {
        //   this.bot.sendMessage(chatId,'Vaqt tugadi.')
        // }
      } else if (splited == 'disagree' && chatId && callbackQuery.message && ID) {
        await this.bot.deleteMessage(chatId, callbackQuery.message?.message_id)
        const trip = await this.tripService.disagreeClient(ID, chatId)
        this.bot.sendMessage(chatId, `${ID} yuborildi`)
      }

      if (splited == 'select' && chatId && data && callbackQuery.message) {
        await this.bot.deleteMessage(chatId, callbackQuery.message?.message_id)
        const Order = await this.tripService.pushUser(
          data.split('-')[2],
          chatId,
          data.split('-')[1],
        )

        if (Order.status && Order.data) {
          const { user, trip } = Order.data
          if (user && trip) {
            this.bot.sendMessage(chatId, 'Olish Uchun borish', {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Olish uchun keldim',
                      callback_data: `ask-${trip['_id']}-${user['_id']}`,
                    },
                  ],
                ],
              },
            })
          }
        } else {
          console.log(Order)
          this.bot.sendMessage(chatId, 'Vaqt tugadi.')
        }
      }

      if (
        splited == 'ask' &&
        chatId &&
        callbackQuery.message &&
        callbackQuery.data
      ) {
        // const tripsResponse = await this.tripService.pushUser()
        await this.bot.deleteMessage(chatId, callbackQuery.message?.message_id)
        const order: any = await this.tripService.findOrderTrip({
          trip: callbackQuery.data.split('-')[1],
          user: callbackQuery.data.split('-')[2],
        })
        console.log(order)

        if (order.candidates.length > 0) {
          this.bot.sendMessage(chatId, 'Yuborildi')
          this.bot.sendMessage(
            order?.org?.group_b_id,
            `${order.candidates[0].user.first_name} ${order.candidates[0].user.last_name} +998${order.candidates[0].user.phone_number}\n${order.meal.name} - ${order.candidates[0].lunch.name}x \n-----------\nTotal: ${order.candidates[0].lunch.cost} so'm`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Berdim ✅',
                      callback_data: 'donetrip',
                    },
                  ],
                ],
              },
            },
          )
        }
      }

      if (splited == 'donetrip' && chatId && callbackQuery.message) {
        this.bot.editMessageText(
          `${callbackQuery.message.text}\nBajarildi ✅`,
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: { inline_keyboard: [] },
          },
        )
      }

      if (splited == 'newtrip' && chatId && data && callbackQuery.message) {
        // this.bot.answerCallbackQuery({})
        await this.bot.deleteMessage(chatId, callbackQuery.message?.message_id)
        const User = await this.users.isExist(chatId)
        if (User.data?.roles) {
          console.log(User.data)
          const newTrip: any = await this.tripService.createTrip({
            meal: data.split('-')[1],
            org: User.data.org['_id'],
            sent_at: Math.floor(Date.now() / 1000),
          })
          console.log('Created Trip', newTrip)
          if (newTrip?.status) {
            this.bot.sendMessage(chatId, 'Yuborildi')
            const lunches = await this.lunchService.getByBase(
              data.split('-')[1],
            )
            interface OneKey {
              text: string
              callback_data: string
            }
            const baseKeys: Array<[OneKey]> = []

            lunches.map((e: any) => {
              baseKeys.push([
                {
                  text: `${e.name} - ${e.cost}`,
                  callback_data: `select-${e['_id']}-${newTrip.data['_id']}`,
                },
              ])
            })
            console.log(lunches)
            const clients = await this.users.getTelegramIDOfClients(
              User.data.org['_id'],
            )
            clients.map((e: any) => {
              this.bot.sendMessage(
                e.telegram_id,
                `Bugungi menu:\n${newTrip.data.meal.name}`,
                {
                  reply_markup: {
                    inline_keyboard: [
                      ...baseKeys,
                      [
                        {
                          text: "Yo'q ❌",
                          callback_data: `disagree-${newTrip.data['_id']}`,
                        },
                      ],
                    ],
                  },
                },
              )
            })
          } else {
            this.bot.sendMessage(
              chatId,
              `⏳ Yangi e'lon berish uchun ${Math.floor(
                newTrip.data.diffrence,
              )} minut vatq qoldi.`,
            )
          }
          console.log(newTrip)
        }
      }

      if (splited == 'lunch' && chatId) {
        const lunchID = data?.split('-')[1]
        if (lunchID) {
          const Lunch = await this.lunchBaseService.getById(lunchID)

          if (Lunch && callbackQuery.message) {
            // this.bot.editMessageReplyMarkup()
            await this.bot.deleteMessage(
              chatId,
              callbackQuery.message?.message_id,
            )
            this.bot.sendMessage(
              chatId,
              `Tanlangan taom:\nnomi: ${Lunch.name}`,
              {
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: "📢 E'lon qilish",
                        callback_data: `newtrip-${lunchID}`,
                      },
                    ],
                    [
                      {
                        text: '❌ Bekor Qilish',
                        callback_data: `remove`,
                      },
                    ],
                  ],
                },
              },
            )
          } else {
            this.bot.sendMessage(chatId, `Taom topilmadi`)
          }
        } else {
          this.bot.sendMessage(chatId, 'Tanlangan taom topib bolmadi. (285)')
        }
      }

      if (splited == 'order' && data && chatId && callbackQuery.message) {
        const type = data?.split('-')[2]
        if (type == 'done') {
          const updatedOrder: any = await this.orderService.acceptOrder({
            order: data?.split('-')[1],
            type: true,
          })
          const textMessage: string[] = []

          if (updatedOrder) {
            textMessage.push(
              `<b>Kimga:</b>\n\${updatedOrder.client.first_name} ${updatedOrder.client.last_name}\n+998${updatedOrder.client.phone_number}\n\n<b>Mahsulotlar:</b>`
            )
            updatedOrder.foods.map((e: any, i: number) => {
              textMessage.push(
                `\n${i + 1}. ${e.food.name} -- ${e.food.cost} s*m\n - Soni: ${
                  e.amount
                } ta`,
              )
            })
            textMessage.push(
              `\n-------------------\nJami: ${updatedOrder.total_cost} s*m`,
            )
            textMessage.push(`\n\Buyurtma Holati: Bajarildi ✅`)
            await this.bot.deleteMessage(
              chatId,
              callbackQuery.message?.message_id,
            )
            this.bot.sendMessage(
              Number(updatedOrder?.client.telegram_id),
              textMessage.join(''),
            )
            this.bot.sendMessage(
              Number(updatedOrder.org.group_a_id),
              textMessage.join(''),
              {
                parse_mode: 'HTML'
              }
            )
          }
          console.log(updatedOrder)
        } else if (type == 'cancel') {
          const textMessage: string[] = []
          const updatedOrder: any = await this.orderService.cancelOrder({
            order: data?.split('-')[1],
            type: false,
          })
          if (updatedOrder) {
            textMessage.push(
              `<b>Kimga:</b>\n${updatedOrder.client.first_name} ${updatedOrder.client.last_name}\n${updatedOrder.client.phone_number}`,
            )
            updatedOrder.foods.map((e: any, i: number) => {
              textMessage.push(`${i + 1}. ${e.food.name}`)
            })
            textMessage.push(
              `\n\n-------------------\nJami: ${updatedOrder.total_cost} uzs`,
            )
            textMessage.push(`\n\nBuyurtma Holati: Bekor qilindi ❌`)
            await this.bot.deleteMessage(
              chatId,
              callbackQuery.message?.message_id,
            )
            this.bot.sendMessage(
              Number(updatedOrder?.client.telegram_id),
              textMessage.join(''),
            )
            this.bot.sendMessage(
              Number(updatedOrder.org.group_a_id),
              textMessage.join(''),
            )
          }
          console.log(updatedOrder)
        }
      }

      if (splited == 'store' && chatId) {
        if (callbackQuery.message) {
          const amount = Number(
            callbackQuery.message.reply_markup?.inline_keyboard[0].find(
              (e) => e.callback_data == 'count',
            )?.text,
          )
          const food = data?.split('-')[1]

          if (food && amount) {
            await this.store.saveToStoreByOrg({
              amount: amount,
              chatId: chatId,
              food: food,
              org: data.split('-')[2]
            })
            const organization = data.split('-')[2]
            this.bot.answerCallbackQuery(callbackQuery.id, {
              text: "Savat qo'shildi",
            })
            const Org = await orgModel.findById(organization).select('name_org').exec()
            if(!Org) {
              throw new Error('Org not found')
            }
            await this.bot.editMessageText(`Tanlangan Oshxona: <b>${Org.name_org}</b>\nNima buyurtma qilmoqchisiz:`,{
              chat_id: chatId,
              message_id: callbackQuery.message.message_id,
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text:"Savat🛒",
                      callback_data:`viewstore-${organization}`
                    },
                    {
                      text:"🍰Desert",
                      callback_data:`pk-dessert-${organization}`
                    }
                  ],
                  [
                    {
                      text:"🥤Ichimlik",
                      callback_data:`pk-drinks-${organization}`
                    },
                    {
                      text:"🍟Gazak",
                      callback_data:`pk-snack-${organization}`
                    }
                  ],
                  [
                    {
                      text:"⬅️Orqaga",
                      callback_data:"back-org"
                    }
                  ]
                ]
              }
            })
          } else {
            this.bot.sendMessage(chatId, 'something went wrong')
          }
        }
      }

      if (splited == 'clear' && chatId && callbackQuery.message && ID) {
        this.bot.answerCallbackQuery(callbackQuery.id, {
          text: "Savat Bo'shatildi",
        })
        await this.store.clearStoreByOrg({chat:chatId,org: ID})
        const Org = await orgModel.findById(ID).select('name_org').exec()
        if(!Org) {
          throw new Error('Org not found')
        }
        await this.bot.editMessageText(`Tanlangan Oshxona: <b>${Org.name_org}</b>\nNima buyurtma qilmoqchisiz:`,{
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text:"Savat🛒",
                  callback_data:`viewstore-${ID}`
                },
                {
                  text:"🍰Desert",
                  callback_data:`pk-dessert-${ID}`
                }
              ],
              [
                {
                  text:"🥤Ichimlik",
                  callback_data:`pk-drinks-${ID}`
                },
                {
                  text:"🍟Gazak",
                  callback_data:`pk-snack-${ID}`
                }
              ],
              [
                {
                  text:"⬅️Orqaga",
                  callback_data:"back-org"
                }
              ]
            ]
          }
        })
      } 
    
      if(splited == 'mainkeyboard' && chatId && callbackQuery.message) {
        this.bot.deleteMessage(chatId,callbackQuery.message.message_id)
        this.bot.sendMessage(chatId,'Asosiy menu 👇',{
          reply_markup: {
            keyboard: [
              [
                {
                  text:"Buyurtma Berish 🛒"
                },
                {
                  text:"Balans 💰"
                }
              ]
            ],
            resize_keyboard: true
          },
        })
        // this.bot.editMessageText('Buyurtma Berish: ',{
        //   chat_id: chatId,
        //   message_id: callbackQuery.message.message_id,
        //   reply_markup: {
        //     inline_keyboard: []
        //   }
        // })
      }
      if (splited == 'buy' && chatId && data) {
        const user = await this.users.isExist(chatId)
        if (user.data.is_active == true && user.data.is_verified == true) {
          const store = await this.store.getStoreByOrg({chatId:chatId,org: data.split('-')[1]})
          console.log(store)

          if (store.length > 0) {    
            const foodArray: any = []
            store.map((e: any) => {
              foodArray.push({ food: e.food.id, amount: e.amount })
            })
            console.log(foodArray)
            const Order = await this.orderService.createOrder({
              org: user.data.org['_id'],
              client: user.data['_id'],
              foods: foodArray,
            })

            if (Order && callbackQuery.message) {
              const foods: string[] = []
              foods.push(
                `<b>Kimga:</b>\n${user.data.first_name} ${
                  user.data.last_name ? `${user.data.last_name}` : ''
                } \n+998${user.data.phone_number}\n\n<b>Mahsulotlar:</b>`,
              )
              Order.foods.map((e: any, i: number) => {
                foods.push(
                  `\n${i + 1}. ${e.food.name} x<b>${e.amount}</b> so'm \nNarxi: ${e.food.cost}\n`,
                )
              })
              foods.push(
                `\n------------------\nJami:${Order.total_cost} uzs \n`,
              )
              foods.push(`\nBuyurtma holati: <i>kutilmoqda...</i>`)
              if (
                user.data.org.group_a_id &&
                user.data.balance >= Order.total_cost
              ) {
                await this.store.clearStoreByOrg({chat:chatId,org:user.data.org['_id']})
                await this.bot.deleteMessage(
                  chatId,
                  callbackQuery.message?.message_id,
                )
                this.bot.sendMessage(
                  chatId,
                  `Buyurtma:\n\n${foods.join(' ')}`,
                  { 
                    parse_mode: 'HTML',
                    reply_markup: {
                      keyboard: [
                        [
                          {
                            text:"Buyurtma Berish 🛒",
                          },
                          {
                            text:"Balans 💰"
                          }
                        ]
                      ],
                      resize_keyboard: true
                    }
                  },
                )
                this.bot.sendMessage(user.data.org.group_a_id, foods.join(''), {
                  parse_mode: 'HTML',
                  reply_markup: {
                    inline_keyboard: [
                      [
                        {
                          text: 'Bajarildi ✅',
                          callback_data: `order-${Order['_id']}-done`,
                        },
                      ],
                      [
                        {
                          text: 'Bekor Qilish ❌',
                          callback_data: `order-${Order['_id']}-cancel`,
                        },
                      ],
                    ],
                  },
                })
              } else if (user.data.balance < Order.total_cost) {
                this.bot.answerCallbackQuery(callbackQuery.id, {
                  text: 'Hisobda pul yetarli emas',
                  show_alert: true,
                })
              }
            } else {
              this.bot.sendMessage(chatId, 'something went wrong at 302 line')
            }
          }
        } else {
          this.bot.sendMessage(
            chatId,
            'Foydalanuvchi tasdiqlanmagan yoki aktiv emas!',
          )
        }
      }

      if ((data == 'decrease' || data == 'increase' || data == 'count') && callbackQuery.message ) {
        console.log('Callback', callbackQuery)
        console.log(
          'bfirfkwjnjrfn',
          callbackQuery.message.reply_markup?.inline_keyboard,
        )
        console.log(data)

        console.log()

        if (callbackQuery.message.reply_markup && data == 'increase') {
          const message = callbackQuery.message
          const count =
            message.reply_markup?.inline_keyboard[0].find(
              (e) => e.callback_data == 'count',
            )?.text || 0
          this.bot.editMessageReplyMarkup(
            {
              inline_keyboard: [
                [
                  {
                    text: '-',
                    callback_data: 'decrease',
                  },
                  {
                    text: `${Number(count) + 1}`,
                    callback_data: 'count',
                  },
                  {
                    text: '+',
                    callback_data: 'increase',
                  },
                ],
                [...callbackQuery.message.reply_markup?.inline_keyboard[1]],
              ],
            },
            {
              chat_id: message.chat.id,
              message_id: message.message_id,
            },
          )
        } else if (callbackQuery.message.reply_markup && data == 'decrease') {
          const message = callbackQuery.message
          const count =
            message.reply_markup?.inline_keyboard[0].find(
              (e) => e.callback_data == 'count',
            )?.text || 0

          if (Number(count) > 1) {
            this.bot.editMessageReplyMarkup(
              {
                inline_keyboard: [
                  [
                    {
                      text: '-',
                      callback_data: 'decrease',
                    },
                    {
                      text: `${Number(count) - 1}`,
                      callback_data: 'count',
                    },
                    {
                      text: '+',
                      callback_data: 'increase',
                    },
                  ],
                  [...callbackQuery.message.reply_markup?.inline_keyboard[1]],
                ],
              },
              {
                chat_id: message.chat.id,
                message_id: message.message_id,
              },
            )
          } else {
            this.bot.answerCallbackQuery(callbackQuery.id, {
              text: 'Soni kam',
              show_alert: true,
            })
          }
        }
      } else if (splited == 'food') {
        if (data && chatId && callbackQuery.message) {
          await this.bot.deleteMessage(chatId, callbackQuery.message.message_id)
          this.bot.answerCallbackQuery(callbackQuery.id, { text: 'Pressed' })
          const food = await this.foods.getById(data.split('-')[1])
          this.bot.sendPhoto(
            chatId,
            food.img
              ? food.img
              : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg',
            {
              caption: `Nomi: <b>${food.name}</b>\nNarxi: <b>${food.cost}</b> so'm\n`,
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: '-',
                      callback_data: 'decrease',
                    },
                    {
                      text: '1',
                      callback_data: 'count',
                    },
                    {
                      text: '+',
                      callback_data: 'increase',
                    },
                  ],
                  [
                    {
                      text: "Savatga Qo'shish ✅",
                      callback_data: `store-${data.split('-')[1]}`,
                    },
                  ],
                ],
              },
              parse_mode: 'HTML',
            },
          )
        }
      }
    } catch (error) {
      console.log(error)
      if (chatId) {
        this.bot.sendMessage(chatId, 'Xatoliq yuz berdi ☹️')
      }
    }
  }

  private handleInlineQuery(query: TelegramBot.InlineQuery) {
    const inlineQueryId = query.id
    console.log(inlineQueryId)
  }

  private handlePollingError(error: Error) {
    console.error(`Polling error: ${error.message}`)
  }

  public sendText(id: number, message: string) {
    this.bot.sendMessage(id, message, { parse_mode: 'HTML' })
  }
}

// const token = '5903607123:AAFYVouBA0EtGRuefEHc6HzxhIFI5IIp_00'
const test_token = '6823735522:AAGR_BT2SFHnADxA19yJppOSnMqjsjK3h1g'

export const botService = new BotService(test_token)
