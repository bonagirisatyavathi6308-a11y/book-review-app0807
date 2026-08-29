import { useProfile } from "@/lib/store";

export type TranslationKey =
  | "nav.home"
  | "nav.search"
  | "nav.review"
  | "nav.promo"
  | "nav.profile"
  | "header.searchPlaceholder"
  | "header.brand"
  | "header.settings"
  | "header.language"
  | "header.editProfile"
  | "header.logout"
  | "header.reader"
  | "home.greeting"
  | "home.subtitle"
  | "home.favouriteAuthors"
  | "home.trending"
  | "home.aboutUs"
  | "home.aboutBody"
  | "search.title"
  | "search.placeholder"
  | "search.hint"
  | "search.noResults"
  | "profile.history"
  | "profile.reviews"
  | "profile.viewed"
  | "profile.reviewsCount"
  | "promo.title"
  | "promo.subtitle"
  | "promo.choose"
  | "promo.generate"
  | "promo.generating"
  | "promo.ready"
  | "promo.working"
  | "promo.unavailable"
  | "promo.failedShort";

type Dict = Partial<Record<TranslationKey, string>>;

const en: Record<TranslationKey, string> = {
  "nav.home": "Home",
  "nav.search": "Search",
  "nav.review": "Review",
  "nav.promo": "Promo",
  "nav.profile": "Profile",
  "header.searchPlaceholder": "Search books or authors",
  "header.brand": "Book Review",
  "header.settings": "Settings",
  "header.language": "Change language",
  "header.editProfile": "Edit profile",
  "header.logout": "Logout",
  "header.reader": "Reader",
  "home.greeting": "Hi",
  "home.subtitle": "Fresh picks based on the authors and genres you love.",
  "home.favouriteAuthors": "Favourite authors",
  "home.trending": "Trending now",
  "home.aboutUs": "About us",
  "home.aboutBody":
    "Book Review is a cosy corner for readers to discover books, watch promos and share honest text or audio reviews with the community.",
  "search.title": "Search",
  "search.placeholder": "Search titles, authors, topics…",
  "search.hint": "Try a category to get started.",
  "search.noResults": "No results for",
  "profile.history": "Watched history",
  "profile.reviews": "My reviews",
  "profile.viewed": "viewed",
  "profile.reviewsCount": "reviews",
  "promo.title": "Book promos",
  "promo.subtitle": "Pick a book and we’ll craft a short cinematic teaser for it.",
  "promo.choose": "Choose a book",
  "promo.generate": "Generate promo",
  "promo.generating": "Generating…",
  "promo.ready": "Promo ready",
  "promo.working": "Generating… this usually takes 1–3 minutes",
  "promo.unavailable": "Promo unavailable",
  "promo.failedShort": "Couldn’t generate this promo",
};

const hi: Dict = {
  "nav.home": "होम",
  "nav.search": "खोज",
  "nav.review": "समीक्षा",
  "nav.promo": "प्रोमो",
  "nav.profile": "प्रोफ़ाइल",
  "header.searchPlaceholder": "किताबें या लेखक खोजें",
  "header.settings": "सेटिंग्स",
  "header.language": "भाषा बदलें",
  "header.editProfile": "प्रोफ़ाइल संपादित करें",
  "header.logout": "लॉग आउट",
  "header.reader": "पाठक",
  "home.greeting": "नमस्ते",
  "home.subtitle": "आपके पसंदीदा लेखकों और शैलियों के आधार पर नई किताबें।",
  "home.favouriteAuthors": "पसंदीदा लेखक",
  "home.trending": "अभी लोकप्रिय",
  "home.aboutUs": "हमारे बारे में",
  "search.title": "खोज",
  "search.placeholder": "शीर्षक, लेखक, विषय खोजें…",
  "search.hint": "शुरू करने के लिए कोई श्रेणी चुनें।",
  "search.noResults": "कोई परिणाम नहीं",
  "profile.history": "देखा गया इतिहास",
  "profile.reviews": "मेरी समीक्षाएँ",
  "profile.viewed": "देखा",
  "profile.reviewsCount": "समीक्षाएँ",
  "promo.title": "पुस्तक प्रोमो",
  "promo.subtitle": "एक किताब चुनें और हम उसका छोटा सिनेमाई टीज़र बनाएंगे।",
  "promo.choose": "किताब चुनें",
  "promo.generate": "प्रोमो बनाएं",
  "promo.generating": "बन रहा है…",
  "promo.ready": "प्रोमो तैयार",
  "promo.working": "बन रहा है… इसमें 1–3 मिनट लगते हैं",
  "promo.unavailable": "प्रोमो उपलब्ध नहीं",
  "promo.failedShort": "यह प्रोमो नहीं बन सका",
};

const te: Dict = {
  "nav.home": "హోమ్",
  "nav.search": "వెతకండి",
  "nav.review": "సమీక్ష",
  "nav.promo": "ప్రోమో",
  "nav.profile": "ప్రొఫైల్",
  "header.searchPlaceholder": "పుస్తకాలు లేదా రచయితలను వెతకండి",
  "header.settings": "సెట్టింగ్‌లు",
  "header.language": "భాష మార్చండి",
  "header.editProfile": "ప్రొఫైల్ సవరించండి",
  "header.logout": "లాగ్ అవుట్",
  "header.reader": "పాఠకుడు",
  "home.greeting": "హాయ్",
  "home.subtitle": "మీకు ఇష్టమైన రచయితలు, శైలుల ఆధారంగా కొత్త పుస్తకాలు.",
  "home.favouriteAuthors": "ఇష్టమైన రచయితలు",
  "home.trending": "ఇప్పుడు ట్రెండింగ్",
  "home.aboutUs": "మా గురించి",
  "search.title": "వెతకండి",
  "search.placeholder": "శీర్షికలు, రచయితలు, అంశాలు…",
  "search.hint": "ప్రారంభించడానికి ఒక వర్గాన్ని ఎంచుకోండి.",
  "search.noResults": "ఫలితాలు లేవు",
  "profile.history": "చూసిన చరిత్ర",
  "profile.reviews": "నా సమీక్షలు",
  "profile.viewed": "చూశారు",
  "profile.reviewsCount": "సమీక్షలు",
  "promo.title": "పుస్తక ప్రోమోలు",
  "promo.subtitle": "ఒక పుస్తకాన్ని ఎంచుకోండి, మేము చిన్న సినిమాటిక్ టీజర్ చేస్తాం.",
  "promo.choose": "పుస్తకాన్ని ఎంచుకోండి",
  "promo.generate": "ప్రోమో చేయండి",
  "promo.generating": "తయారవుతోంది…",
  "promo.ready": "ప్రోమో సిద్ధం",
  "promo.working": "తయారవుతోంది… సాధారణంగా 1–3 నిమిషాలు",
  "promo.unavailable": "ప్రోమో అందుబాటులో లేదు",
  "promo.failedShort": "ఈ ప్రోమో తయారు కాలేదు",
};

const ta: Dict = {
  "nav.home": "முகப்பு",
  "nav.search": "தேடு",
  "nav.review": "விமர்சனம்",
  "nav.promo": "ப்ரோமோ",
  "nav.profile": "சுயவிவரம்",
  "header.searchPlaceholder": "புத்தகங்கள் அல்லது ஆசிரியர்களைத் தேடுங்கள்",
  "header.settings": "அமைப்புகள்",
  "header.language": "மொழியை மாற்று",
  "header.editProfile": "சுயவிவரத்தைத் திருத்து",
  "header.logout": "வெளியேறு",
  "header.reader": "வாசகர்",
  "home.greeting": "வணக்கம்",
  "home.subtitle": "நீங்கள் விரும்பும் ஆசிரியர்கள் மற்றும் வகைகளின் அடிப்படையில்.",
  "home.favouriteAuthors": "பிடித்த ஆசிரியர்கள்",
  "home.trending": "இப்போது பிரபலம்",
  "home.aboutUs": "எங்களைப் பற்றி",
  "search.title": "தேடு",
  "search.placeholder": "தலைப்புகள், ஆசிரியர்கள், தலைப்புகள்…",
  "search.hint": "தொடங்க ஒரு வகையைத் தேர்ந்தெடுக்கவும்.",
  "search.noResults": "முடிவுகள் இல்லை",
  "profile.history": "பார்த்த வரலாறு",
  "profile.reviews": "என் விமர்சனங்கள்",
  "profile.viewed": "பார்த்தது",
  "profile.reviewsCount": "விமர்சனங்கள்",
  "promo.title": "புத்தக ப்ரோமோக்கள்",
  "promo.subtitle": "ஒரு புத்தகத்தைத் தேர்ந்தெடுங்கள், குறும் டீசர் உருவாக்குகிறோம்.",
  "promo.choose": "புத்தகத்தைத் தேர்ந்தெடு",
  "promo.generate": "ப்ரோமோ உருவாக்கு",
  "promo.generating": "உருவாக்குகிறது…",
  "promo.ready": "ப்ரோமோ தயார்",
  "promo.working": "உருவாக்குகிறது… 1–3 நிமிடங்கள் ஆகும்",
  "promo.unavailable": "ப்ரோமோ கிடைக்கவில்லை",
  "promo.failedShort": "இந்த ப்ரோமோவை உருவாக்க முடியவில்லை",
};

const es: Dict = {
  "nav.home": "Inicio",
  "nav.search": "Buscar",
  "nav.review": "Reseña",
  "nav.promo": "Promo",
  "nav.profile": "Perfil",
  "header.searchPlaceholder": "Busca libros o autores",
  "header.settings": "Ajustes",
  "header.language": "Cambiar idioma",
  "header.editProfile": "Editar perfil",
  "header.logout": "Cerrar sesión",
  "header.reader": "Lector",
  "home.greeting": "Hola",
  "home.subtitle": "Novedades según tus autores y géneros favoritos.",
  "home.favouriteAuthors": "Autores favoritos",
  "home.trending": "Tendencias",
  "home.aboutUs": "Sobre nosotros",
  "search.title": "Buscar",
  "search.placeholder": "Títulos, autores, temas…",
  "search.hint": "Prueba una categoría para empezar.",
  "search.noResults": "Sin resultados para",
  "profile.history": "Historial visto",
  "profile.reviews": "Mis reseñas",
  "profile.viewed": "vistos",
  "profile.reviewsCount": "reseñas",
  "promo.title": "Promos de libros",
  "promo.subtitle": "Elige un libro y crearemos un teaser cinematográfico.",
  "promo.choose": "Elige un libro",
  "promo.generate": "Generar promo",
  "promo.generating": "Generando…",
  "promo.ready": "Promo lista",
  "promo.working": "Generando… suele tardar 1–3 minutos",
  "promo.unavailable": "Promo no disponible",
  "promo.failedShort": "No se pudo generar esta promo",
};

const fr: Dict = {
  "nav.home": "Accueil",
  "nav.search": "Recherche",
  "nav.review": "Avis",
  "nav.promo": "Promo",
  "nav.profile": "Profil",
  "header.searchPlaceholder": "Rechercher des livres ou auteurs",
  "header.settings": "Paramètres",
  "header.language": "Changer de langue",
  "header.editProfile": "Modifier le profil",
  "header.logout": "Déconnexion",
  "header.reader": "Lecteur",
  "home.greeting": "Bonjour",
  "home.subtitle": "Des suggestions selon vos auteurs et genres préférés.",
  "home.favouriteAuthors": "Auteurs favoris",
  "home.trending": "Tendances",
  "home.aboutUs": "À propos",
  "search.title": "Recherche",
  "search.placeholder": "Titres, auteurs, sujets…",
  "search.hint": "Essayez une catégorie pour commencer.",
  "search.noResults": "Aucun résultat pour",
  "profile.history": "Historique",
  "profile.reviews": "Mes avis",
  "profile.viewed": "consultés",
  "profile.reviewsCount": "avis",
  "promo.title": "Promos de livres",
  "promo.subtitle": "Choisissez un livre et nous créerons un teaser cinématographique.",
  "promo.choose": "Choisir un livre",
  "promo.generate": "Générer la promo",
  "promo.generating": "Génération…",
  "promo.ready": "Promo prête",
  "promo.working": "Génération… cela prend 1 à 3 minutes",
  "promo.unavailable": "Promo indisponible",
  "promo.failedShort": "Impossible de générer cette promo",
};

const de: Dict = {
  "nav.home": "Start",
  "nav.search": "Suche",
  "nav.review": "Rezension",
  "nav.promo": "Promo",
  "nav.profile": "Profil",
  "header.searchPlaceholder": "Bücher oder Autoren suchen",
  "header.settings": "Einstellungen",
  "header.language": "Sprache ändern",
  "header.editProfile": "Profil bearbeiten",
  "header.logout": "Abmelden",
  "header.reader": "Leser",
  "home.greeting": "Hallo",
  "home.subtitle": "Neue Titel nach deinen Lieblingsautoren und Genres.",
  "home.favouriteAuthors": "Lieblingsautoren",
  "home.trending": "Gerade beliebt",
  "home.aboutUs": "Über uns",
  "search.title": "Suche",
  "search.placeholder": "Titel, Autoren, Themen…",
  "search.hint": "Starte mit einer Kategorie.",
  "search.noResults": "Keine Ergebnisse für",
  "profile.history": "Verlauf",
  "profile.reviews": "Meine Rezensionen",
  "profile.viewed": "angesehen",
  "profile.reviewsCount": "Rezensionen",
  "promo.title": "Buch-Promos",
  "promo.subtitle": "Wähle ein Buch und wir erstellen einen kurzen Teaser.",
  "promo.choose": "Buch wählen",
  "promo.generate": "Promo erstellen",
  "promo.generating": "Wird erstellt…",
  "promo.ready": "Promo fertig",
  "promo.working": "Wird erstellt… dauert 1–3 Minuten",
  "promo.unavailable": "Promo nicht verfügbar",
  "promo.failedShort": "Diese Promo konnte nicht erstellt werden",
};

const ja: Dict = {
  "nav.home": "ホーム",
  "nav.search": "検索",
  "nav.review": "レビュー",
  "nav.promo": "プロモ",
  "nav.profile": "プロフィール",
  "header.searchPlaceholder": "本や著者を検索",
  "header.settings": "設定",
  "header.language": "言語を変更",
  "header.editProfile": "プロフィールを編集",
  "header.logout": "ログアウト",
  "header.reader": "読者",
  "home.greeting": "こんにちは",
  "home.subtitle": "お気に入りの著者とジャンルからの新着です。",
  "home.favouriteAuthors": "お気に入りの著者",
  "home.trending": "人気の本",
  "home.aboutUs": "私たちについて",
  "search.title": "検索",
  "search.placeholder": "タイトル、著者、トピック…",
  "search.hint": "カテゴリーから始めましょう。",
  "search.noResults": "結果がありません:",
  "profile.history": "閲覧履歴",
  "profile.reviews": "自分のレビュー",
  "profile.viewed": "閲覧",
  "profile.reviewsCount": "レビュー",
  "promo.title": "ブックプロモ",
  "promo.subtitle": "本を選ぶと、短いシネマティック予告を作ります。",
  "promo.choose": "本を選ぶ",
  "promo.generate": "プロモを作成",
  "promo.generating": "作成中…",
  "promo.ready": "プロモ完成",
  "promo.working": "作成中… 通常1〜3分かかります",
  "promo.unavailable": "プロモを利用できません",
  "promo.failedShort": "このプロモを作成できませんでした",
};

const DICTS: Record<string, Dict> = {
  English: {},
  "हिन्दी (Hindi)": hi,
  "తెలుగు (Telugu)": te,
  "தமிழ் (Tamil)": ta,
  Español: es,
  Français: fr,
  Deutsch: de,
  日本語: ja,
};

export const HTML_LANG: Record<string, string> = {
  English: "en",
  "हिन्दी (Hindi)": "hi",
  "తెలుగు (Telugu)": "te",
  "தமிழ் (Tamil)": "ta",
  Español: "es",
  Français: "fr",
  Deutsch: "de",
  日本語: "ja",
};

export function translate(language: string, key: TranslationKey): string {
  return DICTS[language]?.[key] ?? en[key];
}

/** Global translator driven by the language saved on the user profile. */
export function useT() {
  const { profile } = useProfile();
  const language = profile.language || "English";
  const t = (key: TranslationKey) => translate(language, key);
  return { t, language, htmlLang: HTML_LANG[language] ?? "en" };
}
