const { Client } = require('nextcloud-node-client');

const client = new Client();

exports.saveUserImage = async (fileName, file) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const folder = await client.getFolder('/pfp');
  await folder.createFile(`${fileName}.png`, file);

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
};
