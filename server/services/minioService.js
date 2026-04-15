const Minio = require('minio');

const PFP_BUCKET = 'pfp';
const DEFAULT_REGION = process.env.MINIO_REGION || 'eu-central-1';

let minioClient;

function getClient() {
  if (!minioClient) {
    minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT || 9000),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  return minioClient;
}

const png = (name) => (name.endsWith('.png') ? name : `${name}.png`);
const reviewBucket = (username, setId) => `${username}-${setId}`;

const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });

exports.saveUserImage = async (fileName, file) =>
  getClient().putObject(PFP_BUCKET, png(fileName), file);

exports.getUserImage = async (fileName) =>
  getObjectAsBase64(PFP_BUCKET, png(fileName));

exports.saveReview = async (username, setId, files) => {
  const bucketName = reviewBucket(username, setId);
  await ensureBucketExists(bucketName);

  return Promise.all(
    files.map((file, i) => getClient().putObject(bucketName, png(String(i)), file))
  );
};

exports.getReviewImages = (username, setId) =>
  getAllObjectsAsBase64(reviewBucket(username, setId));

exports.deleteReviewImages = async (username, setId) =>
  deleteImagesWithBucket(reviewBucket(username, setId));

exports.deleteReviewImagesWithoutBucket = async (username, setId) => {
  const bucketName = reviewBucket(username, setId);
  const list = await listObjects(bucketName);
  if (list.length === 0) return;
  return getClient().removeObjects(bucketName, list);
};

exports.deleteImage = async (fileName) => {
  await assertBucketExists(PFP_BUCKET);
  await getClient().removeObject(PFP_BUCKET, png(fileName));
};

exports.__setClientForTests = (client) => { minioClient = client; };

async function deleteImagesWithBucket(bucketName) {
  await assertBucketExists(bucketName);

  const objectsList = await listObjects(bucketName);
  if (objectsList.length) {
    await getClient().removeObjects(bucketName, objectsList);
  }

  await getClient().removeBucket(bucketName);
}

async function getObjectAsBase64(bucketName, objectName) {
  await assertBucketExists(bucketName);

  try {
    const dataStream = await getClient().getObject(bucketName, objectName);
    if (dataStream) {
      return new Promise((resolve, reject) => {
        const chunks = [];

        dataStream.on('data', (chunk) => chunks.push(chunk));

        dataStream.on('end', () => {
          const objectData = Buffer.concat(chunks);
          const base64String = objectData.toString('base64');
          resolve(`data:image/png;base64,${base64String}`);
        });

        dataStream.on('error', (err) => {
          reject(err);
        });
      });
    }
  } catch (_) {
    return '';
  }
}

function listObjects(bucketName) {
  return new Promise((resolve, reject) => {
    const objectsList = [];
    const stream = getClient().listObjects(bucketName, '', true);
    stream.on('data', (obj) => objectsList.push(obj.name));
    stream.on('end', () => resolve(objectsList));
    stream.on('error', (err) => reject(err));
  });
}

async function getAllObjectsAsBase64(bucketName) {
  await assertBucketExists(bucketName);
  const objectsList = await listObjects(bucketName);
  return Promise.all(
    objectsList.map((objectName) => getObjectAsBase64(bucketName, objectName))
  );
}

async function ensureBucketExists(bucketName, region = 'eu-central-1') {
  const exists = await getClient().bucketExists(bucketName);
  if (!exists) {
    await getClient().makeBucket(bucketName, region);
  }
}

async function assertBucketExists(bucketName) {
  const exists = await getClient().bucketExists(bucketName);
  if (!exists) {
    throw new Error(`Bucket "${bucketName}" does not exist`);
  }
}
