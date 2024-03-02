import TelegramBot from 'node-telegram-bot-api'
import { BOT_TOKEN } from '@config'
import { botTexts } from './text'
import { botCallbackData, botSteps, categoryEnum } from './constants'
import { FormatNumberWithSpaces, KeyboardMaker } from './helper'
import type {
  CallbackQuery,
  InlineKeyboardMarkup,
  Message
} from 'node-telegram-bot-api'
import {
  FoodService,
  LunchService,
  OrderService,
  OrgService,
  StoreService,
  UserService,
  MealPollService
} from '@services'
import {
  MainMenuKeyboard,
  ShareContactKeyboard,
  FoodCategoryMenuKeyboard,
  ViewFoodKeyboard,
  CountFoodAmountComponent,
  CookMainMenu,
  CreateMealPoll
} from './keyboards'
import { lunchBaseModel } from '@models'

class TelegramBotApi {
  private bot: TelegramBot
  private userService = new UserService()
  private orgService = new OrgService()
  private foodService = new FoodService()
  private orderService = new OrderService()
  private storeService = new StoreService()
  private lunchService = new LunchService()
  private mealPollService = new MealPollService()
  private lunchbases = lunchBaseModel

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true })
  }

  public initializeBot() {
    this.bot.on('message', this.handleMessage.bind(this))
    this.bot.on('contact', this.handleContact.bind(this))
    this.bot.on('callback_query', this.handleCallbackQuery.bind(this))
    this.bot.on('polling_error', (error) => {
      console.log(error)
      throw new Error(error?.message)
    })
  }

  private async handleMessage(msg: Message) {
    const chatId = msg.chat.id
    const chatType = msg.chat.type
    try {
      const data = await this.userService.checkUser({ telegramId: chatId })
      console.log(data)
      if (
        data.isExist &&
        data.user &&
        data.user.is_active &&
        data.user.is_verified
      ) {
        if (data.user.role == 'user' && chatType == 'private') {
          if (msg.text == '/start') {
            this.bot.sendMessage(
              msg.chat.id,
              botTexts.userMainMenu.uz,
              MainMenuKeyboard
            )

            await this.storeService.editStep({
              telegramId: msg.chat.id,
              step: botSteps.mainMenu
            })
          } else {
            await this.handleUserMessages(msg)
          }
        } else if (data.user.role == 'cook' && chatType == 'private') {
          if (data.user.org) {
            await this.handleCookMessages(msg, data.user)
          } else {
            this.bot.sendMessage(msg.chat.id, 'Oshxona biriktirilmagan', {
              reply_markup: {
                remove_keyboard: true
              }
            })
          }
        }
      } else if (
        data.isExist &&
        data.user &&
        !data.user.is_active &&
        !data.user.is_verified
      ) {
        this.bot.sendMessage(chatId, `<b>Siz Tasdiqlanmagansiz</b>`, {
          parse_mode: 'HTML'
        })
      } else {
        this.bot.sendMessage(
          msg.chat.id,
          botTexts.askContact.uz,
          ShareContactKeyboard
        )
      }
    } catch (error) {
      console.log(error)
      this.bot.sendMessage(chatId, 'as')
    }
  }

  private async handleContact(msg: Message) {
    try {
      if (!msg.contact) throw new Error('Contact is required')
      await this.userService.registerUser({
        firstName: msg.chat.first_name || '',
        lastName: msg.chat.last_name || '',
        phoneNumber: msg.contact.phone_number,
        telegramId: msg.chat.id
      })
      this.bot.sendMessage(msg.chat.id, `Xush kelibsiz!`, {
        reply_markup: { remove_keyboard: true }
      })
    } catch (error) {
      this.bot.sendMessage(msg.chat.id, botTexts.noContact.uz)
    }
  }

  // private async handleStart(msg: Message) {
  //   try {
  //     const data = await this.userService.checkUser({ telegramId: msg.chat.id })
  //     console.log(data)

  //     if (data.isExist && data.user && data.user.role == 'user') {
  //       this.bot.sendMessage(
  //         msg.chat.id,
  //         botTexts.userMainMenu.uz,
  //         MainMenuKeyboard
  //       )

  //       await this.storeService.editStep({
  //         telegramId: msg.chat.id,
  //         step: botSteps.mainMenu
  //       })
  //     } else if (data.isExist && data.user && data.user.role == 'cook') {
  //       this.bot.sendMessage(
  //         msg.chat.id,
  //         botTexts.cookMainMenu.uz,
  //         CookMainMenu
  //       )

  //       await this.storeService.editStep({
  //         telegramId: msg.chat.id,
  //         step: botSteps.cookMainMenu
  //       })
  //     } else if (!data.isExist) {
  //       this.bot.sendMessage(
  //         msg.chat.id,
  //         botTexts.askContact.uz,
  //         ShareContactKeyboard
  //       )
  //     } else if (
  //       data.user &&
  //       (data.user?.is_verified == false || data.user?.is_active == false)
  //     ) {
  //       this.bot.sendMessage(msg.chat.id, botTexts.noVerified.uz, {
  //         reply_markup: {
  //           remove_keyboard: true
  //         }
  //       })
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     this.bot.sendMessage(msg.chat.id, 'hello')
  //   }
  // }

  private async handleCallbackQuery(msg: CallbackQuery) {
    try {
      const user = await this.userService.checkUser({ telegramId: msg.from.id })

      if (
        user.isExist &&
        user.user?.is_active == true &&
        user.user.is_verified == true
      ) {
        if (msg.data?.split('/')[0] == botCallbackData.saveToStore) {
          await this.#_storeFoodToCart(msg)
        }

        if (
          msg.data?.split('/')[0] == botCallbackData.clearStore &&
          msg.message
        ) {
          this.bot.deleteMessage(msg.from.id, msg.message.message_id)
          await this.storeService.clearStoreByOrg({
            chat: msg.from.id,
            org: msg.data?.split('/')[1]
          })
          this.bot.sendMessage(msg.from.id, botTexts.clearedStore.uz)
        }

        if (
          msg.data?.split('/')[0] == botCallbackData.buyStore &&
          msg.message
        ) {
          this.bot.deleteMessage(msg.from.id, msg.message.message_id)
          await this.#_createOrder({
            msg: msg,
            user: msg.data?.split('/')[1],
            org: msg.data?.split('/')[2]
          })
        }

        if (
          msg.data == botCallbackData.decreaseAmount ||
          botCallbackData.increaseAmount ||
          botCallbackData.showCount
        ) {
          this.#_amountChanger({ msg: msg })
        }
      } else {
        this.bot.sendMessage(msg.from.id, botTexts.noVerified.uz)
      }
    } catch (error) {
      console.log(error)
      this.bot.sendMessage(msg.from.id, botTexts.errorMessage.uz, {
        parse_mode: 'HTML'
      })
    }
  }

  private async handleCookMessages(msg: Message, user: any): Promise<void> {
    try {
      const org = user.org['_id']

      if (msg.text == '/start') {
        this.bot.sendMessage(
          msg.chat.id,
          botTexts.cookMainMenu.uz,
          CookMainMenu
        )

        await this.storeService.editStep({
          telegramId: msg.chat.id,
          step: botSteps.cookMainMenu
        })
      } else {
        const step = await this.storeService.getStep({
          telegramId: msg.chat.id
        })

        if (step == botSteps.cookMainMenu) {
          if (msg.text == botTexts.cookNewPoll.uz) {
            const lunchbases = await this.lunchbases.find({
              org: org,
              is_active: true
            })

            this.bot.sendMessage(msg.chat.id, botTexts.cookViewLunchBase.uz, {
              reply_markup: KeyboardMaker({
                data: lunchbases.map((e) => ({ name: e.name }))
              }),
              parse_mode: 'HTML'
            })

            await this.storeService.editStep({
              telegramId: msg.chat.id,
              step: `${botSteps.cookSelectMeal}/${org}`
            })
          }

          if (msg.text == botTexts.cookViewPoll.uz) {
            this.bot.sendMessage(msg.chat.id, 'latest MealPoll Info')
          }
        }

        if (step.split('/')[0] == botSteps.cookSelectMeal) {
          if (msg.text == botTexts.backAction.uz) {
            this.bot.sendMessage(
              msg.chat.id,
              botTexts.cookMainMenu.uz,
              CookMainMenu
            )

            await this.storeService.editStep({
              telegramId: msg.chat.id,
              step: botSteps.cookMainMenu
            })
          } else {
            const lunchbase = await this.lunchbases
              .findOne({
                name: msg.text,
                org: step.split('/')[1]
              })
              .select('name org')
              .exec()
            console.log(lunchbase, step)

            if (lunchbase) {
              const lunch = await this.lunchService.lunchRetrieveAll({
                pageNumber: 1,
                pageSize: 10,
                org: step.split('/')[1],
                lunchbase: lunchbase['_id'],
                is_bot: true
              })

              const caption = lunch.lunchList.map(
                (e: any) =>
                  `* <b>${e.name}</b> - ${FormatNumberWithSpaces(e.cost)} so'm`
              )

              console.log(lunch)

              if (lunch.lunchList.length > 1) {
                this.bot.sendMessage(
                  msg.chat.id,
                  `<b>E'lon !!!</b>\n\n<b>Tayyorlanmoqchi: </b>${lunchbase.name}\n\n<b>Oshxona:</b> ${user.org.name_org}\n\n<b>Porsiyalari:</b>\n\n${caption.join('\n')}\n\n <i>Diqqat e'lon barcha oshxonalar ishchilariga yuboriladi.</i>`,
                  CreateMealPoll
                )

                await this.storeService.editStep({
                  telegramId: msg.chat.id,
                  step: `${botSteps.cookNewPollSend}/${lunchbase['_id']}/${step.split('/')[1]}`
                })
              }
            }
          }
        }

        if (step.split('/')[0] == botSteps.cookNewPollSend) {
          if (msg.text == botTexts.backAction.uz) {
            await this.bot.deleteMessage(msg.chat.id, msg.message_id)
            await this.storeService.editStep({
              telegramId: msg.chat.id,
              step: botSteps.cookMainMenu
            })

            this.bot.sendMessage(msg.chat.id, 'Siz oshpasiz', CookMainMenu)
          }

          if (msg.text == botTexts.createMealPoll.uz) {
            await this.bot.deleteMessage(msg.chat.id, msg.message_id)

            await this.storeService.editStep({
              telegramId: msg.chat.id,
              step: botSteps.cookMainMenu
            })

            this.bot.sendMessage(msg.chat.id, 'Siz oshpasiz', CookMainMenu)

            await this.#_createMealPoll({
              meal: step.split('/')[1],
              org: step.split('/')[2],
              cook: msg.chat.id
            })
          }
        }
      }
    } catch (error) {
      console.log(error)
      this.bot.sendMessage(msg.chat.id, 'Error: ....')
    }
  }

  private async handleUserMessages(msg: Message): Promise<void> {
    try {
      const userStep =
        (await this.storeService.getStep({
          telegramId: msg.chat.id
        })) || ''

      if (userStep == botSteps.mainMenu) {
        if (msg.text == botTexts.userNewOrder.uz) {
          await this.#_OrgMenuComponent(msg)
        } else if (msg.text == botTexts.userCheckBalance.uz) {
          const user = await this.userService.checkUser({
            telegramId: msg.chat.id
          })
          if (user.user) {
            this.bot.sendMessage(
              msg.chat.id,
              `Balans: <b>${FormatNumberWithSpaces(user.user.balance)} so'm</b>`,
              { parse_mode: 'HTML' }
            )
          }
        } else if (msg.text == botTexts.settingsAction.uz) {
          this.bot.sendMessage(msg.chat.id, botTexts.soonMessage.uz)
        } else if (msg.text == botTexts.feedbackAction.uz) {
          this.bot.sendMessage(msg.chat.id, botTexts.soonMessage.uz)
        }
      }

      if (userStep == botSteps.selectOrg) {
        if (msg.text == botTexts.backAction.uz) {
          this.bot.sendMessage(
            msg.chat.id,
            botTexts.backMainMenu.uz,
            MainMenuKeyboard
          )

          await this.storeService.editStep({
            telegramId: msg.chat.id,
            step: botSteps.mainMenu
          })
        } else {
          const orgs = await this.orgService.orgRetrieveAll({
            pageNumber: 1,
            pageSize: 1,
            search: msg.text
          })

          if (orgs.orgList.length == 1) {
            this.bot.sendMessage(
              msg.chat.id,
              botTexts.askCategory.uz,
              FoodCategoryMenuKeyboard
            )
            await this.storeService.editStep({
              telegramId: msg.chat.id,
              step: `${botSteps.selectCategory}/${orgs.orgList[0]['_id']}`
            })
          }
        }
      }

      if (userStep.split('/')[0] == botSteps.selectCategory) {
        if (msg.text == botTexts.backAction.uz) {
          await this.#_OrgMenuComponent(msg)
        } else if (msg.text == botTexts.storeAction.uz) {
          const store = await this.storeService.getStoreByOrg({
            chatId: msg.chat.id,
            org: userStep.split('/')[1]
          })

          if (store.length > 0) {
            this.bot.sendMessage(
              msg.chat.id,
              this.#_storedFoodsCaptionGenerator(store),
              {
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: botTexts.clearStoreAction.uz,
                        callback_data: `${botCallbackData.clearStore}/${userStep.split('/')[1]}`
                      },
                      {
                        text: botTexts.buyStoreAction.uz,
                        callback_data: `${botCallbackData.buyStore}/${userStep.split('/')[1]}`
                      }
                    ]
                  ]
                },
                parse_mode: 'HTML'
              }
            )
          } else {
            this.bot.sendMessage(msg.chat.id, `Savat bo'sh`)
          }
        } else {
          if (!userStep.split('/')[1]) throw new Error('OrgId not found')
          let category: string | undefined

          switch (msg.text) {
            case botTexts.dessertCategory.uz:
              category = categoryEnum.dessert
              break
            case botTexts.snackCategory.uz:
              category = categoryEnum.snack
              break
            case botTexts.drinkCategory.uz:
              category = categoryEnum.drink
              break
          }

          if (category) {
            const foods = await this.foodService.foodRetrieveAll({
              pageNumber: 1,
              pageSize: 30,
              category: category,
              org: userStep.split('/')[1]
            })

            this.bot.sendMessage(msg.chat.id, botTexts.selectFoodAction.uz, {
              reply_markup: KeyboardMaker({ data: foods.foodList })
            })

            await this.storeService.editStep({
              telegramId: msg.chat.id,
              step: `${botSteps.selectFood}/${userStep.split('/')[1]}`
            })
          }
        }
      }

      if (userStep.split('/')[0] == botSteps.selectFood) {
        if (msg.text == botTexts.backAction.uz) {
          this.bot.sendMessage(
            msg.chat.id,
            botTexts.askCategory.uz,
            FoodCategoryMenuKeyboard
          )
          await this.storeService.editStep({
            telegramId: msg.chat.id,
            step: `${botSteps.selectCategory}/${userStep.split('/')[1]}`
          })
        } else if (msg.text == botTexts.storeAction.uz) {
          const store = await this.storeService.getStoreByOrg({
            chatId: msg.chat.id,
            org: userStep.split('/')[1]
          })

          if (store.length > 0) {
            this.bot.sendMessage(
              msg.chat.id,
              this.#_storedFoodsCaptionGenerator(store),
              {
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: botTexts.clearStoreAction.uz,
                        callback_data: `${botCallbackData.clearStore}/${userStep.split('/')[1]}`
                      },
                      {
                        text: botTexts.buyStoreAction.uz,
                        callback_data: `${botCallbackData.buyStore}/${userStep.split('/')[1]}`
                      }
                    ]
                  ]
                },
                parse_mode: 'HTML'
              }
            )
          } else {
            this.bot.sendMessage(msg.chat.id, `Savat bo'sh`)
          }
        } else {
          const food = await this.foodService.foodRetrieveAll({
            pageNumber: 1,
            pageSize: 1,
            org: userStep.split('/')[1],
            search: msg.text
          })

          if (food.foodList.length == 1) {
            this.bot.sendMessage(
              msg.chat.id,
              botTexts.viewFoodAction.uz,
              ViewFoodKeyboard
            )

            setTimeout(async () => {
              await this.bot.sendPhoto(msg.chat.id, food.foodList[0].img, {
                caption: this.#_foodCaptionGenerator(food.foodList[0]),
                reply_markup: this.#_inlineKeyboardMaker({
                  id: food.foodList[0]['_id'],
                  org: userStep.split('/')[1]
                }),
                parse_mode: 'HTML'
              })
            }, 100)
          }
        }
      }
    } catch (error) {
      console.log(error)
      this.bot.sendMessage(msg.chat.id, botTexts.errorMessage.uz, {
        parse_mode: 'HTML'
      })
    }
  }

  #_inlineKeyboardMaker(payload: {
    id: string
    org: string
  }): InlineKeyboardMarkup {
    return {
      inline_keyboard: [
        CountFoodAmountComponent,
        [
          {
            text: botTexts.storeToCartAction.uz,
            callback_data: `${botCallbackData.saveToStore}/${payload.id}/${payload.org}`
          }
        ]
      ]
    }
  }

  #_foodCaptionGenerator(payload: {
    name: string
    cost: number
    org: string
  }): string {
    return `Mahsulot nomi: <b>${payload.name}</b>\nOshxona: <b>${payload.org}</b>\nNarxi: <b>${FormatNumberWithSpaces(payload.cost)}</b> so'm`
  }

  #_storedFoodsCaptionGenerator(data: any[]): string {
    const caption: string[] = []
    console.log(data)
    let totalCost = 0
    data.map((e, i) => {
      caption.push(
        `${i + 1}. <b>${e.food.food}</b> - ${e.amount} dona\n${FormatNumberWithSpaces(Number(e.food.cost))} so'm * ${e.amount} dona = <b>${FormatNumberWithSpaces(Number(e.food.cost) * Number(e.amount))} so'm</b>\n\n`
      )
      totalCost += e.food.cost * e.amount
    })

    caption.push(
      `<code>--------------------------------</code>\n<i>Jami:</i> ${FormatNumberWithSpaces(totalCost)} so'm`
    )

    return caption.join('')
  }

  #_amountChanger(payload: { msg: CallbackQuery }) {
    const message = payload.msg.message
    if (!message?.reply_markup) {
      throw new Error('Message not found')
    }

    const count =
      message.reply_markup.inline_keyboard[0].find(
        (e) => e.callback_data == botCallbackData.showCount
      )?.text || '1'

    if (payload.msg.data == botCallbackData.increaseAmount) {
      if (Number(count) == 10) {
        this.bot.answerCallbackQuery(payload.msg.id, {
          text: 'Maximum equal to 10'
        })
      } else {
        this.bot.editMessageReplyMarkup(
          {
            inline_keyboard: [
              [
                { text: '-', callback_data: botCallbackData.decreaseAmount },
                {
                  text: `${Number(count) + 1}`,
                  callback_data: botCallbackData.showCount
                },
                { text: '+', callback_data: botCallbackData.increaseAmount }
              ],
              [...message.reply_markup?.inline_keyboard[1]]
            ]
          },
          {
            chat_id: message.chat.id,
            message_id: message.message_id
          }
        )
      }
    } else if (payload.msg.data == botCallbackData.decreaseAmount) {
      if (Number(count) == 1) {
        this.bot.answerCallbackQuery(payload.msg.id, {
          text: 'Minimum equal to 1'
        })
      } else {
        this.bot.editMessageReplyMarkup(
          {
            inline_keyboard: [
              [
                { text: '-', callback_data: botCallbackData.decreaseAmount },
                {
                  text: `${Number(count) - 1}`,
                  callback_data: botCallbackData.showCount
                },
                { text: '+', callback_data: botCallbackData.increaseAmount }
              ],
              [...message.reply_markup?.inline_keyboard[1]]
            ]
          },
          {
            chat_id: message.chat.id,
            message_id: message.message_id
          }
        )
      }
    } else if (payload.msg.data == botCallbackData.showCount) {
      this.bot.answerCallbackQuery(payload.msg.id, {
        text: count
      })
    }
  }

  async #_createOrder(payload: {
    msg: CallbackQuery
    org: string
    user: string
  }) {
    try {
      const org = await this.orgService.orgRetrieveOne({ id: payload.org })

      const store = await this.storeService.getStoreByOrg({
        chatId: payload.msg.from.id,
        org: org['_id']
      })

      console.log(store[0].food.cost)

      const order = await this.orderService.createOrder({
        client: payload.user,
        foods: [],
        org: org['_id']
      })

      this.bot.sendMessage(payload.msg.from.id, order?.org.name_org)
      this.bot.sendMessage(org.group_a_id, '')
    } catch (error) {
      console.log(error)
      this.bot.sendMessage(payload.msg.from.id, botTexts.errorMessage.uz)
    }
  }

  async #_OrgMenuComponent(msg: Message) {
    const orgs = await this.orgService.orgRetrieveAll({
      pageNumber: 1,
      pageSize: 5
    })

    await this.bot.sendMessage(msg.chat.id, botTexts.askOrg.uz, {
      reply_markup: KeyboardMaker({
        data: orgs.orgList.map((e) => ({ name: e.name_org }))
      })
    })

    await this.storeService.editStep({
      telegramId: msg.chat.id,
      step: botSteps.selectOrg
    })
  }

  async #_storeFoodToCart(msg: CallbackQuery) {
    try {
      if (msg.message?.reply_markup && msg.data) {
        await this.bot.deleteMessage(msg.from.id, msg.message.message_id)

        const count =
          msg.message.reply_markup?.inline_keyboard[0].find(
            (e) => e.callback_data == botCallbackData.showCount
          )?.text || '1'

        await this.storeService.saveToStoreByOrg({
          amount: Number(count),
          food: msg.data.split('/')[1],
          chatId: msg.message.chat.id
        })

        await this.storeService.editStep({
          telegramId: msg.from.id,
          step: `${botSteps.selectCategory}/${msg.data.split('/')[2]}`
        })

        this.bot.sendMessage(
          msg.from.id,
          botTexts.storedAction.uz,
          FoodCategoryMenuKeyboard
        )
      }
    } catch (error) {
      console.log(error)
      this.bot.sendMessage(msg.from.id, botTexts.errorMessage.uz, {
        parse_mode: 'HTML'
      })
    }
  }

  async #_createMealPoll(payload: {
    meal: string
    org: string
    cook: number
  }): Promise<void> {
    const mealpoll = await this.mealPollService.mealPollCreate({
      meal: payload.meal,
      org: payload.org
    })

    if (mealpoll.status && mealpoll.data) {
      const lunches = await this.lunchService.lunchRetrieveAll({
        pageNumber: 1,
        pageSize: 5,
        lunchbase: mealpoll.data['_id'],
        org: payload.org,
        is_bot: true
      })

      const activeUsers = await this.userService.retrieveActiveUsers()

      activeUsers.map((e) => {
        this.bot.sendMessage(e.telegram_id, 'Iltimos ovqatni tanlang', {
          reply_markup: {
            inline_keyboard: lunches.lunchList.map((e: any) => [
              {
                text: `${e.name} - ${FormatNumberWithSpaces(e.cost)} so'm`,
                callback_data: `${botCallbackData.selectLunch}/${mealpoll.data['_id']}/${e['_id']}`
              }
            ])
          }
        })
      })
    } else {
      this.bot.sendMessage(
        payload.cook,
        `${Math.floor(mealpoll.data.diffrence)} minut vaqt qoldi yangi elon yaratish uchun`
      )
    }
  }
}

if (!BOT_TOKEN) throw new Error('Bot Token Not Found')
export const botInstance = new TelegramBotApi(BOT_TOKEN)
