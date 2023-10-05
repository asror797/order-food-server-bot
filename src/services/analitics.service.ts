import orderModel from "../models/order.model";



class AnaliticsService {

  public orders = orderModel;

  public async spend() {
    
  }

  public async benefit() {

  }

  public async totalSale(argData:any) {
    const { type , org , startDate , endDate } = argData;

    if(type == 'all') {
      if(startDate && endDate) {
        const allOrders = await this.orders.find({
          createdat: {
            $gte: startDate,
            $lte: endDate
          }
        });

        return allOrders;
      }
      const allOrders = await this.orders.find().select('total_cost');
      return allOrders;
    } else {
      if(startDate && endDate) {
        const allOrders = await this.orders.find({
          createdat: {
            $gte: startDate,
            $lte: endDate
          }
        });

        return allOrders;
      }
      const allOrders = await this.orders.find({ org:org }).select('total_cost');
      return allOrders;
    }
  }
}


export default AnaliticsService;