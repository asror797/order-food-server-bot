import { PollVoteService } from '@services'
import { NextFunction, Request, Response } from 'express'

export class PollVoteController {
  private pollvoteService = new PollVoteService()

  public pollvoteRetrieveAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const pageNumber = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.size as string) || 10
    res.json(
      await this.pollvoteService.pollVoteRetrieveAll({ pageNumber, pageSize })
    )
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
      const pollvoteId = req.params.id
      res.json(
        await this.pollvoteService.pollVoteRetrieveOne({ id: pollvoteId })
      )
    } catch (error) {
      next(error)
    }
  }
}
