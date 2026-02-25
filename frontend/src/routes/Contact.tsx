import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <p className="text-gray-500 text-sm tracking-[0.3em] uppercase mb-6 font-light">
            Get in Touch
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight mb-8">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-8">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2 uppercase tracking-wide">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2 uppercase tracking-wide">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors appearance-none"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Question</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="wholesale">Wholesale Opportunities</option>
                    <option value="press">Press & Media</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2 uppercase tracking-wide">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-4 text-sm font-semibold tracking-wide uppercase hover:bg-gray-800 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-8">
                  Get In Touch
                </h2>
                <p className="text-gray-600 font-light leading-relaxed mb-8">
                  Have a question about our products, shipping, or anything else?
                  We're here to help and will get back to you within 24 hours.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-8">
                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1 uppercase tracking-wide">
                      Email
                    </h3>
                    <a href="mailto:hello@logo.com" className="text-gray-600 font-light hover:text-gray-900 transition-colors">
                      hello@logo.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1 uppercase tracking-wide">
                      Phone
                    </h3>
                    <a href="tel:+1234567890" className="text-gray-600 font-light hover:text-gray-900 transition-colors">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1 uppercase tracking-wide">
                      Address
                    </h3>
                    <p className="text-gray-600 font-light">
                      123 Fashion Street<br />
                      New York, NY 10013<br />
                      United States
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1 uppercase tracking-wide">
                      Hours
                    </h3>
                    <p className="text-gray-600 font-light">
                      Monday - Friday: 9am - 6pm<br />
                      Saturday: 10am - 4pm<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                      <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 font-light">
              Find quick answers to common questions
            </p>
          </div>

          <div className="space-y-6">
            <details className="group bg-white border border-gray-200">
              <summary className="px-6 py-5 cursor-pointer list-none flex items-center justify-between">
                <span className="font-medium text-gray-900">What is your return policy?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <div className="px-6 pb-5 text-gray-600 font-light">
                We offer free returns within 30 days of purchase. Items must be unworn with tags attached.
              </div>
            </details>

            <details className="group bg-white border border-gray-200">
              <summary className="px-6 py-5 cursor-pointer list-none flex items-center justify-between">
                <span className="font-medium text-gray-900">How long does shipping take?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <div className="px-6 pb-5 text-gray-600 font-light">
                Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.
              </div>
            </details>

            <details className="group bg-white border border-gray-200">
              <summary className="px-6 py-5 cursor-pointer list-none flex items-center justify-between">
                <span className="font-medium text-gray-900">Do you ship internationally?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <div className="px-6 pb-5 text-gray-600 font-light">
                Yes, we ship to over 50 countries worldwide. International shipping times vary by location.
              </div>
            </details>

            <details className="group bg-white border border-gray-200">
              <summary className="px-6 py-5 cursor-pointer list-none flex items-center justify-between">
                <span className="font-medium text-gray-900">How do I track my order?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <div className="px-6 pb-5 text-gray-600 font-light">
                You'll receive a tracking number via email once your order ships. Use it to track your package.
              </div>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;