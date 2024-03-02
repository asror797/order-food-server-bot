import mongoose from 'mongoose'
import { lunchModel, orgModel, userModel, tripModel } from '@models'
// import { botService } from '@bot'
import { HttpException } from '@exceptions'
import { CreateTrip } from '../dtos/trip.dto'
import { PaymentService } from '@services'
import { endOfMonth, startOfMonth } from 'date-fns'

export class TripService {
  public trips = tripModel
  public users = userModel
  public org = orgModel
  public lunch = lunchModel
  public paymentService = new PaymentService()

  public async getTrips(page: number, size: number) {
    const skip = (page - 1) * size

    const trips = await this.trips
      .find()
      .select('-updatedAt')
      .skip(skip)
      .limit(size)
      .populate('candidates.user', 'first_name last_name phone_number')
      .populate({
        path: 'candidates.lunch',
        // populate: {
        //   path: 'products.product',
        //   model: 'Product',
        //   select:'name '
        // },
        select: 'name cost'
      })
      .populate('org', 'name_org')
      .populate('meal', 'name')
      .exec()
    const totalTrips = await this.trips.countDocuments().exec()
    const totalPages = Math.ceil(totalTrips / size)
    return {
      data: trips,
      currentPage: page,
      totalPages,
      totalTrips,
      tripsOnPage: trips.length
    }
  }

  public async tripRetrieveOneById(id: string) {
    const trip = await this.trips
      .findById(id)
      .populate(
        'candidates.user',
        'first_name last_name phone_number telegram_id'
      )
      .populate({
        path: 'candidates.lunch',
        populate: {
          path: 'products.product',
          model: 'Product',
          select: 'name '
        },
        select: 'name cost'
      })
      .exec()

    console.log('Trip', trip)

    return trip
  }

  public async tripRetrieveOne(client: number) {
    const cook = await this.users.findOne({
      telegram_id: client
    })

    if (!cook || !cook?.org) {
      return {
        status: false,
        data: {}
      }
    }

    const latestData: any = await this.trips
      .findOne({ org: cook.org['_id'] })
      .populate('candidates')
      .populate('candidates.user', 'first_name last_name phone_number')
      // .populate('candidates.lunch')
      .populate({
        path: 'candidates.lunch',
        populate: {
          path: 'products.product',
          model: 'Product',
          select: 'name unit'
        }
      })
      .populate('meal', 'name')
      .select('-createdAt -updatedAt')
      .sort({ createdAt: -1 })
      .limit(1)

    interface IProduct {
      [orderId: string]: {
        products: [
          {
            product: {
              _id: string
              name: string
              unit: string
            }
            amount: number
          }
        ]
        amount: number
      }
    }

    const countProduct: IProduct = {}

    for (const order of latestData.candidates) {
      const { lunch, user } = order
      console.log(user)

      if (!countProduct[lunch.name]) {
        countProduct[lunch.name] = {
          products: lunch.products,
          amount: 1
        }
      } else {
        countProduct[lunch.name].amount++
      }
    }

    interface IProductCount {
      [key: string]: {
        name: string
        unit: string
        amount: number
      }
    }

    const productCount: IProductCount[] | any = {}
    Object.keys(countProduct).forEach((orderId) => {
      countProduct[orderId].products.forEach((product) => {
        const productId = product.product._id

        if (Object.keys(productCount).includes(productId)) {
          productCount[productId].amount +=
            product.amount * countProduct[orderId].amount
        } else {
          productCount[productId] = {
            name: product.product.name,
            unit: product.product.unit,
            amount: product.amount * countProduct[orderId].amount
          }
        }
      })
    })

    return {
      status: true,
      data: latestData,
      count: countProduct,
      productCount: productCount
    }
  }

  public async tripCreate(payload: any) {
    const { base, org } = payload

    const Org = await this.org.findById(org)

    if (!Org) throw new HttpException(400, 'org not foud')

    const latestData: any = await this.trips
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1)

    if (latestData) {
      const diffrence =
        (Math.floor(Date.now() / 1000) - latestData.sent_at) / 60
      if (diffrence > Org.trip_timeout) {
        console.log('Latest trip', latestData)
        const newTrip = await this.trips.create({
          sent_at: Math.floor(Date.now() / 1000),
          meal: base,
          org: org
        })

        return {
          status: true,
          data: await this.trips
            .findById(newTrip['_id'])
            .populate('meal', 'name cost')
        }
      } else {
        return {
          status: false,
          data: {
            diffrence: Org.trip_timeout - diffrence
          }
        }
      }
    } else {
      const newTrip = await this.trips.create({
        sent_at: Math.floor(Date.now() / 1000),
        meal: base,
        org: org
      })

      return {
        status: true,
        data: await this.trips
          .findById(newTrip['_id'])
          .populate('meal', 'name cost')
      }
    }
  }

  public async createTrip(tripData: CreateTrip) {
    const { meal, org } = tripData
    const Org = await this.org.findById(org)
    if (!Org) throw new HttpException(400, 'org not foud')

    const latestData: any = await this.trips
      .findOne()
      .where({
        org: org
      })
      .sort({ createdAt: -1 })
      .limit(1)

    if (latestData) {
      const diffrence =
        (Math.floor(Date.now() / 1000) - latestData.sent_at) / 60
      if (diffrence > Org.trip_timeout) {
        console.log('Latest trip', latestData)
        const newTrip = await this.trips.create({
          sent_at: Math.floor(Date.now() / 1000),
          meal: meal,
          org: org
        })

        return {
          status: true,
          data: await this.trips
            .findById(newTrip['_id'])
            .populate('meal', 'name cost')
        }
      } else {
        return {
          status: false,
          data: {
            diffrence: Org.trip_timeout - diffrence
          }
        }
      }
    } else {
      const newTrip = await this.trips.create({
        sent_at: Math.floor(Date.now() / 1000),
        meal: meal,
        org: org
      })

      return {
        status: true,
        data: await this.trips
          .findById(newTrip['_id'])
          .populate('meal', 'name cost')
      }
    }
  }

  public async pushUser(trip: string, client: number, lunch: string) {
    const user = await this.users
      .findOne({
        telegram_id: Number(client)
      })
      .populate('org')

    if (!user) throw new HttpException(400, 'user not found')
    const isExist = await this.trips.findById(trip)
    if (!isExist) throw new HttpException(400, 'Trip not found')
    const diffrence = (Math.floor(Date.now() / 1000) - isExist.sent_at) / 60
    const Lunch = await this.lunch.findById(lunch)

    if (!Lunch) throw new HttpException(400, 'not found lunch')

    if (diffrence < (user.org?.trip_timeout || 0)) {
      const updatedTrip: any = await this.trips
        .findByIdAndUpdate(
          trip,
          {
            $push: { candidates: { user: user['_id'], lunch: lunch } }
          },
          { new: true }
        )
        .populate('meal')
        .exec()
      console.log(updatedTrip)
      if (!updatedTrip) throw new HttpException(400, 'something went wrong')
      // const payment = await this.paymentService.dicrease({
      //   user: user['_id'],
      //   amount: Lunch.cost
      // })
      // console.log('Payment', payment)

      return {
        status: true,
        data: {
          org: user.org,
          trip: updatedTrip,
          type: true,
          user: user,
          lunch: Lunch
        }
      }
    } else {
      return {
        status: false,
        data: {
          diffrence: user.org?.trip_timeout - diffrence
        }
      }
    }
  }

  public async agreeClient(trip: string, client: number) {
    const user = await this.users
      .findOne({
        telegram_id: Number(client)
      })
      .populate('org')
    console.log(user)

    if (!user) throw new HttpException(400, 'user not found')
    const isExist = await this.trips.findById(trip)
    if (!isExist) throw new HttpException(400, 'Trip not found')
    const diffrence = (Math.floor(Date.now() / 1000) - isExist.sent_at) / 60

    console.log('Diffrence:', diffrence)

    if (diffrence < (user.org?.trip_timeout || 0)) {
      const updatedTrip: any = await this.trips
        .findByIdAndUpdate(
          trip,
          {
            $push: { agree_users: user['_id'] }
          },
          { new: true }
        )
        .populate('meal')
        .exec()
      console.log(updatedTrip)
      if (!updatedTrip) throw new HttpException(400, 'something went wrong')
      // const payment = await this.paymentService.dicrease({
      //   user: user['_id'],
      //   amount: updatedTrip.meal.cost
      // })
      // console.log('Payment', payment)

      return {
        status: true,
        data: {
          org: user.org,
          trip: updatedTrip,
          type: true,
          user: user
        }
      }
    } else {
      return {
        status: false,
        data: {
          diffrence: user.org?.trip_timeout - diffrence
        }
      }
    }
  }

  public async findOrderTrip(payload: any) {
    const { trip, user } = payload

    const User = await this.users
      .findById(user)
      .populate('org')
      .select('phone_number first_name last_name')
      .exec()

    console.log(User)

    const userByTrip = await this.trips
      .aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(trip),
            'candidates.user': new mongoose.Types.ObjectId(user)
          }
        },
        {
          $unwind: '$candidates'
        },
        {
          $match: {
            'candidates.user': new mongoose.Types.ObjectId(user)
          }
        },
        {
          $lookup: {
            from: 'users', // Assuming the user collection is named 'users'
            localField: 'candidates.user',
            foreignField: '_id',
            as: 'attendedUser.user'
          }
        },
        {
          $lookup: {
            from: 'lunches', // Assuming the lunch collection is named 'lunches'
            localField: 'candidates.lunch',
            foreignField: '_id',
            as: 'attendedUser.lunch'
          }
        },
        {
          $project: {
            'attendedUser.user': { $arrayElemAt: ['$attendedUser.user', 0] },
            'attendedUser.lunch': { $arrayElemAt: ['$attendedUser.lunch', 0] },
            'attendedUser.total': '$candidates.total',
            'attendedUser._id': '$candidates._id'
          }
        }
      ])
      .exec()

    const Order = await this.trips
      .findOne({
        _id: trip
      })
      .populate('meal', 'name')
      .populate('org', 'group_a_id group_b_id')
      .exec()

    return {
      meal: Order?.meal,
      org: Order?.org,
      candidates: [userByTrip[0].attendedUser]
    }
  }

  public async cancelAgreeClient(payload: any) {
    const { trip, client } = payload
    const user = await this.users
      .findOne({
        telegram_id: Number(client)
      })
      .populate('org')
    console.log(user)

    if (!user) throw new HttpException(200, 'user not found')
    const Trip = await this.trips.findByIdAndUpdate(
      trip,
      { $pull: { agree_users: user['_id'] } },
      { new: true }
    )
    console.log(Trip)
  }

  public async disagreeClient(trip: string, client: number) {
    const user = await this.users
      .findOne({
        telegram_id: Number(client)
      })
      .populate('org')
    if (!user) throw new HttpException(400, 'user not found')
    const isExist = await this.trips.findById(trip)
    if (!isExist) throw new HttpException(400, 'Trip not found')
    const updatedTrip = await this.trips.findByIdAndUpdate(
      trip,
      {
        $push: { disagree_users: user['_id'] }
      },
      { new: true }
    )
    console.log(updatedTrip)

    return updatedTrip
  }

  public async getTotalSpentsOfUser(payload: any) {
    const startDate = payload.startDate
      ? payload.startDate
      : startOfMonth(new Date())
    const endDate = payload.endDate ? payload.endDate : endOfMonth(new Date())
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          'candidates.user': new mongoose.Types.ObjectId(payload.userId)
        }
      },
      {
        $unwind: '$candidates'
      },
      {
        $match: {
          'candidates.user': new mongoose.Types.ObjectId(payload.userId)
        }
      },
      {
        $lookup: {
          from: 'lunches',
          localField: 'candidates.lunch',
          foreignField: '_id',
          as: 'lunch'
        }
      },
      {
        $project: {
          _id: 0,
          attendedUser: '$candidates.user',
          lunch: { $arrayElemAt: ['$lunch', 0] },
          total: '$candidates.total'
        }
      },
      {
        $limit: 70
      }
    ]

    const result = await this.trips.aggregate(pipeline)

    console.log(result)

    return result
  }

  public async statusChecker(trip: string) {
    const isExist = await this.trips.findOne().sort('-createdAt')
    if (!isExist) throw new HttpException(400, 'not found trip')
    console.log(isExist)
    if (trip) {
      return true
    } else {
      return false
    }
  }
}
