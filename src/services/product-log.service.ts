import productLogModel from "../models/productlog.model"
import type { CreateProductLog } from "../dtos/product-log.dto"
import productModel from "../models/product.model"
import { httException } from "../exceptions/httpException"


class ProductLogService {
  public productLog = productLogModel
  public products = productModel

  public async createLog(logData:CreateProductLog) {
    const { amount, cost, type, product, org } = logData

    const isExist = await this.products.findById(product)
    
    if(!isExist) throw new httException(400,'product not found')

    const newLog = await this.productLog.create({
      amount,
      type,
      cost,
      product,
      org
    });

    return newLog
  }
}

export default ProductLogService