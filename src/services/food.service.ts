import { HttpException } from '@exceptions'
import { 
  FoodCreateRequest,
  FoodCreateResponse,
  FoodDeleteRequest, 
  FoodDeleteResponse, 
  FoodRetrieveOneRequest, 
  FoodRetrieveOneResponse,
  FoodRetrieveAllRequest,
  FoodUpdateRequest, 
  FoodUpdateResponse
} from '@interfaces'
import { foodModel, productModel, orgModel } from '@models'
import { ProductService, ProductLogService } from '@services'

export class FoodService {
  public foods = foodModel
  public products = productModel
  public productLog = new ProductLogService()
  public productService = new ProductService()
  public org = orgModel

  public async foodRetrieveAll(payload: FoodRetrieveAllRequest): Promise<any> {
    const categoryEnum = ['drinks', 'snacks', 'dessert']
    const query: any = {}

    if (payload.category && categoryEnum.includes(payload.category)) {
      query.category = payload.category
    }

    if (payload.search) {
      query.name = { $regex: payload.search.trim(), $options: 'i' }
    }

    if (payload.org) {
      const org = await this.org.findById(payload.org).exec()
      if (!org) throw new HttpException(404, 'Org not found')
      query.org = payload.org
    }

    const foodList = await this.foods
      .find(query)
      .skip((payload.pageNumber - 1) * payload.pageSize)
      .limit(payload.pageSize)
      .populate('org', 'name_org')
      .select('name cost img')
      .exec()

    const count = await this.foods.countDocuments(query).exec()

    return {
      count: count,
      pageSize: payload.pageSize,
      pageNumber: payload.pageNumber,
      pageCount: 5,
      foodList: foodList.map((e: any) => ({
        _id: e['_id'],
        name: e.name,
        cost: e.cost,
        img: e.img,
        org: e.org.name_org
      }))
    }
  }

  public async foodRetrieveOne(payload: FoodRetrieveOneRequest): Promise<FoodRetrieveOneResponse> {
    const food = await this.foods.findById(payload.id).select('name cost img org')
    if (!food) throw new HttpException(404, 'Food not found')
    
    return food
  }

  public async foodCreate(payload: FoodCreateRequest):Promise<FoodCreateResponse> {
    if (payload.org) {
      const org = await this.org.findById(payload.org)
      if (!org) throw new HttpException(404, 'Org not found')
    }

    await Promise.all(
      payload.products.map(async (e: any) => {
        const product = await this.foods.findById(e['_id']).select('org').exec()

        if (!product || e.amount >= 0) {
          throw new HttpException(
            404,
            'Product not found or Amount not positive'
          )
        }
      })
    )

    const food = await this.foods.create({
      name: payload.name,
      cost: payload.cost,
      org: payload.org,
      category: payload.category,
      products: payload.products
    })

    return food
  }

  public async foodUpdate(payload: FoodUpdateRequest): Promise<FoodUpdateResponse> {
    console.log(payload.id)
    return {
      _id: ''
    }
  }

  public async foodDelete(payload: FoodDeleteRequest): Promise<FoodDeleteResponse> {
    await this.foodRetrieveOne({ id: payload.id })

    const food = await this.foods.findByIdAndDelete(payload.id)

    return {
      ...food
    }
  }

  public async checkFoodProducts(payload: { food: string; amount: number }): Promise<boolean> {
    const food = await this.foods
      .findById(payload.food)
      .select('products')
      .exec()
    
    if (!food) return false

    await Promise.all(food.products.map(async(e) => {
      const isValid = await this.productService.checkProductAmount({
        product: e.product.toString(),
        amount: e.amount * payload.amount
      })

      if (!isValid) return false
    }))

    return true
  }

}
