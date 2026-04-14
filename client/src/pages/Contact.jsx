import React, { useState, useContext, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next'; // 🌍 NEW TRANSLATION HOOK

const Contact = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { t } = useTranslation(); // 🌍 INIT
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.full_name || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ ...formData, subject: '', message: '' }); 
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4">{t('contact_title', 'Contact Support')}</h1>
          <p className="text-xl text-gray-600 font-medium">{t('contact_subtitle', 'Have a question about your order or need help? Send us a message!')}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Contact Info Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-amber-50 p-8 rounded-[30px] border border-amber-100 flex items-start gap-4 shadow-sm">
              <div className="bg-amber-200 p-4 rounded-full text-amber-800"><MapPin size={24} /></div>
              <div>
                <h3 className="font-black text-xl text-amber-950 mb-1">{t('location_title', 'Our Location')}</h3>
                <p className="text-amber-800 font-medium">{t('loc_l1', '123 Premium Sweet Hub,')}<br/>{t('loc_l2', 'Adajan, Surat, Gujarat 395009')}</p>
              </div>
            </div>

            <div className="bg-red-50 p-8 rounded-[30px] border border-red-100 flex items-start gap-4 shadow-sm">
              <div className="bg-red-200 p-4 rounded-full text-red-800"><Phone size={24} /></div>
              <div>
                <h3 className="font-black text-xl text-red-950 mb-1">{t('phone_title', 'Phone Support')}</h3>
                <p className="text-red-800 font-medium">{t('phone_l1', '+91 98765 43210')}<br/>{t('phone_l2', 'Mon-Sat: 9AM to 8PM')}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-[30px] border border-blue-100 flex items-start gap-4 shadow-sm">
              <div className="bg-blue-200 p-4 rounded-full text-blue-800"><Mail size={24} /></div>
              <div>
                <h3 className="font-black text-xl text-blue-950 mb-1">{t('email_title', 'Email Us')}</h3>
                <p className="text-blue-800 font-medium">{t('email_l1', 'support@sweetcart.com')}<br/>{t('email_l2', 'We reply within 24 hours.')}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-2/3 bg-white p-8 md:p-10 rounded-[35px] shadow-xl border border-gray-100">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-300">
                <div className="bg-green-100 p-6 rounded-full text-green-600 mb-6">
                  <CheckCircle size={64} /> 
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">{t('inquiry_sent_title', 'Inquiry Sent!')}</h3>
                <p className="text-lg text-gray-600 font-medium">{t('inquiry_sent_desc', 'Thank you for reaching out. Our support team will review your message and reply shortly.')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">{t('form_name', 'Your Name')}</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors font-medium bg-gray-50 focus:bg-white" placeholder={t('ph_name', 'John Doe')} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">{t('form_email', 'Email Address')}</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors font-medium bg-gray-50 focus:bg-white" placeholder={t('ph_email', 'name@example.com')} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">{t('form_subject', 'Subject')}</label>
                  <input required type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors font-medium bg-gray-50 focus:bg-white" placeholder={t('ph_subject', 'e.g. Order #10005 Delivery Issue')} />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">{t('form_message', 'Your Message')}</label>
                  <textarea required name="message" value={formData.message} onChange={handleInputChange} rows="5" className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors font-medium bg-gray-50 focus:bg-white resize-none" placeholder={t('ph_message', 'How can we help you today?')}></textarea>
                </div>

                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-white text-xl bg-red-800 hover:bg-red-900 transition-all shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:scale-100">
                  {loading ? t('btn_sending', 'Sending...') : <><Send size={24} /> {t('btn_send', 'Send Inquiry')}</>}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;