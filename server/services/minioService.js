const Minio = require('minio');

let minioClient;

function getClient() {
  if (!minioClient) {
    minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  return minioClient;
}

exports.saveUserImage = async (fileName, file) =>
  getClient().putObject('pfp', `${fileName}.png`, file);

exports.getUserImage = async (fileName) =>
  getObjectAsBase64('pfp', `${fileName}.png`);

exports.saveReview = async (username, setId, files) => {
  const bucketName = `${username}-${setId}`;
  await ensureBucketExists(bucketName);

  const uploadPromises = files.map((file, i) =>
    getClient().putObject(`${username}-${setId}`, `${i}.png`, file)
  );

  return Promise.all(uploadPromises);
};

exports.getReviewImages = (username, setId) =>
  getAllObjectsAsBase64(`${username}-${setId}`);

exports.deleteReviewImages = async (username, setId) =>
  deleteImagesWithBucket(`${username}-${setId}`);

exports.deleteReviewImagesWithoutBucket = async (username, setId) => {
  const list = await listObjects(`${username}-${setId}`);
  return getClient().removeObjects(`${username}-${setId}`, list);
};

exports.deleteImage = async (fileName) => {
  await assertBucketExists('pfp');
  await getClient().removeObject('pfp', `${fileName}.png`);
};

async function deleteImagesWithBucket(bucketName) {
  await assertBucketExists(bucketName);

  const objectsList = await listObjects(bucketName);

  await getClient().removeObjects(bucketName, objectsList);
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
