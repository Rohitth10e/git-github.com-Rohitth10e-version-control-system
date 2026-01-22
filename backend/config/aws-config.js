import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({ region: "ap-south-1" });

const s3 = new AWS.S3();

const s3_bucket = process.env.S3_BUCKET;

export { s3, s3_bucket };