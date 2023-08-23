import Id from "../../@shared/domain/value-object/id.value-object";
import { ProducerExec } from "../../kafka.producer";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import { ProductModel } from "./product.model";


export default class ProductRepository implements ProductGateway {
  async add(product: Product): Promise<void> {
    try{
      await ProductModel.create({
        id: product.id.id,
        name: product.name,
        description: product.description,
        price: product.price,
        qtdAvailable: product.qtdAvailable,
        qtdTotal: product.qtdTotal,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      let payload = {
        id: product.id.id,
        name: product.name,
        description: product.description,
        price: product.price,
        qtdAvailable: product.qtdAvailable,
        qtdTotal: product.qtdTotal,
      }

      await ProducerExec("products", payload)

    }catch(err){
      console.log(err)
    }
  }
  async find(id: string): Promise<Product> {
    const product = await ProductModel.findOne({
      where: { id },
    });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      price: product.price,
      qtdAvailable: product.qtdAvailable,
      qtdTotal: product.qtdTotal,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }
}
