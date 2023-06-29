const express = require('express');
const cors = require('cors');

function addMiddlewares(app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
}

module.exports = addMiddlewares;
