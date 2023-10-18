import { CreateLunch, LunchUpdateDto, PushProductDto } from "../dtos/lunch.dto";
import { httException } from "../exceptions/httpException";
import { ILunch } from "../interfaces/lunch.interface";
import lunchBaseModel from "../models/lunch-base.model";
import lunchModel from "../models/lunch.model";
import orgModel from "../models/org.model";
import productModel from "../models/product.model";



class LunchService {
  public lunches = lunchModel;
  public orgs = orgModel
  public products = productModel
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

    

    const Base = await this.bases.findById(payload.base)
    if(!Base) throw new httException(400,'lunch base not found')

    const newLunch = await this.lunches.create({
      base: payload.base,
      org: Base.org,
      cost: payload.cost,
      name: payload.name
    });

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

  public async pushProduct(lunchData:PushProductDto) {
    interface IProducts {
      product: string
      amount: number
    }
    const lunch = lunchData.lunch
    const addProducts:IProducts[] = []

    const Lunch = await this.lunches.findById(lunch)

    if(!Lunch) throw new httException(400,'lunch not found')
 
    for (let i = 0; i < lunchData.products.length; i++) {
      console.log(i)
      const product = lunchData.products[i]
      const Product = await this.products.findById(product.product) 
      console.log('Produt',Product)
      if(!Product) throw new httException(400,'Product not found')
      if(Lunch.products.length > 0) {
        for (let j = 0; j < Lunch.products.length; j++) {
          const jproduct = Lunch.products[j]
          console.log('j',jproduct)
          if(product.product == jproduct.product) throw new httException(400,`${jproduct.product} product already exist`)
          if(product.amount < 0) throw new httException(400,'amount should be higher than 0')
          addProducts.push({
            product: product.product,
            amount: product.amount
          })
        }
      }else {
        if(product.amount < 0) throw new httException(400,'amount should be higher than 0') 
        addProducts.push({
          product: product.product,
          amount: product.amount
        })
      }
    }

    console.log(addProducts)
    const updatedProduct = await this.lunches.findByIdAndUpdate(lunch,
      {
        $addToSet: { products: { $each: addProducts } }
      },
      { new: true }
    ).exec()

    return updatedProduct
  }

  // public async 
}


export default LunchService;