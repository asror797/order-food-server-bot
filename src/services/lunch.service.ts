import { CreateLunch } from "../dtos/lunch.dto";
import { ILunch } from "../interfaces/lunch.interface";
import lunchModel from "../models/lunch.model";



class LunchService {
  public lunches = lunchModel;

  public async getLunches(page:number ,size: number) {
    const skip = (page - 1) * size

    const Lunches = await this.lunches.find()
              .select('-updatedAt')
              .skip(skip)
              .limit(size)
              .populate('org','name_org')
              .exec();
    const totalLunches = await this.lunches.countDocuments().exec()
    const totalPages = Math.ceil(totalLunches / size)
    return {
      data: Lunches,
      currentPage: page,
      totalPages,
      totalLunches,
      productsOnPage: Lunches.length
    };
  }

  public async getById(lunch:string) {
    return await this.lunches.findById(lunch)
  }

  public async getByOrg(org: string) {
    const lunches = await this.lunches.find({
      org: org
    });

    return lunches;
  } 

  public async createLunch(lunchData:CreateLunch) {
    const newLunch = await this.lunches.create(lunchData);

    return newLunch;
  }

  public async updateLunch() {

  }

  public async pushProduct(lunchData:any) {
    const { lunch , products  } = lunchData
  }
}


export default LunchService;