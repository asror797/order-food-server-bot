import { CreateProduct, UpdateAmount } from '@dtos'
import { HttpException } from '@exceptions'
import { productModel } from '@models'
import {
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
  private products = productModel

  public async productRetrieveAll(
    payload: ProductRetrieveAllRequest
  ): Promise<ProductRetrieveAllResponse> {
    const productList = await this.products
      .find()
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
        org: e.org.name_org,
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
    if (!product) throw new HttpException(400, 'notFoundprod')

    return product
  }

  public async productCreate(
    payload: ProductCreateRequest
  ): Promise<ProductCreateResponse> {
    await this.#_checkProductName({ name: payload.name, org: payload.org })

    const product = await this.products.create({
      name: payload.name,
      org: payload.org,
      cost: payload.cost,
      unit: payload.unit
    })
    return product
  }

  public async productUpdate(payload: ProductUpdateRequest) {
    await this.productRetrieveOne({ id: payload.id })

    const updatedProduct = await this.products.findByIdAndUpdate(payload.id, {})

    return updatedProduct
  }

  public async productDelete(payload: ProductDeleteRequest) {
    await this.productRetrieveOne({ id: payload.id })

    const deletedProduct = await this.products.findByIdAndRemove(payload.id)

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

    return !!product
  }
}

export default ProductService
