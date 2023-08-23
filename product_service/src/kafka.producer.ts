import { Kafka, Producer, ProducerRecord } from 'kafkajs';

// Configurações do Kafka
const kafka = new Kafka({
  clientId: 'product-producer',
  brokers: ['kafka:9092'], 
});

const producer: Producer = kafka.producer();


// Função assíncrona para inicializar o produtor
async function initProducer() {
    await producer.connect();
}
  
  // Função para enviar mensagem ao tópico
async function sendMessage(topic: string, payload: object) {
    const record: ProducerRecord = {
      topic: topic,
      messages: [{ value: JSON.stringify(payload) }], // Serializa o objeto JSON para uma string
    };
  
    try {
      await producer.send(record);
      console.log('JSON enviado para o tópico:', topic, 'JSON:', payload);
    } catch (err) {
      console.error('Erro ao enviar JSON para o tópico', topic, ':', err);
    }
}
  
  // Chamada da função de inicialização e envio de mensagem de exemplo
export async function ProducerExec(topic: string, payload: any) {
    await initProducer();
  
    // Envio do JSON para o tópico
    await sendMessage(topic, payload);
  
    await producer.disconnect();
}