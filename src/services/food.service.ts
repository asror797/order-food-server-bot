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
  FoodUpdateResponse,
  FoodRetrieveAllResponse
} from '@interfaces'
import { foodModel, productModel, orgModel } from '@models'
import { ProductService, ProductLogService, ValidationService } from '@services'
import { FoodCreateDto } from '@dtos'

export class FoodService {
  public foods = foodModel
  public products = productModel
  public productLog = new ProductLogService()
  public productService = new ProductService()
  private validateService = new ValidationService()
  public org = orgModel

  public async foodRetrieveAll(
    payload: FoodRetrieveAllRequest
  ): Promise<FoodRetrieveAllResponse> {
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
      .sort({ createdAt: -1 })
      .populate('org', 'name_org')
      .select(
        payload.isDashboard
          ? 'name cost img category is_deleted products'
          : 'name cost img'
      )
      .exec()

    const count = await this.foods.countDocuments(query).exec()
    const validFoodList: any = []
    if (!payload.isDashboard) {
      await Promise.all(
        foodList.map(async (e) => {
          const isValid = await this.checkFoodProducts({
            food: e['_id'],
            amount: 1
          })
          if (isValid) {
            validFoodList.push(e)
          }
        })
      )
    }

    return {
      count: count,
      pageSize: payload.pageSize,
      pageNumber: payload.pageNumber,
      pageCount: Math.ceil(count / payload.pageSize),
      foodList: payload.isDashboard
        ? foodList.map((e: any) => ({
            _id: e['_id'],
            name: e.name,
            cost: e.cost,
            img: e.img,
            org: e.org?.name_org || null,
            category: e.category,
            products: e.products.length,
            is_private: e.is_deleted
          }))
        : validFoodList.map((e: any) => ({
            _id: e['_id'],
            name: e.name,
            cost: e.cost,
            org: e.org?.name_org || null,
            img: e.img,
          }))
    }
  }

  public async foodRetrieveOne(
    payload: FoodRetrieveOneRequest
  ): Promise<FoodRetrieveOneResponse> {
    const food = await this.foods
      .findById(payload.id)
      .populate('org', 'name_org')
      .populate('products.product', 'name cost')
      .select('name cost img org products')
      .exec()
    if (!food) throw new HttpException(404, 'Food not found')

    return food
  }

  public async foodCreate(payload: FoodCreateDto): Promise<FoodCreateResponse> {
    await this.validateService.validateDto(payload)
    if (payload.org) {
      const org = await this.org.findById(payload.org)
      if (!org) throw new HttpException(404, 'Org not found')
    }

    await Promise.all(
      payload.products.map(async (e: any) => {
        const product = await this.products
          .findById(e.product)
          .select('org')
          .exec()
        if (!product) {
          throw new HttpException(404, `${e.product} product not found`)
        }
        if (e.amount <= 0) {
          throw new HttpException(
            400,
            `${e.product} product amount not positive`
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

  public async foodUpdate(payload: FoodUpdateRequest): Promise<any> {
    await this.foodRetrieveOne({ id: payload.id })
    const updateObj: any = {}

    if (payload.img) {
      updateObj.img = payload.img
    }

    if (payload.cost) {
      updateObj.cost = payload.cost
    }

    if (payload.category) {
      updateObj.category = payload.category
    }

    if (payload.name) {
      updateObj.name = payload.name
    }

    if ('is_private' in payload) {
      if (typeof payload.is_private === 'boolean') {
        updateObj.is_deleted = payload.is_private
      }
    }

    const updatedFood: any = await this.foods
      .findByIdAndUpdate(payload.id, updateObj, { new: true })
      .select('-createdAt -updatedAt -products')
      .exec()

    if (!updatedFood) throw new HttpException(404, 'Food not found/')

    return {
      _id: updatedFood['_id'],
      name: updatedFood.name,
      cost: updatedFood.cost,
      img: updatedFood.img,
      org: updatedFood.org,
      category: updatedFood.category,
      is_private: updatedFood.is_deleted
    }
  }

  public async foodProductAdd(payload: any) {
    const food: any = await this.foodRetrieveOne({ id: payload.id })
    const product = await this.products.findOne({
      _id: payload.product,
      org: food.org['_id']
    })
    if (!product) throw new HttpException(404, 'Product not found')

    const productIndex = food.products.findIndex(
      (p: any) => p.product['_id'] === payload.product
    )
    if (productIndex !== -1)
      throw new HttpException(400, 'Product already added')
    if (payload.amount <= 0)
      throw new HttpException(400, 'Product amunt should be valid')

    const updatedFood = await this.foods
      .findByIdAndUpdate(
        payload.id,
        {
          $push: {
            products: { product: payload.product, amount: payload.amount }
          }
        },
        { new: true }
      )
      .select('-createdAt -updatedAt')
      .exec()

    return updatedFood
  }

  public async foodProductUpdate(payload: {
    food: string
    product: string
    amount: number
  }) {
    await this.foodRetrieveOne({ id: payload.food })

    const updatedLunch = await this.foods.findOneAndUpdate(
      { _id: payload.food, 'products.product': payload.product },
      { $set: { 'products.$.amount': payload.amount } },
      { new: true }
    )

    return updatedLunch
  }

  public async foodProductDelete(payload: {
    foodId: string
    productId: string
  }) {
    await this.foodRetrieveOne({ id: payload.foodId })

    const productDeleted = await this.foods.findByIdAndUpdate(payload.foodId, {
      $pull: { products: { product: payload.productId } }
    })

    return {
      _id: productDeleted ? productDeleted['_id'] : payload.productId
    }
  }

  public async foodDelete(
    payload: FoodDeleteRequest
  ): Promise<FoodDeleteResponse> {
    await this.foodRetrieveOne({ id: payload.id })

    const food = await this.foods.findByIdAndDelete(payload.id)

    return {
      _id: food ? food['_id'] : payload.id
    }
  }

  public async checkFoodProducts(payload: {
    food: string
    amount: number
  }): Promise<boolean> {
    const food = await this.foods
      .findById(payload.food)
      .select('products')
      .exec()

    if (!food) return false

    for (const e of food.products) {
      const isValid = await this.productService.checkProductAmount({
        product: e.product.toString(),
        amount: e.amount * payload.amount
      })

      if (!isValid) return false
    }

    return true
  }
}
