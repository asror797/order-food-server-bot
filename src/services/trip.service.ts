import botService from "../bot/bot";
import { CreateTrip } from "../dtos/trip.dto";
import { httException } from "../exceptions/httpException";
import lunchModel from "../models/lunch.model";
import orgModel from "../models/org.model";
import tripModel from "../models/trip.model";
import userModel from "../models/user.model";
import PaymentService from "./payment.service";


class TripService {

  public trips = tripModel;
  public users = userModel;
  public org = orgModel;
  public lunch = lunchModel;
  public paymentService = new PaymentService()

  public async getTrips(page: number,size:number) {

    const skip = (page - 1) * size

    const trips = await this.trips.find()
              .select('-updatedAt')
              .skip(skip)
              .limit(size)
              .populate('candidates.user','first_name last_name phone_number')
              .populate({
                path: 'candidates.lunch',
                // populate: {
                //   path: 'products.product',
                //   model: 'Product',
                //   select:'name '
                // },
                select:'name cost'
              })
              .populate('org','name_org')
              .populate('meal','name')
              .exec();
    const totalTrips = await this.trips.countDocuments().exec()
    const totalPages = Math.ceil(totalTrips / size)
    return {
      data: trips,
      currentPage: page,
      totalPages,
      totalTrips,
      tripsOnPage: trips.length
    };
  }

  public async tripRetrieveOneById(id: string) {
    const trip = await this.trips.findById(id).populate('candidates.user','first_name last_name phone_number telegram_id')
    .populate({
      path: 'candidates.lunch',
      populate: {
        path: 'products.product',
        model: 'Product',
        select:'name '
      },
      select:'name cost'
    }).exec()

    console.log('Trip',trip)

    return trip

  }

  public async tripRetrieveOne(client:number) {
    const cook = await this.users.findOne({
      telegram_id: client
    })

    if(!cook || !cook?.org) {
      return {
        status: false,
        data: {}
      }
    }

    const latestData:any = await this.trips
      .findOne({ org: cook.org['_id']})
      .populate('candidates')
      .populate('candidates.user','first_name last_name phone_number')
      // .populate('candidates.lunch')
      .populate({
        path: 'candidates.lunch',
        populate: {
          path: 'products.product',
          model: 'Product',
          select:'name unit'
        },
      })
      .populate('meal','name')
      .select('-createdAt -updatedAt')
      .sort({ createdAt: -1 }) 
      .limit(1);



    interface IProduct {
      [orderId: string]: {
        products: [
          {
            product: {
              "_id":string,
              name: string,
              unit: string
            },
            amount: number
          }
        ],
        amount: number
      }
    } 
    
    const countProduct:IProduct = {}

    for (const order of latestData.candidates) {
      const { lunch, user } = order

      if(!countProduct[lunch.name]) {
        countProduct[lunch.name] = {
          products: lunch.products,
          amount: 1
        }
      } else {
        countProduct[lunch.name].amount ++
      }
    }

    interface IProductCount {
      [key: string]: {
        name: string,
        unit: string,
        amount: number
      }
    }
    
    let productCount: IProductCount[] | any = {};

    // for(let i =0;i<Object.keys(countProduct).length;i++){ // ["1","0.7"]
    //   console.log(countProduct[Object.keys(countProduct)[i]])
    //   for(let a=0;a<countProduct[Object.keys(countProduct)[i]].products.length;a++){
    //     productCount[countProduct[Object.keys(countProduct)[i]].products[a].product._id]
    //     if(Object.keys(productCount).includes(countProduct[Object.keys(countProduct)[i]].products[a].product._id)){

    //       productCount[countProduct[Object.keys(countProduct)[i]].products[a].product._id].amount = 
    //             productCount[countProduct[Object.keys(countProduct)[i]].products[a].product._id] + countProduct[Object.keys(countProduct)[i]].products[a].amount * countProduct[Object.keys(countProduct)[i]].amount
    //     } else {
    //       productCount[countProduct[Object.keys(countProduct)[i]].products[a].product._id] = {
    //          name:countProduct[Object.keys(countProduct)[i]].products[a].product.name,
    //          unit:countProduct[Object.keys(countProduct)[i]].products[a].product.unit,
    //          amount:  countProduct[Object.keys(countProduct)[i]].products[a].amount * countProduct[Object.keys(countProduct)[i]].amount}
    //     }
    //   }
    // }

    Object.keys(countProduct).forEach(orderId => {
      countProduct[orderId].products.forEach(product => {
        const productId = product.product._id;
    
        if (Object.keys(productCount).includes(productId)) {
          productCount[productId].amount += product.amount * countProduct[orderId].amount;
        } else {
          productCount[productId] = {
            name: product.product.name,
            unit: product.product.unit,
            amount: product.amount * countProduct[orderId].amount
          };
        }
      });
    });

    return {
      status: true,
      data: latestData,
      count: countProduct,
      productCount: productCount
    }
  }

  public async tripCreate(payload:any) {
    const { base, org } = payload

    const Org = await this.org.findById(org)

    if(!Org) throw new httException(400,'org not foud')

    const latestData:any = await this.trips
      .findOne()
      .sort({ createdAt: -1 }) 
      .limit(1);
    
    if(latestData) {
      const diffrence = (Math.floor(Date.now() / 1000) - latestData.sent_at) / 60
      if(diffrence > Org.trip_timeout ) {
        console.log('Latest trip',latestData)
        const newTrip = await this.trips.create({
          sent_at: Math.floor(Date.now() / 1000),
          meal: base,
          org: org
        });

        return {
          status: true,
          data: await this.trips.findById(newTrip['_id']).populate('meal','name cost')
        }
      } else {
        return {
          status: false,
          data: {
            diffrence: Org.trip_timeout -  diffrence
          }
        }
      }
    } else {
      const newTrip = await this.trips.create({
        sent_at: Math.floor(Date.now() / 1000),
        meal: base,
        org: org
      });

      return {
        status: true,
        data: await this.trips.findById(newTrip['_id']).populate('meal','name cost')
      }
    }
  }


  public async createTrip(tripData:CreateTrip) {
    const { meal, org , sent_at } = tripData;

    const Org = await this.org.findById(org)

    if(!Org) throw new httException(400,'org not foud')

    console.log(Org)
    const latestData:any = await this.trips
      .findOne()
      .sort({ createdAt: -1 }) 
      .limit(1)
    
    if(latestData) {
      const diffrence = (Math.floor(Date.now() / 1000) - latestData.sent_at) / 60
      if(diffrence > Org.trip_timeout ) {
        console.log('Latest trip',latestData)
        const newTrip = await this.trips.create({
          sent_at: Math.floor(Date.now() / 1000),
          meal: meal,
          org: org
        });

        return {
          status: true,
          data: await this.trips.findById(newTrip['_id']).populate('meal','name cost')
        }
      } else {
        return {
          status: false,
          data: {
            diffrence: Org.trip_timeout -  diffrence
          }
        }
      }
    } else {
      const newTrip = await this.trips.create({
        sent_at: Math.floor(Date.now() / 1000),
        meal: meal,
        org: org
      });

      return {
        status: true,
        data: await this.trips.findById(newTrip['_id']).populate('meal','name cost')
      }
    }
  }

  public async pushUser(trip: string,client: number,lunch: string) {
    const user = await this.users.findOne({
      telegram_id: Number(client)
    }).populate('org')

    if(!user) throw new httException(400,'user not found')
    const isExist = await this.trips.findById(trip)
    if(!isExist) throw new httException(400,'Trip not found')
    const diffrence = (Math.floor(Date.now() / 1000) - isExist.sent_at) / 60
    const Lunch = await this.lunch.findById(lunch)

    if(!Lunch) throw new httException(400,'not found lunch')

    if(diffrence < (user.org?.trip_timeout || 0)) {
      const updatedTrip:any = await this.trips.findByIdAndUpdate(trip,{
        $push: { candidates: {user:user['_id'], lunch:lunch } },
      }, { new: true }).populate('meal').exec()
      console.log(updatedTrip);
      if(!updatedTrip) throw new httException(400,'something went wrong')
      const payment = await this.paymentService.dicrease({user: user['_id'], amount: Lunch.cost})
      console.log('Payment',payment)

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
          diffrence: user.org?.trip_timeout -  diffrence
        }
      }
    }

  }

  public async agreeClient(trip: string,client: number) {
    const user = await this.users.findOne({
      telegram_id: Number(client)
    }).populate('org')
    console.log(user)

    if(!user) throw new httException(400,'user not found')
    const isExist = await this.trips.findById(trip)
    if(!isExist) throw new httException(400,'Trip not found')
    const diffrence = (Math.floor(Date.now() / 1000) - isExist.sent_at) / 60

    console.log('Diffrence:',diffrence)

    if(diffrence < (user.org?.trip_timeout || 0)) {
      const updatedTrip:any = await this.trips.findByIdAndUpdate(trip,{
        $push: { agree_users: user['_id'] },
      }, { new: true }).populate('meal').exec()
      console.log(updatedTrip);
      if(!updatedTrip) throw new httException(400,'something went wrong')
      const payment = await this.paymentService.dicrease({user: user['_id'], amount: updatedTrip.meal.cost})
      console.log('Payment',payment)

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
          diffrence: user.org?.trip_timeout -  diffrence
        }
      }
    }
  }

  public async findOrderTrip(payload:any) {
    const { trip, user } = payload


    const User = await this.users.findById(user).populate('org').select('phone_number first_name last_name').exec()

    const Order = await this.trips.findOne(
      {
        _id: trip,
        'candidates.user':user
      },
    ).populate('meal','name').populate('org','group_a_id group_b_id').populate('candidates.user','first_name last_name phone_number telegram_id')
    .populate('candidates.lunch','name cost').exec()

    console.log('Trip finded',User)

    return Order
  }

  public async cancelAgreeClient(payload:any) {
    const { trip , client } = payload
    const user = await this.users.findOne({
      telegram_id: Number(client)
    }).populate('org')
    console.log(user)

    if(!user) throw new httException(200,'user not found')
    const Trip = await this.trips.findByIdAndUpdate(
      trip,
      { $pull: { agree_users: user['_id'] } }, 
      { new: true }
    );
    console.log(Trip)
  }

  public async disagreeClient(trip: string,client: number) {
    const user = await this.users.findOne({
      telegram_id: Number(client)
    }).populate('org')
    if(!user) throw new httException(400,'user not found')
    const isExist = await this.trips.findById(trip)
    if(!isExist) throw new httException(400,'Trip not found')
    const updatedTrip = await this.trips.findByIdAndUpdate(trip,{
              $push: { disagree_users: user['_id'] },
            }, { new: true });
    console.log(updatedTrip);

    return updatedTrip
  }

  public async statusChecker(trip:string,client: string) {
    const isExist = await this.trips.findOne().sort('-createdAt')
    if(!isExist) throw new httException(400,'not found trip')
    console.log(isExist)
    const timenow = 78945612

    const diffrenceTime = 0

    if(trip) {
      return true
    } else {
      return false
    }
  }
}


export default TripService;