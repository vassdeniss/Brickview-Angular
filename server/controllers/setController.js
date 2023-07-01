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
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Minifigure'
 *       example:
 *         setNum: "8091-1"
 *         name: "Republic Swamp Speeder"
 *         year: 2010
 *         parts: 176
 *         image: "https://cdn.rebrickable.com/media/sets/8091-1/3953.jpg"
 *         minifigCount: 4
 *         results:
 *           - id: 9227
 *             set_num: "fig-003834"
 *             set_name: "Barriss Offee, Black Hood and Cape"
 *             quantity: 1
 *             set_img_url: "https://cdn.rebrickable.com/media/sets/fig-003834/90508.jpg"
 *           - id: 9225
 *             set_num: "fig-002330"
 *             set_name: "Battle Droid, One Bent Arm, One Straight Arm"
 *             quantity: 2
 *             set_img_url: "https://cdn.rebrickable.com/media/sets/fig-002330/108353.jpg"
 *           - id: 9228
 *             set_num: "fig-003835"
 *             set_name: "Clone Trooper, Phase II Armor, Plain Black Head, Dotted Mouth"
 *             quantity: 1
 *             set_img_url: "https://cdn.rebrickable.com/media/sets/fig-003835/104299.jpg"
 *           - id: 9226
 *             set_num: "fig-003668"
 *             set_name: "Super Battle Droid, Pearl Dark Gray"
 *             quantity: 1
 *             set_img_url: "https://cdn.rebrickable.com/media/sets/fig-003668/102998.jpg"
 *
 *     Minifigure:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The ID of the minifigure.
 *           example: 9227
 *         set_num:
 *           type: string
 *           description: The set number of the minifigure.
 *           example: "fig-003834"
 *         set_name:
 *           type: string
 *           description: The name of the minifigure.
 *           example: "Barriss Offee, Black Hood and Cape"
 *         quantity:
 *           type: integer
 *           description: The quantity of the minifigure in the set.
 *           example: 1
 *         set_img_url:
 *           type: string
 *           format: uri
 *           description: The URL of the minifigure image.
 *           example: "https://cdn.rebrickable.com/media/sets/fig-003834/90508.jpg"
 */

const router = require('express').Router();

const setService = require('../services/setService');

/**
 * @swagger
 * /sets/{setId}:
 *   get:
 *     summary: Get set with minifigs by ID
 *     description: Retrieve a set with its associated minifigs based on the provided set ID.
 *     parameters:
 *       - in: path
 *         name: setId
 *         required: true
 *         description: The ID of the set to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. Returns the set with minifigs.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Set'
 *       '404':
 *         description: Set not found.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     tags:
 *       - Sets
 */
router.get('/:setId', async (req, res) => {
  try {
    const set = await setService.getWithMinifigs(req.params.setId);
    res.status(200).json(set);
  } catch (err) {
    res.status(404).send('Set not found!');
  }
});

module.exports = router;
