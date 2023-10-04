import { CreateFood, GetFoods } from "../dtos/food.dto";
import { httException } from "../exceptions/httpException";
import foodModel from "../models/food.model";
import productModel from "../models/product.model";
import ProductLogService from "./product-log.service";


class FoodService {
  public foods = foodModel;
  public products = productModel;
  public productLog = new ProductLogService()

  public async getFoods(payload: any) {
    const { page, size, search } = payload
    const skip = (page - 1) * size

    if (!search || search.trim() === "") {
      const foods = await this.foods
        .find()
        .populate('org', 'name_org')
        .populate('products.product','name cost')
        .skip((page - 1) * size)
        .limit(size)
        .exec();

      const totalFoods = await this.foods.countDocuments().exec()
      const totalPages = Math.ceil(totalFoods / size)
      return {
        data: foods,
        currentPage: page,
        totalPages,
        totalFoods,
        foodsOnPage: foods.length
      };
    }

    const re = new RegExp(search, "i");
    const foods = await this.foods
      .find({
        $or: [
          { name: { $regex: re } },
        ]
      })
      .populate('org', 'name_org')
      .populate('products.product','name cost')
      .skip(skip)
      .limit(size)
      .exec();

    const totalFoods = await this.foods.countDocuments().exec()
    const totalPages = Math.ceil(totalFoods / size)

    return {
      data: foods,
      currentPage: page,
      totalPages,
      totalFoods,
      foodsOnPage: foods.length
    };
  }

  public async getFoodsForBot(getFood:GetFoods) {
    const { page, size , org , category } = getFood;
    const foods = await this.foods.find({
      org: org,
      category: category
    }).exec();
    console.log(foods)

    return foods;
  }

  public async DecreaseProductsOfFood(payload:any) {
    const { food, amount } = payload

    const Food = await this.foods.findById(food).populate('products.product').exec()

    if(!Food) throw new httException(400,'not found food')

    const products = Food.products

    for (let i = 0; i < products.length; i++) {
      const orderFood:any = products[i]
      await this.productLog.createLog({
        amount: amount * orderFood.amount,
        product: orderFood.product['_id'].toString(),
        type: false,
        cost: orderFood.product.cost,
        org: Food.org
      })
    }
    return "ok"

  } 


  public async creatNew(foodData:CreateFood) {
    const { name , org , cost , category , products } = foodData;

    const productObjects = []

    for (const {  product,  amount } of products) {
      const Product = await this.products.findById(product);

      if(!Product) throw new httException(400,`Product with ID ${product} not found`);

      productObjects.push({ product: Product['_id'] , amount: amount});
      
    }

    const newFood = await this.foods.create({
      name,
      cost,
      org,
      category,
      products: productObjects,
    });


    return newFood;
  }

  public async getByCategory(category: string , org: string) {
    const foods = await this.foods.find({
      category: category,
      org: org
    });
    console.log(foods)
    return foods;
  }

  public async getById(id: string) {
    const food = await this.foods.findById(id).exec();

    if(!food) throw new httException(400,`${id} id  food not found`)

    return food;
  }

  public async updatePic(foodData:any) {
    const { food , image } = foodData

    const isExist = await this.foods.findById(food)

    if(!isExist) throw new httException(400,'food not found')

    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    if(!urlPattern.test(image)) throw new httException(400,'image should be link')

    const updatedFood = await this.foods.findByIdAndUpdate(food,{
      img: image
    },{ new: true })

    if(!updatedFood) throw new httException(500,'something went wrong')

    return {
      _id: updatedFood['_id'],
      name: updatedFood.name,
      cost: updatedFood.cost,
      category: updatedFood.category
    }
  }

}


export default FoodService;