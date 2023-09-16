import TelegramBot, { Message, CallbackQuery, InlineQueryResultArticle } from 'node-telegram-bot-api';
import UserService from '../services/user.service';
import { IUser } from '../interfaces/user.interface';
import { FoodMenu, KeyboardFormatter, MainMenu, ShareContact, formatter } from './keyboards';
import FoodService from '../services/food.service';
import orgModel from '../models/org.model';
import StoreService from '../services/store.service';
import OrderService from '../services/order.service';
class BotService {
  private bot: TelegramBot;
  private users = new UserService()
  private foods = new FoodService()
  private store = new StoreService()
  private orderService = new OrderService()

  constructor(private token: string) {
    this.bot = new TelegramBot(token, { polling: true });
    // this.initialize()
  }

  public initialize() {
    this.bot.on('message', this.handleMessage.bind(this));
    this.bot.on('callback_query', this.handleCallbackQuery.bind(this));
    this.bot.on('inline_query', this.handleInlineQuery.bind(this));
    this.bot.on('polling_error', this.handlePollingError.bind(this));
    this.bot.on('contact', this.registerUser.bind(this));
    this.bot.on('polling_error', (error) => {
      console.error(`Polling error: ${error.message}`);
  });
    console.log('Bot initialized')
  }

  private async registerUser(msg:Message) {
    const contact = msg.contact;
    try {
      // const contact = msg.contact;
      if(contact?.user_id) {
        const isExist = await this.users.isExist(contact.user_id);
        if(isExist.data) {
          this.bot.sendMessage(contact.user_id,"Siz ro'yxatdan o'tgansiz")
        } else {
          const user = await this.users.registirNewUser({
            first_name: contact.first_name || "",
            last_name: contact.last_name || "",
            phone_number: contact.phone_number || "",
            telegram_id: contact.user_id 
          })
          this.bot.sendMessage(user.telegram_id,"Siz ro'yxatdan o'tdingiz",{ reply_markup: MainMenu})
        }
      }
    } catch (error) {
      console.log(error)
      if(contact?.user_id) {
        this.bot.sendMessage(contact.user_id,'Something went wrong try again :(')
      }
    }

  }

  private async handleMessage(msg: Message) {
    const chatId = msg.chat.id;
    const messageText = msg.text || '';

    try {

      if(msg.chat.type == 'group') {
        console.log(msg)
        this.bot.sendMessage(chatId,'Buyurtma ')
      }
      
      if (messageText.startsWith('/start') && msg.chat.type != 'group') {
        interface IisExist {
          message: string
          data: IUser | null | any
        }
        const isExist: IisExist = await this.users.isExist(chatId);
  
        console.log(isExist)
  
        if(isExist.data) {
          this.bot.sendMessage(chatId,'Xush kelibsiz',{ reply_markup: MainMenu})
        } else {
          console.log(msg)
          this.bot.sendMessage(chatId,"Siz ro‘yxatdan o‘tmagansiz",{ reply_markup: ShareContact })
        }
      } else if (messageText.startsWith('/help')) {
        // Handle the /help command
        this.bot.sendMessage(chatId, 'Available commands:\n/help - Show this help message\n/echo [text] - Echo your message');
      } else if (messageText.startsWith('/echo')) {
        // Handle the /echo command
        const echoMessage = messageText.split('/echo')[1]?.trim();
        if (echoMessage) {
          this.bot.sendMessage(chatId, `You said: ${echoMessage}`);
        } else {
          this.bot.sendMessage(chatId, 'Please provide text to echo.');
        }
      } else if( messageText == '🍽 Menu') {
        // await this.bot.deleteMessage(chatId,msg.message_id)
        this.bot.sendMessage(chatId,'Buyurma bering',{ reply_markup: FoodMenu })
      }  else if( messageText == 'Asosiy menu') {
        this.bot.sendMessage(chatId,'Buyurma bering',{ reply_markup: MainMenu })
      } else if( messageText == '💰 Balans') {
        await this.bot.deleteMessage(chatId,msg.message_id)
        const userBalance: IUser | null = await this.users.getBalance(chatId);
        if(userBalance) {
          this.bot.sendMessage(chatId,`<b>Ism</b>: ${userBalance.first_name} ${userBalance.last_name}\n<b>Balans</b>: ${userBalance.balance} So'm\n<b>Status</b>: ${userBalance.is_active ? "tasdiqlangan" : "tasdiqlanmagan"}`,{ parse_mode:"HTML"});
        } else {
          this.bot.sendMessage(chatId,'Foydalanuvchi topilmadi');
        }
      } else if( messageText == '🥤Ichimlik') {
        // await this.bot.deleteMessage(chatId,msg.message_id)
        const user = await this.users.isExist(chatId)
        
        console.log(user)

        if(user.data) {
          const foods = await this.foods.getFoodsForBot({
            org: user.data.org,
            category: 'drinks'
          })
          console.log(foods)
          const data:any[] = []
          foods.map((e) => {
            data.push({
              id: e['_id'],
              name: e.name,
              cost:e.cost
            })
          })
          console.log(formatter(data))
          this.bot.sendMessage(chatId,`Ichimliklar: `,{ reply_markup: { inline_keyboard: [
            ...formatter(data)
          ]}})
        } else {
          this.bot.sendMessage(chatId,'Siz Tasdiqlanmagansiz')
        }
      } else if( messageText == '🛒 Savat') {
        // await this.bot.deleteMessage(chatId,msg.message_id-2)
        const store = await this.store.getStore(`${chatId}`)
        if(store.length == 0) {
          this.bot.sendMessage(chatId,"Bo'sh",{ reply_markup: FoodMenu })
        } else {

          const textStore: string[] = []
          let total_cost:number = 0
          store.map((e:any,i:number) => {
            textStore.push(`\n${i+1}. ${e.food.food} -- ${e.food.cost} so'm -- ${e.amount} ta`);
            total_cost = total_cost + (e.food.cost * e.amount);
          })

          textStore.push(`\n\n Jami: ${total_cost} so'm`)
          this.bot.sendMessage(chatId,textStore.join(''),{
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text:"Bo'shatish",
                    callback_data:'clear-store'
                  },
                  {
                    text:'Sotib olish',
                    callback_data:'buy-order'
                  }
                ]
              ],
            },
            parse_mode:'HTML'
          })
        }
      } else if( messageText == '🌮 Gazaklar') {
        const user = await this.users.isExist(chatId)

        console.log(user)

        if(user.data) {
          const foods = await this.foods.getFoodsForBot({
            org: user.data.org,
            category: 'snacks'
          })
          console.log(foods)
          const data:any[] = []
          foods.map((e) => {
            data.push({
              id: e['_id'],
              name: e.name,
              cost:e.cost
            })
          })
          this.bot.sendMessage(chatId,`Gazaklar: `,{ reply_markup: { inline_keyboard: [
            ...formatter(data)
          ]},parse_mode:'HTML'})
        } else {
          this.bot.sendMessage(chatId,'Siz Tasdiqlanmagansiz')
        }
      } else if( messageText == '🍰 Desert') {
        const user = await this.users.isExist(chatId)

        console.log(user)

        if(user.data) {
          const foods = await this.foods.getFoodsForBot({
            org: user.data.org,
            category: 'dessert'
          })
          console.log(foods)
          const data: any[] = [];

          foods.map((e) => {
            data.push({
              id: e['_id'],
              name: e.name,
              cost:e.cost
            })
          })
          this.bot.sendMessage(chatId,`Dessertlar: `,{ reply_markup: { inline_keyboard: [
            ...formatter(data)
          ]}})
        } else {
          this.bot.sendMessage(chatId,'Siz Tasdiqlanmagansiz')
        }
      } else if(messageText == 'Buyurtmalarim') {
        
      }
       else {
        // Handle other messages
        this.bot.sendMessage(chatId, 'I do not understand that command. Type /help for a list of available commands.');
      }
    } catch (error) {
      console.log(error)
    }

  }

  private async handleCallbackQuery(callbackQuery: CallbackQuery) {
    const chatId = callbackQuery.message?.chat.id;
    const data = callbackQuery.data

    const splited = data?.split('-')[0]
    console.log(splited)

    try {

      if(splited == 'order' && data) {
        const type = data?.split('-')[2];
        if(type == 'done') {
          const updatedOrder = await this.orderService.acceptOrder({order: data?.split('-')[1],type:true})
          
          console.log(updatedOrder)
        } else if(type == 'cancel') {
          const updatedOrder = await this.orderService.cancelOrder({order: data?.split('-')[1],type:false})
          console.log(updatedOrder)
        }
      }
     

      if(splited == 'store' && chatId) {
        if(callbackQuery.message) {
          // console.log({
           const  amount = Number(callbackQuery.message.reply_markup?.inline_keyboard[0].find((e) => e.callback_data == 'count')?.text)
           const food = data?.split('-')[1]
          // })

          if(food && amount ) {
            const isStored = await this.store.saveToStore(`${chatId}`,food,`${amount}`)
            console.log(isStored)
            await this.bot.deleteMessage(callbackQuery.from.id,callbackQuery.message?.message_id);
            this.bot.sendMessage(callbackQuery.from.id,"Savatga qo'shildi");

          } else {
            this.bot.sendMessage(chatId,'something went wrong')
          }
        }
      }

      if(splited == 'clear' && chatId && callbackQuery.message) {
        console.log(chatId,callbackQuery);
        this.bot.answerCallbackQuery(callbackQuery.id, { text: "Savat Bo'shatildi" , show_alert: true })
        await this.bot.deleteMessage(chatId,callbackQuery.message?.message_id)
        const isCleared = await this.store.clear(chatId);
        console.log('cleared',isCleared)
      } else if(splited == 'buy' && chatId) {
        const user = await this.users.isExist(chatId)
        if(user.data && user.data.is_active == true && user.data.is_verified == true) {
          const store = await this.store.getStore(`${chatId}`);
          console.log(store)

          if(store.length > 0) {
            const foodArray:any = [] 
            store.map((e:any) =>{
              foodArray.push( { food: e.food.id , amount: e.amount })
            })
            console.log(foodArray);
            const Order = await this.orderService.createOrder({
              org: user.data.org['_id'],
              client: user.data['_id'],
              foods: foodArray
            });

            console.log(Order)

            if(Order && callbackQuery.message) {
              const foods:string[] = [] 
              foods.push(`Kimga:\n👤: ${user.data.first_name} ${user.data.last_name ? `${user.data.last_name}` : ''} \n📞: +998${user.data.phone_number}\n`);
              Order.foods.map((e:any,i) => {
                foods.push(`\n${i+1}. ${e.food.name} - <b>${e.food.cost}</b> s*m \n - Soni: ${e.amount} ta\n`)
              })
              foods.push(`\n------------------\nJami: <code> ${Order.total_cost}</code> s*m \n`)
              foods.push(`\nBuyurtma Holati: 🕓 <code>Kutilmoqda...</code>`)
              // this.bot.sendMessage()
              if(user.data.org.group_a_id && (user.data.balance >=Order.total_cost)) {
                await this.store.clear(chatId)
                await this.bot.deleteMessage(chatId,callbackQuery.message?.message_id);
                this.bot.sendMessage(chatId,`Buyurtma:\n  ${foods.join(' ')}`,{ parse_mode: 'HTML'});
                this.bot.sendMessage(user.data.org.group_a_id,foods.join(''),{ parse_mode: 'HTML', reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text:'Bajarildi ✅',
                        callback_data:`order-${Order['_id']}-done`
                      }
                    ],
                    [
                      {
                        text:'Bekor Qilish ❌',
                        callback_data:`order-${Order['_id']}-cancel`
                      }
                    ]
                  ]
                }});
              } else if(user.data.balance < Order.total_cost) {
                console.log('Something')
                this.bot.answerCallbackQuery(callbackQuery.id, { text: 'Hisobda pul yetarli emas' , show_alert: true })
              }
            } else {
              this.bot.sendMessage(chatId,'something went wrong at 302 line')
            }
          }

        } else {
          this.bot.sendMessage(chatId,'Foydalanuvchi tasdiqlanmagan yoki aktiv emassiz!');
        }
      } 

    
  
      if((data == 'decrease' || data == 'increase' || data == 'count') && callbackQuery.message ) {
        console.log('Callback',callbackQuery)
        console.log('bfirfkwjnjrfn',callbackQuery.message.reply_markup?.inline_keyboard)
        console.log(data);
        
        console.log();
       

        if(callbackQuery.message.reply_markup && data == 'increase') {
          const message = callbackQuery.message
          const count = message.reply_markup?.inline_keyboard[0].find((e) => e.callback_data == 'count')?.text || 0
          this.bot.editMessageReplyMarkup({
            inline_keyboard: [
              [
                {
                  text:'-',
                  callback_data:'decrease'
                },
                {
                  text:`${Number(count) + 1}`,
                  callback_data:'count'
                },
                {
                  text:'+',
                  callback_data:'increase'
                }
              ],
              [
                ...callbackQuery.message.reply_markup?.inline_keyboard[1]
              ]
            ]
          }, {
            chat_id: message.chat.id,
            message_id: message.message_id,
          });

        } else if(callbackQuery.message.reply_markup && data == 'decrease') {
          const message = callbackQuery.message
          const count = message.reply_markup?.inline_keyboard[0].find((e) => e.callback_data == 'count')?.text || 0

          if(Number(count) > 1) {
            this.bot.editMessageReplyMarkup({
              inline_keyboard: [
                [
                  {
                    text:'-',
                    callback_data:'decrease'
                  },
                  {
                    text:`${Number(count) - 1}`,
                    callback_data:'count'
                  },
                  {
                    text:'+',
                    callback_data:'increase'
                  }
                ],
                [
                  ...callbackQuery.message.reply_markup?.inline_keyboard[1]
                ]
              ]
            }, {
              chat_id: message.chat.id,
              message_id: message.message_id,
            });
          } else {
              this.bot.answerCallbackQuery(callbackQuery.id, { text: 'Soni kam' , show_alert: true })
          }
          
        }
  
      } else if( splited == 'food') {
        if(data && chatId && callbackQuery.message) {
          await this.bot.deleteMessage(chatId, callbackQuery.message.message_id);
          this.bot.answerCallbackQuery(callbackQuery.id,{ text:"Pressed"});
          const food = await this.foods.getById(data.split('-')[1])
          this.bot.sendPhoto(chatId, food.img ? food.img :'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg',{
            caption: `Nomi: <b>${food.name}</b>\nNarxi: <b>${food.cost}</b> so'm\n`,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text:'-',
                    callback_data: 'decrease'
                  },
                  {
                    text:'1',
                    callback_data: 'count'
                  },
                  {
                    text:'+',
                    callback_data: 'increase'
                  }
                ],
                [
                  {
                    text:"Savatga Qo'shish ✅",
                    callback_data:`store-${data.split('-')[1]}`
                  }
                ]
              ]
            },
            parse_mode:'HTML'
          });
        }
      } 
    } catch (error) {
      console.log(error)
      if(chatId) {
        this.bot.sendMessage(chatId,'simple dimple')
      }
        
    }
  }

  private handleInlineQuery(query: TelegramBot.InlineQuery) {
    const inlineQueryId = query.id;
    const queryText = query.query;
    console.log(inlineQueryId)
  }

  private handlePollingError(error: Error) {
    console.error(`Polling error: ${error.message}`);
  }

  public sendText(id: number,message:string) {
    this.bot.sendMessage(id,message,{ parse_mode:'HTML'})
  }
}

const token = '5398672106:AAF_zgtGfTYwu9_F-uTg1S1LrbhLzR2VKkk';

const botService = new BotService(token);

export default botService;
