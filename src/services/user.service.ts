import { CreateUserDto } from "../dtos/user.dto";
import { IUser } from "../interfaces/user.interface";
import userModel from "../models/user.model";



class UserService {

  private users = userModel;

  public async isExist(telegramID: number) {
    const isExist = await this.users.findOne({
      telegram_id: telegramID
    });

    if(isExist) {
      return {
        data: isExist,
        message:"user exist",
      };
    } else {
      return {
        data: null,
        message:"user not found",
      }
    }
  }

  public async registirNewUser(userData: CreateUserDto ) {
    const newUser = await this.users.create(userData);
    return newUser;
  }

  public async getAll() {
    const allUsers = await this.users.find().exec();

    return allUsers;
  }

  public async getBalance(telegramID: number):Promise<IUser | null> {
    const user = await this.users.findOne({
      telegram_id: telegramID
    }) 
    return user
  }

}


export default UserService;