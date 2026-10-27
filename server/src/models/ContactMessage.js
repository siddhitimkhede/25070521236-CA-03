import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'archived'],
      default: 'unread'
    }
  },
  {
    timestamps: true
  }
);

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;
