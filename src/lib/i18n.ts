import { useProfile } from "@/lib/store";

export type LanguageOption = { code: string; label: string; native: string };

/** Supported interface + content languages, with a strong focus on Indian languages. */
export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "ur", label: "Urdu", native: "اردو" },
];

export type TranslationKey =
  | "home"
  | "search"
  | "review"
  | "promo"
  | "profile"
  | "searchPlaceholder"
  | "favouriteAuthors"
  | "indianAuthors"
  | "trendingNow"
  | "aboutUs"
  | "greeting"
  | "feedSubtitle"
  | "synopsis"
  | "communityReviews"
  | "googleReviews"
  | "readOnGoogle"
  | "noReviews"
  | "writeReview"
  | "morePicks"
  | "language"
  | "editProfile"
  | "logout"
  | "ratings";

type Dict = Record<TranslationKey, string>;

const en: Dict = {
  home: "Home",
  search: "Search",
  review: "Review",
  promo: "Promo",
  profile: "Profile",
  searchPlaceholder: "Search books or authors",
  favouriteAuthors: "Favourite authors",
  indianAuthors: "Popular Indian authors",
  trendingNow: "Trending now",
  aboutUs: "About us",
  greeting: "Hi",
  feedSubtitle: "Fresh picks based on the authors and genres you love.",
  synopsis: "Synopsis",
  communityReviews: "Community reviews",
  googleReviews: "Google Books reviews",
  readOnGoogle: "Read all reviews on Google Books",
  noReviews: "No reviews yet — be the first to share your thoughts.",
  writeReview: "Write a review",
  morePicks: "More picks",
  language: "Language",
  editProfile: "Edit profile",
  logout: "Logout",
  ratings: "ratings",
};

const translations: Record<string, Partial<Dict>> = {
  hi: {
    home: "होम",
    search: "खोजें",
    review: "समीक्षा",
    promo: "प्रोमो",
    profile: "प्रोफ़ाइल",
    searchPlaceholder: "किताबें या लेखक खोजें",
    favouriteAuthors: "पसंदीदा लेखक",
    indianAuthors: "लोकप्रिय भारतीय लेखक",
    trendingNow: "अभी लोकप्रिय",
    aboutUs: "हमारे बारे में",
    greeting: "नमस्ते",
    feedSubtitle: "आपके पसंदीदा लेखकों और विधाओं पर आधारित नई किताबें।",
    synopsis: "सारांश",
    communityReviews: "पाठकों की समीक्षाएँ",
    googleReviews: "गूगल बुक्स समीक्षाएँ",
    readOnGoogle: "गूगल बुक्स पर सभी समीक्षाएँ पढ़ें",
    noReviews: "अभी कोई समीक्षा नहीं — पहली समीक्षा आप लिखें।",
    writeReview: "समीक्षा लिखें",
    morePicks: "और किताबें",
    language: "भाषा",
    editProfile: "प्रोफ़ाइल संपादित करें",
    logout: "लॉग आउट",
    ratings: "रेटिंग",
  },
  te: {
    home: "హోమ్",
    search: "వెతకండి",
    review: "సమీక్ష",
    promo: "ప్రోమో",
    profile: "ప్రొఫైల్",
    searchPlaceholder: "పుస్తకాలు లేదా రచయితలను వెతకండి",
    favouriteAuthors: "ఇష్టమైన రచయితలు",
    indianAuthors: "ప్రసిద్ధ భారతీయ రచయితలు",
    trendingNow: "ఇప్పుడు ట్రెండింగ్",
    aboutUs: "మా గురించి",
    greeting: "నమస్కారం",
    feedSubtitle: "మీకు ఇష్టమైన రచయితలు, విభాగాల ఆధారంగా కొత్త పుస్తకాలు.",
    synopsis: "సారాంశం",
    communityReviews: "పాఠకుల సమీక్షలు",
    googleReviews: "గూగుల్ బుక్స్ సమీక్షలు",
    readOnGoogle: "గూగుల్ బుక్స్‌లో అన్ని సమీక్షలు చదవండి",
    noReviews: "ఇంకా సమీక్షలు లేవు — మీరే మొదటి సమీక్ష రాయండి.",
    writeReview: "సమీక్ష రాయండి",
    morePicks: "మరిన్ని పుస్తకాలు",
    language: "భాష",
    editProfile: "ప్రొఫైల్ మార్చండి",
    logout: "లాగ్ అవుట్",
    ratings: "రేటింగ్‌లు",
  },
  ta: {
    home: "முகப்பு",
    search: "தேடு",
    review: "விமர்சனம்",
    promo: "விளம்பரம்",
    profile: "சுயவிவரம்",
    searchPlaceholder: "புத்தகங்கள் அல்லது எழுத்தாளர்களைத் தேடுங்கள்",
    favouriteAuthors: "பிடித்த எழுத்தாளர்கள்",
    indianAuthors: "பிரபல இந்திய எழுத்தாளர்கள்",
    trendingNow: "இப்போது பிரபலம்",
    aboutUs: "எங்களைப் பற்றி",
    greeting: "வணக்கம்",
    feedSubtitle: "நீங்கள் விரும்பும் எழுத்தாளர்கள், வகைகளின் அடிப்படையில் புதிய தேர்வுகள்.",
    synopsis: "சுருக்கம்",
    communityReviews: "வாசகர் விமர்சனங்கள்",
    googleReviews: "கூகுள் புக்ஸ் விமர்சனங்கள்",
    readOnGoogle: "கூகுள் புக்ஸில் அனைத்து விமர்சனங்களையும் படிக்க",
    noReviews: "இன்னும் விமர்சனங்கள் இல்லை — முதலில் நீங்கள் எழுதுங்கள்.",
    writeReview: "விமர்சனம் எழுதுங்கள்",
    morePicks: "மேலும் புத்தகங்கள்",
    language: "மொழி",
    editProfile: "சுயவிவரத்தைத் திருத்து",
    logout: "வெளியேறு",
    ratings: "மதிப்பீடுகள்",
  },
  kn: {
    home: "ಮುಖಪುಟ",
    search: "ಹುಡುಕಿ",
    review: "ವಿಮರ್ಶೆ",
    promo: "ಪ್ರೋಮೋ",
    profile: "ಪ್ರೊಫೈಲ್",
    searchPlaceholder: "ಪುಸ್ತಕ ಅಥವಾ ಲೇಖಕರನ್ನು ಹುಡುಕಿ",
    favouriteAuthors: "ಮೆಚ್ಚಿನ ಲೇಖಕರು",
    indianAuthors: "ಜನಪ್ರಿಯ ಭಾರತೀಯ ಲೇಖಕರು",
    trendingNow: "ಈಗ ಜನಪ್ರಿಯ",
    aboutUs: "ನಮ್ಮ ಬಗ್ಗೆ",
    greeting: "ನಮಸ್ಕಾರ",
    synopsis: "ಸಾರಾಂಶ",
    communityReviews: "ಓದುಗರ ವಿಮರ್ಶೆಗಳು",
    googleReviews: "ಗೂಗಲ್ ಬುಕ್ಸ್ ವಿಮರ್ಶೆಗಳು",
    writeReview: "ವಿಮರ್ಶೆ ಬರೆಯಿರಿ",
    language: "ಭಾಷೆ",
    logout: "ಲಾಗ್ ಔಟ್",
  },
  ml: {
    home: "ഹോം",
    search: "തിരയുക",
    review: "അവലോകനം",
    promo: "പ്രോമോ",
    profile: "പ്രൊഫൈൽ",
    searchPlaceholder: "പുസ്തകങ്ങളോ എഴുത്തുകാരെയോ തിരയുക",
    favouriteAuthors: "പ്രിയ എഴുത്തുകാർ",
    indianAuthors: "പ്രശസ്ത ഇന്ത്യൻ എഴുത്തുകാർ",
    trendingNow: "ഇപ്പോൾ ട്രെൻഡിംഗ്",
    aboutUs: "ഞങ്ങളെക്കുറിച്ച്",
    greeting: "നമസ്കാരം",
    synopsis: "സംഗ്രഹം",
    communityReviews: "വായനക്കാരുടെ അവലോകനങ്ങൾ",
    googleReviews: "ഗൂഗിൾ ബുക്സ് അവലോകനങ്ങൾ",
    writeReview: "അവലോകനം എഴുതുക",
    language: "ഭാഷ",
    logout: "ലോഗ് ഔട്ട്",
  },
  bn: {
    home: "হোম",
    search: "খুঁজুন",
    review: "রিভিউ",
    promo: "প্রোমো",
    profile: "প্রোফাইল",
    searchPlaceholder: "বই বা লেখক খুঁজুন",
    favouriteAuthors: "প্রিয় লেখক",
    indianAuthors: "জনপ্রিয় ভারতীয় লেখক",
    trendingNow: "এখন জনপ্রিয়",
    aboutUs: "আমাদের সম্পর্কে",
    greeting: "নমস্কার",
    synopsis: "সারসংক্ষেপ",
    communityReviews: "পাঠকের রিভিউ",
    googleReviews: "গুগল বুকস রিভিউ",
    writeReview: "রিভিউ লিখুন",
    language: "ভাষা",
    logout: "লগ আউট",
  },
  mr: {
    home: "मुख्यपृष्ठ",
    search: "शोधा",
    review: "परीक्षण",
    promo: "प्रोमो",
    profile: "प्रोफाइल",
    searchPlaceholder: "पुस्तके किंवा लेखक शोधा",
    favouriteAuthors: "आवडते लेखक",
    indianAuthors: "लोकप्रिय भारतीय लेखक",
    trendingNow: "सध्या लोकप्रिय",
    aboutUs: "आमच्याविषयी",
    greeting: "नमस्कार",
    synopsis: "सारांश",
    communityReviews: "वाचकांची परीक्षणे",
    googleReviews: "गूगल बुक्स परीक्षणे",
    writeReview: "परीक्षण लिहा",
    language: "भाषा",
    logout: "बाहेर पडा",
  },
  gu: {
    home: "હોમ",
    search: "શોધો",
    review: "સમીક્ષા",
    promo: "પ્રોમો",
    profile: "પ્રોફાઇલ",
    searchPlaceholder: "પુસ્તકો કે લેખકો શોધો",
    favouriteAuthors: "પ્રિય લેખકો",
    indianAuthors: "લોકપ્રિય ભારતીય લેખકો",
    trendingNow: "અત્યારે લોકપ્રિય",
    aboutUs: "અમારા વિશે",
    greeting: "નમસ્તે",
    synopsis: "સારાંશ",
    communityReviews: "વાચકોની સમીક્ષાઓ",
    googleReviews: "ગૂગલ બુક્સ સમીક્ષાઓ",
    writeReview: "સમીક્ષા લખો",
    language: "ભાષા",
    logout: "લોગ આઉટ",
  },
  pa: {
    home: "ਹੋਮ",
    search: "ਖੋਜੋ",
    review: "ਸਮੀਖਿਆ",
    promo: "ਪ੍ਰੋਮੋ",
    profile: "ਪ੍ਰੋਫਾਈਲ",
    searchPlaceholder: "ਕਿਤਾਬਾਂ ਜਾਂ ਲੇਖਕ ਖੋਜੋ",
    favouriteAuthors: "ਪਸੰਦੀਦਾ ਲੇਖਕ",
    indianAuthors: "ਮਸ਼ਹੂਰ ਭਾਰਤੀ ਲੇਖਕ",
    trendingNow: "ਹੁਣ ਪ੍ਰਚਲਿਤ",
    aboutUs: "ਸਾਡੇ ਬਾਰੇ",
    greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    synopsis: "ਸਾਰ",
    communityReviews: "ਪਾਠਕਾਂ ਦੀਆਂ ਸਮੀਖਿਆਵਾਂ",
    googleReviews: "ਗੂਗਲ ਬੁੱਕਸ ਸਮੀਖਿਆਵਾਂ",
    writeReview: "ਸਮੀਖਿਆ ਲਿਖੋ",
    language: "ਭਾਸ਼ਾ",
    logout: "ਲਾਗ ਆਊਟ",
  },
  or: {
    home: "ହୋମ୍",
    search: "ଖୋଜନ୍ତୁ",
    review: "ସମୀକ୍ଷା",
    promo: "ପ୍ରୋମୋ",
    profile: "ପ୍ରୋଫାଇଲ୍",
    searchPlaceholder: "ପୁସ୍ତକ କିମ୍ବା ଲେଖକ ଖୋଜନ୍ତୁ",
    favouriteAuthors: "ପ୍ରିୟ ଲେଖକ",
    indianAuthors: "ଲୋକପ୍ରିୟ ଭାରତୀୟ ଲେଖକ",
    trendingNow: "ବର୍ତ୍ତମାନ ଲୋକପ୍ରିୟ",
    aboutUs: "ଆମ ବିଷୟରେ",
    greeting: "ନମସ୍କାର",
    synopsis: "ସାରାଂଶ",
    communityReviews: "ପାଠକ ସମୀକ୍ଷା",
    googleReviews: "ଗୁଗଲ ବୁକ୍ସ ସମୀକ୍ଷା",
    writeReview: "ସମୀକ୍ଷା ଲେଖନ୍ତୁ",
    language: "ଭାଷା",
    logout: "ଲଗ୍ ଆଉଟ୍",
  },
  ur: {
    home: "ہوم",
    search: "تلاش",
    review: "تبصرہ",
    promo: "پرومو",
    profile: "پروفائل",
    searchPlaceholder: "کتابیں یا مصنفین تلاش کریں",
    favouriteAuthors: "پسندیدہ مصنفین",
    indianAuthors: "مشہور بھارتی مصنفین",
    trendingNow: "ابھی مقبول",
    aboutUs: "ہمارے بارے میں",
    greeting: "السلام علیکم",
    synopsis: "خلاصہ",
    communityReviews: "قارئین کے تبصرے",
    googleReviews: "گوگل بکس تبصرے",
    writeReview: "تبصرہ لکھیں",
    language: "زبان",
    logout: "لاگ آؤٹ",
  },
};

/** Accepts a stored language code or a legacy label and returns a supported code. */
export function normalizeLanguage(value: string | undefined): string {
  if (!value) return "en";
  const match = LANGUAGES.find(
    (l) => l.code === value || l.label === value || l.native === value || value.includes(l.native),
  );
  return match?.code ?? "en";
}

export function translate(code: string, key: TranslationKey): string {
  return translations[normalizeLanguage(code)]?.[key] ?? en[key];
}

/** Hook returning a translate function bound to the user's selected language. */
export function useT() {
  const { profile } = useProfile();
  const code = normalizeLanguage(profile.language);
  const t = (key: TranslationKey) => translate(code, key);
  return { t, lang: code, rtl: code === "ur" };
}
