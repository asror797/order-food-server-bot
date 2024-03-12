import { PollVoteService } from '@services'
import { NextFunction, Request, Response } from 'express'

export class PollVoteController {
  private pollvoteService = new PollVoteService()

  public pollvoteRetrieveAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
    } catch (error) {
      next(error)
    }
  }

  public pollvoteRetrieveOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
    } catch (error) {
      next(error)
    }
  }
}
