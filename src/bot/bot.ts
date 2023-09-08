import TelegramBot, { Message, CallbackQuery, InlineQueryResultArticle } from 'node-telegram-bot-api';
import UserService from '../services/user.service';
import { IUser } from '../interfaces/user.interface';
import { FoodMenu, MainMenu, ShareContact } from './keyboards';

class BotService {
  private bot: TelegramBot;
  private users = new UserService()

  constructor(private token: string) {
    this.bot = new TelegramBot(token, { polling: true });
  }

  public initialize() {
    this.bot.on('message', this.handleMessage.bind(this));
    this.bot.on('callback_query', this.handleCallbackQuery.bind(this));
    this.bot.on('inline_query', this.handleInlineQuery.bind(this));
    this.bot.on('polling_error', this.handlePollingError.bind(this));
    this.bot.on('contact', this.registerUser.bind(this));
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

    if (messageText.startsWith('/start')) {
      // Handle the /start command
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
    } else {
      // Handle other messages
      this.bot.sendMessage(chatId, 'I do not understand that command. Type /help for a list of available commands.');
    }
  }

  private handleCallbackQuery(callbackQuery: CallbackQuery) {
    const chatId = callbackQuery.message?.chat.id;
    const data = callbackQuery.data;

    // Handle callback queries if needed
  }

  private handleInlineQuery(query: TelegramBot.InlineQuery) {
    const inlineQueryId = query.id;
    const queryText = query.query;

    // Handle inline queries if needed
  }

  private handlePollingError(error: Error) {
    console.error(`Polling error: ${error.message}`);
  }

  public sendText(id: number,message:string) {
    this.bot.sendMessage(id,message)
  }
}

const token = '5617632676:AAHSSTgKmdvAJux5BsxHEYAV6RM2e0GlYis';

const botService = new BotService(token);

export default botService;
