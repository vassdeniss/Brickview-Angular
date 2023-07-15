/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *         email:
 *           type: string
 *           description: The email of the user.
 *         password:
 *           type: string
 *           description: The password of the user.
 *         repeatPassword:
 *           type: string
 *           description: The repeated password.
 *       example:
 *         username: john_doe
 *         email: john_doe@example.com
 *         password: password123
 *         repeatPassword: password123
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: The error message.
 *       example:
 *         message: An error occurred
 */

const router = require('express').Router();

const { mustBeAuth } = require('../middlewares/auth');
const userService = require('../services/userService');
const nexcloudService = require('../services/nextcloudService');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             example:
 *               accessToken: some_jwt_token
 *               refreshToken: some_jwt_token
 *       400:
 *         description: Registration failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', async (req, res) => {
  try {
    if (req.body.image) {
      const base64String = req.body.image;
      const base64Data = base64String.replace(/^data:image\/(\w+);base64,/, '');
      const file = Buffer.from(base64Data, 'base64');
      await nexcloudService.saveUserImage(req.body.email, file);
    }

    const result = await userService.register(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in as a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             email: john_doe@example.com
 *             password: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               accessToken: some_jwt_token
 *               refreshToken: some_jwt_token
 *               image: some_base64_image
 *       400:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logout successful
 */
router.get('/logout', mustBeAuth, async (req, res) => {
  await userService.logout(req.header('X-Refresh'));
  res.status(204).end();
});

module.exports = router;
