import FoodService from "../services/food.service";




class FoodController {
  public foodService = new FoodService();

  public getFoods = async() => {
    try {
      const foods = await this.foodService.creatNew()
    } catch (error) {
      
    }
  }
}


export default FoodController;