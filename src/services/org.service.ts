import { IOrg } from "../interfaces/org.interface";
import orgModel from "../models/org.model";


class OrgService {

  private orgs = orgModel;

  public async get() {
    return await this.orgs.find().exec();
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