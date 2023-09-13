import TelegramBot, { Message, CallbackQuery, InlineQueryResultArticle } from 'node-telegram-bot-api';
import UserService from '../services/user.service';
import { IUser } from '../interfaces/user.interface';
import { FoodMenu, KeyboardFormatter, MainMenu, ShareContact } from './keyboards';
import FoodService from '../services/food.service';
import orgModel from '../models/org.model';

class BotService {
  private bot: TelegramBot;
  private users = new UserService()
  private foods = new FoodService()

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
      
      if (messageText.startsWith('/start')) {
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
        this.bot.sendMessage(chatId,'Buyurma bering',{ reply_markup: FoodMenu })
      }  else if( messageText == 'Asosiy menu') {
        this.bot.sendMessage(chatId,'Buyurma bering',{ reply_markup: MainMenu })
      } else if( messageText == '💰 Balans') {
  
        const userBalance: IUser | null = await this.users.getBalance(chatId);
        if(userBalance) {
          this.bot.sendMessage(chatId,`<b>Ism</b>: ${userBalance.first_name} ${userBalance.last_name}\n<b>Balans</b>: ${userBalance.balance} So'm\n<b>Status</b>: ${userBalance.is_active ? "tasdiqlangan" : "tasdiqlanmagan"}`,{ parse_mode:"HTML"});
        } else {
          this.bot.sendMessage(chatId,'Foydalanuvchi topilmadi')
        }
      } else if( messageText == '🥤Ichimlik') {
        const user = await this.users.isExist(chatId)

        console.log(user)

        if(user.data) {
          const foods = await this.foods.getFoodsForBot({
            org: user.data.org,
            category: 'drinks'
          })
          console.log(foods)
          const data:string[] = []
          foods.map((e) => {
            data.push(e['_id'])
          })
          this.bot.sendMessage(chatId,`Ichimliklar: \n ${foods.map((e,i) => `\n${i+1}. ${e.name} - ${e.cost} so'm\n\n`)}`,{ reply_markup: { inline_keyboard: KeyboardFormatter(1,data)}})
        } else {
          this.bot.sendMessage(chatId,'Siz Tasdiqlanmagansiz')
        }
      } else if( messageText == '🛒 Savat') {
        this.bot.sendMessage(chatId,"Bo'sh",{ reply_markup: FoodMenu })
      } else if( messageText == '🌮 Gazaklar') {
        const user = await this.users.isExist(chatId)

        console.log(user)

        if(user.data) {
          const foods = await this.foods.getFoodsForBot({
            org: user.data.org,
            category: 'snacks'
          })
          console.log(foods)
          const data:string[] = []
          foods.map((e) => {
            data.push(e['_id'])
          })
          this.bot.sendMessage(chatId,`Gazaklar: \n ${foods.map((e,i) => `\n${i+1}. ${e.name} - <b>${e.cost}</b> so'm\n`)}`,{ reply_markup: { inline_keyboard: KeyboardFormatter(1,data)},parse_mode:'HTML'})
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
          const data: string[] = [];

          foods.map((e) => {
            data.push(e['_id'])
          })
          this.bot.sendMessage(chatId,`Dessertlar: \n ${foods.map((e,i) => `\n${i+1}. ${e.name} - ${e.cost} so'm\n`)}`,{ reply_markup: { inline_keyboard: KeyboardFormatter(1,data) }})
        } else {
          this.bot.sendMessage(chatId,'Siz Tasdiqlanmagansiz')
        }
      } else {
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

    const inlineKeyboard = {
      inline_keyboard: [
        [{ text: 'Press Me', callback_data: 'button_pressed' }],
      ],
    };
  

    if((data == 'decrease' || data == 'increase' || data == 'count') && callbackQuery.message ) {
      console.log('Callback',callbackQuery)
      console.log('a',callbackQuery.message.reply_markup?.inline_keyboard[0])
      
      const message = callbackQuery.message
      this.bot.editMessageReplyMarkup(inlineKeyboard, {
        chat_id: message.chat.id,
        message_id: message.message_id,
      });

    } else {
      if(data && chatId && callbackQuery.message) {
        await this.bot.deleteMessage(chatId, callbackQuery.message.message_id - 1);
        this.bot.answerCallbackQuery(callbackQuery.id,{ text:"Pressed"});
        const food = await this.foods.getById(data)
        this.bot.sendPhoto(chatId, food.img ? food.img :'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg',{
          caption: `Nomi: <b>${food.name}</b>\nNarxi: <b>${food.cost}</b> so'm\nMavjud: <b>0</b> dona`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text:'-',
                  callback_data: 'decrease'
                },
                {
                  text:'0',
                  callback_data: 'count'
                },
                {
                  text:'+',
                  callback_data: 'increase'
                }
              ],
              [
                {
                  text:'Savatga Saqlash',
                  callback_data:'store'
                }
              ]
            ]
          },
          parse_mode:'HTML'
        });
      }
    }

    // console.log(callbackQuery.message)
    // console.log(chatId,data)

    // Handle callback queries if needed
  }

  private handleInlineQuery(query: TelegramBot.InlineQuery) {
    const inlineQueryId = query.id;
    const queryText = query.query;
    console.log(inlineQueryId)

    // Handle inline queries if needed
  }

  private handlePollingError(error: Error) {
    console.error(`Polling error: ${error.message}`);
  }

  public sendText(id: number,message:string) {
    this.bot.sendMessage(id,message)
  }
}

const token = '5398672106:AAF_zgtGfTYwu9_F-uTg1S1LrbhLzR2VKkk';

const botService = new BotService(token);

export default botService;
