import { Bot, Context } from 'grammy'

class GrammyBot {
  private bot: Bot
  constructor() {
    this.bot = new Bot('')
  }

  public initializeBot() {
    this.bot.command('start', this.handleStartCommand.bind(this))
    this.bot.callbackQuery([],)
    // this.bot.drop()
    // this.bot.start({onStart})
  }

  private async handleStartCommand(ctx: Context) {
    await ctx.reply('salom')
  }

  private async handleCallback(ctx: Context) {
    await ctx.answerCallbackQuery(ctx.callbackQuery?.id)
  }
}

export { GrammyBot }
