import type { CreateProductLog } from '../dtos/product-log.dto'
import { productModel, productLogModel } from '@models'
import { HttpException } from '@exceptions'

export class ProductLogService {
  public productLog = productLogModel
  public products = productModel

  public async productLogRetrieveAll(payload: any): Promise<any> {
    const productlogList = await this.productLog.find()

    return {
      count: 1,
      pageSize: 1,
      pageCount: 10,
      pageNumber: 1,
      productlogList: productlogList
    }
  }

  public async productLogRetrieveOne(payload: any): Promise<any> {
    const productlog = await this.productLog.findById(payload.id)
    if (!productlog) throw new HttpException(404, 'Productlog not found')

    return productlog
  }

  public async productLogCreate(payload: any): Promise<any> {
    const product = await this.products
      .findById(payload.product)
      .select('org')
      .exec()
    if (!product) throw new HttpException(404, 'Product not found')

    await this.productLog.create({
      product: product['_id'],
      org: product.org,
      amount: payload.amount,
      cost: payload.cost,
      type: payload.type
    })
  }

  public async productLogUpdate(payload: any): Promise<any> {
    await this.productLogRetrieveOne({ id: payload.id })
  }

  public async productLogDelete(payload: any): Promise<any> {
    await this.productLogRetrieveOne({ id: payload.id })
  }

  public async createLog(logData: CreateProductLog) {
    const { amount, cost, type, product, org } = logData

    const isExist = await this.products.findById(product)

    if (!isExist) throw new HttpException(400, 'product not found')

    const updateProductAmount = await this.products.findOneAndUpdate(
      {
        _id: product
      },
      {
        amount: type ? isExist.amount + amount : isExist.amount - amount
      },
      { new: true }
    )

    console.log(updateProductAmount)

    const newLog = await this.productLog.create({
      amount,
      type,
      cost,
      product,
      org
    })

    return newLog
  }
}

export default ProductLogService
