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
  return new Promise((resolve, reject) => {
    minioClient.getObject('pfp', `${fileName}.png`, (err, stream) => {
      if (err) {
        reject(err);
      }

      const chunks = [];

      stream.on('data', function (chunk) {
        chunks.push(chunk);
      });

      stream.on('end', function () {
        const objectContent = Buffer.concat(chunks);
        const base64String = objectContent.toString('base64');

        resolve(`data:image/png;base64,${base64String}`);
      });
    });
  });
};
