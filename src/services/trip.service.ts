import botService from "../bot/bot";
import { CreateTrip } from "../dtos/trip.dto";
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
      sent_at: sent_at,
      meal: meal,
      org: org
    });

    const clients = await this.users.find({
      org: org
    }).select('telegram_id');

    console.log(clients);

    return newTrip;
  }

  public async agreeClient(trip: string,client: string) {

  }

  public async disagreeClient(trip: string,client: string) {

  }

  
}


export default TripService;