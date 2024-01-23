import { lunchBaseModel, lunchModel, orgModel, productModel } from '@models'
import { CreateLunch, LunchUpdateDto, PushProductDto } from '../dtos/lunch.dto'
import { HttpException } from '@exceptions'

export class LunchService {
  public lunches = lunchModel
  public orgs = orgModel
  public products = productModel
  public bases = lunchBaseModel

  public async getLunches(page: number, size: number) {
    const skip = (page - 1) * size

    const Lunches = await this.lunches
      .find()
      .select('-updatedAt')
      .skip(skip)
      .limit(size)
      .populate('org', 'name_org')
      .populate('base', 'name')
      .populate('products.product', 'name cost')
      .exec()
    const totalLunches = await this.lunches.countDocuments().exec()
    const totalPages = Math.ceil(totalLunches / size)
    return {
      data: Lunches,
      currentPage: page,
      totalPages,
      totalLunches,
      productsOnPage: Lunches.length,
    }
  }

  public async getById(lunch: string) {
    return await this.lunches.findById(lunch)
  }

  public async getByOrg(org: string) {
    const lunches = await this.lunches.find({
      org: org,
    })

    return lunches
  }

  public async getByBase(base: string) {
    const lunches = await this.lunches
      .find({
        base: base,
      })
      .populate('products.product', 'name cost')
      .select('name cost percent_cook products.amount')

    return lunches
  }

  public async getLunchByBase(lunch: string) {
    const Lunch = await this.lunches
      .findById({
        _id: lunch,
      })
      .populate('products.product', 'name cost')
      .populate('base', 'name')
      .select('name cost percent_cook products.amount')

    return Lunch
  }

  public async deleteLunch(id: string) {
    const Lunch = await this.lunches.findById(id)
    if (!Lunch) throw new HttpException(400, 'not found lunch')
    const deletedLunch = await this.lunches
      .deleteOne(
        {
          _id: Lunch['_id'],
        },
        { new: true },
      )
      .exec()

    return deletedLunch
  }

  public async createLunch(payload: CreateLunch) {
    const Base = await this.bases.findById(payload.base)
    if (!Base) throw new HttpException(400, 'lunch base not found')

    console.log(payload)

    const newLunch = await this.lunches.create({
      ...payload,
      base: payload.base,
      org: Base.org,
      cost: payload.cost,
      name: payload.name,
      products: payload.products ?? [],
    })
    return newLunch
  }

  public async updateLunch(payload: LunchUpdateDto) {
    const updateObj: any = {}
    const Lunch = await this.lunches.findById(payload.id)

    if (!Lunch) throw new HttpException(400, 'lunch not found')

    if (payload.org) {
      const Org = await this.orgs.findById(payload.org)
      if (!Org) throw new HttpException(400, 'org not found')
      updateObj.org = payload.org
    }

    if (payload.base) {
      const Base = await this.bases.findById(payload.base)
      if (!Base) throw new HttpException(400, 'base not found')
      updateObj.base = payload.base
    }
    if (payload.cost) {
      updateObj.cost = payload.cost
    }
    if (payload.name) {
      updateObj.name = payload.name
    }

    if (payload.percent_cook) {
      updateObj.percent_cook = payload.percent_cook
    }

    const updatedLunch = await this.bases.findByIdAndUpdate(
      payload.id,
      updateObj,
      { new: true },
    )

    return updatedLunch
  }

  public async pushProduct(lunchData: PushProductDto) {
    interface IProducts {
      product: string
      amount: number
    }
    const lunch = lunchData.lunch
    const addProducts: IProducts[] = []

    const Lunch = await this.lunches.findById(lunch)

    if (!Lunch) throw new HttpException(400, 'lunch not found')

    for (let i = 0; i < lunchData.products.length; i++) {
      const product = lunchData.products[i]
      const Product = await this.products.findById(product.product)
      if (!Product) throw new HttpException(400, 'Product not found')

      if (Lunch.products.length > 0) {
        for (let j = 0; j < Lunch.products.length; j++) {
          const jproduct = Lunch.products[j]
          console.log('j', jproduct)
          if (product.product == jproduct.product)
            throw new HttpException(
              400,
              `${jproduct.product} product already exist`,
            )
          if (product.amount < 0)
            throw new HttpException(400, 'amount should be higher than 0')
          addProducts.push({
            product: product.product,
            amount: product.amount,
          })
        }
      } else {
        if (product.amount <= 0)
          throw new HttpException(400, 'amount should be higher than 0')
        let isExist: boolean = false
        addProducts.map((e) => {
          if (e.product == product.product) {
            isExist = true
          }
        })

        if (!isExist) {
          addProducts.push({
            product: product.product,
            amount: product.amount,
          })
        }
      }
    }

    const updatedProduct = await this.lunches
      .findByIdAndUpdate(
        lunch,
        {
          $addToSet: { products: { $each: addProducts } },
        },
        { new: true },
      )
      .exec()

    return updatedProduct
  }

  public async fullUpdateProduct(payload: any) {
    const lunch = payload.lunch
    interface IProducts {
      product: string
      amount: number
    }
    const addingPorducts: IProducts[] = []
    const updatingProducts: IProducts[] = []

    const Lunch = await this.lunches.findById(lunch)
    if (!Lunch) throw new HttpException(400, 'not found lunch')

    for (let i = 0; i < payload.products.length; i++) {
      const uProduct = payload.products[i]
      for (let j = 0; j < Lunch.products.length; j++) {
        const eProduct = Lunch.products[j]

        if (uProduct.product == eProduct.product) {
          if (uProduct.amount < 0 || uProduct.amount == eProduct.amount)
            throw new HttpException(400, 'amount should be valid')
          updatingProducts.push({
            product: uProduct.product,
            amount: uProduct.amount,
          })
        }
      }
    }

    for (let i = 0; i < payload.products.length; i++) {
      const aProduct = payload.products[i]
      let isExist: boolean = false

      for (let j = 0; j < Lunch.products.length; j++) {
        const element = Lunch.products[j]

        if (element.product == aProduct.product) {
          isExist = true
        }
      }
      if (isExist == false) {
        addingPorducts.push({
          ...aProduct,
        })
      }
    }

    const response: any = []
    let addedProducts: any = {}

    if (addingPorducts.length > 0) {
      addedProducts = await this.lunches
        .findByIdAndUpdate(
          lunch,
          {
            $addToSet: { products: { $each: addingPorducts } },
          },
          { new: true },
        )
        .exec()
    }

    for (const UProduct of updatingProducts) {
      const updatedProduct = await this.lunches
        .updateOne(
          {
            _id: lunch,
            'products.product': UProduct.product,
          },
          {
            $set: { 'products.$.amount': UProduct.amount },
          },
        )
        .exec()

      if (updatedProduct.modifiedCount > 0) {
        response.push(UProduct)
      }
    }

    return {
      added: addedProducts.products,
      updated: response,
    }
  }

  public async fullUpdateLunch(payload: any) {
    const updateObj: any = {}

    const Lunch = await this.lunches.findById(payload.id)
    if (!Lunch) throw new HttpException(400, 'lunch not found')

    if (payload.org) {
      const Org = await this.orgs.findById(payload.org)
      if (!Org) throw new HttpException(400, 'org not found')
      updateObj.org = payload.org
    }

    if (payload.base) {
      const Base = await this.bases.findById(payload.base)
      if (!Base) throw new HttpException(400, 'base not found')
      updateObj.base = payload.base
    }
    if (payload.cost) {
      updateObj.cost = payload.cost
    }
    if (payload.name) {
      updateObj.name = payload.name
    }

    if (payload.percent_cook) {
      updateObj.percent_cook = payload.percent_cook
    }

    const updatedLunch = await this.bases.findByIdAndUpdate(
      payload.id,
      updateObj,
      { new: true },
    )

    if (payload.products) {
      await this.pushProduct({
        lunch: payload.id,
        products: payload.products,
      })
    }

    return updatedLunch
  }

  public async updateProduct(payload: any) {
    const lunch = payload.lunch
    interface IProducts {
      product: string
      amount: number
    }
    const updateProducts: IProducts[] = []
    const Lunch = await this.lunches.findById(lunch)
    const response: any = []
    if (!Lunch) throw new HttpException(400, 'lunch not found')
    for (let j = 0; j < payload.products.length; j++) {
      const uProduct = payload.products[j]
      for (let i = 0; i < Lunch.products.length; i++) {
        const product = Lunch.products[i]
        if (uProduct.product == product.product) {
          if (uProduct.amount > 0) {
            updateProducts.push({
              product: uProduct.product,
              amount: uProduct.amount,
            })
          } else {
            throw new HttpException(
              400,
              `${uProduct.product} product amount should be higher than 0`,
            )
          }
        }
      }
    }
    for (const UProduct of updateProducts) {
      const updatedProduct = await this.lunches
        .updateOne(
          {
            _id: lunch,
            'products.product': UProduct.product,
          },
          {
            $set: { 'products.$.amount': UProduct.amount },
          },
        )
        .exec()

      if (updatedProduct.modifiedCount > 0) {
        response.push(UProduct)
      }
    }
    return response
  }

  public async deleteProductOfLunch(payload: any) {
    const { lunch, product } = payload

    const Lunch = await this.lunches.findById(lunch)
    if (!Lunch) throw new HttpException(400, 'not found lunch')

    const updatedOrder = await this.lunches.findByIdAndUpdate(
      lunch,
      { $pull: { products: { product: product } } },
      { new: true },
    )

    return updatedOrder
  }
}
