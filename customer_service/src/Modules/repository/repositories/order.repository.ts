import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import OrderItem from "../../domain/order-item.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import Address from "../../domain/value-object/address.value-object";
import CheckoutGateway from "../../gateway/checkout.gateway";
import OrderItemsModel from "../models/order-item.model";
import OrderModel from "../models/order.model";

export default class OrderRepository implements CheckoutGateway{
    async addOrder(order: Order): Promise<void> {
        await OrderModel.create({
            id: order.id.id,
            client: order.client,
            client_id: order.client.id.id,
            total: order.total,
            discount: order.discount,
            order_date: order.orderDate,
            
            items: order.items.map((item) =>({
                id: item.id.id,                
                product_id: item.product.id.id,
                order_id: item.orderId,
                product: item.product,
                qtd: item.qtd,
                total: item.total
            }))
        },
        {
          include: [{model: OrderItemsModel}]
        })

    }
    async findOrder(orderId: string): Promise<Order> {
        const orderData = await OrderModel.findOne({where: {id: orderId}, include: ["order_items"]})

        const address = new Address({
            street: orderData.client.street,
            number: orderData.client.number,
            complement: orderData.client.complement,
            city: orderData.client.city,
            state: orderData.client.state,
            zipCode: orderData.client.zip_code
          })

        const client = new Client({
            id: new Id(orderData.client.id),
            name: orderData.client.name,
            email: orderData.client.email,
            document: orderData.client.document,
            address: address
        })

        const items = orderData.items.map(item =>{
            let product = new Product({
                id: new Id(item.product_id),
                name: item.product.name,
            })
            
            let newItem = new OrderItem({
                id: new Id(item.id),
                product: product,
                orderId: new Id(item.order_id),
                qtd: item.qtd,
                total: item.total
            })

            return newItem
        })

        const order = new Order({
            id: new Id(orderData.id),
            client: client,
            items: items,
            discount: orderData.discount,
            orderDate: orderData.order_date,
            total: orderData.total
        })

        return order
    }   
}