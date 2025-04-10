import dotenv from 'dotenv';
dotenv.config();

import RabbitMQClient from '../rabbitmq';
import { QUEUES, RankingJobMessage } from '../config';
import { processRankingJob } from './ranking';
import { processResumeFromQueue } from './resume-processor-worker';
import { ResumeProcessingMessage } from '../auto-ranking';
import { processBatchOfResumes } from './resume-batch-processor';
import { logInfo, logError } from '../../logger';
import connectToDatabase from '../../mongodb';

// Resume processing queue name
const RESUME_PROCESSING_QUEUE = 'resume-processing';

// The number of workers to run concurrently
const MAX_CONCURRENT_WORKERS = 3;

// Constants for batch processing
const BATCH_SIZE = 5; 
const BATCH_TIMEOUT = 5000;

// In-memory storage for batching
const resumes = {
  currentBatch: [] as ResumeProcessingMessage[],
  batchTimer: null as NodeJS.Timeout | null,
  isProcessing: false
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
 
    await startResumeWorker();
    
    logInfo('All workers initialized and ready');
  } catch (error) {
    logError('Failed to initialize workers', error);
    process.exit(1);
  }
}

async function startRankingWorker() {
  const rabbitmq = RabbitMQClient.getInstance();
  
  try {
    logInfo('Starting ranking worker...');
    
    await rabbitmq.consumeMessages<RankingJobMessage>(
      QUEUES.RESUME_RANKING, 
      async (message, ack, nack) => {
        try {
          logInfo(`Processing ranking job ${message.taskId} for job ${message.jobId}`);
          
          // Process the job
          await processRankingJob(message);
          
          // Acknowledge successful processing
          ack();
        } catch (error) {
          logError('Error processing ranking job', error);
          
          // Nack message, don't requeue to avoid infinite loops
          nack(false);
        }
      }
    );
    
    logInfo('Ranking worker started successfully');
  } catch (error) {
    logError('Failed to start ranking worker', error);
    throw error;
  }
}

// Process the current batch of resumes
async function processBatch() {
  if (resumes.isProcessing || resumes.currentBatch.length === 0) return;
  
  resumes.isProcessing = true;
  const batchToProcess = [...resumes.currentBatch];
  resumes.currentBatch = [];
  
  if (resumes.batchTimer) {
    clearTimeout(resumes.batchTimer);
    resumes.batchTimer = null;
  }
  
  try {
    await processBatchOfResumes(batchToProcess);
  } catch (error) {
    logError('Error processing batch:', error);
  } finally {
    resumes.isProcessing = false;
    
    // Process any new resumes that accumulated during processing
    if (resumes.currentBatch.length >= BATCH_SIZE) {
      processBatch();
    } else if (resumes.currentBatch.length > 0 && !resumes.batchTimer) {
      // Set timer for remaining items
      resumes.batchTimer = setTimeout(() => processBatch(), BATCH_TIMEOUT);
    }
  }
}

// Updated resume worker to support batching
async function startResumeWorker() {
  const rabbitmq = RabbitMQClient.getInstance();
  
  try {
    logInfo('Starting resume processing worker...');
    
    // Use the prefetch method inside consumeMessages instead of directly accessing channel
    await rabbitmq.consumeMessages<ResumeProcessingMessage>(
      RESUME_PROCESSING_QUEUE, 
      async (message, ack, nack) => {
        try {
          // Add the resume to the current batch
          resumes.currentBatch.push(message);
          
          // Acknowledge message immediately - we've stored it in memory
          ack();
          
          // Process batch immediately if it's full
          if (resumes.currentBatch.length >= BATCH_SIZE && !resumes.isProcessing) {
            processBatch();
          } else if (resumes.currentBatch.length === 1 && !resumes.batchTimer && !resumes.isProcessing) {
            // Start a timer for the first resume in a new batch
            resumes.batchTimer = setTimeout(() => processBatch(), BATCH_TIMEOUT);
          }
          
        } catch (error) {
          logError(`Error handling resume message:`, error);
          nack(false); // Don't requeue on error
        }
      }, 
      MAX_CONCURRENT_WORKERS * BATCH_SIZE // Set prefetch count here
    );
    
    logInfo('Resume processing worker started successfully');
  } catch (error) {
    logError('Failed to start resume processing worker', error);
    throw error;
  }
}

// Handle graceful shutdown
function handleShutdown() {
  logInfo('Shutting down workers...');
  
  // Process any remaining resumes before shutting down
  if (resumes.currentBatch.length > 0) {
    processBatch().finally(() => {
      const rabbitmq = RabbitMQClient.getInstance();
      rabbitmq.close()
        .then(() => {
          logInfo('Workers shut down successfully');
          process.exit(0);
        })
        .catch((error) => {
          logError('Error shutting down workers', error);
          process.exit(1);
        });
    });
  } else {
    const rabbitmq = RabbitMQClient.getInstance();
    rabbitmq.close()
      .then(() => {
        logInfo('Workers shut down successfully');
        process.exit(0);
      })
      .catch((error) => {
        logError('Error shutting down workers', error);
        process.exit(1);
      });
  }
}

// Register shutdown handlers
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

// Start workers
initializeWorkers()
  .catch(err => {
    logError('Fatal error initializing workers', err);
    process.exit(1);
  });