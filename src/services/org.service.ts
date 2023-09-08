import { IOrg } from "../interfaces/org.interface";
import orgModel from "../models/org.model";


class OrgService {

  private orgs = orgModel;

  public async get():Promise<IOrg[]> {
    return await this.orgs.find().exec();
  }

  public createOrg(orgData:string) {

  }

  public update() {

  }

  public delete() {

  }
}



export default OrgService;