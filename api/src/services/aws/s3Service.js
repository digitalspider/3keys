import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { AWS } from "../../common/constants";

const { AWS_REGION_APSE2 } = AWS.REGIONS;

let s3Client;

function getClient() {
  return new S3Client({
    region: AWS_REGION_APSE2,
  });
}

export async function upload(input) {
  s3Client ||= getClient();
  return s3Client.send(new PutObjectCommand(input));
}

export async function getObject(input) {
  s3Client ||= getClient();
  return s3Client.send(new GetObjectCommand(input));
}

export async function listFiles(input) {
  s3Client ||= getClient();
  return s3Client.send(new ListObjectsCommand(input));
}

export async function copyFile(input) {
  s3Client ||= getClient();
  return s3Client.send(new CopyObjectCommand(input));
}

export async function deleteFile(input) {
  s3Client ||= getClient();
  return s3Client.send(new DeleteObjectCommand(input));
}

export async function getObjectToBuffer(Bucket, Key) {
  const response = await getObject({
    Bucket,
    Key,
  }),

   stream = response.Body;

  return (
    new Promise() <
    Buffer >
    ((resolve, reject) => {
      const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.once('end', () => resolve(Buffer.concat(chunks)));
    stream.once('error', reject);
  }));
}
