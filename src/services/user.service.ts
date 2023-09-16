import userModel from "../models/user.model";
import { ChangeOrg, ChangeStatus, CreateUserDto, SendMessae, UpdateUserDto } from "../dtos/user.dto";
import { httException } from "../exceptions/httpException";
import { IUser } from "../interfaces/user.interface";
import { formatPhoneNumber } from "../utils/phoneNumberFormatter";
import botService from "../bot/bot";
import orgModel from "../models/org.model";



class UserService {

  private users = userModel;
  private orgs = orgModel;

  public async isExist(telegramID: number) {
    const isExist = await this.users.findOne({
      telegram_id: telegramID
    }).populate('org','name_org group_a_id group_b_id')

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
              .populate('org','name_org')
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
    const { _id , last_name , first_name , org , is_active , is_verified , type } = userData;

    if(type == 'verify') {
      const updatedUser = await this.users.findByIdAndUpdate(userData['_id'],{ is_verified: true , is_active: true }, { new: true });

      return updatedUser;
    } else if (type == 'status') {
      
      if(is_active == true ) {
        const updateUser =  await this.users.findByIdAndUpdate(_id,{is_active: true} , { new: true});
        return updateUser;
      } else if(is_active == false) {
        const updateUser =  await this.users.findByIdAndUpdate(_id,{is_active: false} , { new: true});
        return updateUser;
      } else {
        return {
          message:"ok",
          status:200
        }
      }
      
    }
  }

  public async sendMessageToUsers(msgData: SendMessae) {

    const { org , message } = msgData

    if(org == 'all' || org == null) {
      const users = await this.users.find({
        is_active: true,
        is_verified: true
      })
      users.map((e) => {
        botService.sendText(e.telegram_id,message)
      });
  
      return {
        message:"sent",
        status:200
      }
    } else {
      const Org = await this.orgs.findById(org)
      if(Org) throw new httException(400,'org not found')
      const users = await this.users.find({
        is_active: true,
        is_verified: true,
        org: org
      })
      users.map((e) => {
        botService.sendText(e.telegram_id,message)
      });
      return {
        message:"ok",
        status:"ok"
      }
    }
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

  public async ChangeOrg(userData:ChangeOrg) {
    const { user , org } = userData;

    const Org = await this.orgs.findById(org);
    const User = await this.users.findById(user);

    if(!User) throw new httException(400,'user not found')

    if(!Org) throw new httException(400,'org not found')

    const updatedUser = await this.users.findByIdAndUpdate(user,{
      org: org
    },{ new: true });

    return updatedUser;
  }

  public async transitPayment(userData:any) {
    const { type , amount , user } = userData 

    const User = await this.users.findById(user);

    if(!User) throw new httException(400,'user not found');

    if(type == 'increase') {
      const updateduser = await this.users.findByIdAndUpdate(user,{
        balance: User.balance + Number(amount)
      },{ new: true });
      return updateduser;
    } else if(type == 'decrease') {
      if(User.balance < amount ) throw new httException(200,'you cant');
      const updateduser = await this.users.findByIdAndUpdate(user,{
        balance: User.balance - Number(amount)
      },{ new: true });
      return updateduser;
    } else {
      return {
        message:"something is missing",
        status:200
      }
    }
  }

  public async transaction(userData:any) {
    const { telegram_id , type , amount } = userData
    const user = await this.users.findOne({
      telegram_id: telegram_id
    });
    if(!user) throw new Error('user not found');
    if(user.balance < amount && type == false ) throw new Error('');
    if(type == true) {
    } else if(type == false) {
    }
  }

}


export default UserService;