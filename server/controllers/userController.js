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
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: The auto-generated id of the user.
 *               example: 5ebd6b2bcef2b33d8c1b4f7c
 *             username:
 *               type: string
 *               description: The username of the user
 *               example: john_doe
 *             email:
 *               type: string
 *               description: The email of the user.
 *               example: john_doe@example.com
 *             sets:
 *               type: array
 *               description: The sets of the user.
 *               $ref: '#/components/schemas/Minifigure'
 *       example:
 *         _id: 5ebd6b2bcef2b33d8c1b4f7c
 *         username: john_doe
 *         email: john_doe@example.com
 *         sets: []
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

const { getMongooseErrors } = require('../lib/errorExtractor');
const { mustBeAuth } = require('../middlewares/auth');
const userService = require('../services/userService');

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
 *           example:
 *             username: john_doe
 *             email: john_doe@example.com
 *             password: password123
 *             repeatPassword: password123
 *             image: some_base64_image
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             example:
 *               tokens:
 *                 accessToken: some_jwt_token
 *                 refreshToken: some_jwt_token
 *               user:
 *                 _id: 5ebd6b2bcef2b33d8c1b4f7c
 *                 username: john_doe
 *                 email: john_doe@example.com
 *                 sets: []
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
    if (err.name === 'ValidationError') {
      err = getMongooseErrors(err);
    }

    res.status(400).json({
      message: err.message,
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
 *               tokens:
 *                 accessToken: some_jwt_token
 *                 refreshToken: some_jwt_token
 *               user:
 *                 _id: 5ebd6b2bcef2b33d8c1b4f7c
 *                 username: john_doe
 *                 email: john_doe@example.com
 *                 sets: []
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
 *       200:
 *         description: Data updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 _id: 5ebd6b2bcef2b33d8c1b4f7c
 *                 username: john_doe
 *                 email: john_doe@example.com
 *                 sets: []
 *               image: some_base64_image
 *       400:
 *         description: Error updating.
 *       401:
 *         description: Unauthorized - User not authenticated.
 */
router.patch('/edit', mustBeAuth, async (req, res) => {
  try {
    const updatedUser = await userService.editData(
      req.body,
      req.header('X-Refresh')
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err = getMongooseErrors(err);
    }

    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
