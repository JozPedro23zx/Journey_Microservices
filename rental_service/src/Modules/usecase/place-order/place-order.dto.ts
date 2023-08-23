export interface PlaceOrderInputDto {
  clientId: string;
  productId: string;
  itemQtd: number;
  itemTotal: number;
  downpayment: number;
  deliveryFee: number;
  lateFee: number;
  discount: number;
  orderDate: Date;
  paymentType: string;
  amount: number;
  description: string;
  paymentDate: Date;
}

export interface PlaceOrderOutputDto {
  id: string;
  total: number;
  items: {
    itemId: string;
  }[];
  payments: {
    paymentId: string;
  }[];
}
