import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import Product from './Modules/domain/product.entity';
import Id from './@shared/domain/value-object/id.value-object';
import ProductRepository from './Modules/repository/repositories/product.repository';
import Client from './Modules/domain/client.entity';
import ClientRepository from './Modules/repository/repositories/client.repository';

// Configurações do Kafka
const kafka = new Kafka({
  clientId: 'rental-consumer',
  brokers: ['kafka:9092'], // Coloque aqui o endereço dos brokers do Kafka
});

// Crie um consumidor
const consumer: Consumer = kafka.consumer({ groupId: 'group2' });

async function initConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topics: ['products', 'customers']}); // Subscreve ao tópico
}

// Função para processar as mensagens recebidas
async function processMessage({ topic, partition, message }: EachMessagePayload) {
  const messageValue = message.value?.toString();

  try {
    const jsonPayload = JSON.parse(messageValue || '');
    if(topic == "products"){
        createProduct(jsonPayload)
    }
    else if(topic == "customers"){
      createClient(jsonPayload)
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
        name: productData.name,
        price: productData.price
    })

    productRepository.add(product)
}

async function createClient(clientData: any){
  let clientRepository = new ClientRepository()
  let client = new Client({
      id: new Id(clientData.id),
      name: clientData.name,
      email: clientData.email
  })

  clientRepository.add(client)
}

// Chamada das funções de inicialização e consumo de mensagens
export async function ConsumerExec() {
  await initConsumer();
  await consumeMessages();
}