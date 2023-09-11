import foodModel from "../models/food.model";


class FoodService {
  public foods = foodModel;

  public async getFoods(page: number , size: number) {
    const skip = (page - 1) * size

    const foods = await this.foods.find()
                .select('-updatedAt')
                .skip(skip)
                .limit(size)
                .exec();
    return foods;
  }

  public async creatNew() {

  }

  public async getByCategory(category: string , org: string) {
    const foods = await this.foods.find({
      category: category,
      org: org
    });
    console.log(foods)
    return foods;
  }

}


export default FoodService;