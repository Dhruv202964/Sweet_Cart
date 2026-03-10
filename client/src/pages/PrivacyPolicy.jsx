import React from 'react';
import { ShieldAlert } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-[40px] shadow-xl border border-amber-100">
        
        <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-8">
          <div className="bg-amber-100 p-4 rounded-full text-amber-600">
            <ShieldAlert size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Privacy Policy</h1>
            <p className="text-gray-500 font-medium mt-1">Last Updated: March 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-gray-700 font-medium leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">1. Information We Collect</h2>
            <p>At SweetCart, we are committed to protecting your privacy. We collect information that you provide directly to us when you register for an account, place an order, or contact our support team. This includes your full name, email address, mobile phone number, and delivery addresses.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">2. How We Use Your Data</h2>
            <p className="mb-3">The information we collect is used strictly for the following operational purposes:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>To process and fulfill your orders efficiently.</li>
              <li>To communicate with you regarding your order status and delivery updates.</li>
              <li>To provide customer support and respond to your inquiries.</li>
              <li>To improve our website functionality and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">3. Data Security & Encryption</h2>
            <p>We implement strict enterprise-grade security measures to maintain the safety of your personal information. Your passwords are cryptographically hashed using industry-standard bcrypt algorithms before being stored in our secure PostgreSQL database. We do not store plain-text passwords.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">4. Cookies and Local Storage</h2>
            <p>Our application uses browser local storage and session storage to maintain your active shopping cart and keep you securely logged into your account. These are essential functional tools required for the e-commerce platform to operate seamlessly.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">5. Account Deletion</h2>
            <p>You have the right to request the deletion of your personal data at any time. You can permanently delete your account, including all saved addresses and order history, directly from the "Danger Zone" within your My Account dashboard.</p>
          </section>

          <section className="bg-amber-50 p-6 rounded-2xl border border-amber-200 mt-10">
            <h2 className="text-xl font-black text-amber-900 mb-2">Contact Us Regarding Privacy</h2>
            <p className="text-amber-800">If you have any questions about this Privacy Policy or how your data is handled, please contact our administrative team at <span className="font-bold">support@sweetcart.com</span>.</p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;