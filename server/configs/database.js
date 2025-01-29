const mongoose = require('mongoose');

const uri = process.env.MONGO_DB_PRODUCTION_URI2;

async function connectDb() {
  mongoose.connect(uri);
}

module.exports = connectDb;
