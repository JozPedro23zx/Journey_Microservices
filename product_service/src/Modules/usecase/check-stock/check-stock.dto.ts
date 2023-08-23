export interface CheckStockInputDto {
  productId: string;
}

export interface CheckStockOutputDto {
  productId: string;
  qtdAvailable: number;
  qtdTotal: number;
}
