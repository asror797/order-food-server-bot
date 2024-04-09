import { orgModel, productModel } from '@models'
import { ProductLogService } from '@services'
import { HttpException } from '@exceptions'
import {
  ProductChangeAmountRequest,
  ProductCreateRequest,
  ProductCreateResponse,
  ProductDeleteRequest,
  ProductRetrieveAllRequest,
  ProductRetrieveAllResponse,
  ProductRetrieveOneRequest,
  ProductRetrieveOneResponse,
  ProductUpdateRequest
} from '@interfaces'

export class ProductService {
  private productlogService = new ProductLogService()
  private products = productModel
  private orgs = orgModel

  public async productRetrieveAll(
    payload: ProductRetrieveAllRequest
  ): Promise<ProductRetrieveAllResponse> {
    const query: any = {}

    if (payload.search) {
      query.name = { $regex: new RegExp(payload.search, 'i') }
    }

    if (payload.org) {
      const org = await this.orgs.findById(payload.org)
      if (!org) {
        throw new HttpException(404, 'Org not found')
      }
      query.org = payload.org
    }


    const productList = await this.products
      .find(query)
      .skip((payload.pageNumber - 1) * payload.pageSize)
      .limit(payload.pageSize)
      .sort({ createdAt: -1 })
      .populate('org', 'name_org')
      .exec()

    const count = await this.products.countDocuments()

    return {
      count: count,
      pageCount: 4,
      pageNumber: 1,
      pageSize: 10,
      productList: productList.map((e: any) => ({
        _id: e['_id'],
        name: e.name,
        cost: e.cost,
        org: e.org ? e.org.name_org : null,
        amount: e.amount,
        unit: e.unit,
        min_amount: e.min_amount
      }))
    }
  }

  public async productRetrieveOne(
    payload: ProductRetrieveOneRequest
  ): Promise<ProductRetrieveOneResponse> {
    const product = await this.products
      .findById(payload.id)
      .select('name cost amount org')
    if (!product) throw new HttpException(400, 'Not found product')

    return product
  }

  public async productCreate(
    payload: ProductCreateRequest
  ): Promise<ProductCreateResponse> {
    await this.#_checkProductName({ name: payload.name, org: payload.org })
    const org = await this.orgs.findById(payload.org)
    if (!org) throw new HttpException(404, 'Product not found')

    const product = await this.products.create({
      name: payload.name,
      org: payload.org,
      cost: payload.cost,
      unit: payload.unit
    })
    return product
  }

  public async productChangeAmount(payload: ProductChangeAmountRequest):Promise<void> {
    const product = await this.productRetrieveOne({ id: payload.id })

    if (payload.type) {
      await this.products.updateOne({ _id: payload.id }, { amount: product.amount + payload.amount }).exec()

      await this.productlogService.productLogCreate({
        product: payload.id,
        type: payload.type,
        amount: payload.amount,
        cost: payload.cost
      })
    }

    if (!payload.type) {
      await this.products.updateOne({ _id: payload.id }, { amount: product.amount - payload.amount }).exec()

      await this.productlogService.productLogCreate({
        product: payload.id,
        type: payload.type,
        amount: payload.amount,
        cost: payload.cost
      })
    }
  }

  public async productUpdate(payload: ProductUpdateRequest) {
    await this.productRetrieveOne({ id: payload.id })
    const updateObj: any = {}

    if (payload.org) {
      const org = await this.orgs.findById(payload.org)
      if (!org) throw new HttpException(404, 'Org not found')
      updateObj.org = payload.org
    }

    if (payload.name) {
      updateObj.name = payload.name
    }

    if (payload.cost) {
      updateObj.cost = payload.cost
    }

    if (payload.min_amount) {
      updateObj.min_amount = payload.min_amount
    }

    const updatedProduct = await this.products.findByIdAndUpdate(payload.id, updateObj)

    return updatedProduct
  }

  public async productDelete(payload: ProductDeleteRequest) {
    await this.productRetrieveOne({ id: payload.id })

    const deletedProduct = await this.products.findByIdAndRemove(payload.id).exec()

    return deletedProduct
  }

  async #_checkProductName(payload: {
    name: string
    org: string
  }): Promise<void> {
    const product = await this.products
      .findOne({
        name: payload.name,
        org: payload.org
      })
      .select('name')
      .exec()

    if (product) throw new HttpException(400, 'Product name already used')
  }

  public async checkProductAmount(payload: {
    product: string
    amount: number
  }): Promise<boolean> {
    const product = await this.products.findOne({
      _id: payload.product,
      amount: { $gte: payload.amount }
    })

    console.log('ProductService product:', product)

    return !!product
  }
}

export default ProductService
