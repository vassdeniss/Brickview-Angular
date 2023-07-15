const { Client } = require('nextcloud-node-client');

const client = new Client();

exports.saveUserImage = async (fileName, file) => {
  const folder = await client.getFolder('/pfp');
  await folder.createFile(`${fileName}.png`, file);
};

exports.getUserImage = async (fileName) => {
  const folder = await client.getFolder('/pfp');
  const file = await folder.getFile(`${fileName}.png`);

  return file === null ? null : file.getContent();
};
