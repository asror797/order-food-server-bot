import { CreateProduct, UpdateAmount } from "../dtos/product.dto";
import { httException } from "../exceptions/httpException";
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


  public async increaseAmount(productData:UpdateAmount) {
    const { product , amount } = productData;

    const isExist = await this.products.findById(product);

    if(!isExist) throw new httException(200,'product not found');

    const updatedproduct = await this.products.findByIdAndUpdate(product,
      {
        amount: Number(isExist.amount) + Number(amount)
      }, { new: true});
    
      return updatedproduct;

  } 

  public async decreaseAmount(productData:UpdateAmount) {
    const { product , amount } = productData;

    const isExist = await this.products.findById(product);

    if(!isExist) throw new httException(200,'product not found');

    if(Number(isExist.amount < Number(amount))) throw new httException(200,'amount dont decrease')
    
    const updatedProduct = await this.products.findByIdAndUpdate(product,{ amount: Number(isExist.amount) - Number(amount)},{ new: true});

    return updatedProduct;
  }
}


export default ProductService;