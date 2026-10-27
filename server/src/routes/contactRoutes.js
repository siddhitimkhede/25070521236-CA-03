import express from 'express';
import { submitContactMessage, getContactMessages } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContactMessage);
router.get('/', protect, adminOnly, getContactMessages);

export default router;
