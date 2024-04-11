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
  ): Promise<any> {
    const query: any = {}
    if (payload.mealpoll) {
      query.mealpoll = payload.mealpoll
    }

    const pollVoteList = await this.pollvotes
      .find(query)
      .skip(payload.pageNumber)
      .limit(payload.pageSize)
      .sort({ createdAt: -1 })
      .exec()

    const count = await this.pollvotes.countDocuments().exec()
    return {
      count: count,
      pageNumber: payload.pageNumber,
      pageSize: payload.pageSize,
      pageCount: Math.ceil(pollVoteList.length),
      pollVoteList: pollVoteList
    }
  }

  public async pollVoteRetrieveOne(
    payload: PollVoteRetrieveOneRequest
  ): Promise<any> {
    const pollvote = await this.pollvotes
      .findById(payload.id)
      .select('-createdAt -updatedAt')
      .exec()
    if (!pollvote) throw new HttpException(404, 'pollvote not found')

    return pollvote
  }

  public async pollVoteCreate(
    payload: PollVoteCreateRequest
  ): Promise<PollVoteCreateResponse> {
    const meal_poll: any = await this.mealpolls
      .findById(payload.meal_poll)
      .populate('org', 'name_org trip_timeout group_b_id')
      .select('meal sent_at')
      .exec()

    if (!meal_poll) throw new HttpException(404, 'Meal Poll not found')

    const diffrence = (Math.floor(Date.now() / 1000) - meal_poll.sent_at) / 60
    console.log(diffrence)

    const meal = await this.lunches
      .findById(payload.meal)
      .select('cost name')
      .exec()

    if (!meal) throw new HttpException(404, 'Meal not found')

    const user = await this.users
      .findById(payload.user)
      .select('balance')
      .exec()

    if (!user) throw new HttpException(404, 'User not found')

    if (user.balance >= meal.cost && diffrence < meal_poll.org.trip_timeout) {
      const pollvote = await this.pollvotes.create({
        meal: payload.meal,
        meal_poll: payload.meal_poll,
        user: payload.user,
        cost: meal.cost
      })

      return {
        status: true,
        cost: pollvote.cost,
        meal: meal.name,
        meal_poll: pollvote.meal_poll,
        user: pollvote.user,
        org: {
          name: meal_poll.org.name_org,
          groupId: meal_poll.org.group_b_id
        }
      }
    } else {
      return {
        status: false,
        cost: meal.cost,
        meal: meal.name,
        meal_poll: meal_poll['_id'],
        user: user['_id'],
        org: {
          name: meal_poll.org.name_org,
          groupId: meal_poll.org.group_b_id
        },
        timeout: diffrence > meal_poll.org.trip_timeout
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
