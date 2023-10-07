import botService from "../bot/bot";
import { CreateTrip } from "../dtos/trip.dto";
import { httException } from "../exceptions/httpException";
import orgModel from "../models/org.model";
import tripModel from "../models/trip.model";
import userModel from "../models/user.model";
import PaymentService from "./payment.service";


class TripService {

  public trips = tripModel;
  public users = userModel;
  public org = orgModel;
  public paymentService = new PaymentService()

  public async getTrips(page: number,size:number) {

    const skip = (page - 1) * size

    const trips = await this.trips.find()
              .select('-updatedAt')
              .skip(skip)
              .limit(size)
              .populate('org','name_org')
              .populate('meal','name cost')
              .populate('agree_users','first_name last_name phone_number')
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
      .populate('agree_users','first_name last_name phone_number')
      .populate('meal')
      .sort({ createdAt: -1 }) 
      .limit(1);
    return {
      status: true,
      data: latestData
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
      .limit(1);
    
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