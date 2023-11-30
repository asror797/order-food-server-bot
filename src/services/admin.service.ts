import { AdminLoginDto, CreateAdmin } from "../dtos/admin.dto";
import { httException } from "../exceptions/httpException";
import adminModel from "../models/admin.model";
import jwt from "jsonwebtoken";

class AdminService {
  public admins = adminModel;

  public async getAdmins() {
    return await this.admins.find().populate('org','name_org')
  }

  public async createAdmin(adminData:CreateAdmin) {
    const newAdmin = await this.admins.create(adminData);
    return newAdmin;
  }

  public async loginAdmin(adminData:AdminLoginDto) {
    const { password, phone_number } = adminData;

    let admin: any = await this.admins.find({
      phone_number: phone_number
    });

    if(admin.length >= 0) {
      admin = admin[0]
    }

    if(!admin) throw new httException(400,'user not found');

    console.log(admin)
    if(admin.password != password ) {
      throw new httException(400,'password or phone_number wrong')
    }
    return {
      token: jwt.sign(JSON.stringify(admin),'secret_key'),
      admin: {
        fullname:admin.fullname,
        role: admin.role,
      }
    }
  }


  public async updateAdmin(payload:any) {
    const { admin , fullname, password, newPassword } = payload;

    const Admin = await this.admins.findById(admin)

    if(!Admin) throw new httException(400,'admin is not defined')

    interface IUpdate {
      fullname?: string
      password?: string
    }

    let updatesData:IUpdate = {}

    if(fullname) {
      updatesData.fullname = fullname
    }

    if(newPassword) {
      if(Admin.password !== password) throw new httException(400,'old password is wrong')
      updatesData.password = newPassword
    }

    const updatedAdmin = await this.admins.findOneAndUpdate({
      _id: admin
    },{...updatesData},{ new: true });

    return updatedAdmin;
  }

}


export default AdminService;