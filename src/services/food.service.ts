import foodModel from "../models/food.model";




class FoodService {
  public foods = foodModel;

  public async getFoods(page: number , size: number) {
    const foods = await this.foods.find()
  }

  public async creatNew() {

  }

}


export default FoodService;