const mongoose = require('mongoose');

const uri = process.env.MONGO_DB_PRODUCTION_URI;
const devUri = process.env.MONGO_DB_DEV_URI;

async function connectDb() {
  await mongoose.connect(uri);
}

module.exports = connectDb;
