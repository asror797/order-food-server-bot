import express from "express"
import cors from "cors"
import errorMiddleware from "./middlewares/error.middleware";
import { Routes } from "./interfaces/route.interface";
import { connect } from "mongoose";
import { dbConnection } from "./database/database";
import botService from "./bot/bot";



class App {
  public app: express.Application
  public port: number

  constructor(routes:Routes[]) {
    this.app = express()
    this.port = 9000

    this.connectToDatabase()
    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initialieErrorHandling()
    this.initializeBot()

  }

  private async connectToDatabase() {
    try {
      await connect(dbConnection.url,dbConnection.options)
    } catch (error) {
      console.log(error)
    }
  }

  public listen() {
    this.app.listen(this.port,() => {
      console.log(`Server is runing at ${this.port}`);
    })
  }

  private initializeMiddlewares() {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use('/uploads',express.static('uploads'))
  }


  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/',route.router)
    })
  }

  private initialieErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private initializeBot() {
    botService.initialize()
  }
}


export default App;
