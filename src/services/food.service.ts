import { CreateFood, GetFoods, UpdateFoodDto } from '../dtos/food.dto'
import { httException } from '@exceptions'
import { IFood } from '../interfaces/food.interface'
import { foodModel, productModel, orgModel } from '@models'
import { ProductService, ProductLogService } from '@services'

export class FoodService {
  public foods = foodModel
  public products = productModel
  public productLog = new ProductLogService()
  public productService = new ProductService()
  public org = orgModel

  public async getFoods(payload: any) {
    const { page, size, search } = payload
    const skip = (page - 1) * size

    if (!search || search.trim() === '') {
      const foods = await this.foods
        .find()
        .populate('org', 'name_org')
        .populate('products.product', 'name cost')
        .skip((page - 1) * size)
        .limit(size)
        .exec()

      const totalFoods = await this.foods.countDocuments().exec()

      return {
        data: foods,
        currentPage: page,
        totalPages: Math.ceil(totalFoods / size),
        totalFoods,
        foodsOnPage: foods.length,
      }
    }

    const re = new RegExp(search, 'i')
    const foods = await this.foods
      .find({
        $or: [{ name: { $regex: re } }],
      })
      .populate('org', 'name_org')
      .populate('products.product', 'name cost')
      .skip(skip)
      .limit(size)
      .exec()

    const totalFoods = await this.foods.countDocuments().exec()
    const totalPages = Math.ceil(totalFoods / size)

    return {
      data: foods,
      currentPage: page,
      totalPages,
      totalFoods,
      foodsOnPage: foods.length,
    }
  }

  public async getFoodsForBot(getFood: GetFoods) {
    const { org, category } = getFood
    const foods = await this.foods
      .find({
        org: org,
        category: category,
        $or: [{ is_deleted: false }, { is_deleted: { $exists: false } }],
      })
      .exec()

    const availableFoods = []

    for (let i = 0; i < foods.length; i++) {
      const food = foods[i]

      if (food.products.length > 0) {
        for (let j = 0; j < food.products.length; j++) {
          const product = food.products[j]

          const statusProduct = await this.productService.checkAmountProduct({
            product: product.product['_id'],
            amount: product.amount,
          })

          if (statusProduct) {
            availableFoods.push(food)
          }
        }
      }
    }

    return availableFoods
  }

  public async DecreaseProductsOfFood(payload: any) {
    const { food, amount } = payload

    const Food = await this.foods
      .findById(food)
      .populate('products.product')
      .exec()

    if (!Food) throw new httException(400, 'not found food')

    const products = Food.products

    for (let i = 0; i < products.length; i++) {
      const orderFood: any = products[i]
      await this.productLog.createLog({
        amount: amount * orderFood.amount,
        product: orderFood.product['_id'].toString(),
        type: false,
        cost: orderFood.product.cost,
        org: Food.org,
      })
    }
    return 'ok'
  }

  public async creatNew(foodData: CreateFood) {
    const { name, org, cost, category, products } = foodData

    const productObjects = []

    for (const { product, amount } of products) {
      const Product = await this.products.findById(product)

      if (!Product)
        throw new httException(400, `Product with ID ${product} not found`)

      productObjects.push({ product: Product['_id'], amount: amount })
    }

    const newFood = await this.foods.create({
      name,
      cost,
      org,
      category,
      products: productObjects,
    })

    return newFood
  }

  public async getByCategory(category: string, org: string) {
    const foods = await this.foods.find({
      category: category,
      org: org,
    })
    console.log(foods)
    return foods
  }

  public async getById(id: string) {
    const food = await this.foods.findById(id).exec()

    if (!food) throw new httException(400, `${id} id  food not found`)

    return food
  }

  public async updatePic(foodData: any) {
    const { food, image } = foodData

    const isExist = await this.foods.findById(food)

    if (!isExist) throw new httException(400, 'food not found')

    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    if (!urlPattern.test(image))
      throw new httException(400, 'image should be link')

    const updatedFood = await this.foods.findByIdAndUpdate(
      food,
      {
        img: image,
      },
      { new: true },
    )

    if (!updatedFood) throw new httException(500, 'something went wrong')

    return {
      _id: updatedFood['_id'],
      name: updatedFood.name,
      cost: updatedFood.cost,
      category: updatedFood.category,
    }
  }

  public async changeStatus(payload: any) {
    const { id, status } = payload
    const food = await this.foods.findById(id)

    if (!food) throw new httException(400, 'not found food')

    const updatedFood = await this.foods.findByIdAndUpdate(
      id,
      { is_deleted: status },
      { new: true },
    )

    return {
      _id: updatedFood ? updatedFood['_id'] : '',
      name: updatedFood?.name,
    }
  }

  public async updateFood(payload: UpdateFoodDto) {
    const { food, cost, name, category, org, is_deleted, img } = payload

    const updateData = {
      ...(org !== undefined && { org }),
      ...(cost !== undefined && { cost }),
      ...(category !== undefined && { category }),
      ...(is_deleted !== undefined && { is_deleted }),
      ...(img !== undefined && { img }),
      ...(name !== undefined && { name }),
    }

    if (updateData.org) {
      const isExist = await this.org.findById(org)
      if (!isExist) throw new httException(400, 'org not found')
    }

    const updatedFood = await this.foods
      .findByIdAndUpdate(food, updateData, { new: true })
      .exec()

    if (!updatedFood) throw new httException(500, 'something went wrong')

    // delete updatedFood.products

    return updatedFood
  }

  public async updateProductFood(payload: any) {
    const { food, products } = payload

    const Food = await this.foods.findById(food)

    if (!Food) throw new httException(400, 'food not found')

    for (let i = 0; i < products.length; i++) {
      const productWithAmount = products[i]

      const Product = await this.products.findById(productWithAmount.product)
      if (!Product) throw new httException(400, 'product not found')
      if (productWithAmount.amount == 0) {
      } else if (productWithAmount.amount > 0) {
      } else {
        throw new httException(400, 'amount is not valid')
      }
    }
  }

  // delete
  public async deleteProduct(payload: any) {
    const { food, product } = payload

    const Food = await this.getFoodById(food)

    const isProductInArray = Food.products.some(
      (item) => item.product == product.id,
    )

    if (!isProductInArray) throw new httException(400, 'product not found')

    const updatedFood = await this.foods.findByIdAndUpdate(
      food,
      { $pull: { products: { product: product.id } } },
      { new: true },
    )
    return updatedFood
  }
  // update | add or remove amount
  // public async updateProduct(payload: any) {
  //   const { food, product } = payload
  // }
  // add  new product with amount
  // public async addProduct(payload: any) {
  //   const { food, product } = payload
  // }

  public async getFoodById(id: string): Promise<IFood> {
    const Food = await this.foods.findById(id)
    if (!Food) throw new httException(400, 'food not found')
    return Food
  }
}
