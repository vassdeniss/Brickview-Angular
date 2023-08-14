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
 *         isReviewed:
 *           type: boolean
 *           description: Whether the set is reviewed or not.
 *           example: false
 *         minifigs:
 *           type: array
 *           $ref: '#/components/schemas/Minifigure'
 *         user:
 *           $ref: '#/components/schemas/User'
 *       example:
 *         setNum: "8091-1"
 *         name: "Republic Swamp Speeder"
 *         year: 2010
 *         parts: 176
 *         image: "https://cdn.rebrickable.com/media/sets/8091-1/3953.jpg"
 *         minifigCount: 4
 *         isReviewed: false
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
 *         user:
 *           username: john_doe
 *           email: john_doe@example.com
 *           password: password123
 *           repeatPassword: password123
 *           image: some_base64_image
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
 * /allWithReviews:
 *   get:
 *     summary: Get all sets with their reviews.
 *     tags: [Sets]
 *     responses:
 *       200:
 *         description: Successfullly retrieved the sets.
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
 *                     example: "Kessel Run Millennium  Falcon"
 *                   image:
 *                     type: string
 *                     description: The set image.
 *                     example: "https://some-url"
 *                   username:
 *                     type: string
 *                     description: The user username.
 *                     example: "guest"
 *                   userImage:
 *                     type: string
 *                     description: The user image.
 *                     example: "some-base64-image"
 */
router.get('/allWithReviews', async (req, res) => {
  const reviews = await setService.getAllWithReview();
  res.status(200).json(reviews);
});

/**
 * @swagger
 * /user-collection:
 *   get:
 *     summary: Get a user's set collection
 *     tags: [Sets]
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username of the user to be searched.
 *         schema:
 *           type: string
 *           example: "guest"
 *     responses:
 *       200:
 *         description: Successfullly retrieved the set collection.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: object
 *                     properties:
 *                       image:
 *                         type: string
 *                         description: The set image.
 *                         example: "https://some-url"
 *                       username:
 *                         type: string
 *                         description: The user username.
 *                         example: "guest"
 *                   sets:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Set'
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
 */
router.get('/user-collection/:username', async (req, res) => {
  try {
    const collection = await setService.getUserCollection(req.params.username);
    res.status(200).json(collection);
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
});

/**
 * @swagger
 * /add-set:
 *   post:
 *     summary: Add a set to the user's collection
 *     tags: [Sets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               setId:
 *                 type: string
 *                 description: The set ID to add to the collection.
 *                 example: "8091"
 *     responses:
 *       200:
 *         description: Successfullly added the set to the collection.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Set not found.
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
 *       401:
 *         description: Unauthorized - User not authenticated
 */
router.post('/add-set', mustBeAuth, async (req, res) => {
  try {
    const updatedUser = await setService.addSet(
      req.body.setId,
      req.header('X-Refresh')
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  }
});

/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Delete a set from the user's collection
 *     tags: [Sets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the set to be deleted.
 *         schema:
 *           type: string
 *           example: "8091"
 *     responses:
 *       200:
 *         description: Successfully deleted the set from the collection.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
 *         description: Forbidden - User not allowed to delete.
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
 *         description: Unauthorized - User not authenticated.
 */
router.delete('/delete/:id', mustBeAuth, async (req, res) => {
  try {
    const updatedUser = await setService.deleteSet(
      req.params.id,
      req.header('X-Refresh')
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  }
});

module.exports = router;
