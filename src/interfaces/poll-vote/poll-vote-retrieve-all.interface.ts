export interface PollVoteRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  mealpoll?: string
  search?: string
}

export interface PollVoteList {
  _id: string
  name: string
  cost: number
}

export interface PollVoteRetrieveAllResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
  pollVoteList: PollVoteList[]
}
