import { NextFunction, Request, Response } from "express";
import TripService from "../services/trip.service";
import { ParsedQs } from "qs";
import { CreateTrip } from "../dtos/trip.dto";


class TripController {

  public tripService = new TripService();


  public getTrips = async(req:Request<ParsedQs>,res:Response,next:NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;

      res.json(await this.tripService.getTrips(page,size));
    } catch (error) {
      next(error)
    }
  }

  public createTrip = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const tripData:CreateTrip = req.body;

      // res.json()

    } catch (error) {
      next(error)
    }
  }
}

export default TripController;
