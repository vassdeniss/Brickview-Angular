const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

exports.saveUserImage = async (fileName, file) => {
  minioClient.putObject('pfp', `${fileName}.png`, file, (err, _) => {
    if (err) {
      throw err;
    }
  });
};

exports.getUserImage = async (fileName) => {
  return getObjectAsBase64('pfp', `${fileName}.png`);
};

exports.saveReview = (username, setId, files) => {
  return new Promise(async (resolve, reject) => {
    const exists = await doesBucketExist(`${username}-${setId}`);
    if (!exists) {
      await createBucket(`${username}-${setId}`);
    }

    const uploadPromises = files.map((file, i) => {
      return new Promise((resolve, reject) => {
        minioClient.putObject(
          `${username}-${setId}`,
          `${i}.png`,
          file,
          (err, _) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    });

    Promise.all(uploadPromises)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

exports.getReviewImages = (username, setId) => {
  return getAllObjectsAsBase64(`${username}-${setId}`);
};

exports.deleteReviewImages = async (username, setId) =>
  deleteImagesWithBucket(`${username}-${setId}`);

function doesBucketExist(bucketName) {
  return new Promise((resolve, reject) => {
    minioClient.bucketExists(bucketName, (err, exists) => {
      if (err) {
        reject(err);
      }

      resolve(exists);
    });
  });
}

function createBucket(bucketName) {
  return new Promise((resolve, reject) => {
    minioClient.makeBucket(bucketName, 'eu-central-1', (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}

async function deleteImagesWithBucket(bucketName) {
  const exists = await doesBucketExist(bucketName);
  if (!exists) {
    throw new Error('Bucket does not exist!');
  }

  const objectsList = await listObjects(bucketName);

  await minioClient.removeObjects(bucketName, objectsList);
  await minioClient.removeBucket(bucketName);
}

function getObjectAsBase64(bucketName, objectName) {
  return new Promise(async (resolve, reject) => {
    const exists = await doesBucketExist(bucketName);
    if (!exists) {
      reject({
        message: 'Bucket does not exist!',
      });
    }

    minioClient.getObject(bucketName, objectName, (err, dataStream) => {
      if (err) {
        reject(err);
      }

      const chunks = [];

      dataStream.on('data', (chunk) => chunks.push(chunk));

      dataStream.on('end', () => {
        const objectData = Buffer.concat(chunks);
        const base64String = objectData.toString('base64');
        resolve(`data:image/png;base64,${base64String}`);
      });

      dataStream.on('error', (err) => reject(err));
    });
  });
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
  const exists = await doesBucketExist(bucketName);
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
