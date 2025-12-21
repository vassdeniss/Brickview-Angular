/**
 * @swagger
 * tags:
 *   name: Sets
 *   description: Set management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Set:
 *       type: object
 *       properties:
 *         setNum:
 *           type: string
 *           description: The set number.
 *           example: "8091-1"
 *         name:
 *           type: string
 *           description: The name of the set.
 *           example: "Republic Swamp Speeder"
 *         year:
 *           type: integer
 *           description: The year the set was released.
 *           example: 2010
 *         parts:
 *           type: integer
 *           description: The number of parts in the set.
 *           example: 176
 *         image:
 *           type: string
 *           format: uri
 *           description: The URL of the set image.
 *           example: "https://cdn.rebrickable.com/media/sets/8091-1/3953.jpg"
 *         minifigCount:
 *           type: integer
 *           description: The total count of minifigures.
 *           example: 4
 *         minifigs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Minifigure'
 *         content:
 *           type: string
 *           description: The review itself.
 *           example: "Some very long review text."
 *         reviewDate:
 *           type: string
 *           format: date
 *           description: The date the review was created.
 *           example: "2021-01-01"
 *         videoIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["195fa1", "vj1oa9"]
 *       example:
 *         setNum: "8091-1"
 *         name: "Republic Swamp Speeder"
 *         year: 2010
 *         parts: 176
 *         image: "https://cdn.rebrickable.com/media/sets/8091-1/3953.jpg"
 *         minifigCount: 4
 *         content: "Some very long review text."
 *         reviewDate: "2021-01-01"
 *         minifigs:
 *           - name: "Barriss Offee, Black Hood and Cape"
 *             quantity: 1
 *             image: "https://cdn.rebrickable.com/media/sets/fig-003834/90508.jpg"
 *           - name: "Battle Droid, One Bent Arm, One Straight Arm"
 *             quantity: 2
 *             image: "https://cdn.rebrickable.com/media/sets/fig-002330/108353.jpg"
 *           - name: "Clone Trooper, Phase II Armor, Plain Black Head, Dotted Mouth"
 *             quantity: 1
 *             image: "https://cdn.rebrickable.com/media/sets/fig-003835/104299.jpg"
 *           - name: "Super Battle Droid, Pearl Dark Gray"
 *             quantity: 1
 *             image: "https://cdn.rebrickable.com/media/sets/fig-003668/102998.jpg"
 *         videoIds:
 *           - "195fa1"
 *           - "vj1oa9"
 *
 *     Minifigure:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the minifigure.
 *           example: "Barriss Offee, Black Hood and Cape"
 *         quantity:
 *           type: integer
 *           description: The quantity of the minifigure in the set.
 *           example: 1
 *         image:
 *           type: string
 *           format: uri
 *           description: The URL of the minifigure image.
 *           example: "https://cdn.rebrickable.com/media/sets/fig-003834/90508.jpg"
 *       example:
 *         name: "Barriss Offee, Black Hood and Cape"
 *         quantity: 1
 *         image: "https://cdn.rebrickable.com/media/sets/fig-003834/90508.jpg"
 */

const router = require('express').Router();
const { mustBeAuth } = require('../middlewares/auth');
const setService = require('../services/setService');

/**
 * @swagger
 * /sets/allWithReviews:
 *   get:
 *     summary: Get all sets with their reviews.
 *     tags: [Sets]
 *     parameters:
 *       - name: setNumber
 *         in: query
 *         required: false
 *         description: Optional filter for set number (partial match).
 *         schema:
 *           type: string
 *           example: "8091"
 *     responses:
 *       200:
 *         description: Successfully retrieved the sets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The set ID.
 *                     example: "918fh18j102"
 *                   name:
 *                     type: string
 *                     description: The set name.
 *                     example: "Kessel Run Millennium Falcon"
 *                   image:
 *                     type: string
 *                     description: The set image URL.
 *                     example: "https://some-url"
 *                   username:
 *                     type: string
 *                     description: The username of the reviewer.
 *                     example: "guest"
 *                   userImage:
 *                     type: string
 *                     description: The user profile image (e.g., URL or base64).
 *                     example: "some-base64-image"
 *                   reviewDate:
 *                     type: string
 *                     description: The date the review was created (localized).
 *                     example: "January 1, 2021"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong."
 */
router.get('/allWithReviews', async (req, res) => {
  try {
    const reviews = await setService.getAllWithReview(req.query.setNumber);
    res.status(200).json(reviews);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({
      message: err.message || 'Something went wrong.',
    });
  }
});

/**
 * @swagger
 * /sets/user-collection/{username}:
 *   get:
 *     summary: Get a user's set collection.
 *     tags: [Sets]
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username of the user to be searched.
 *         schema:
 *           type: string
 *           example: "guest"
 *       - name: X-Language
 *         in: header
 *         required: false
 *         description: Language for error messages (defaults to "en").
 *         schema:
 *           type: string
 *           example: "en"
 *     responses:
 *       200:
 *         description: Successfully retrieved the set collection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     image:
 *                       type: string
 *                       description: The user profile image URL.
 *                       example: "https://some-url"
 *                     username:
 *                       type: string
 *                       description: The username.
 *                       example: "guest"
 *                 sets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Set'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "User not found!"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong."
 */
router.get('/user-collection/:username', async (req, res) => {
  const { username } = req.params;
  const language = req.header('X-Language') || 'en';

  try {
    const collection = await setService.getUserCollection(username, language);
    res.status(200).json(collection);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({
      message: err.message || 'Something went wrong.',
    });
  }
});

/**
 * @swagger
 * /sets/add-set:
 *   post:
 *     summary: Add a set to the user's collection.
 *     tags: [Sets]
 *     security:
 *       - BearerAuth: []
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
 *           example: "en"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               setId:
 *                 type: string
 *                 description: The Rebrickable set base ID to add to the collection (without the -1 suffix).
 *                 example: "8091"
 *     responses:
 *       200:
 *         description: Successfully added the set to the collection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "setId is required."
 *       401:
 *         description: User not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized."
 *       404:
 *         description: Set or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Set not found!"
 *       409:
 *         description: Set already exists in collection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Set already exists in collection!"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong."
 */
router.post('/add-set', mustBeAuth, async (req, res) => {
  const language = req.header('X-Language') || 'en';
  const refreshToken = req.header('X-Refresh');

  try {
    const updatedUser = await setService.addSet(
      req.body.setId,
      refreshToken,
      language
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({
      message: err.message || 'Something went wrong.',
    });
  }
});

/**
 * @swagger
 * /sets/delete/{id}:
 *   delete:
 *     summary: Delete a set from the user's collection.
 *     tags: [Sets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the set document to be deleted.
 *         schema:
 *           type: string
 *           example: "665b3e4f1b0f3fa41c123456"
 *       - name: X-Language
 *         in: header
 *         required: false
 *         description: Language for error messages (defaults to "en").
 *         schema:
 *           type: string
 *           example: "en"
 *     responses:
 *       200:
 *         description: Successfully deleted the set from the collection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Set not found in the collection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Set not found!"
 *       403:
 *         description: User not allowed to delete this set.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "You are not authorized to delete this set!"
 *       401:
 *         description: User not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong."
 */
router.delete('/delete/:id', mustBeAuth, async (req, res) => {
  const language = req.header('X-Language') || 'en';

  try {
    const updatedUser = await setService.deleteSet(
      req.params.id,
      req.header('X-Refresh'),
      language
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({
      message: err.message || 'Something went wrong.',
    });
  }
});

module.exports = router;
