import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import Product from './Modules/domain/product.entity';
import Id from './@shared/domain/value-object/id.value-object';
import ProductRepository from './Modules/repository/repositories/product.repository';
import OrderRepository from './Modules/repository/repositories/order.repository';
import Order from './Modules/domain/order.entity';
import Client from './Modules/domain/client.entity';
import FindClientUseCase from './Modules/usecase/find-client/find-client.usecase';
import ClientRepository from './Modules/repository/repositories/client.repository';
import OrderItem from './Modules/domain/order-item.entity';

// Configurações do Kafka
const kafka = new Kafka({
  clientId: 'customer-consumer',
  brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`], 
});

// Crie um consumidor
const consumer: Consumer = kafka.consumer({ groupId: 'group1' });

async function initConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topics: ['products', 'rental']}); // Subscreve ao tópico
}

// Função para processar as mensagens recebidas
async function processMessage({ topic, partition, message }: EachMessagePayload) {
  const messageValue = message.value?.toString();

  try {
    const jsonPayload = JSON.parse(messageValue || '');
    if(topic == "products"){
        createProduct(jsonPayload)
    }
    else if(topic == "rental"){
        createOrder(jsonPayload)
    }
  } catch (err) {
    console.error('Erro to proccess message', topic, ':', err);
  }
}

// Inicia o consumo das mensagens
async function consumeMessages() {
  await consumer.run({
    eachMessage: processMessage,
  });
}

async function createProduct(productData: any){
    let productRepository = new ProductRepository()
    let product = new Product({
        id: new Id(productData.id),
        name: productData.name
    })

    productRepository.add(product)
}

async function createOrder(orderData: any){
  let orderRepository = new OrderRepository()
  let clientRepository = new ClientRepository()

  const client = await clientRepository.find(orderData.client_id);

  const items = orderData.items.map( (item: any) =>{
    let product = new Product({
        id: new Id(item.product_id),
        name: item.product.name
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

  let order = new Order({
      id: new Id(orderData.id),
      client: client,
      items: items,
      discount: orderData.discount,
      total: orderData.total,
      orderDate: orderData.order_date
  })

  orderRepository.addOrder(order)
}

// Chamada das funções de inicialização e consumo de mensagens
export async function ConsumerExec() {
  await initConsumer();
  await consumeMessages();
}