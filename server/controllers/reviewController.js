/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management
 */

const router = require('express').Router();
const { mustBeAuth } = require('../middlewares/auth');
const reviewService = require('../services/reviewService');

/**
 * @swagger
 * /reviews/get/{id}:
 *   get:
 *     summary: Get a review by its ID
 *     tags:
 *       - Reviews
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the review to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the review object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 setName:
 *                   type: string
 *                 setImage:
 *                   type: string
 *                 setNumber:
 *                   type: string
 *                 setParts:
 *                   type: array
 *                   items:
 *                     type: string
 *                 setYear:
 *                   type: string
 *                 setMinifigCount:
 *                   type: number
 *                 setImages:
 *                   type: array
 *                   items:
 *                     type: string
 *                 setMinifigures:
 *                   type: array
 *                   items:
 *                     type: object
 *                 userUsername:
 *                   type: string
 *                 content:
 *                   type: string
 *       404:
 *         description: Review not found.
 */
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

/**
 * @swagger
 * /reviews/create:
 *   post:
 *     summary: Create a new review
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               setImages:
 *                 type: array
 *                 items:
 *                   type: string
 *               content:
 *                 type: string
 *             required:
 *               - _id
 *               - setImages
 *               - content
 *     responses:
 *       200:
 *         description: Review created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - Check the request payload.
 *       401:
 *         description: Unauthorized - User not authenticated.
 */
router.post('/create', mustBeAuth, async (req, res) => {
  try {
    const user = await reviewService.addReview(
      req.body,
      req.header('X-Refresh')
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

/**
 * @swagger
 * /reviews/edit:
 *   patch:
 *     summary: Update review data.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               setImages:
 *                 type: array
 *                 items:
 *                  type: string
 *             example:
 *               content: This is some text
 *               setImages: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."]
 *     responses:
 *       200:
 *         description: Review updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error updating.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       403:
 *         description: Forbidden - User not authorized to edit the review.
 *       404:
 *         description: Review not found.
 */
router.patch('/edit', mustBeAuth, async (req, res) => {
  try {
    const user = await reviewService.editReview(
      req.body,
      req.header('X-Refresh')
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  }
});

/**
 * @swagger
 * /reviews/delete/{id}:
 *   delete:
 *     summary: Delete a review by its ID
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the review to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - User not authenticated or not authorized to delete the review.
 *       403:
 *         description: Forbidden - User not authorized to delete the review.
 *       404:
 *         description: Review not found.
 */
router.delete('/delete/:id', mustBeAuth, async (req, res) => {
  try {
    const user = await reviewService.deleteReview(
      req.params.id,
      req.header('X-Refresh')
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  }
});

module.exports = router;
