const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const jwt = require('./lib/jwt');

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost:3000';

const addMiddlewares = require('./configs/middlewares');
const connectDb = require('./configs/database');

const routes = require('./routes');

addMiddlewares(app);

connectDb()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(`DB error: ${err}`));

app.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  const decoded = await jwt.verify(refreshToken, process.env.JWT_TOKEN);

  const { username } = decoded;
  // TODO: Finishs
});

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Legoview Express API',
      version: '1.0.0',
      description:
        'The express API behind the Legoview angular app documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'vassdeniss',
        url: 'https://github.com/vassdeniss',
        email: 'vassdeniss@gmail.com',
      },
    },
    servers: [
      {
        url: process.env.HOST,
      },
      {
        url: 'http://130.204.92.72:20302',
      },
    ],
  },
  apis: ['./controllers/*.js'],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/health', (req, res) => {
  res.status(200).send('Server health OK!');
});

app.use(routes);

app.listen(PORT, () => console.log(`Server listenng on ${HOST}`));
