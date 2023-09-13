import userModel from "../models/user.model";
import { ChangeStatus, CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { httException } from "../exceptions/httpException";
import { IUser } from "../interfaces/user.interface";
import { formatPhoneNumber } from "../utils/phoneNumberFormatter";
import botService from "../bot/bot";



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
    const phone_number = formatPhoneNumber(userData.phone_number);
    const newUser = await this.users.create({
      ...userData,
      phone_number
    });
    return newUser;
  }

  public async getUsers(page:number,size:number) {
    const skip = (page - 1) * size

    const users = await this.users.find()
              .select('-updatedAt')
              .skip(skip)
              .limit(size)
              .exec();
    const totalUsers = await this.users.countDocuments().exec()
    const totalPages = Math.ceil(totalUsers / size)
    return {
      data: users,
      currentPage: page,
      totalPages,
      totalUsers,
      usersOnPage: users.length
    };
  }

  public async getBalance(telegramID: number):Promise<IUser | null> {
    const user = await this.users.findOne({
      telegram_id: telegramID
    }) 
    return user
  }

  public async updateUser(userData:UpdateUserDto) {
    botService.sendText(5104936606,"Updayted")
    const updatedUser = await this.users.findByIdAndUpdate(userData['_id'],userData)

    return updatedUser;
  }

  public async sendMessageToUsers(text: string) {
    const users = await this.users.find({
      is_active: true,
      is_verified: true
    })
    // botService.sendText()
    users.map((e) => {
      botService.sendText(e.telegram_id,text)
    });

    return "ok"
  }


  public async changeStatus(userData:ChangeStatus) {
    const { user , type } = userData;
    const isExist = await this.users.findById(user);

    if(!isExist) throw new httException(400,'user not exist');
    if( type == 'verify' ) {  
      return await this.users.findOneAndUpdate(
        {
          _id: user
        },
        {
          is_active: true,
          is_verified: true
        }
      )
    } else {
      return {}
    }
  }

}


export default UserService;