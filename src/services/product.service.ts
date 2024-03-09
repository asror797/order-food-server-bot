import { CreateProduct, UpdateAmount } from '../dtos/product.dto'
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
      .populate('org', 'name_org')
      .exec()

    const count = await this.products.countDocuments()

    return {
      count: count,
      pageCount: 4,
      pageNumber: 1,
      pageSize: 10,
      productList: productList
    }
  }

  public async productRetrieveOne(
    payload: ProductRetrieveOneRequest
  ): Promise<ProductRetrieveOneResponse> {
    const product = await this.products.findById(payload.id)
    if (!product) throw new HttpException(400, 'notFoundprod')

    return product
  }

  public async productCreate(
    payload: ProductCreateRequest
  ): Promise<ProductCreateResponse> {
    await this.#_checkProductName({ name: payload.name, org: payload.org })

    const product = await this.products.create({
      name: payload.name,
      org: payload.name,
      cost: ''
    })
    return product
  }

  public async productUpdate(payload: ProductUpdateRequest) {
    await this.productRetrieveOne({id: payload.id})

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
  }): Promise<any> {
    console.log(payload)
    return true
  }

  public async checkProductAmount(payload: { product: string; amount: number}): Promise<boolean> {
    const product = await this.products.findOne({
      _id: payload.product,
      amount: { $gte: payload.amount }
    })

    return !!product
  }

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
        productsOnPage: products.length
      }
    }

    const re = new RegExp(search, 'i')
    const products = await this.products
      .find({
        $or: [{ name: { $regex: re } }]
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
      productsOnPage: products.length
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

    if (!isExist) throw new HttpException(200, 'product not found')

    const updatedproduct = await this.products.findByIdAndUpdate(
      product,
      {
        amount: Number(isExist.amount) + Number(amount),
        cost: cost
      },
      { new: true }
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
          unit: payload.unit
        },
        { new: true }
      )
      .exec()

    return newUpdate
  }

  public async decreaseAmount(productData: UpdateAmount) {
    const { product, amount } = productData

    const isExist = await this.products.findById(product)

    if (!isExist) throw new HttpException(200, 'product not found')

    if (Number(isExist.amount < Number(amount)))
      throw new HttpException(200, 'amount dont decrease')

    const updatedProduct = await this.products.findByIdAndUpdate(
      product,
      { amount: Number(isExist.amount) - Number(amount) },
      { new: true }
    )

    return updatedProduct
  }
}

export default ProductService
