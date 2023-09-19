import { Router } from "express"
import TripController from "../controllers/trips.controller"



class TripRoute {
  public path = '/trip'
  public router = Router()
  public tripController = new TripController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`,this.tripController.getTrips);
  }
}

export default TripRoute;