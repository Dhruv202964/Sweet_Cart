import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 🌍 NEW TRANSLATION HOOK

const PrivacyPolicy = () => {
  const { t } = useTranslation(); // 🌍 INIT

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-[40px] shadow-xl border border-amber-100">
        
        <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-8">
          <div className="bg-amber-100 p-4 rounded-full text-amber-600">
            <ShieldAlert size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{t('privacy_title', 'Privacy Policy')}</h1>
            <p className="text-gray-500 font-medium mt-1">{t('privacy_last_updated', 'Last Updated: March 2026')}</p>
          </div>
        </div>

        <div className="space-y-8 text-gray-700 font-medium leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">{t('privacy_sec1_title', '1. Information We Collect')}</h2>
            <p>{t('privacy_sec1_p', 'At SweetCart, we are committed to protecting your privacy. We collect information that you provide directly to us when you register for an account, place an order, or contact our support team. This includes your full name, email address, mobile phone number, and delivery addresses.')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">{t('privacy_sec2_title', '2. How We Use Your Data')}</h2>
            <p className="mb-3">{t('privacy_sec2_p', 'The information we collect is used strictly for the following operational purposes:')}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>{t('privacy_sec2_li1', 'To process and fulfill your orders efficiently.')}</li>
              <li>{t('privacy_sec2_li2', 'To communicate with you regarding your order status and delivery updates.')}</li>
              <li>{t('privacy_sec2_li3', 'To provide customer support and respond to your inquiries.')}</li>
              <li>{t('privacy_sec2_li4', 'To improve our website functionality and user experience.')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">{t('privacy_sec3_title', '3. Data Security & Encryption')}</h2>
            <p>{t('privacy_sec3_p', 'We implement strict enterprise-grade security measures to maintain the safety of your personal information. Your passwords are cryptographically hashed using industry-standard bcrypt algorithms before being stored in our secure PostgreSQL database. We do not store plain-text passwords.')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">{t('privacy_sec4_title', '4. Cookies and Local Storage')}</h2>
            <p>{t('privacy_sec4_p', 'Our application uses browser local storage and session storage to maintain your active shopping cart and keep you securely logged into your account. These are essential functional tools required for the e-commerce platform to operate seamlessly.')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">{t('privacy_sec5_title', '5. Account Deletion')}</h2>
            <p>{t('privacy_sec5_p', 'You have the right to request the deletion of your personal data at any time. You can permanently delete your account, including all saved addresses and order history, directly from the "Danger Zone" within your My Account dashboard.')}</p>
          </section>

          <section className="bg-amber-50 p-6 rounded-2xl border border-amber-200 mt-10">
            <h2 className="text-xl font-black text-amber-900 mb-2">{t('privacy_contact_title', 'Contact Us Regarding Privacy')}</h2>
            <p className="text-amber-800">{t('privacy_contact_p', 'If you have any questions about this Privacy Policy or how your data is handled, please contact our administrative team at')} <span className="font-bold">support@sweetcart.com</span>.</p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;