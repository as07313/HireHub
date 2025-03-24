import amqp, { Channel, Connection, Options } from 'amqplib';
import { logError, logInfo } from '../logger';

// Define a type that extends the basic Connection with missing methods
interface EnhancedConnection extends Connection {
  createChannel(): Promise<Channel>;
  close(): Promise<void>;
}

class RabbitMQClient {
  private static instance: RabbitMQClient;
  private connection: EnhancedConnection | null = null;
  private channel: Channel | null = null;
  private isConnecting: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): RabbitMQClient {
    if (!RabbitMQClient.instance) {
      RabbitMQClient.instance = new RabbitMQClient();
    }
    return RabbitMQClient.instance;
  }

  public async connect(): Promise<void> {
    if (this.connection && this.channel) return;

    // Prevent multiple connection attempts
    if (this.isConnecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    this.isConnecting = true;

    this.connectionPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
        logInfo(`Connecting to RabbitMQ at ${amqpUrl}`);

        // Connect with explicit type casting to EnhancedConnection
        this.connection = await amqp.connect(amqpUrl) as unknown as EnhancedConnection;
        
        // Now TypeScript knows createChannel exists
        if (this.connection) {
          this.channel = await this.connection.createChannel();
        } else {
          throw new Error('Failed to create RabbitMQ connection');
        }

        // Set up error handlers
        if (this.connection) {
          this.connection.on('error', (err) => {
            logError('RabbitMQ connection error', err);
            this.connection = null;
            this.channel = null;
            
            // Attempt reconnection after a delay
            setTimeout(() => {
              this.isConnecting = false;
              this.connect().catch(err => {
                logError('Reconnection failed', err);
              });
            }, 5000);
          });
        }

        if (this.connection) {
          this.connection.on('close', () => {
            logInfo('RabbitMQ connection closed');
            this.connection = null;
            this.channel = null;
          });
        }

        // Define queues and exchanges
        await this.setupQueues();

        logInfo('Connected to RabbitMQ successfully');
        this.isConnecting = false;
        resolve();
      } catch (error) {
        this.isConnecting = false;
        logError('Failed to connect to RabbitMQ', error);
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  private async setupQueues(): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');

    try {
      // Create main ranking queue with priority support
      await this.channel.assertQueue('resume-ranking', {
        durable: true,
        maxPriority: 10
      });

      // Create a status updates queue
      await this.channel.assertQueue('ranking-status', {
        durable: true
      });

      // Create dead letter queue for failed jobs
      await this.channel.assertQueue('resume-ranking-dead-letter', {
        durable: true
      });

      // Create a standard direct exchange for retry instead of delayed message exchange
      await this.channel.assertExchange('ranking-retry', 'direct', {
        durable: true
      });

      // Bind retry exchange to main queue
      await this.channel.bindQueue('resume-ranking', 'ranking-retry', 'ranking');
    } catch (error) {
      logError('Error setting up RabbitMQ queues', error);
      throw error;
    }
  }

  public async publishMessage<T>(
    queue: string,
    message: T,
    priority: number = 1,
    options?: Options.Publish
  ): Promise<boolean> {
    try {
      if (!this.channel) await this.connect();
      if (!this.channel) throw new Error('Failed to create channel');

      return this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true, // Message survives broker restarts
          priority,
          ...options
        }
      );
    } catch (error) {
      logError('Error publishing message to RabbitMQ', error);
      throw error;
    }
  }

  public async publishDelayedMessage<T>(
    exchange: string,
    routingKey: string,
    message: T,
    delayMs: number,
    options?: Options.Publish
  ): Promise<boolean> {
    try {
      if (!this.channel) await this.connect();
      if (!this.channel) throw new Error('Failed to create channel');

      // Since we don't have the delayed message exchange plugin,
      // we'll simulate delay by adding a timestamp to the message
      const messageWithDelay = {
        originalMessage: message,
        processAfter: Date.now() + delayMs
      };

      return this.channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(messageWithDelay)),
        {
          persistent: true,
          ...options
        }
      );
    } catch (error) {
      logError('Error publishing delayed message', error);
      throw error;
    }
  }

  public async consumeMessages<T>(
    queue: string,
    callback: (message: T, ack: () => void, nack: (requeue: boolean) => void) => Promise<void>
  ): Promise<amqp.Replies.Consume> {
    try {
      if (!this.channel) await this.connect();
      if (!this.channel) throw new Error('Failed to create channel');

      // Set prefetch to 1 to ensure fair work distribution
      await this.channel.prefetch(1);

      return this.channel.consume(
        queue,
        async (msg) => {
          if (!msg) return;

          try {
            const content = JSON.parse(msg.content.toString()) as T;
            
            const ack = () => {
              if (this.channel) this.channel.ack(msg);
            };
            
            const nack = (requeue: boolean = true) => {
              if (this.channel) this.channel.nack(msg, false, requeue);
            };

            await callback(content, ack, nack);
          } catch (error) {
            logError('Error processing message', error);
            // Negative acknowledge with requeue set to false to prevent infinite loops
            if (this.channel) this.channel.nack(msg, false, false);
          }
        },
        { noAck: false } // Manual acknowledgment
      );
    } catch (error) {
      logError('Error consuming messages', error);
      throw error;
    }
  }

  public getChannel(): Channel | null {
    return this.channel;
  }

  public async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      
      if (this.connection) {
        // We can now directly call close since we defined it in EnhancedConnection
        await this.connection.close();
      }
      
      this.channel = null;
      this.connection = null;
      logInfo('RabbitMQ connection closed successfully');
    } catch (error) {
      logError('Error closing RabbitMQ connection', error);
      this.channel = null;
      this.connection = null;
    }
  }
}

export default RabbitMQClient;