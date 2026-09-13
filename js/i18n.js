/**
 * SMARAN Global Localization & Internationalization Engine (i18n)
 * Fully supports English (en), Assamese (as), Hindi (hi), and Khasi (kh).
 */

const SMARAN_I18N = {
  currentLang: localStorage.getItem('smaran_lang') || 'en',

  dictionaries: {
    // ==========================================
    // 1. ASSAMESE (অসমীয়া)
    // ==========================================
    as: {
      langName: 'অসমীয়া',
      tagline: 'প্ৰতিটো স্মৃতিয়েই অমূল্য',
      greeting: 'সুপ্ৰভাত, মীৰা',
      greetingSub: 'আহক আজিৰ দিনটো একেলগে কটাওঁ।',
      quote: '“শিপা একে ঠাইতে থাকিব পাৰে, কিন্তু স্মৃতিয়ে আমাক আগবাঢ়ি যাবলৈ দিয়ে।”',
      
      // Navigation
      navHome: 'মুখ্য পৃষ্ঠা',
      navMemories: 'স্মৃতি সম্ভাৰ',
      navGames: 'খেলা আৰম্ভ',
      navMyDay: 'দিনলিপি',
      navProgress: 'প্ৰগতি',
      navSettings: 'ছেটিংছ',
      navSos: 'জরুৰীকালীন সাহায্য',
      sosSubtitle: 'মীৰা, আমি আপোনাৰ লগতেই আছোঁ। সহায় এতিয়াই পাব।',

      // Hero & Journey
      todaysJourney: 'আজিৰ স্মৃতি যাত্ৰা',
      journeyProgress: '৫ টাৰ ভিতৰত ৩ টা সম্পূৰ্ণ',
      beginJourney: 'আজিৰ যাত্ৰা আৰম্ভ কৰক',
      continueJourney: 'কাৰ্যকলাপ চলাই যাওক',
      
      // Voice Hero
      talkToSmaran: 'স্মৰণৰ সৈতে কথা পাতক',
      voiceSubtext: 'আপুনি স্বাভাৱিকভাৱে কথা ক’ব পাৰে',
      voicePrompt1: 'মোৰ স্মৃতি খেলা আৰম্ভ কৰা',
      voicePrompt2: 'মোৰ পৰিয়ালৰ স্মৃতি দেখুওৱা',
      voicePrompt3: 'আজিৰ পৰৱৰ্তী কাম কি?',
      voicePrompt4: 'মোৰ স্মাৰকসমূহ কোৱা',
      voiceListening: 'শুনি আছোঁ...',
      voiceProcessing: 'বুজি আছোঁ...',
      voiceUnderstood: 'আপুনি ক’লে:',
      voiceResponseDefault: 'নিশ্চয় মীৰা বাইদেউ। আহক আৰম্ভ কৰোঁ।',
      answerByVoice: '🎙 কণ্ঠস্বৰেৰে উত্তৰ দিয়ক',

      // Memory Spotlight
      todaysMemoryTitle: 'আজিৰ মনৰ স্মৃতি',
      memoryRelation: 'নাতিনী',
      memoryStorySnippet: 'তেওঁ প্ৰতি দেওবাৰে মিঠা পিঠা লৈ আইতাক লগ কৰিবলৈ আহে।',
      playWithMemory: 'এই স্মৃতিৰ খেল খেলক →',
      addMemoryBtn: '+ স্মৃতি যোগ কৰক',

      // Game Hub
      gamesTitle: 'আহক খেলোঁ, মীৰা ❤️',
      gamesSubtitle: 'স্মৃতি, মনোযোগ আৰু চিনাকি মুহূৰ্তৰে সজোৱা আনন্দময় খেল।',
      featuredActivity: 'আজিৰ বিশেষ খেল',
      allActivities: 'সকলো খেল',
      catMemory: '❤️ স্মৃতি',
      catRecognition: '👀 পৰিচয়',
      catSound: '🎵 ধ্বনি',
      catLanguage: '🗣️ ভাষা',
      catPatterns: '🧩 আৰ্হি',
      catStories: '📖 সাধু',
      catPlaces: '🏡 চিনাকি ঠাই',
      catDaily: '⏰ দৈনিক জীৱন',
      playNow: 'এতিয়াই খেলক ▶',

      // Game Actions & States
      pairsFound: 'চিনাকি জোৰা:',
      attempts: 'প্ৰচেষ্টা:',
      backToGames: '← খেললৈ উভতি যাওক',
      hintBtn: '💡 সহায় লওক',
      listenQuestion: '🔊 প্ৰশ্ন শুনক',
      confirmAnswer: '✓ নিশ্চিত কৰক',
      tryAgain: 'পুনৰ চেষ্টা কৰক',
      wonderful: 'অতি সুন্দৰ!',
      almostThere: 'প্ৰায় হৈছে! আন এটা চেষ্টা কৰক ❤️',
      nextActivity: 'পৰৱৰ্তী খেল →',
      backToHub: 'খেলৰ তালিকালৈ উভতি যাওক 🎮',

      // Memory Garden Gamification
      gardenTitle: 'মীৰাৰ স্মৃতিৰ বাগিচা',
      gardenGrowth: '🌱 স্মৃতিৰ বাগিচাত নতুন ফুল ফুলিল!',
      streakDays: 'দিনৰ অবিৰত যাত্ৰা',
      seedsCollected: 'স্মৃতি গুটি সংগ্ৰহ',

      // My Day Reminders
      myDayTitle: 'আজিৰ দিনলিপি',
      myDaySubtitle: 'শান্তিময় আৰু সুশৃংখল দিনটোৰ বাবে মৃদু সোঁৱৰণী',
      medMorning: 'পুৱাৰ ঔষধ',
      drinkWater: 'পানী আৰু চাহ খোৱা',
      lunchTime: 'দুপৰীয়াৰ আহাৰ',
      eveningWalk: 'বাগিচাত পদচাৰণা',
      familyCall: 'পৰিয়ালৰ সৈতে কথা-বতৰা',
      completedBadge: '✓ সম্পূৰ্ণ',
      remindMeBtn: 'মোক মনত পেলাই দিয়ক',

      // Mood Check
      howAreYou: 'আজি আপোনাৰ মনটো কেনে আছে?',
      moodSub: 'আপোনাৰ অনুভূতিবোৰ আমাৰ বাবে অতি মূল্যবান।',
      moodHappy: 'আনন্দিত',
      moodGood: 'ভাল',
      moodOkay: 'সাধাৰণ',
      moodLow: 'মন গধুৰ',

      // Sound & Story
      soundsFromHomeTitle: 'ঘৰৰ চিনাকি সুৰ',
      listenPrompt: 'চকু দুটা মুদি শান্তভাৱে শুনক...',
      culturalStoriesTitle: 'সাংস্কৃতিক স্মৃতি',
      readStoryBtn: 'সাধু পঢ়ক →',
      offlineActive: 'অফলাইন মোড সক্ৰিয়',
      offlineDesc: 'ইণ্টাৰনেট নোহোৱাকৈও স্মৰণ সম্পূৰ্ণৰূপে সক্ৰিয় হৈ থাকে।',
      syncBtn: 'এতিয়াই সংমিশ্ৰণ কৰক'
    },

    // ==========================================
    // 2. ENGLISH (en)
    // ==========================================
    en: {
      langName: 'English',
      tagline: 'Because Every Memory Matters',
      greeting: 'Good Morning, Meera',
      greetingSub: "Let's spend a few joyful moments together.",
      quote: '“Roots may stay in the same place, but memories help us keep growing.”',
      
      navHome: 'Home',
      navMemories: 'Memories',
      navGames: 'Games',
      navMyDay: 'My Day',
      navProgress: 'Progress',
      navSettings: 'Settings',
      navSos: 'Emergency SOS',
      sosSubtitle: 'Meera, we are right here with you. Help is one tap away.',

      todaysJourney: "Today's Memory Journey",
      journeyProgress: '3 of 5 activities completed',
      beginJourney: "Begin Today's Journey",
      continueJourney: 'Continue Activities',

      talkToSmaran: 'Talk to SMARAN',
      voiceSubtext: 'You can speak naturally with me.',
      voicePrompt1: 'Start my memory game',
      voicePrompt2: 'Show my family memories',
      voicePrompt3: "What is my next activity?",
      voicePrompt4: 'Tell me my daily schedule',
      voiceListening: 'Listening to your voice...',
      voiceProcessing: 'Understanding...',
      voiceUnderstood: 'You said:',
      voiceResponseDefault: "Of course, Meera. Let us begin together.",
      answerByVoice: '🎙 Answer by Voice',

      todaysMemoryTitle: "Today's Cherished Memory",
      memoryRelation: 'Granddaughter',
      memoryStorySnippet: 'Visits Grandma every Sunday with fresh sweet coconut pitha.',
      playWithMemory: 'Play with this memory →',
      addMemoryBtn: '+ Add Family Memory',

      gamesTitle: "Let's Play, Meera ❤️",
      gamesSubtitle: 'Fun activities built around memories, attention and familiar things.',
      featuredActivity: "Today's Featured Activity",
      allActivities: 'All Activities',
      catMemory: '❤️ Memory',
      catRecognition: '👀 Recognition',
      catSound: '🎵 Sound',
      catLanguage: '🗣️ Language',
      catPatterns: '🧩 Patterns',
      catStories: '📖 Stories',
      catPlaces: '🏡 Familiar Places',
      catDaily: '⏰ Daily Life',
      playNow: 'Play Now ▶',

      pairsFound: 'Pairs Found:',
      attempts: 'Attempts:',
      backToGames: '← Back to Games',
      hintBtn: '💡 Gentle Hint',
      listenQuestion: '🔊 Listen to Question',
      confirmAnswer: '✓ Confirm Answer',
      tryAgain: 'Try Again',
      wonderful: 'Wonderful work!',
      almostThere: 'Almost there! Try another one ❤️',
      nextActivity: 'Next Activity →',
      backToHub: 'Back to Game Hub 🎮',

      gardenTitle: "Meera's Memory Garden",
      gardenGrowth: '🌱 Your Memory Garden Grew a New Blossom!',
      streakDays: 'Day Activity Streak',
      seedsCollected: 'Memory Seeds Collected',

      myDayTitle: 'My Daily Rhythm',
      myDaySubtitle: 'Gentle reminders that keep your day peaceful and connected',
      medMorning: 'Morning Medicine',
      drinkWater: 'Warm Water & Tea',
      lunchTime: 'Nourishing Lunch',
      eveningWalk: 'Veranda & Garden Walk',
      familyCall: 'Family Evening Call',
      completedBadge: '✓ Completed',
      remindMeBtn: 'Remind Me',

      howAreYou: 'How are you feeling today?',
      moodSub: 'Your feelings matter to us.',
      moodHappy: 'Happy',
      moodGood: 'Good',
      moodOkay: 'Okay',
      moodLow: 'Low',

      soundsFromHomeTitle: 'Sounds From Home',
      listenPrompt: 'Close your eyes and listen gently...',
      culturalStoriesTitle: 'Cultural Stories & Lore',
      readStoryBtn: 'Read Story →',
      offlineActive: 'Offline Mode Ready',
      offlineDesc: 'SMARAN is fully active on your device without internet.',
      syncBtn: 'Sync Cloud'
    },

    // ==========================================
    // 3. HINDI (हिन्दी)
    // ==========================================
    hi: {
      langName: 'हिन्दी',
      tagline: 'क्योंकि हर याद अनमोल है',
      greeting: 'सुप्रभात, मीरा ❤️',
      greetingSub: 'आइए आज कुछ सुकून भरे पल साथ बिताएं।',
      quote: '“जड़ें भले एक जगह रहें, पर यादें हमें जीवन में आगे बढ़ाती हैं।”',

      navHome: 'होम',
      navMemories: 'यादें',
      navGames: 'अभ्यास',
      navMyDay: 'दिनचर्या',
      navProgress: 'प्रगति',
      navSettings: 'सेटिंग्स',
      navSos: 'आपातकालीन सहायता (SOS)',
      sosSubtitle: 'मीरा जी, हम आपके साथ हैं। मदद तुरंत उपलब्ध है।',

      todaysJourney: 'आज की स्मृति यात्रा',
      journeyProgress: '5 में से 3 गतिविधियाँ पूरी',
      beginJourney: 'आज की यात्रा शुरू करें',
      continueJourney: 'अभ्यास जारी रखें',

      talkToSmaran: 'SMARAN से बात करें',
      voiceSubtext: 'आप अपनी आवाज़ में स्वाभाविक रूप से बोल सकते हैं।',
      voicePrompt1: 'मेरा मेमोरी गेम शुरू करो',
      voicePrompt2: 'मेरी पारिवारिक यादें दिखाओ',
      voicePrompt3: 'मेरा अगला काम क्या है?',
      voicePrompt4: 'मेरी दिनचर्या बताओ',
      voiceListening: 'सुन रहे हैं...',
      voiceProcessing: 'समझ रहे हैं...',
      voiceUnderstood: 'आपने कहा:',
      voiceResponseDefault: 'बिल्कुल मीरा जी। आइए मिलकर शुरू करते हैं।',
      answerByVoice: '🎙 बोलकर उत्तर दें',

      todaysMemoryTitle: 'आज की अनमोल याद',
      memoryRelation: 'पोती',
      memoryStorySnippet: 'हर रविवार ताज़ा मीठा पीठा लेकर दादी से मिलने आती है।',
      playWithMemory: 'इस याद से खेलें →',
      addMemoryBtn: '+ नई याद जोड़ें',

      gamesTitle: 'आइए खेलें, मीरा जी ❤️',
      gamesSubtitle: 'यादों, ध्यान और जानी-पहचानी बातों पर आधारित सुखद गतिविधियाँ।',
      featuredActivity: 'आज की मुख्य गतिविधि',
      allActivities: 'सभी गतिविधियाँ',
      catMemory: '❤️ याददाश्त',
      catRecognition: '👀 पहचान',
      catSound: '🎵 ध्वनियाँ',
      catLanguage: '🗣️ भाषा',
      catPatterns: '🧩 पैटर्न',
      catStories: '📖 कहानियाँ',
      catPlaces: '🏡 परिचित स्थान',
      catDaily: '⏰ दैनिक जीवन',
      playNow: 'अभी खेलें ▶',

      pairsFound: 'मिले जोड़े:',
      attempts: 'प्रयास:',
      backToGames: '← खेलों पर वापस जाएं',
      hintBtn: '💡 संकेत लें',
      listenQuestion: '🔊 सवाल सुनें',
      confirmAnswer: '✓ उत्तर की पुष्टि करें',
      tryAgain: 'फिर से प्रयास करें',
      wonderful: 'बहुत सुंदर!',
      almostThere: 'लगभग सही! कोई दूसरा चुनें ❤️',
      nextActivity: 'अगली गतिविधि →',
      backToHub: 'खेल सूची पर जाएं 🎮',

      gardenTitle: 'मीरा की स्मृति वाटिका',
      gardenGrowth: '🌱 आपकी स्मृति वाटिका में नया फूल खिला!',
      streakDays: 'दिनों का लगातार क्रम',
      seedsCollected: 'स्मृति बीज एकत्र हुए',

      myDayTitle: 'आज की दिनचर्या',
      myDaySubtitle: 'दिन को शांत और व्यवस्थित रखने के लिए सहज अनुस्मारक',
      medMorning: 'सुबह की दवा',
      drinkWater: 'गुनगुना पानी और चाय',
      lunchTime: 'दोपहर का भोजन',
      eveningWalk: 'बगीचे में टहलना',
      familyCall: 'परिवार से बातचीत',
      completedBadge: '✓ संपन्न',
      remindMeBtn: 'मुझे याद दिलाएं',

      howAreYou: 'आज आप कैसा महसूस कर रहे हैं?',
      moodSub: 'आपकी भावनाएं हमारे लिए महत्वपूर्ण हैं।',
      moodHappy: 'प्रसन्न',
      moodGood: 'अच्छा',
      moodOkay: 'सामान्य',
      moodLow: 'उदास',

      soundsFromHomeTitle: 'घर की जानी-पहचानी धुनें',
      listenPrompt: 'आँखें बंद करके ध्यान से सुनें...',
      culturalStoriesTitle: 'सांस्कृतिक कहानियाँ',
      readStoryBtn: 'कहानी पढ़ें →',
      offlineActive: 'ऑफ़लाइन मोड तैयार',
      offlineDesc: 'इंटरनेट के बिना भी स्मरण आपके फोन पर पूरी तरह सक्रिय है।',
      syncBtn: 'सिंक करें'
    },

    // ==========================================
    // 4. KHASI (Ka Ktien Khasi) - Authentic
    // ==========================================
    kh: {
      langName: 'Khasi',
      tagline: 'Namar man la ka jingkynmaw ka kordor',
      greeting: 'Khublei step, Meera ❤️',
      greetingSub: 'Ia kynmaw lang ia ki sngi ba kmen.',
      quote: '“Ki thied ki ieng ha kajuh ka jaka, hynrei ki jingkynmaw ki pynsan ia ngi.”',

      navHome: 'Iing',
      navMemories: 'Jingkynmaw',
      navGames: 'Gaw',
      navMyDay: 'Ka Sngi Jong Nga',
      navProgress: 'Jingsan',
      navSettings: 'Ki Jingbuh',
      navSos: 'Jingsau Kyrkieh (SOS)',
      sosSubtitle: 'Meera, ngi don bad phi. Ka jingsau ka lah ban poi kloi.',

      todaysJourney: 'Ka Jingiaid Jingkynmaw Mynta',
      journeyProgress: '3 na 5 tylli la dep',
      beginJourney: 'Sdang ia ka Jingiaid Mynta',
      continueJourney: 'Ia pyndep ia ki kam',

      talkToSmaran: 'Iakren bad SMARAN',
      voiceSubtext: 'Phi lah ban kren shai bad suk.',
      voicePrompt1: 'Sdang ia ka gaw jingkynmaw',
      voicePrompt2: 'Pyni ia ki jingkynmaw kiba ieid',
      voicePrompt3: 'Kaei ka kam kaban bud?',
      voicePrompt4: 'Iathuh ia ka por jong nga',
      voiceListening: 'Sngap ia ka ktien jong phi...',
      voiceProcessing: 'Sngewthuh ia ka jingkren...',
      voiceUnderstood: 'Phi la ong:',
      voiceResponseDefault: 'Hooid Kong Meera. To ngin ia sdang lang.',
      answerByVoice: '🎙 Kren ban jubab',

      todaysMemoryTitle: 'Ka Jingkynmaw Ba Kordor Mynta',
      memoryRelation: 'Ka Ksew (Granddaughter)',
      memoryStorySnippet: 'Ka wan jngoh ia ka Mei-rad man la ka Robibar bad ki jingbam thiang.',
      playWithMemory: 'Ia gaw bad kane ka jingkynmaw →',
      addMemoryBtn: '+ Buh Jingkynmaw Thymmai',

      gamesTitle: 'To Ngin Ia Gaw, Meera ❤️',
      gamesSubtitle: 'Ki kam ba biria ban pynkynmaw ia ki jingim kiba kordor.',
      featuredActivity: 'Ka Gaw Ba Kongsan Mynta',
      allActivities: 'Baroh Ki Gaw',
      catMemory: '❤️ Jingkynmaw',
      catRecognition: '👀 Jingithuh',
      catSound: '🎵 Ki Sur',
      catLanguage: '🗣️ Ka Ktien',
      catPatterns: '🧩 Ki Dur',
      catStories: '📖 Ki Puriskam',
      catPlaces: '🏡 Ki Jaka Ba Ieid',
      catDaily: '⏰ Ka Jingim Man Ka Sngi',
      playNow: 'Gaw Mynta ▶',

      pairsFound: 'Ki Kynhun Ba Shem:',
      attempts: 'Jingpyrshang:',
      backToGames: '← Phai Sha Ki Gaw',
      hintBtn: '💡 Jingiarap',
      listenQuestion: '🔊 Sngap ia ka jingkylli',
      confirmAnswer: '✓ Pynskhem ia ka jubab',
      tryAgain: 'Pyrshang Biang',
      wonderful: 'Bha shibun!',
      almostThere: 'Jan poi! Pyrshang biang da kawei ❤️',
      nextActivity: 'Ka Gaw Kaban Bud →',
      backToHub: 'Phai Sha Ka Thup Gaw 🎮',

      gardenTitle: 'Ka Kper Jingkynmaw Jong I Meera',
      gardenGrowth: '🌱 Ka Kper Jingkynmaw ka la phuh Syntiew Thymmai!',
      streakDays: 'Sngi ba iai gaw beit',
      seedsCollected: 'Ki Symbai Jingkynmaw',

      myDayTitle: 'Ka Por Man Ka Sngi',
      myDaySubtitle: 'Ki jingpynkynmaw ba jemnud ban pynbha ia ka sngi',
      medMorning: 'Dawai Step',
      drinkWater: 'Dih Um Sha Bad Um Syaid',
      lunchTime: 'Ja Step/Miet',
      eveningWalk: 'Iaiaid Kai Ha Kper',
      familyCall: 'Iakren Phone Bad Ka Ba-haiing',
      completedBadge: '✓ La Dep',
      remindMeBtn: 'Pynkynmaw ia nga',

      howAreYou: 'Kumno phi sngew mynta ka sngi?',
      moodSub: 'Ka jingsngew jong phi ka kordor ha ngi.',
      moodHappy: 'Kmen',
      moodGood: 'Bha',
      moodOkay: 'Thiah suk',
      moodLow: 'Sngewsih',

      soundsFromHomeTitle: 'Ki Sur Na La Shnong',
      listenPrompt: 'Khapbrip ki khmat bad sngap jemnud...',
      culturalStoriesTitle: 'Ki Khanatang Shnong',
      readStoryBtn: 'Pule Puriskam →',
      offlineActive: 'Offline Mode La Kren',
      offlineDesc: 'SMARAN ka trei pura ha ka device wat lada ym don internet.',
      syncBtn: 'Pyniasoh Internet'
    }
  },

  // Lookup helper with robust alias fallback
  t(key) {
    const dict = this.dictionaries[this.currentLang] || this.dictionaries.en;
    if (dict && dict[key] !== undefined) return dict[key];

    const aliases = {
      welcomeSub: 'greetingSub',
      voiceHeroTitle: 'talkToSmaran',
      voiceHeroSubtitle: 'voiceSubtext',
      todaysMemoryBadge: 'todaysMemoryTitle',
      ananyaRelation: 'memoryRelation',
      ananyaStory: 'memoryStorySnippet',
      memoriesSubtitle: 'myDaySubtitle'
    };

    if (aliases[key] && dict && dict[aliases[key]] !== undefined) {
      return dict[aliases[key]];
    }

    const enDict = this.dictionaries.en;
    if (enDict[key] !== undefined) return enDict[key];
    if (aliases[key] && enDict[aliases[key]] !== undefined) return enDict[aliases[key]];

    return key;
  },

  // Set active language and refresh DOM across all screens
  setLanguage(langCode) {
    if (!this.dictionaries[langCode]) {
      langCode = 'en';
    }
    this.currentLang = langCode;
    try {
      localStorage.setItem('smaran_lang', langCode);
    } catch (e) {}

    // 1. Apply translations to all DOM elements with [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    });

    // 2. Update language pill display in header
    const headerLangEl = document.getElementById('headerLangName');
    if (headerLangEl) {
      headerLangEl.textContent = this.dictionaries[langCode].langName;
    }

    // 3. Update voice recognition language if available
    if (window.smaranVoice && window.smaranVoice.recognition) {
      if (langCode === 'hi') window.smaranVoice.recognition.lang = 'hi-IN';
      else if (langCode === 'as') window.smaranVoice.recognition.lang = 'as-IN';
      else window.smaranVoice.recognition.lang = 'en-IN';
    }

    // 4. Refresh Game Hub cards
    if (window.smaranGames && typeof window.smaranGames.renderGameHub === 'function') {
      const activeCategory = document.querySelector('.game-filter-btn.active')?.getAttribute('data-category') || 'all';
      window.smaranGames.renderGameHub(activeCategory);
    }

    // 5. Refresh Memory Vault
    if (window.smaranApp && typeof window.smaranApp.renderMemoryVault === 'function') {
      window.smaranApp.renderMemoryVault();
    }
  }
};

window.i18n = SMARAN_I18N;
window.SMARAN_I18N = SMARAN_I18N;


