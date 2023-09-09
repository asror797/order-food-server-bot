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

  public async getUsers(page:number,size:number) {
    const skip = (page - 1) * size

    const users = await this.users.find()
                .select('-updatedAt')
               .skip(skip)
               .limit(size)
               .populate('org')
               .exec();
    return users;
  }

  public async getBalance(telegramID: number):Promise<IUser | null> {
    const user = await this.users.findOne({
      telegram_id: telegramID
    }) 
    return user
  }

  public updateUser(userData:string) {

  }

}


export default UserService;