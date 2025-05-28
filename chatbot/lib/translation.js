const translations = {
    en: {
      greeting: "Hi, there 👋",
      intro: "To help you find the best MSME schemes, I need some info about your business.",
      thinking: "AI is thinking...",
      error: "Something went wrong. Please try again.",
      share: "Share",
      newChat: "New Chat",
    },
    te: {
      greeting: "హాయ్, మీరు వచ్చారు 👋",
      intro: "మీ వ్యాపారానికి అనుకూలమైన MSME పథకాలను కనుగొనడానికి మీ సమాచారం అవసరం.",
      thinking: "AI ఆలోచిస్తోంది...",
      error: "ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
      share: "షేర్ చేయండి",
      newChat: "కొత్త చాట్",
    },
    ta: {
      greeting: "வணக்கம் 👋",
      intro: "உங்களின் தொழிலுக்கு சிறந்த MSME திட்டங்களை கண்டறிய நான் உங்கள் விவரங்களை தேவைப்படுகிறேன்.",
      thinking: "AI சிந்திக்கிறது...",
      error: "ஏதோ தவறு ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
      share: "பகிர்",
      newChat: "புதிய உரையாடல்",
    },
    hi: {
      greeting: "नमस्ते 👋",
      intro: "आपके व्यवसाय के लिए सर्वोत्तम MSME योजनाएँ खोजने के लिए मुझे कुछ जानकारी चाहिए।",
      thinking: "AI सोच रहा है...",
      error: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
      share: "साझा करें",
      newChat: "नई बातचीत",
    },
    bn: {
      greeting: "হ্যালো 👋",
      intro: "আপনার ব্যবসার জন্য সেরা MSME স্কিম খুঁজে পেতে আমাকে কিছু তথ্য প্রয়োজন।",
      thinking: "AI ভাবছে...",
      error: "কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      share: "শেয়ার করুন",
      newChat: "নতুন চ্যাট",
    },
    gu: {
      greeting: "હાય 👋",
      intro: "તમારા વ્યવસાય માટે શ્રેષ્ઠ MSME યોજના શોધવા માટે મને કેટલીક માહિતી જોઈશે.",
      thinking: "AI વિચારી રહ્યો છે...",
      error: "કંઈક ખોટું થયું છે. કૃપા કરીને ફરી પ્રયાસ કરો.",
      share: "શેર કરો",
      newChat: "નવું ચેટ",
    },
  }
  
  export const getTranslation = (key, lang = "en") => {
    return translations[lang]?.[key] || translations["en"][key] || key
  }
  