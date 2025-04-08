import dotenv from 'dotenv';
dotenv.config();

import RabbitMQClient from '../rabbitmq';
import { QUEUES, RankingJobMessage } from '../config';
import { processRankingJob } from './ranking';
import { processResumeFromQueue } from './resume-processor-worker';
import { ResumeProcessingMessage } from '../auto-ranking';
import { logInfo, logError } from '../../logger';
import connectToDatabase from '../../mongodb';

// Add constants for resume processing queue
const RESUME_PROCESSING_QUEUE = 'resume-processing';

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
    
    // Start resume processing worker
    await startResumeWorker();
    
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

// New function to start the resume processing worker
async function startResumeWorker() {
  const rabbitmq = RabbitMQClient.getInstance();
  
  try {
    logger.info('Starting resume processing worker...');
    
    await rabbitmq.consumeMessages<ResumeProcessingMessage>(
      RESUME_PROCESSING_QUEUE, 
      async (message, ack, nack) => {
        try {
          logger.info(`Processing resume ${message.resumeId} for application ${message.applicantId}`);
          
          // Process the resume
          await processResumeFromQueue(message);
          
          // Acknowledge successful processing
          ack();
        } catch (error) {
          logger.error(`Error processing resume ${message.resumeId}:`, error);
          
          // Nack message, don't requeue if it's a permanent error
          nack(false);
        }
      }
    );
    
    logger.info('Resume processing worker started successfully');
  } catch (error) {
    logger.error('Failed to start resume processing worker', error);
    throw error;
  }
}

// Handle graceful shutdown
function handleShutdown() {
  logger.info('Shutdown signal received. Closing connections...');
  
  const rabbitmq = RabbitMQClient.getInstance();
  rabbitmq.close()
    .then(() => {
      logger.info('Connections closed successfully');
      process.exit(0);
    })
    .catch(err => {
      logger.error('Error closing connections', err);
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