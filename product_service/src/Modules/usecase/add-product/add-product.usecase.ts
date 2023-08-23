import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import ProductGateway from "../../gateway/product.gateway";
import { AddProductInputDto, AddProductOutputDto } from "./add-product.dto";

export default class AddProductUseCase {
  private _productRepository: ProductGateway;

  constructor(_productRepository: ProductGateway) {
    this._productRepository = _productRepository;
  }

  async execute(input: AddProductInputDto): Promise<AddProductOutputDto> {
    const props = {
      id: new Id(input.id),
      name: input.name,
      description: input.description,
      price: input.price,
      qtdAvailable: input.qtdAvailable,
      qtdTotal: input.qtdTotal,   
    };

    const product = new Product(props);
    this._productRepository.add(product);

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      price: product.price,
      qtdAvailable: product.qtdAvailable,
      qtdTotal: product.qtdTotal,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
