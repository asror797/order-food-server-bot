import { IOrg } from "../interfaces/org.interface";
import orgModel from "../models/org.model";


class OrgService {

  private orgs = orgModel;

  public async get(page:number,size:number) {
    const skip = (page - 1) * size

    const org = await this.orgs.find()
              .select('-updatedAt')
              .skip(skip)
              .limit(size)
              .exec();
    const totalOrgs = await this.orgs.countDocuments().exec()
    const totalPages = Math.ceil(totalOrgs / size)
    return {
      data: org,
      currentPage: page,
      totalPages,
      totalOrgs,
      orgsOnPage: org.length
    };
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