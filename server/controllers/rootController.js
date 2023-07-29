/**
 * @swagger
 * tags:
 *   name: Root
 *   description: Root endpoints
 */

const router = require('express').Router();
const { mustBeAuth } = require('../middlewares/auth');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Endpoint for testing the server's health
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: Server is ok
 *         content:
 *           text/plain:
 *             example:
 *               Server health OK!
 */
router.get('/health', (req, res) => {
  res.status(200).send('Server health OK!');
});

/**
 * @swagger
 * /validate-token:
 *   get:
 *     summary: Check the token the user provided
 *     tags: [Root]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             example:
 *               resolution: 'Authenticated'
 */
router.get('/validate-token', mustBeAuth, (req, res) => {
  res.status(200).json({
    resolution: 'Authenticated',
  });
});

module.exports = router;
