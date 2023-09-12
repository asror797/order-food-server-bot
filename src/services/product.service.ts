import { CreateProduct } from "../dtos/product.dto";
import productModel from "../models/product.model";


class ProductService {
  public products = productModel;

  public async getProducts(page:number,size:number) {
    const skip = (page - 1) * size

    const products = await this.products.find()
              .select('-updatedAt')
              .skip(skip)
              .populate('org','name_org')
              .limit(size)
              .exec();
    return products;
  }

  public async createNew(productData:CreateProduct) {
    console.log(productData)
    const newProduct = await this.products.create(productData);

    return newProduct;
  }


  public async increaseAmount() {
    
  }
}


export default ProductService;