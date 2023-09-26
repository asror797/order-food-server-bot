import botService from "../bot/bot";
import { CreateTrip } from "../dtos/trip.dto";
import { httException } from "../exceptions/httpException";
import tripModel from "../models/trip.model";
import userModel from "../models/user.model";


class TripService {

  public trips = tripModel;
  public users = userModel;

  public async getTrips(page: number,size:number) {

    const skip = (page - 1) * size

    const trips = await this.trips.find()
              .select('-updatedAt')
              .skip(skip)
              .limit(size)
              .populate('org','name_org')
              .populate('meal','name cost')
              .exec();
    const totalTrips = await this.trips.countDocuments().exec()
    const totalPages = Math.ceil(totalTrips / size)
    return {
      data: trips,
      currentPage: page,
      totalPages,
      totalTrips,
      usersOnPage: trips.length
    };
  }

  public async createTrip(tripData:CreateTrip) {
    const { meal, org , sent_at } = tripData;

    const newTrip = await this.trips.create({
      sent_at: Math.floor(Date.now() / 1000),
      meal: meal,
      org: org
    });

    const clients = await this.users.find({
      org: org
    }).select('telegram_id');

    console.log(clients);

    return await this.trips.findById(newTrip['_id']).populate('meal','name cost');
  }

  public async agreeClient(trip: string,client: number) {
    const isExist = await this.trips.findById(trip)
    if(!isExist) throw new httException(400,'Trip not found')
    const updatedTrip = await this.trips.findByIdAndUpdate(trip,{
              $push: { agree_users: client },
            }, { new: true });
    console.log(updatedTrip);

    return updatedTrip
  }

  public async disagreeClient(trip: string,client: string) {
    const isExist = await this.trips.findById(trip)
    if(!isExist) throw new httException(400,'Trip not found')
    const updatedTrip = await this.trips.findByIdAndUpdate(trip,{
              $push: { disagree_users: client },
            }, { new: true });
    console.log(updatedTrip);

    return updatedTrip
  }

  
}


export default TripService;