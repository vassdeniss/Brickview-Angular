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
 *     UserPublic:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user.
 *           example: 5ebd6b2bcef2b33d8c1b4f7c
 *         username:
 *           type: string
 *           description: The username of the user.
 *           example: john_doe
 *         email:
 *           type: string
 *           description: The email of the user.
 *           example: john_doe@example.com
 *         sets:
 *           type: array
 *           description: The sets of the user.
 *           items:
 *             $ref: '#/components/schemas/Set'
 *
 *     Tokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: some_jwt_token
 *         refreshToken:
 *           type: string
 *           example: some_jwt_token
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         tokens:
 *           $ref: '#/components/schemas/Tokens'
 *         user:
 *           $ref: '#/components/schemas/UserPublic'
 *         image:
 *           type: string
 *           nullable: true
 *           description: User profile image (URL/base64 depending on your minioService).
 *
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
 *     parameters:
 *       - name: X-Refresh
 *         in: header
 *         required: true
 *         description: Refresh token for the session to logout.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized - User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/logout', mustBeAuth, async (req, res) => {
  try {
    await userService.logout(req.header('X-Refresh'));
    res.status(204).end();
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || 'Something went wrong.' });
  }
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
 *             type: object
 *             required: [username, email, password, repeatPassword]
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 example: john_doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               repeatPassword:
 *                 type: string
 *                 example: password123
 *               image:
 *                 type: string
 *                 nullable: true
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Registration failed (validation or bad input)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
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

    const status = err.statusCode || 400; // register errors are usually 400
    res.status(status).json({
      message: err.message || 'Something went wrong.',
    });
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in as a user
 *     tags: [Users]
 *     parameters:
 *       - name: X-Language
 *         in: header
 *         required: false
 *         description: Language for error messages (defaults to "en").
 *         schema:
 *           type: string
 *           example: en
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', async (req, res) => {
  const language = req.header('X-Language') || 'en';

  try {
    const result = await userService.login(req.body, language);
    res.status(200).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({
      message: err.message || 'Something went wrong.',
    });
  }
});

/**
 * @swagger
 * /users/edit:
 *   patch:
 *     summary: Update user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: X-Refresh
 *         in: header
 *         required: true
 *         description: Refresh token used to identify the user.
 *         schema:
 *           type: string
 *       - name: X-Language
 *         in: header
 *         required: false
 *         description: Language for error messages (defaults to "en").
 *         schema:
 *           type: string
 *           example: en
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
 *                 nullable: true
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
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/UserPublic'
 *                 image:
 *                   type: string
 *                   nullable: true
 *       401:
 *         description: Unauthorized - User not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Validation error / bad input.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/edit', mustBeAuth, async (req, res) => {
  const language = req.header('X-Language') || 'en';

  try {
    const updatedUser = await userService.editData(
      req.body,
      req.header('X-Refresh'),
      language
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err = getMongooseErrors(err);
    }

    const status = err.statusCode || 500;
    res.status(status).json({
      message: err.message || 'Something went wrong.',
    });
  }
});

module.exports = router;
