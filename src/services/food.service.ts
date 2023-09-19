import { CreateFood, GetFoods } from "../dtos/food.dto";
import { httException } from "../exceptions/httpException";
import foodModel from "../models/food.model";
import productModel from "../models/product.model";


class FoodService {
  public foods = foodModel;
  public products = productModel;

  public async getFoods(page: number , size: number) {
    const skip = (page - 1) * size

    const foods = await this.foods.find()
              .select('-updatedAt')
              .skip(skip)
              .limit(size)
              .populate('products.product','name cost')
              .populate('org','name_org')
              .exec();
    const totalFoods = await this.foods.countDocuments().exec()
    const totalPages = Math.ceil(totalFoods / size)
    const formattedFoods = foods.map(food => ({
      ...food.toObject(), 
      products: food.products.map(productItem => ({
        product: productItem.product,
        amount: productItem.amount,
      })),
    }));

    return {
      data: formattedFoods,
      currentPage: page,
      totalPages,
      totalFoods,
      foodsOnPage: formattedFoods.length
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

}


export default FoodService;