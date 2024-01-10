import { CreateProduct, UpdateAmount } from '../dtos/product.dto'
import { httException } from '@exceptions'
import { productModel } from '@models'

export class ProductService {
  public products = productModel

  public async getProducts(payload: any) {
    const { page, size, search } = payload
    const skip = (page - 1) * size

    if (!search || search.trim() === '') {
      const products = await this.products
        .find()
        .populate('org', 'name_org')
        .skip((page - 1) * size)
        .limit(size)
        .exec()

      const totalProducts = await this.products.countDocuments().exec()
      const totalPages = Math.ceil(totalProducts / size)
      return {
        data: products,
        currentPage: page,
        totalPages,
        totalProducts,
        productsOnPage: products.length,
      }
    }

    const re = new RegExp(search, 'i')
    const products = await this.products
      .find({
        $or: [{ name: { $regex: re } }],
      })
      .populate('org', 'name_org')
      .skip(skip)
      .limit(size)
      .exec()

    const totalProducts = await this.products.countDocuments().exec()
    const totalPages = Math.ceil(totalProducts / size)
    return {
      data: products,
      currentPage: page,
      totalPages,
      totalProducts,
      productsOnPage: products.length,
    }
  }

  public async createNew(productData: CreateProduct) {
    console.log(productData)
    const newProduct = await this.products.create(productData)

    return newProduct
  }

  public async increaseAmount(productData: UpdateAmount) {
    const { product, amount, cost } = productData

    const isExist = await this.products.findById(product)

    if (!isExist) throw new httException(200, 'product not found')

    const updatedproduct = await this.products.findByIdAndUpdate(
      product,
      {
        amount: Number(isExist.amount) + Number(amount),
        cost: cost,
      },
      { new: true },
    )

    return updatedproduct
  }

  public async checkAmountProduct(payload: any) {
    const { product, amount } = payload

    const Product = await this.products.findById(product)

    if (!Product) {
      return false
    }

    if (Product.amount >= amount) {
      return true
    }

    if (Product.amount < amount) {
      return false
    }
  }

  public async updateProduct(payload: any) {
    const newUpdate = await this.products
      .findByIdAndUpdate(
        payload.product,
        {
          name: payload.name,
          unit: payload.unit,
        },
        { new: true },
      )
      .exec()

    return newUpdate
  }

  public async decreaseAmount(productData: UpdateAmount) {
    const { product, amount } = productData

    const isExist = await this.products.findById(product)

    if (!isExist) throw new httException(200, 'product not found')

    if (Number(isExist.amount < Number(amount)))
      throw new httException(200, 'amount dont decrease')

    const updatedProduct = await this.products.findByIdAndUpdate(
      product,
      { amount: Number(isExist.amount) - Number(amount) },
      { new: true },
    )

    return updatedProduct
  }
}

export default ProductService
