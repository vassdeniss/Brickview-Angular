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
 *           description: The username of the user
 *           example: john_doe
 *         email:
 *           type: string
 *           description: The email of the user.
 *           example: john_doe@example.com
 *         password:
 *           type: string
 *           description: The password of the user.
 *           example: password123
 *         repeatPassword:
 *           type: string
 *           description: The repeated password.
 *           example: password123
 *         image:
 *           type: string
 *           description: The base64 encoded image.
 *           example: some_base64_image
 *       example:
 *         username: john_doe
 *         email: john_doe@example.com
 *         password: password123
 *         repeatPassword: password123
 *         image: some_base64_image
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

/**
 * @swagger
 * /users/get-logged-user:
 *   get:
 *     summary: Get current looged in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *        200:
 *         description: The user was found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *        404:
 *         description: The user was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *        401:
 *          description: Unauthorized - User not authenticated
 */
router.get('/get-logged-user', mustBeAuth, async (req, res) => {
  try {
    const user = await userService.getLoggedInUser(req.header('X-Refresh'));
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
});

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Log out a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized - User not authenticated
 */
router.get('/logout', mustBeAuth, async (req, res) => {
  await userService.logout(req.header('X-Refresh'));
  res.status(204).end();
});

/**
 * @swagger
 * /users/register:
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
    const result = await userService.register(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message.split(': ')[2],
    });
  }
});

/**
 * @swagger
 * /users/login:
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
 * /users/edit:
 *   patch:
 *     summary: Update user data
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *               deleteProfilePicture:
 *                 type: boolean
 *             example:
 *               username: john_doe
 *               profilePicture: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *               deleteProfilePicture: false
 *     responses:
 *       204:
 *         description: Data updated successfully.
 *       400:
 *         description: Error updating.
 *       401:
 *         description: Unauthorized - User not authenticated.
 */
router.patch('/edit', mustBeAuth, async (req, res) => {
  try {
    await userService.editData(req.body, req.header('X-Refresh'));
    res.status(204).end();
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
