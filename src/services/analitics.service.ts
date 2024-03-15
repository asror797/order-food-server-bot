import { orderModel } from '@models'

export class AnaliticsService {
  public orders = orderModel


  public async purcheUser() {}
  public async soldProduct() {}
  public async countOrder() {}
  public async costOrder() {}
  /*
    - Top most purchase users     // 10 *daily
    - Top sold products / food    // 10 *daily
    - Total order amount by Org   // *daily
    - Total sum of orders by org  // *daily
  */
}
