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
    this.router.get(`${this.path}/latest`,this.tripController.tripRetrieveOne)
  }
}

export default TripRoute;

/*
  ovqatni porsiyalarini yigib olish kerak 
  { name, count, product: [{}] }


  masalik nomi va amount { name, amount }
  bitasiga qancha product ketishini xisoblab count ga kopaytirish kerak 


*/