import { HttpException } from "@exceptions"
import axios, { AxiosInstance, AxiosResponse } from "axios"

export class DataFetcher {

  readonly #_baseUrl: string
  readonly #_axios: AxiosInstance
  
  constructor(baseUrl:string) {
    this.#_baseUrl = baseUrl
    this.#_axios = axios.create({
      baseURL: this.#_baseUrl,
      headers: {
        Accept: 'application/json'
      },
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < status
    })

    this.#_axios.interceptors.response.use((response:AxiosResponse):AxiosResponse => response,
    this.#_responseError.bind(this))
  }

  async fetchData(endPoint: string):Promise<any> {
    const response = await this.#_axios.get('/')

    return response
  }

  async #_responseError(error:unknown):Promise<AxiosResponse> {
    console.log(error)
    throw new HttpException(500,'Something wrong')
  }
}

