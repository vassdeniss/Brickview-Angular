const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

exports.saveUserImage = async (fileName, file) =>
  minioClient.putObject('pfp', `${fileName}.png`, file);

exports.getUserImage = async (fileName) =>
  getObjectAsBase64('pfp', `${fileName}.png`);

exports.saveReview = async (username, setId, files) => {
  const exists = await minioClient.bucketExists(`${username}-${setId}`);
  if (!exists) {
    await minioClient.makeBucket(`${username}-${setId}`, 'eu-central-1');
  }

  const uploadPromises = files.map((file, i) =>
    minioClient.putObject(`${username}-${setId}`, `${i}.png`, file)
  );

  return Promise.all(uploadPromises);
};

exports.getReviewImages = (username, setId) =>
  getAllObjectsAsBase64(`${username}-${setId}`);

exports.deleteReviewImages = async (username, setId) =>
  deleteImagesWithBucket(`${username}-${setId}`);

exports.deleteReviewImagesWithoutBucket = async (username, setId) => {
  const list = await listObjects(`${username}-${setId}`);
  return minioClient.removeObjects(`${username}-${setId}`, list);
};

exports.deleteImage = async (fileName) => {
  const exists = await minioClient.bucketExists('pfp');
  if (!exists) {
    throw new Error('Bucket does not exist!');
  }

  await minioClient.removeObject('pfp', `${fileName}.png`);
};

async function deleteImagesWithBucket(bucketName) {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    throw new Error('Bucket does not exist!');
  }

  const objectsList = await listObjects(bucketName);

  await minioClient.removeObjects(bucketName, objectsList);
  await minioClient.removeBucket(bucketName);
}

async function getObjectAsBase64(bucketName, objectName) {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    throw new Error('Bucket does not exist!');
  }

  try {
    const dataStream = await minioClient.getObject(bucketName, objectName);
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
    const stream = minioClient.listObjects(bucketName, '', true);
    stream.on('data', (obj) => objectsList.push(obj.name));
    stream.on('end', () => resolve(objectsList));
    stream.on('error', (err) => reject(err));
  });
}

async function getAllObjectsAsBase64(bucketName) {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    throw {
      message: 'Bucket does not exist!',
    };
  }

  const objectsList = await listObjects(bucketName);
  return Promise.all(
    objectsList.map((objectName) => getObjectAsBase64(bucketName, objectName))
  );
}
