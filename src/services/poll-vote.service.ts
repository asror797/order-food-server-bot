import { HttpException } from '@exceptions'
import {
  PollVoteRetrieveAllRequest,
  PollVoteRetrieveAllResponse,
  PollVoteRetrieveOneRequest,
  PollVoteRetrieveOneResponse,
  PollVoteCreateRequest,
  PollVoteUpdateRequest,
  PollVoteDeleteRequest,
  PollVoteUpdateResponse,
  PollVoteDeleteResponse,
  PollVoteCreateResponse
} from '@interfaces'
import { lunchModel, mealPollModel, pollVote, userModel } from '@models'

export class PollVoteService {
  private pollvotes = pollVote
  private mealpolls = mealPollModel
  private lunches = lunchModel
  private users = userModel

  public async pollVoteRetrieveAll(
    payload: PollVoteRetrieveAllRequest
  ): Promise<PollVoteRetrieveAllResponse> {
    const pollVoteList = await this.pollvotes
      .find()
      .skip(payload.pageNumber)
      .exec()

    const count = await this.pollvotes.countDocuments().exec()
    return {
      count: count,
      pageNumber: payload.pageNumber,
      pageSize: payload.pageSize,
      pageCount: Math.ceil(pollVoteList.length),
      pollVoteList: []
    }
  }

  public async pollVoteRetrieveOne(
    payload: PollVoteRetrieveOneRequest
  ): Promise<PollVoteRetrieveOneResponse> {
    console.log(payload)
    return {
      id: ''
    }
  }

  public async pollVoteCreate(
    payload: PollVoteCreateRequest
  ): Promise<PollVoteCreateResponse> {
    const meal_poll: any = await this.mealpolls
      .findById(payload.meal_poll)
      .populate('org', 'name_org group_b_id')
      .select('meal')
      .exec()
    console.log(meal_poll)

    if (!meal_poll) throw new HttpException(404, 'Meal Poll not found')

    const meal = await this.lunches
      .findById(payload.meal)
      .select('cost name')
      .exec()

    if (!meal) throw new HttpException(404, 'Meal not found')

    const user = await this.users.findById(payload.user)
    if (!user) throw new HttpException(404, 'User not found')

    const pollvote = await this.pollvotes.create({
      meal: payload.meal,
      meal_poll: payload.meal_poll,
      user: payload.user,
      cost: meal.cost
    })

    return {
      cost: pollvote.cost,
      meal: pollvote.meal,
      meal_poll: pollvote.meal_poll,
      user: pollvote.user,
      org: {
        name: meal_poll.org.name_org,
        groupId: meal_poll.org.group_b_id
      }
    }
  }

  public async pollVoteDelete(
    payload: PollVoteUpdateRequest
  ): Promise<PollVoteUpdateResponse> {
    console.log(payload)
    return {
      id: ''
    }
  }

  public async pollVoteUpdate(
    payload: PollVoteDeleteRequest
  ): Promise<PollVoteDeleteResponse> {
    console.log(payload)
    return {
      id: ''
    }
  }
}
