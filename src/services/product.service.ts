import productModel from "../models/product.model";



class ProductService {
  public products = productModel;

  public async createNew(productData: string) {
    const newProduct = await this.products.create({
      name: productData
    });

    return newProduct
  }


  public async increaseAmount() {
    
  }
  

}


export default ProductService;