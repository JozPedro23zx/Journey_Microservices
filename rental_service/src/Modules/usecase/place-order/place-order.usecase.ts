import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Client from "../../domain/client.entity";
import OrderItem from "../../domain/order-item.entity";
import Order from "../../domain/order.entity";
import Payment from "../../domain/payment.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import ClientGateway from "../../gateway/client.gateway";
import ProductGateway from "../../gateway/product.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientRepository: ClientGateway;
  private _orderRepository: CheckoutGateway;
  private _productRepository: ProductGateway

  constructor(
    clientRepository: ClientGateway,
    productRepository: ProductGateway,
    orderRepository: CheckoutGateway
  ) {
    this._clientRepository = clientRepository;
    this._productRepository = productRepository;
    this._orderRepository = orderRepository;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientRepository.find(input.clientId);
    const product = await this._productRepository.find(input.productId);
    if (!client) {
      throw new Error("Client not found");
    }

    // await this.validateProducts(input);

    const myClient = new Client({
      id: new Id(client.id.id),
      name: client.name,
      email: client.email,
    });

    const orderItem = new OrderItem({
      id: new Id(),
      orderId: new Id(),
      product: product,
      qtd: input.itemQtd,
      total: input.itemTotal
    })

    const payment = new Payment({
      id: new Id(),
      orderId: orderItem.orderId.id,
      descripition: input.description,
      paymentType: input.paymentType,
      amount: input.amount,
      paymentDate: input.paymentDate
    })

    const order = new Order({
      id: new Id(orderItem.orderId.id),
      client: myClient,
      items: [orderItem],
      payments: [payment],
      status: "default",
      downpayment: input.downpayment,
      deliveryFee: input.deliveryFee,
      lateFee: input.lateFee,
      discount: input.discount,
      orderDate: input.orderDate,
    });

    await this._orderRepository.addOrder(order);

    return {
      id: order.id.id,
      total: order.total,
      items: order.items.map((item) => {
        return {
          itemId: item.id.id,
        };
      }),
      payments: order.payments.map((payment) => {
        return {
          paymentId: payment.id.id,
        };
      }),
    };
  }

  // private async validateProducts(input: PlaceOrderInputDto) {
  //   if (input.products.length === 0) {
  //     throw new Error("No products selected");
  //   }

  //   for (const p of input.products) {
  //     const product = await this._productRepository.checkStock({
  //       productId: p.productId,
  //     });
  //     if (product.stock <= 0) {
  //       throw new Error(
  //         `Product ${product.productId} is not available in stock`
  //       );
  //     }
  //   }
  // }

  // private async getProduct(productId: string): Promise<Product> {
  //   const product = await this._catalogFacade.find({ id: productId });
  //   if (!product) {
  //     throw new Error("Product not found");
  //   }
  //   const productProps = {
  //     id: new Id(product.id),
  //     name: product.name,
  //     description: product.description,
  //     salesPrice: product.salesPrice,
  //   };
  //   const myProduct = new Product(productProps);
  //   return myProduct;
  // }
}
