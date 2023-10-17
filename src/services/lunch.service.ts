import { CreateLunch, LunchUpdateDto } from "../dtos/lunch.dto";
import { httException } from "../exceptions/httpException";
import { ILunch } from "../interfaces/lunch.interface";
import lunchBaseModel from "../models/lunch-base.model";
import lunchModel from "../models/lunch.model";
import orgModel from "../models/org.model";



class LunchService {
  public lunches = lunchModel;
  public orgs = orgModel
  public bases = lunchBaseModel

  public async getLunches(page:number ,size: number) {
    const skip = (page - 1) * size

    const Lunches = await this.lunches.find()
              .select('-updatedAt')
              .skip(skip)
              .limit(size)
              .populate('org','name_org')
              .populate('base','name')
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


  public async getByBase(base:string) {
    const lunches = await this.lunches.find({
     base: base
    })

    return lunches
  }


  public async deleteLunch(id: string) {
    const Lunch = await this.lunches.findById(id)
    if(!Lunch) throw new httException(400,'not found lunch')
    const deletedLunch = await this.lunches.deleteOne({
      _id: Lunch['_id']
    },{ new: true }).exec()

    return deletedLunch;
  }

  public async createLunch(payload:CreateLunch) {

    const Org = await this.orgs.findById(payload.org)
    if(!Org) throw new httException(400,'org not found')

    const Base = await this.bases.findById(payload.base)
    if(!Base) throw new httException(400,'lunch base not found')

    const newLunch = await this.lunches.create(payload);

    return newLunch;
  }

  public async updateLunch(payload:LunchUpdateDto) {
    const updateObj:any = {}
    const Lunch = await this.lunches.findById(payload.id)

    if(!Lunch) throw new httException(400,'lunch not found')

    if(payload.org) {
      const Org = await this.orgs.findById(payload.org)
      if(!Org) throw new httException(400,'org not found')
      updateObj.org = payload.org
    }

    if(payload.base) {
      const Base = await this.bases.findById(payload.base)
      if(!Base) throw new httException(400,'base not found')
      updateObj.base = payload.base
    }
    if(payload.cost) {
      updateObj.cost = payload.cost
    }
    if(payload.name) {
      updateObj.name = payload.name
    }

    if(payload.percent_cook) {
      updateObj.percent_cook = payload.percent_cook
    }

    const updatedLunch = await this.bases.findByIdAndUpdate(payload.id,updateObj,{ new: true })

    return updatedLunch
  }

  public async pushProduct(lunchData:any) {
    const { lunch , products  } = lunchData
  }
}


export default LunchService;