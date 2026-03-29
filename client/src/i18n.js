import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  eng: {
    translation: {
      // --- NAVBAR ---
      "home": "Home",
      "full_menu": "Full Menu",
      "search_placeholder": "Search for premium sweets, farsan...",
      "welcome_guest": "Welcome, Guest!",
      "sign_in_fast": "Sign in for faster checkout.",
      "my_account": "My Account & Details",
      "track_order": "Track Order",
      "admin_dash": "Admin Dashboard",
      "logout": "Logout",
      "login_register": "Login / Register",
      
      // --- FOOTER ---
      "brand_desc": "Born in the heart of Surat, we have been crafting the finest, 100% pure vegetarian sweets and farsan. Originally Shreenathji Farsan, our journey started with a single pan of premium ghee, and today we deliver smiles across the city.",
      "quick_links": "Quick Links",
      "about_us": "About Us",
      "contact_support": "Contact & Support",
      "visit_us": "Visit Us",
      "main_branch": "Main Branch:",
      "main_branch_address_1": "Navsari Bazar Rd, Rustampura,",
      "main_branch_address_2": "Surat, Gujarat 395002",
      "adajan_branch": "Adajan Branch:",
      "adajan_address_1": "Shop No.3, Green Plaza,",
      "adajan_address_2": "Subhash Chandra Bose Marg,",
      "adajan_address_3": "Adajan, Surat 395009",
      "our_branches": "Our Branches",
      "currently_serving": "Currently Serving",
      "surat_outlets": "Surat (2 Outlets)",
      "coming_soon": "Coming Soon 🚀",
      "ahmedabad": "Ahmedabad",
      "vadodara": "Vadodara",
      "mumbai": "Mumbai",
      "all_rights_reserved": "All rights reserved.",
      "privacy_policy": "Privacy Policy",
      "made_with": "Made with",
      "by": "by"
    }
  },
  hin: {
    translation: {
      // --- NAVBAR ---
      "home": "होम",
      "full_menu": "पूरा मेनू",
      "search_placeholder": "प्रीमियम मिठाइयाँ, फरसाण खोजें...",
      "welcome_guest": "नमस्ते, अतिथि!",
      "sign_in_fast": "तेज़ चेकआउट के लिए साइन इन करें।",
      "my_account": "मेरा खाता और विवरण",
      "track_order": "ऑर्डर ट्रैक करें",
      "admin_dash": "एडमिन डैशबोर्ड",
      "logout": "लॉग आउट",
      "login_register": "लॉगिन / रजिस्टर",
      
      // --- FOOTER ---
      "brand_desc": "सूरत के दिल में जन्मे, हम बेहतरीन और 100% शुद्ध शाकाहारी मिठाइयाँ और फरसाण बना रहे हैं। मूल रूप से श्रीनाथजी फरसाण, हमारी यात्रा प्रीमियम घी की एक कड़ाही से शुरू हुई थी, और आज हम पूरे शहर में मुस्कान बांटते हैं।",
      "quick_links": "त्वरित लिंक",
      "about_us": "हमारे बारे में",
      "contact_support": "संपर्क और सहायता",
      "visit_us": "हमसे मिलें",
      "main_branch": "मुख्य शाखा:",
      "main_branch_address_1": "नवसारी बाजार रोड, रुस्तमपुरा,",
      "main_branch_address_2": "सूरत, गुजरात 395002",
      "adajan_branch": "अडाजण शाखा:",
      "adajan_address_1": "शॉप नंबर 3, ग्रीन प्लाज़ा,",
      "adajan_address_2": "सुभाष चंद्र बोस मार्ग,",
      "adajan_address_3": "अडाजण, सूरत 395009",
      "our_branches": "हमारी शाखाएँ",
      "currently_serving": "वर्तमान में सेवा दे रहे हैं",
      "surat_outlets": "सूरत (2 आउटलेट)",
      "coming_soon": "जल्द आ रहा है 🚀",
      "ahmedabad": "अहमदाबाद",
      "vadodara": "वडोदरा",
      "mumbai": "मुंबई",
      "all_rights_reserved": "सभी अधिकार सुरक्षित।",
      "privacy_policy": "गोपनीयता नीति",
      "made_with": "के साथ",
      "by": "बनाया गया"
    }
  },
  guj: {
    translation: {
      // --- NAVBAR ---
      "home": "હોમ",
      "full_menu": "સંપૂર્ણ મેનૂ",
      "search_placeholder": "પ્રીમિયમ મીઠાઈઓ, ફરસાણ શોધો...",
      "welcome_guest": "નમસ્તે, મહેમાન!",
      "sign_in_fast": "ઝડપી ચેકઆઉટ માટે સાઇન ઇન કરો.",
      "my_account": "મારું ખાતું અને વિગતો",
      "track_order": "ઓર્ડર ટ્રેક કરો",
      "admin_dash": "એડમિન ડેશબોર્ડ",
      "logout": "લૉગ આઉટ",
      "login_register": "લૉગિન / રજિસ્ટર",
      
      // --- FOOTER ---
      "brand_desc": "સુરતના હૃદયમાં જન્મેલા, અમે શ્રેષ્ઠ અને 100% શુદ્ધ શાકાહારી મીઠાઈઓ અને ફરસાણ બનાવી રહ્યા છીએ. મૂળ રૂપે શ્રીનાથજી ફરસાણ, અમારી યાત્રા પ્રીમિયમ ઘી ની એક કડાઈથી શરૂ થઈ હતી, અને આજે અમે આખા શહેરમાં ખુશીઓ વહેંચીએ છીએ.",
      "quick_links": "ઝડપી લિંક્સ",
      "about_us": "અમારા વિશે",
      "contact_support": "સંપર્ક અને સહાય",
      "visit_us": "અમારી મુલાકાત લો",
      "main_branch": "મુખ્ય શાખા:",
      "main_branch_address_1": "નવસારી બજાર રોડ, રુસ્તમપુરા,",
      "main_branch_address_2": "સુરત, ગુજરાત 395002",
      "adajan_branch": "અડાજણ શાખા:",
      "adajan_address_1": "દુકાન નંબર 3, ગ્રીન પ્લાઝા,",
      "adajan_address_2": "સુભાષ ચંદ્ર બોઝ માર્ગ,",
      "adajan_address_3": "અડાજણ, સુરત 395009",
      "our_branches": "અમારી શાખાઓ",
      "currently_serving": "હાલમાં સેવા આપી રહ્યા છે",
      "surat_outlets": "સુરત (2 આઉટલેટ્સ)",
      "coming_soon": "ટૂંક સમયમાં આવી રહ્યું છે 🚀",
      "ahmedabad": "અમદાવાદ",
      "vadodara": "વડોદરા",
      "mumbai": "મુંબઈ",
      "all_rights_reserved": "તમામ હકો સુરક્ષિત.",
      "privacy_policy": "ગોપનીયતા નીતિ",
      "made_with": "સાથે",
      "by": "બનાવેલ"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'eng', // Changed fallback to 3 letters
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;