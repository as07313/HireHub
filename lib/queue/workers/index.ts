import dotenv from 'dotenv';
dotenv.config();

import RabbitMQClient from '../rabbitmq';
import { QUEUES, RankingJobMessage } from '../config';
import { processRankingJob } from './ranking';
import { logInfo, logError } from '../../logger';
import connectToDatabase from '../../mongodb';


// Add basic logger if you don't have one
export const logger = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error || '')
};

async function initializeWorkers() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Initialize RabbitMQ connection
    const rabbitmq = RabbitMQClient.getInstance();
    await rabbitmq.connect();
    
    // Start job ranking worker
    await startRankingWorker();
    
    logger.info('All workers initialized and ready');
  } catch (error) {
    logger.error('Failed to initialize workers', error);
    process.exit(1);
  }
}

async function startRankingWorker() {
  const rabbitmq = RabbitMQClient.getInstance();
  
  try {
    logger.info('Starting ranking worker...');
    
    // Add explicit type for message parameter
    await rabbitmq.consumeMessages<RankingJobMessage>(
      QUEUES.RESUME_RANKING, 
      async (message, ack, nack) => {
        try {
          logger.info(`Processing ranking job ${message.taskId} for job ${message.jobId}`);
          
          // Process the job
          await processRankingJob(message);
          
          // Acknowledge successful processing
          ack();
        } catch (error) {
          logger.error('Error processing ranking job', error);
          
          // Nack message, don't requeue to avoid infinite loops
          nack(false);
        }
      }
    );
    
    logger.info('Ranking worker started successfully');
  } catch (error) {
    logger.error('Failed to start ranking worker', error);
    throw error;
  }
}

// Handle graceful shutdown
function handleShutdown() {
  const rabbitmq = RabbitMQClient.getInstance();
  
  logger.info('Shutting down workers...');
  
  rabbitmq.close()
    .then(() => {
      logger.info('Workers shut down successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Error shutting down workers', error);
      process.exit(1);
    });
}

// Register shutdown handlers
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

// Start workers
initializeWorkers()
  .catch(err => {
    logger.error('Fatal error initializing workers', err);
    process.exit(1);
  });