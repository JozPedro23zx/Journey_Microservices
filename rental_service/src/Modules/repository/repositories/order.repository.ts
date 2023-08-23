import Id from "../../../@shared/domain/value-object/id.value-object";
import { ProducerExec } from "../../../kafka.producer";
import Client from "../../domain/client.entity";
import OrderItem from "../../domain/order-item.entity";
import Order from "../../domain/order.entity";
import Payment from "../../domain/payment.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import OrderItemsModel from "../models/order-item.model";
import OrderModel from "../models/order.model";


export default class OrderRepository implements CheckoutGateway{
    async addOrder(order: Order): Promise<void> {
        try{
            await OrderModel.create({
                id: order.id.id,
                client_id: order.client.id.id,
                client: order.client,
                downpayment: order.downpayment,
                delivery_fee: order.deliveryFee,
                late_fee: order.lateFee,
                balance: order.balance,
                total: order.total,
                discount: order.discount,
                order_date: order.orderDate,
                return_date: order.returnDate,
                
                items: order.items.map((item) =>({
                    id: item.id.id,                
                    product_id: item.product.id.id,
                    order_id: item.orderId,
                    product: item.product,
                    qtd: item.qtd,
                    total: item.total
                })),
                payments: order.payments.map((payment) =>({
                    id: payment.id.id,
                    paymentType: payment.paymentType,
                    order_id: order.id.id
                })),
                status: order.status
            },
            {
              include: [{model: OrderItemsModel}]
            })

            let payload = {
                id: order.id.id,
                client_id: order.client.id.id,
                client: order.client,
                downpayment: order.downpayment,
                delivery_fee: order.deliveryFee,
                late_fee: order.lateFee,
                balance: order.balance,
                total: order.total,
                discount: order.discount,
                order_date: order.orderDate,
                return_date: order.returnDate,
                items: order.items.map((item) =>({
                    id: item.id.id,                
                    product_id: item.product.id.id,
                    order_id: item.orderId,
                    product: item.product,
                    qtd: item.qtd,
                    total: item.total
                })),
                payments: order.payments.map((payment) =>({
                    id: payment.id.id,
                    paymentType: payment.paymentType,
                    order_id: order.id.id
                })),
                status: order.status
            }

            await ProducerExec("rental", payload)


        }catch(err){
            console.log(err)
        }

    }
    async findOrder(orderId: string): Promise<Order> {
        const orderData = await OrderModel.findOne({where: {id: orderId}, include: ["order_items"]})

        const client = new Client({
            id: new Id(orderData.client.id),
            name: orderData.client.name,
            email: orderData.client.email
        })

        const payments = orderData.payments.map(payment =>{
            let newPayment = new Payment({
                id: new Id(payment.id),
                paymentType: payment.payment_type,
                orderId: payment.order_id,
                descripition: payment.descripition,
                amount: payment.amount,
                paymentDate: payment.payment_date
            })

            return newPayment
        })

        const items = orderData.items.map( item =>{
            let product = new Product({
                id: new Id(item.product.id),
                name: item.product.name,
                price: item.product.price
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
            payments: payments,
            status: orderData.status,
            downpayment: orderData.downpayment,
            deliveryFee: orderData.delivery_fee,
            lateFee: orderData.late_fee,
            discount: orderData.discount,
            orderDate: orderData.order_date,
        })

        return order
    }   
}