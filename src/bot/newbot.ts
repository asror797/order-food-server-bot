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
  MealPollService,
  PollVoteService,
  PaymentService,
  ProductService
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
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'

class TelegramBotApi {
  private bot: TelegramBot
  private userService = new UserService()
  private orgService = new OrgService()
  private foodService = new FoodService()
  private productService = new ProductService()
  private orderService = new OrderService()
  private storeService = new StoreService()
  private lunchService = new LunchService()
  private mealPollService = new MealPollService()
  private pollVoteService = new PollVoteService()
  private paymentService = new PaymentService()
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

  public sendMessage(payload: { text: string; chatId: number }) {
    this.bot.sendMessage(payload.chatId, payload.text, { parse_mode: 'HTML' })
  }

  private async handleMessage(msg: Message) {
    const chatId = msg.chat.id
    const chatType = msg.chat.type
    try {
      const data = await this.userService.checkUser({ telegramId: chatId })

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
        if (chatType == 'private') {
          this.bot.sendMessage(
            msg.chat.id,
            botTexts.askContact.uz,
            ShareContactKeyboard
          )
        } else {
          if (msg.text == '/group') {
            this.bot.sendMessage(msg.chat.id, `GroupId: ${msg.chat.id}`)
          }
        }
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
      console.log(error)
      this.bot.sendMessage(msg.chat.id, botTexts.noContact.uz)
    }
  }

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
            user: user.user['_id'].toString(),
            org: msg.data?.split('/')[1]
          })
        }

        if (
          msg.data == botCallbackData.decreaseAmount ||
          botCallbackData.increaseAmount ||
          botCallbackData.showCount
        ) {
          this.#_amountChanger({ msg: msg })
        }

        if (
          msg.data?.split('/')[0] == botCallbackData.selectLunch &&
          msg.message &&
          msg.data
        ) {
          this.bot.answerCallbackQuery({
            callback_query_id: msg.id
          })

          await this.#_createPollVote({
            lunch: msg.data.split('/')[2],
            meal: msg.data.split('/')[1],
            user: user.user,
            org: user.user.org['_id'],
            message: msg.message,
            callbackId: msg.id
          })
        }

        if (
          msg.data &&
          msg.data.split('/')[0] == botCallbackData.comeToTakeLunch &&
          msg.message?.text
        ) {
          this.bot.deleteMessage(msg.message.chat.id, msg.message.message_id)

          this.bot.sendMessage(
            msg.message.chat.id,
            `${msg.message.text}\nStatus: Yuborildi`,
            {
              parse_mode: 'HTML'
            }
          )

          this.bot.sendMessage(
            parseInt(msg.data.split('/')[1]),
            msg.message.text,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: botTexts.donePollVote.uz,
                      callback_data: `${botCallbackData.donePollVoteOfUser}/${parseInt(msg.data.split('/')[1])}`
                    }
                  ]
                ]
              }
            }
          )
        }

        if (
          msg.data &&
          msg.data.split('/')[0] == botCallbackData.donePollVoteOfUser &&
          msg.message?.text
        ) {
          this.bot.deleteMessage(
            parseInt(msg.data.split('/')[1]),
            msg.message.message_id
          )
          this.bot.sendMessage(
            parseInt(msg.data.split('/')[1]),
            `${msg.message.text}\n<b>Status</b>: Bajarildi ✅`,
            {
              parse_mode: 'HTML'
            }
          )
        }

        if (
          msg.data &&
          msg.data.split('/')[0] == botCallbackData.acceptOrder &&
          msg.message
        ) {
          this.bot.deleteMessage(msg.message.chat.id, msg.message.message_id)

          const order = await this.orderService.orderAccept({
            id: msg.data.split('/')[1]
          })

          //@ts-ignore
          const productsCaption = this.#_storedFoodsCaptionGenerator(
            // @ts-ignore
            order.foods.map((e: any) => ({
              food: { food: e.food.name, cost: e.food.cost },
              amount: e.amount
            }))
          )
          this.bot.sendMessage(
            msg.message.chat.id,
            // @ts-ignore
            `<b>Buyurtmachi</b>:  ${order.client.first_name + ' ' + order.client.last_name}\n<b>Telefon</b>: ${order.client.phone_number}\n\n${productsCaption}\n\n<b>Bajarildi ✅</b>`,
            { parse_mode: 'HTML' }
          )

          this.bot.sendMessage(
            // @ts-ignore
            order.client.telegram_id,
            // @ts-ignore
            `<b>Buyurtmachi</b>:  ${order.client.first_name + ' ' + order.client.last_name}\n<b>Telefon</b>: ${order.client.phone_number}\n\n${productsCaption}\n\n<b>Bajarildi ✅</b>`,
            { parse_mode: 'HTML' }
          )
        }

        if (
          msg.data &&
          msg.data.split('/')[0] == botCallbackData.cancelOrder &&
          msg.message
        ) {
          this.bot.deleteMessage(msg.message.chat.id, msg.message.message_id)

          const order = await this.orderService.orderCancel({
            id: msg.data.split('/')[1]
          })

          const productsCaption = this.#_storedFoodsCaptionGenerator(
            // @ts-ignore
            order.foods.map((e: any) => ({
              food: { food: e.food.name, cost: e.food.cost },
              amount: e.amount
            }))
          )

          this.bot.sendMessage(
            msg.message.chat.id,
            // @ts-ignore
            `<b>Buyurtmachi</b>:  ${order.client.first_name + ' ' + order.client.last_name}\n<b>Telefon</b>: ${order.client.phone_number}\n\n${productsCaption}\n\n<b>Bekor qilindi 🚫</b>`,
            { parse_mode: 'HTML' }
          )

          this.bot.sendMessage(
            // @ts-ignore
            order.client.telegram_id,
            // @ts-ignore
            `<b>Buyurtmachi</b>:  ${order.client.first_name + ' ' + order.client.last_name}\n<b>Telefon</b>: ${order.client.phone_number}\n\n${productsCaption}\n\n<b>Bekor qilindi 🚫</b>`,
            { parse_mode: 'HTML' }
          )
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

        if (step?.split('/')[0] == botSteps.cookSelectMeal) {
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

              if (lunch.lunchList.length >= 1) {
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
            search: msg.text,
            is_bot: true
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

            if (foods.foodList.length > 0) {
              this.bot.sendMessage(msg.chat.id, botTexts.selectFoodAction.uz, {
                reply_markup: KeyboardMaker({ data: foods.foodList })
              })

              await this.storeService.editStep({
                telegramId: msg.chat.id,
                step: `${botSteps.selectFood}/${userStep.split('/')[1]}`
              })
            } else {
              this.bot.sendMessage(msg.chat.id, botTexts.emptyFoodList.uz)
            }
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
    let totalCost = 0
    data.map((e) => {
      caption.push(
        `<b>${e.food.food}</b> x ${e.amount} = <b>${FormatNumberWithSpaces(Number(e.food.cost) * Number(e.amount))} so'm</b>\n\n`
      )
      totalCost += e.food.cost * e.amount
    })

    caption.push(
      `<code>--------------------------------</code>\n<b>Jami:</b> ${FormatNumberWithSpaces(totalCost)} so'm`
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
      // Get Store

      // Validate Food
      const validFoods: any = []
      await Promise.all(
        store.map(async (e: any) => {
          const isValid = await this.foodService.checkFoodProducts({
            food: e.food.id,
            amount: e.amount
          })
          if (isValid) {
            validFoods.push(e)
          }
        })
      )

      if (validFoods.length !== 0) {
        const order = await this.orderService.orderCreate({
          client: payload.user,
          foods: validFoods.map((e: any) => ({
            food: e.food.id,
            amount: e.amount
          })),
          org: org['_id']
        })

        if (order.isBalanceSufficient === false) {
          this.bot.sendMessage(
            payload.msg.from.id,
            'Balansda pul yetarli emas!'
          )
        } else {
          await Promise.all(
            order.foods.map(async (e: any) => {
              for (let i = 0; i < e.products.length; i++) {
                const product = e.products[i]
                const amount = e.amount * product.amount
                await this.productService.productChangeAmount({
                  amount: amount,
                  id: product.product,
                  type: false,
                  cost: 0
                })
              }
            })
          )

          await this.userService.userUpdateBalance({
            type: false,
            amount: order.total_cost,
            user: payload.user
          })

          const productsCaption = this.#_storedFoodsCaptionGenerator(
            order.foods.map((e: any) => ({
              food: { food: e.name, cost: e.cost },
              amount: e.amount
            }))
          )

          await this.storeService.clearStoreByOrg({
            chat: payload.msg.from.id,
            org: org['_id']
          })

          this.bot.sendMessage(payload.msg.from.id, `${productsCaption}`, {
            parse_mode: 'HTML'
          })
          this.bot.sendMessage(
            org.group_a_id,
            `<b>Buyurtmachi</b>:  ${order.user.fullname}\n<b>Telefon raqami</b>:  ${order.user.phone_number}\n<b>Tanlangan oshxona</b>:  ${order.org}\n<b>Buyurtma sanasi</b>:  ${format(order.createdAt, 'd MMM HH:mm y', { locale: uz })}\n\n${productsCaption}`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: botTexts.acceptOrder.uz,
                      callback_data: `${botCallbackData.acceptOrder}/${order['_id']}`
                    }
                  ],
                  [
                    {
                      text: botTexts.cancelOrder.uz,
                      callback_data: `${botCallbackData.cancelOrder}/${order['_id']}`
                    }
                  ]
                ]
              },
              parse_mode: 'HTML'
            }
          )
        }
      } else {
        await this.storeService.clearStoreByOrg({
          org: org['_id'],
          chat: payload.msg.from.id
        })
        this.bot.sendMessage(
          payload.msg.from.id,
          'Mahsulot mavjud emas.\nIltimos qayta sotib oling!'
        )
      }
    } catch (error) {
      console.log(error)
      this.bot.sendMessage(payload.msg.from.id, botTexts.errorMessage.uz, {
        parse_mode: 'HTML'
      })
    }
  }

  async #_OrgMenuComponent(msg: Message) {
    const orgs = await this.orgService.orgRetrieveAll({
      pageNumber: 1,
      pageSize: 5,
      is_bot: true
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
        lunchbase: mealpoll.data.meal,
        org: payload.org,
        is_bot: true
      })

      const activeUsers = await this.userService.retrieveActiveUsers()

      activeUsers.map((e) => {
        this.bot.sendMessage(
          e.telegram_id,
          `<b>Iltimos ovqatni tanlang!!!</b>\n\n<b>Tayyorlanyabdi</b>: ${mealpoll.data.meal?.name}\n<b>Oshxona</b>: ${mealpoll.data.org?.name_org}\n<b>Porsiyalar</b>: `,
          {
            reply_markup: {
              inline_keyboard: lunches.lunchList.map((x: any) => [
                {
                  text: `${x.name} - ${FormatNumberWithSpaces(x.cost)} so'm`,
                  callback_data: `${botCallbackData.selectLunch}/${mealpoll.data['_id']}/${x['_id']}`
                }
              ])
            },
            parse_mode: 'HTML'
          }
        )
      })
    } else {
      this.bot.sendMessage(
        payload.cook,
        `${Math.floor(mealpoll.data?.diffrence || 0)} minut vaqt qoldi yangi elon yaratish uchun`
      )
    }
  }

  async #_createPollVote(payload: {
    meal: string
    lunch: string
    user: any
    org: string
    message: any
    callbackId: any
  }) {
    const vote = await this.pollVoteService.pollVoteCreate({
      meal: payload.lunch,
      meal_poll: payload.meal,
      user: payload.user['_id']
    })

    if (vote.status) {
      await this.paymentService.paymentCreate({
        amount: vote.cost,
        client: payload.user['_id'],
        org: payload.org,
        type: false
      })

      this.bot.deleteMessage(
        payload.user.telegram_id,
        payload.message.message_id
      )

      this.bot.sendMessage(
        payload.user.telegram_id,
        `<b>Kimga</b>: ${payload.user.first_name} ${payload.user.last_name}\n<b>Telefon</b>: ${payload.user.phone_number}\n<b>Oshxona</b>: ${vote.org.name} \n<b>Porsiya</b>: ${vote.meal}\n<b>Narxi</b>: ${FormatNumberWithSpaces(vote.cost)} so'm`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: botTexts.cometotakeLunch.uz,
                  callback_data: `${botCallbackData.comeToTakeLunch}/${vote.org.groupId}`
                }
              ]
            ]
          },
          parse_mode: 'HTML'
        }
      )

      this.bot.sendMessage(
        vote.org.groupId,
        `<b>Kimga</b>: ${payload.user.first_name} ${payload.user.last_name}\n<b>Telefon</b>: ${payload.user.phone_number}\n<b>Oshxona</b>: ${vote.org.name} \n<b>Porsiya</b>: ${vote.meal}\n<b>Narxi</b>: ${FormatNumberWithSpaces(vote.cost)} so'm`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: botTexts.donePollVote.uz,
                  callback_data: `${botCallbackData.donePollVoteOfUser}/${vote.org.groupId}`
                }
              ]
            ]
          },
          parse_mode: 'HTML'
        }
      )
    } else {
      if (vote.timeout) {
        this.bot.deleteMessage(
          payload.user.telegram_id,
          payload.message.message_id
        )
        this.bot.sendMessage(payload.user.telegram_id, 'Vaqt otib ketdi')
      } else {
        this.bot.answerCallbackQuery(payload.callbackId)
        this.bot.sendMessage(
          payload.user.telegram_id,
          'Hisobda pul yetarli emas'
        )
      }
    }
  }
}

if (!BOT_TOKEN) throw new Error('Bot Token Not Found')
export const botInstance = new TelegramBotApi(BOT_TOKEN)
