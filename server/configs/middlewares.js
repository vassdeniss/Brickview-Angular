const express = require('express');
const cors = require('cors');

const allowedOrigins = [
  'https://brickview.vasspass.net',
  'http://localhost:4200',
];

function addMiddlewares(app) {
  const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Authorization', 'X-Refresh', 'X-Language'],
  };

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '500mb' }));
  app.use(express.urlencoded({ extended: false, limit: '500mb' }));
}

module.exports = addMiddlewares;
