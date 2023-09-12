import { IOrg } from "../interfaces/org.interface";
import orgModel from "../models/org.model";


class OrgService {

  private orgs = orgModel;

  public async get(page:number,size:number) {
    const skip = (page - 1) * size

    const products = await this.orgs.find()
              .select('-updatedAt')
              .skip(skip)
              .limit(size)
              .exec();
    return products;
  }

  public async createOrg(name: string) {
    const newOrg = await this.orgs.create({
      name_org: name
    });

    return newOrg;
  }

  public update() {

  }

  public delete() {

  }
}



export default OrgService;