const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

const connectDb = require('./configs/database');

const routes = require('./routes');

connectDb()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(`DB error: ${err}`));

app.use(cors());

app.get('/', (req, res) => {
  res.send('slash');
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
        url: 'http://localhost:3000',
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

app.use(routes);

app.listen(PORT, process.env.IPV4 | 'localhost', () =>
  console.log(`Server listenng on ${PORT}`)
);
