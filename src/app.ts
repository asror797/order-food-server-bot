import express from 'express'
import cors from 'cors'
import errorMiddleware from './middlewares/error.middleware'
import { Routes } from './interfaces/route.interface'
import { connect } from 'mongoose'
import { dbConnection } from './database'
import { botService } from '@bot'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
// require('dotenv').config()

class App {
  public app: express.Application
  public port: number
  public bot: any

  constructor(routes: Routes[]) {
    this.app = express()
    this.port = 3000
    this.bot = botService

    this.connectToDatabase()
    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initialieErrorHandling()
    this.initializeSwagger()
    this.initializeBot()
  }

  private async connectToDatabase() {
    try {
      await connect(dbConnection.url, dbConnection.options)
      console.log('Connected to database')
    } catch (error) {
      console.log(error)
    }
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is runing at ${this.port}`)
    })
  }

  private initializeMiddlewares() {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use('/uploads', express.static('uploads'))
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router)
    })
  }

  private initialieErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private initializeBot() {
    botService.initialize()
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Woodline Kitchen Bot REST Api',
        },
      },
      apis: ['swagger.yaml'],
    }

    const specs = swaggerJSDoc(options)
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs))
  }
}

export default App
