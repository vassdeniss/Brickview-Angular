const express = require('express');
const cors = require('cors');

function addMiddlewares(app) {
  app.use(
    cors({
      origin: 'https://brickview.vasspass.net',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    })
  );
  app.use(express.json({ limit: '500mb' }));
  app.use(express.urlencoded({ extended: false, limit: '500mb' }));
}

module.exports = addMiddlewares;
