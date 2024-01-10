import { NextFunction, Request, Response } from 'express'
import redisService from '../services/redis.service'
import { OtpInfo } from '../dtos/otp.dto'

class SettingsController {
  public saveOtpInfo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const otpServiceInfo: OtpInfo = req.body
      res.json(await redisService.saveOtpServiceInfo(otpServiceInfo))
    } catch (error) {
      next(error)
    }
  }
}

export default SettingsController
