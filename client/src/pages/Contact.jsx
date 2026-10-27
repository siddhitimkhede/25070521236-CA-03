import React, { useState } from 'react';
import { Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const FAQS = [
  {
    q: 'Are Rossele Skin products suitable for sensitive skin?',
    a: 'Yes. Every formulation is crafted with gentle, non-comedogenic ingredients and formulated without synthetic dyes or aggressive fragrance.'
  },
  {
    q: 'How long does complimentary shipping take in India?',
    a: 'All orders over ₹1,500 receive complimentary express courier shipping. Packages dispatch from Mumbai within 24 hours and typically arrive within 2–4 business days.'
  },
  {
    q: 'Can I use Dew Veil Serum and Cloud Cream together?',
    a: 'Absolutely. In our 3-step ritual, Dew Veil hydrates deeply as Step 02, followed by Cloud Cream as Step 03 to seal in active moisture.'
  },
  {
    q: 'Is this university project integrated with a real database?',
    a: 'Yes! All products, contact inquiries, reviews, and demonstration orders persist in a local MongoDB database and can be inspected via MongoDB Compass.'
  }
];

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { addToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      addToast('Please complete all form fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitContact(formData);
      setSubmitted(true);
      addToast(res.message || 'Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      addToast(err.message || 'Failed to submit inquiry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block">
          Client Care & Concierge
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-cocoa leading-tight">
          How May We Help You?
        </h1>
        <p className="text-sm text-taupe font-light leading-relaxed">
          Whether you need personalized routine advice, shipping assistance, or press inquiries, we are here.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
        
        {/* Left: Contact Info Placeholders */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream shadow-xs space-y-6">
            <h3 className="font-serif text-2xl text-cocoa font-normal pb-3 border-b border-cream">
              Concierge Touchpoints
            </h3>

            <div className="flex items-start gap-3.5 text-xs">
              <div className="w-9 h-9 rounded-full bg-blush flex items-center justify-center text-cocoa flex-shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="font-medium text-cocoa block">Email Concierge</span>
                <span className="text-taupe font-light">care@rosseleskin.com</span>
                <span className="text-[10px] text-taupe block mt-0.5">Average response within 24 hours</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-xs">
              <div className="w-9 h-9 rounded-full bg-blush flex items-center justify-center text-cocoa flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-medium text-cocoa block">Brand Studio</span>
                <span className="text-taupe font-light">
                  Rossele Beauty House, Promenade Wing<br />
                  Mumbai, Maharashtra 400050, India
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-xs">
              <div className="w-9 h-9 rounded-full bg-blush flex items-center justify-center text-cocoa flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-medium text-cocoa block">Concierge Hours</span>
                <span className="text-taupe font-light">
                  Monday – Friday: 9:00 AM – 6:00 PM IST<br />
                  Saturday: 10:00 AM – 3:00 PM IST
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-blush-light border border-blush text-xs text-cocoa font-light leading-relaxed">
            <strong className="font-medium block mb-1">Demonstration Notice</strong>
            Messages submitted through this contact form are validated on our Express server and stored in your local MongoDB collection (<code className="font-mono text-rose-dark">contactmessages</code>).
          </div>
        </div>

        {/* Right: Working Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream shadow-card">
            <h3 className="font-serif text-2xl text-cocoa font-normal mb-2">
              Send a Message
            </h3>
            <p className="text-xs text-taupe mb-6 font-light">
              Fill in your details and we'll be in touch with thoughtful guidance.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-blush flex items-center justify-center mx-auto text-cocoa">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-2xl text-cocoa">Message Received</h4>
                <p className="text-xs text-taupe font-light max-w-sm mx-auto leading-relaxed">
                  Thank you for connecting with ROSSELE SKIN. Your inquiry has been logged in MongoDB and our concierge team will respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline rounded-xl text-xs"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-taupe block mb-1.5 font-medium">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Elena Vance"
                      className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-taupe block mb-1.5 font-medium">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-taupe block mb-1.5 font-medium">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Routine consultation or order inquiry"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-taupe block mb-1.5 font-medium">Message</label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we assist your skincare ritual today?"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary rounded-xl w-full py-4 flex items-center justify-center gap-2 text-xs shadow-soft"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting to MongoDB...' : 'Send Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <section className="bg-white rounded-3xl p-6 sm:p-12 border border-cream shadow-xs max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block mb-1">
            Common Inquiries
          </span>
          <h3 className="font-serif text-3xl text-cocoa font-normal">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="divide-y divide-cream">
          {FAQS.map((faq, index) => (
            <div key={index} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between text-left group"
              >
                <span className="font-serif text-lg text-cocoa font-normal group-hover:text-rose-dark transition-colors">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-taupe transition-transform duration-300 ${
                    openFaq === index ? 'rotate-180 text-cocoa' : ''
                  }`}
                />
              </button>
              {openFaq === index && (
                <p className="mt-2 text-xs text-taupe font-light leading-relaxed pl-1 animate-fadeIn">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
