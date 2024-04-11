import { Router } from 'express'
import { PollVoteController } from '@controllers'
import { checkPermission } from '@middlewares'
import { OrgPermissions } from '@constants'

export class PollVoteRoute {
  public path = '/poll-vote'
  public router = Router()
  public pollvoteController = new PollVoteController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      checkPermission(OrgPermissions.ORG_RETRIEVE_ALL),
      this.pollvoteController.pollvoteRetrieveAll
    )

    this.router.get(
      `${this.path}/:id`,
      checkPermission(OrgPermissions.ORG_RETRIEVE_ONE),
      this.pollvoteController.pollvoteRetrieveOne
    )
  }
}
