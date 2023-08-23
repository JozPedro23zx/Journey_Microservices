export interface AddProductFacadeInputDto {
  id?: string;
  name: string;
  description: string;
  price: number;
  qtdAvailable: number;
  qtdTotal: number;
}

export interface CheckStockFacadeInputDto {
  productId: string;
}

export interface CheckStockFacadeOutputDto {
  productId: string;
  stock: number;
}

export default interface ProductAdmFacadeInterface {
  addProduct(input: AddProductFacadeInputDto): Promise<void>;
  checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto>;
}
