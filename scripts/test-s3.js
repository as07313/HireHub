// test-s3-cjs.js - CommonJS version
const { S3Client, ListObjectsCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'fypbucket';
const PARSED_FOLDER = 'parsed';

// Initialize S3 client with the same config as your application
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.AWS_REGION ,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  forcePathStyle: true
});

async function testS3Connection() {
  try {
    console.log('S3 Configuration:');
    console.log(`Endpoint: ${process.env.S3_ENDPOINT || 'not set'}`);
    console.log(`Region: ${process.env.AWS_REGION || 'us-east-1'}`);
    console.log(`Bucket: ${BUCKET_NAME}`);
    console.log(`Access Key ID: ${process.env.AWS_ACCESS_KEY_ID ? '***' + process.env.AWS_ACCESS_KEY_ID.slice(-4) : 'not set'}`);
    console.log(`Secret Access Key: ${process.env.AWS_SECRET_ACCESS_KEY ? '******' : 'not set'}`);

    // Try to list objects
    console.log('\nAttempting to list objects in bucket...');
    const command = new ListObjectsCommand({
      Bucket: BUCKET_NAME,
      Prefix: PARSED_FOLDER,
      MaxKeys: 5
    });

    const response = await s3Client.send(command);
    
    console.log('\nS3 Connection successful!');
    console.log(`Found ${response.Contents?.length || 0} objects in ${PARSED_FOLDER}/`);
    
    // Print the first few objects
    if (response.Contents && response.Contents.length > 0) {
      console.log('\nFirst few objects:');
      response.Contents.slice(0, 5).forEach(item => {
        console.log(`- ${item.Key} (${item.Size} bytes, Last modified: ${item.LastModified})`);
      });
    } else {
      console.log('No objects found in the specified path.');
    }
  } catch (error) {
    console.error('\nS3 Connection test failed:');
    console.error(error);
  }
}

// Run the test
testS3Connection();