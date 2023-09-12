export interface PlaceOrderFacadeInputDto {
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
  
  export interface PlaceOrderFacadeOutputDto {
    id: string;
    total: number;
    items: {
      itemId: string;
    }[];
    payments: {
      paymentId: string;
    }[];
  }
  
  export default interface RentalFacadeInterface{
    addOrder(intput: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto>;
}