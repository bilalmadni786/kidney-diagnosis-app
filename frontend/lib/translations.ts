export type LanguageCode = "en" | "ur" | "hi" | "ar" | "es" | "fr" | "zh";

export const LANGUAGES: { code: LanguageCode; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English",  nativeLabel: "English"   },
  { code: "ur", label: "Urdu",     nativeLabel: "اردو"      },
  { code: "hi", label: "Hindi",    nativeLabel: "हिंदी"     },
  { code: "ar", label: "Arabic",   nativeLabel: "العربية"   },
  { code: "es", label: "Spanish",  nativeLabel: "Español"   },
  { code: "fr", label: "French",   nativeLabel: "Français"  },
  { code: "zh", label: "Chinese",  nativeLabel: "中文"       },
];

export type TranslationKey =
  | "welcomeTitle"
  | "welcomeSubtitle"
  | "welcomeCreatedBy"
  | "welcomeDescription"
  | "welcomeCapabilities"
  | "welcomeDisclaimer"
  | "getStarted"
  | "typeMessage"
  | "send"
  | "uploadFile"
  | "analyzeImage"
  | "analyzing"
  | "dropzoneText"
  | "dropzoneHint"
  | "predictionResult"
  | "confidence"
  | "allProbabilities"
  | "disclaimer"
  | "you"
  | "thinking"
  | "errorNetwork"
  | "errorInvalidFile"
  | "errorAnalysis"
  | "selectLanguage"
  | "changeLanguage";

type Translations = Record<LanguageCode, Record<TranslationKey, string>>;

export const translations: Translations = {
  en: {
    welcomeTitle: "Welcome to KidneyAI",
    welcomeSubtitle: "Your Intelligent Medical Assistant",
    welcomeCreatedBy: "Created by Bilal Madni",
    welcomeDescription:
      "I'm an AI-powered medical assistant specially trained on kidney CT scan data to detect and explain kidney conditions.",
    welcomeCapabilities:
      "✓ Kidney Stones  ✓ Cysts  ✓ Tumors  ✓ Normal Conditions",
    welcomeDisclaimer:
      "⚠️ For educational purposes only. Always consult a qualified doctor.",
    getStarted: "Get Started",
    typeMessage: "Ask me anything about kidney health…",
    send: "Send",
    uploadFile: "Upload Image or PDF",
    analyzeImage: "Analyze Scan",
    analyzing: "Analyzing…",
    dropzoneText: "Drop your CT scan here",
    dropzoneHint: "JPG, PNG, or PDF · Max 20 MB",
    predictionResult: "Prediction Result",
    confidence: "Confidence",
    allProbabilities: "All Probabilities",
    disclaimer:
      "AI prediction for educational purposes only. Consult a doctor.",
    you: "You",
    thinking: "KidneyAI is thinking…",
    errorNetwork: "Cannot connect to AI server. Please try again.",
    errorInvalidFile: "Please upload a valid CT scan image (JPG, PNG) or PDF.",
    errorAnalysis: "Analysis failed. Please try another image.",
    selectLanguage: "Select Language",
    changeLanguage: "Change Language",
  },
  ur: {
    welcomeTitle: "KidneyAI میں خوش آمدید",
    welcomeSubtitle: "آپ کا ذہین طبی معاون",
    welcomeCreatedBy: "بلال مدنی کی جانب سے",
    welcomeDescription:
      "میں ایک AI طبی معاون ہوں جو گردے کے CT اسکین ڈیٹا پر تربیت یافتہ ہے۔",
    welcomeCapabilities: "✓ گردے کی پتھری  ✓ سسٹ  ✓ ٹیومر  ✓ نارمل حالت",
    welcomeDisclaimer:
      "⚠️ صرف تعلیمی مقاصد کے لیے۔ ہمیشہ ڈاکٹر سے مشورہ کریں۔",
    getStarted: "شروع کریں",
    typeMessage: "گردے کی صحت کے بارے میں پوچھیں…",
    send: "بھیجیں",
    uploadFile: "تصویر یا PDF اپلوڈ کریں",
    analyzeImage: "اسکین کا تجزیہ کریں",
    analyzing: "تجزیہ ہو رہا ہے…",
    dropzoneText: "CT اسکین یہاں ڈراپ کریں",
    dropzoneHint: "JPG، PNG یا PDF · زیادہ سے زیادہ 20 MB",
    predictionResult: "پیشگوئی کا نتیجہ",
    confidence: "اعتماد",
    allProbabilities: "تمام امکانات",
    disclaimer: "صرف تعلیمی مقاصد کے لیے AI پیشگوئی۔ ڈاکٹر سے مشورہ کریں۔",
    you: "آپ",
    thinking: "KidneyAI سوچ رہا ہے…",
    errorNetwork: "AI سرور سے رابطہ نہیں ہو سکا۔ دوبارہ کوشش کریں۔",
    errorInvalidFile: "براہ کرم درست CT اسکین تصویر (JPG، PNG) یا PDF اپلوڈ کریں۔",
    errorAnalysis: "تجزیہ ناکام رہا۔ کوئی اور تصویر آزمائیں۔",
    selectLanguage: "زبان منتخب کریں",
    changeLanguage: "زبان تبدیل کریں",
  },
  hi: {
    welcomeTitle: "KidneyAI में आपका स्वागत है",
    welcomeSubtitle: "आपका बुद्धिमान चिकित्सा सहायक",
    welcomeCreatedBy: "बिलाल मदनी द्वारा निर्मित",
    welcomeDescription:
      "मैं एक AI चिकित्सा सहायक हूँ जो किडनी CT स्कैन डेटा पर प्रशिक्षित है।",
    welcomeCapabilities:
      "✓ किडनी की पथरी  ✓ सिस्ट  ✓ ट्यूमर  ✓ सामान्य स्थिति",
    welcomeDisclaimer:
      "⚠️ केवल शैक्षिक उद्देश्यों के लिए। हमेशा डॉक्टर से सलाह लें।",
    getStarted: "शुरू करें",
    typeMessage: "किडनी स्वास्थ्य के बारे में पूछें…",
    send: "भेजें",
    uploadFile: "छवि या PDF अपलोड करें",
    analyzeImage: "स्कैन विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है…",
    dropzoneText: "CT स्कैन यहाँ डालें",
    dropzoneHint: "JPG, PNG या PDF · अधिकतम 20 MB",
    predictionResult: "भविष्यवाणी परिणाम",
    confidence: "विश्वास",
    allProbabilities: "सभी संभावनाएँ",
    disclaimer: "केवल शैक्षिक AI भविष्यवाणी। डॉक्टर से परामर्श करें।",
    you: "आप",
    thinking: "KidneyAI सोच रहा है…",
    errorNetwork: "AI सर्वर से कनेक्ट नहीं हो सका। पुनः प्रयास करें।",
    errorInvalidFile: "कृपया एक वैध CT स्कैन छवि (JPG, PNG) या PDF अपलोड करें।",
    errorAnalysis: "विश्लेषण विफल हुआ। कोई अन्य छवि आज़माएँ।",
    selectLanguage: "भाषा चुनें",
    changeLanguage: "भाषा बदलें",
  },
  ar: {
    welcomeTitle: "مرحباً بك في KidneyAI",
    welcomeSubtitle: "مساعدك الطبي الذكي",
    welcomeCreatedBy: "من إنشاء بلال مدني",
    welcomeDescription:
      "أنا مساعد طبي يعمل بالذكاء الاصطناعي، مدرّب على بيانات صور الأشعة المقطعية للكلى.",
    welcomeCapabilities:
      "✓ حصوات الكلى  ✓ الكيسات  ✓ الأورام  ✓ الحالات الطبيعية",
    welcomeDisclaimer:
      "⚠️ للأغراض التعليمية فقط. استشر دائماً طبيباً مؤهلاً.",
    getStarted: "ابدأ الآن",
    typeMessage: "اسألني عن صحة الكلى…",
    send: "إرسال",
    uploadFile: "رفع صورة أو PDF",
    analyzeImage: "تحليل الأشعة",
    analyzing: "جارٍ التحليل…",
    dropzoneText: "أسقط صورة الأشعة هنا",
    dropzoneHint: "JPG أو PNG أو PDF · الحجم الأقصى 20 ميغابايت",
    predictionResult: "نتيجة التشخيص",
    confidence: "الثقة",
    allProbabilities: "جميع الاحتمالات",
    disclaimer: "تشخيص ذكاء اصطناعي للأغراض التعليمية فقط. استشر طبيباً.",
    you: "أنت",
    thinking: "KidneyAI يفكر…",
    errorNetwork: "تعذّر الاتصال بخادم الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.",
    errorInvalidFile: "يرجى رفع صورة أشعة مقطعية صالحة (JPG, PNG) أو PDF.",
    errorAnalysis: "فشل التحليل. يرجى تجربة صورة أخرى.",
    selectLanguage: "اختر اللغة",
    changeLanguage: "تغيير اللغة",
  },
  es: {
    welcomeTitle: "Bienvenido a KidneyAI",
    welcomeSubtitle: "Tu Asistente Médico Inteligente",
    welcomeCreatedBy: "Creado por Bilal Madni",
    welcomeDescription:
      "Soy un asistente médico impulsado por IA, entrenado en datos de TC renal para detectar condiciones renales.",
    welcomeCapabilities:
      "✓ Cálculos Renales  ✓ Quistes  ✓ Tumores  ✓ Estado Normal",
    welcomeDisclaimer:
      "⚠️ Solo para fines educativos. Siempre consulte a un médico.",
    getStarted: "Comenzar",
    typeMessage: "Pregúntame sobre salud renal…",
    send: "Enviar",
    uploadFile: "Subir imagen o PDF",
    analyzeImage: "Analizar exploración",
    analyzing: "Analizando…",
    dropzoneText: "Suelta tu TC aquí",
    dropzoneHint: "JPG, PNG o PDF · Máx. 20 MB",
    predictionResult: "Resultado de predicción",
    confidence: "Confianza",
    allProbabilities: "Todas las probabilidades",
    disclaimer: "Predicción IA solo con fines educativos. Consulte a un médico.",
    you: "Tú",
    thinking: "KidneyAI está pensando…",
    errorNetwork: "No se puede conectar al servidor IA. Por favor, inténtalo de nuevo.",
    errorInvalidFile: "Por favor sube una imagen TC válida (JPG, PNG) o PDF.",
    errorAnalysis: "El análisis falló. Prueba con otra imagen.",
    selectLanguage: "Seleccionar idioma",
    changeLanguage: "Cambiar idioma",
  },
  fr: {
    welcomeTitle: "Bienvenue sur KidneyAI",
    welcomeSubtitle: "Votre Assistant Médical Intelligent",
    welcomeCreatedBy: "Créé par Bilal Madni",
    welcomeDescription:
      "Je suis un assistant médical IA entraîné sur des données de scanner rénal pour détecter les affections rénales.",
    welcomeCapabilities:
      "✓ Calculs Rénaux  ✓ Kystes  ✓ Tumeurs  ✓ État Normal",
    welcomeDisclaimer:
      "⚠️ À des fins éducatives uniquement. Consultez toujours un médecin.",
    getStarted: "Commencer",
    typeMessage: "Posez-moi vos questions sur la santé rénale…",
    send: "Envoyer",
    uploadFile: "Téléverser image ou PDF",
    analyzeImage: "Analyser le scan",
    analyzing: "Analyse en cours…",
    dropzoneText: "Déposez votre scanner ici",
    dropzoneHint: "JPG, PNG ou PDF · Max 20 Mo",
    predictionResult: "Résultat de prédiction",
    confidence: "Confiance",
    allProbabilities: "Toutes les probabilités",
    disclaimer: "Prédiction IA à des fins éducatives uniquement. Consultez un médecin.",
    you: "Vous",
    thinking: "KidneyAI réfléchit…",
    errorNetwork: "Impossible de se connecter au serveur IA. Veuillez réessayer.",
    errorInvalidFile: "Veuillez téléverser une image de scanner valide (JPG, PNG) ou un PDF.",
    errorAnalysis: "L'analyse a échoué. Veuillez essayer une autre image.",
    selectLanguage: "Choisir la langue",
    changeLanguage: "Changer de langue",
  },
  zh: {
    welcomeTitle: "欢迎使用 KidneyAI",
    welcomeSubtitle: "您的智能医疗助手",
    welcomeCreatedBy: "由 Bilal Madni 创建",
    welcomeDescription:
      "我是一款AI医疗助手，专门针对肾脏CT扫描数据训练，用于检测肾脏疾病。",
    welcomeCapabilities: "✓ 肾结石  ✓ 囊肿  ✓ 肿瘤  ✓ 正常状况",
    welcomeDisclaimer:
      "⚠️ 仅供教育目的。请务必咨询合格的医生。",
    getStarted: "开始使用",
    typeMessage: "询问有关肾脏健康的问题…",
    send: "发送",
    uploadFile: "上传图片或PDF",
    analyzeImage: "分析扫描",
    analyzing: "分析中…",
    dropzoneText: "将CT扫描拖放到此处",
    dropzoneHint: "JPG、PNG 或 PDF · 最大 20 MB",
    predictionResult: "预测结果",
    confidence: "置信度",
    allProbabilities: "所有概率",
    disclaimer: "仅供教育的AI预测，请咨询医生。",
    you: "您",
    thinking: "KidneyAI 思考中…",
    errorNetwork: "无法连接到AI服务器，请重试。",
    errorInvalidFile: "请上传有效的CT扫描图像（JPG、PNG）或PDF。",
    errorAnalysis: "分析失败，请尝试其他图像。",
    selectLanguage: "选择语言",
    changeLanguage: "更改语言",
  },
};

export function t(key: TranslationKey, lang: LanguageCode): string {
  return translations[lang]?.[key] ?? translations["en"][key];
}
