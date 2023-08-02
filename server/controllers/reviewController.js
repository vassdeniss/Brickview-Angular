/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The id of the review.
 *         buildExperience:
 *           type: string
 *           description: The build experience part of the review.
 *         design:
 *           type: string
 *           description: The design part of the review.
 *         minifigures:
 *           type: string
 *           description: The minifigures part of the review.
 *         value:
 *           type: string
 *           description: The value part of the review.
 *         other:
 *           type: string
 *           description: The other part of the review.
 *         verdict:
 *           type: string
 *           description: The verdict part of the review.
 *         set:
 *           $ref: '#/components/schemas/Set'
 *       example:
 *         buildExperience: "This was a fun build, but I had some issues with the stickers."
 *         design: "The design is great, but the stickers are a bit hard to apply."
 *         minifigures: "The minifigures are great, but I wish there were more."
 *         value: "The value is great, I got it on sale."
 *         other: "The set is great, but I wish there were more minifigures."
 *         verdict: "Overall, I would recommend this set."
 *         set:
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
 */

const router = require('express').Router();
const { mustBeAuth } = require('../middlewares/auth');
const reviewService = require('../services/reviewService');

router.post('/create', mustBeAuth, async (req, res) => {
  try {
    await reviewService.addReview(req.body, req.header('X-Refresh'));
    res.status(204).end();
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

router.get('/get/:id', async (req, res) => {
  try {
    const review = await reviewService.getReview(req.params.id);
    res.status(200).json(review);
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id, req.header('X-Refresh'));
    res.status(204).end();
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
});

module.exports = router;
