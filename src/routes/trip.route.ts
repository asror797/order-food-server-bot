import { Router } from 'express'
import TripController from '../controllers/trips.controller'

export class TripRoute {
  public path = '/trip'
  public router = Router()
  public tripController = new TripController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.tripController.getTrips)
    this.router.get(`${this.path}/latest`, this.tripController.tripRetrieveOne)
    this.router.get(`${this.path}/spent`,this.tripController.retrieveSpent)
  }
}
