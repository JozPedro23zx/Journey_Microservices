export interface AddProductInputDto {
  id?: string;
  name: string;
  description: string;
  price: number;
  qtdAvailable: number;
  qtdTotal: number;
}

export interface AddProductOutputDto {
  id: string;
  name: string;
  description: string;
  price: number;
  qtdAvailable: number;
  qtdTotal: number;
  createdAt: Date;
  updatedAt: Date;
}
