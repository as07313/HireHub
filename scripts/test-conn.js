// test-conn.js - ESM version
import amqplib from 'amqplib';
import { createClient } from 'redis';

async function testConnections() {
  try {
    // Test Redis
    console.log("Testing Redis connection...");
    const redisClient = createClient({url: 'redis://localhost:6379'});
    await redisClient.connect();
    await redisClient.set('test-key', 'Hello from Redis!');
    const redisResult = await redisClient.get('test-key');
    console.log("Redis test result:", redisResult);
    await redisClient.disconnect();
    
    // Test RabbitMQ
    console.log("Testing RabbitMQ connection...");
    const connection = await amqplib.connect('amqp://localhost:5672');
    console.log("RabbitMQ connection successful");
    await connection.close();
    
    console.log("All connections tested successfully!");
  } catch (error) {
    console.error("Connection test failed:", error);
    console.error(error);
  }
}

testConnections();