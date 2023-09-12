"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const org_service_1 = __importDefault(require("../services/org.service"));
class OrgController {
    constructor() {
        this.orgService = new org_service_1.default();
        this.get = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const size = parseInt(req.query.size) || 10;
                res.json(await this.orgService.get(page, size));
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        };
        this.createOrg = async (req, res, next) => {
            try {
                const newOrg = await this.orgService.createOrg(req.body.name_org);
                res.json({
                    _id: newOrg['_id'],
                    name_org: newOrg.name_org
                });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        };
        this.updateOrg = async (req, res, next) => {
            try {
            }
            catch (error) {
            }
        };
    }
}
exports.default = OrgController;
