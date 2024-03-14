import { lunchBaseModel, lunchModel, orgModel, productModel } from '@models'
import { HttpException } from '@exceptions'
import { LunchDeleteRequest, LunchUpdateRequest } from '@interfaces'

export class LunchService {
  private lunches = lunchModel
  private orgs = orgModel
  private products = productModel
  private bases = lunchBaseModel

  public async lunchRetrieveAll(payload: any): Promise<any> {
    const query: any = {}
    if (payload.is_bot) {
      query.is_active = true
    }

    if (payload.org) {
      const org = await this.orgs.findById(payload.org)
      if (!org) throw new HttpException(404, 'Org not found')
      query.org = payload.org
    }

    if (payload.lunchbase) {
      const lunchbase = await this.bases.findById(payload.lunchbase)
      if (!lunchbase) throw new HttpException(404, 'Lunchbase not found')
      query.base = payload.lunchbase
    }

    if (payload.search) {
      query.name = { $regex: payload.search, $options: 'i' }
    }

    const lunchList = await this.lunches
      .find(query)
      .skip((payload.pageNumber - 1) * payload.pageSize)
      .limit(payload.pageSize)
      .sort({ createdAt: -1 })
      .populate('base', 'name')
      .select('name cost is_active')
      .exec()

    const count = await this.lunches.countDocuments().exec()

    return {
      count: count,
      pageNumber: payload.pageNumber,
      pageSize: 10,
      pageCount: Math.ceil(count / payload.pageSize),
      lunchList: lunchList.map((e: any) => ({
        _id: e['_id'],
        name: e.name,
        cost: e.cost,
        base: e.base.name,
        is_active: e.is_active
      }))
    }
  }

  public async lunchRetrieveOne(payload: { id: string }): Promise<any> {
    const lunch = await this.lunches
      .findById(payload.id)
      .populate('products.product', 'name cost')
      .populate('org', 'name_org')
      .select('-createdAt -updatedAt')

    if (!lunch) throw new HttpException(404, 'Lunch not found')

    return lunch
  }

  public async lunchCreate(payload: any): Promise<any> {
    console.log(payload)
    const lunchbase = await this.bases.findById(payload.lunchbase)
    if (!lunchbase) throw new HttpException(404, 'Lunchbase not found')

    const org = await this.orgs.findById(payload.org)
    if (!org) throw new HttpException(404, 'Org not found')

    await this.#_lunchNameCheck({ name: payload.name, org: payload.org })

    await Promise.all(
      payload.products.map(async (e: any) => {
        console.log(e)
        const product = await this.products.findById(e.product)
        if (!product) throw new HttpException(404, 'Product not found')

        if (e.amount <= 0) throw new HttpException(404, 'Product amount number')
      })
    )

    const lunch = await this.lunches.create({
      name: payload.name,
      cost: payload.cost,
      org: payload.org,
      base: payload.lunchbase
    })

    return lunch
  }

  public async lunchUpdate(payload: LunchUpdateRequest): Promise<any> {
    await this.lunchRetrieveOne({ id: payload.id })
    const updateObj: any = {}

    if (payload.persent_cook) {
      updateObj.percent_cook = payload.persent_cook
    }

    if (payload.name) {
      updateObj.name = payload.name
    }

    if (payload.is_active) {
      updateObj.is_active = payload.is_active
    }

    if (payload.cost) {
      updateObj.cost = payload.cost
    }
    const updatedProduct = await this.lunches
      .findByIdAndUpdate(payload.id, updateObj, { new: true })
      .select('-createdAt -updatedAt -products')
      .exec()

    return updatedProduct
  }

  public async lunchProductAdd(payload: any) {
    const lunch = await this.lunchRetrieveOne({ id: payload.id })

    const product = await this.products.findOne({
      _id: payload.product,
      org: lunch.org['_id']
    })
    if (!product) throw new HttpException(404, 'Product not found')

    const productIndex = lunch.products.findIndex(
      (p: any) => p.product['_id'] === payload.product
    )
    if (productIndex !== -1)
      throw new HttpException(400, 'Product already added')
    if (payload.amount <= 0)
      throw new HttpException(400, 'Product amunt should be valid')

    const updatedFood = await this.lunches
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

  public async lunchProductUpdate() {}

  public async lunchProductDelete(payload: {
    lunch: string
    product: string
  }) {}

  public async lunchDelete(payload: LunchDeleteRequest): Promise<any> {
    await this.lunchRetrieveOne({ id: payload.id })
    const deletedProduct = await this.lunches.findByIdAndDelete(payload.id)

    return deletedProduct
  }

  async #_lunchNameCheck(payload: { name: string; org: string }) {
    const lunchbase = await this.bases.findOne({
      name: payload.name,
      org: payload.org
    })
    if (lunchbase) throw new HttpException(400, 'Name already used')
  }
}
