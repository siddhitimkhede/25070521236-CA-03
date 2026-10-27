import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await NewsletterSubscriber.findOne({ email: cleanEmail });
    if (existing) {
      if (existing.status === 'active') {
        return res.status(200).json({
          success: true,
          message: 'You are already part of the Rossele Skin inner circle.'
        });
      } else {
        existing.status = 'active';
        await existing.save();
        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.'
        });
      }
    }

    await NewsletterSubscriber.create({
      email: cleanEmail,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Welcome to ROSSELE SKIN. Enjoy a little glow in your inbox.'
    });
  } catch (error) {
    next(error);
  }
};
