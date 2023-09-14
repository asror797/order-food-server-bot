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
    const totalProducts = await this.products.countDocuments().exec()
    const totalPages = Math.ceil(totalProducts / size)
    return {
      data: products,
      currentPage: page,
      totalPages,
      totalProducts,
      productsOnPage: products.length
    };
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