import { pollVote } from '@models'

export class PollVoteService {
  private pollvotes = pollVote

  public async pollVoteRetrieveAll(): Promise<any> {
    const pollVoteList = await this.pollvotes.find().exec()
    return pollVoteList
  }
  public async pollVoteRetrieveOne(): Promise<any> {}
  public async pollVoteCreate(): Promise<any> {}
  public async pollVoteDelete(): Promise<any> {}
  public async pollVoteUpdate(): Promise<any> {}
}
