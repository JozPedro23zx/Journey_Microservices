import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import dotenv from "dotenv"

dotenv.config()

const kafka = new Kafka({
  clientId: 'rental-producer',
  brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`], 
});

const producer: Producer = kafka.producer();

async function initProducer() {
    await producer.connect();
}
  
async function sendMessage(topic: string, payload: object) {
    const record: ProducerRecord = {
      topic: topic,
      messages: [{ value: JSON.stringify(payload) }],
    };
  
    try {
      await producer.send(record);
      console.log('JSON enviado para o tópico:', topic, 'JSON:', payload);
    } catch (err) {
      console.error('Erro ao enviar JSON para o tópico', topic, ':', err);
    }
}

export async function ProducerExec(topic: string, payload: any) {
    await initProducer();
  
    await sendMessage(topic, payload);
  
    await producer.disconnect();
}