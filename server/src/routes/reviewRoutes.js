import express from 'express';
import { getProductReviews, createReview } from '../controllers/reviewController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:productId', getProductReviews);
router.post('/:productId', optionalAuth, createReview);

export default router;
