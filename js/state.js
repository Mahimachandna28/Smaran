/**
 * SMARAN Global State & Cognitive Game Library Data Store
 */

const SMARAN_STATE = {
  currentRegion: 'assam',
  currentLang: 'en', // 'en', 'as', 'hi', 'kh'
  currentMode: 'elderly', // 'elderly' or 'caregiver'
  currentView: 'home', // 'home', 'games', 'game-player', 'vault', 'reminders', 'caregiver', 'world'
  isOffline: false,
  offlineSyncPending: 8,
  soundEnabled: true,
  voiceGuidance: true,
  fontScale: 'normal',
  highContrast: false,
  reduceMotion: false,
  activeSoundscape: null,
  activeSoundscapeTitle: 'Assam Morning',
  isPlayingSoundscape: false,
  
  // Meera's Persistent Profile & Gamification
  user: {
    name: 'Meera Sharma',
    nativeName: 'মীৰা শৰ্মা',
    age: 72,
    state: 'Assam',
    city: 'Tezpur / Guwahati',
    primaryLanguage: 'Assamese (অসমীয়া)',
    pin: '1234',
    isLoggedIn: true,
    avatar: '👵',
    stats: {
      memorySeeds: 48,
      stars: 14,
      dayStreak: 5,
      completedToday: 3,
      totalActivities: 5,
      gardenStage: 3, // 0: Seed, 1: Sprout, 2: Bud, 3: Bloom, 4: Garden
      gardenPlants: ['🌱 Brahmaputra Tea', '🌸 Bihu Kopou Orchid', '🌿 Assam Fern', '🌷 Majuli Lotus']
    },
    // Daily Journey Path
    journey: [
      { id: 'family_match', title: 'Memory Garden', icon: '❤️', status: 'completed', skill: 'Recall' },
      { id: 'sound_home', title: 'Sounds From Home', icon: '🎵', status: 'completed', skill: 'Auditory' },
      { id: 'pattern_garden', title: 'Pattern Garden', icon: '🌿', status: 'current', skill: 'Attention' },
      { id: 'story_memory', title: 'Remember the Story', icon: '📖', status: 'locked', skill: 'Comprehension' },
      { id: 'evening_reflect', title: 'Evening Reflection', icon: '🌙', status: 'locked', skill: 'Emotional' }
    ]
  },

  // Caregiver Analytics
  caregiver: {
    metrics: {
      memory: 74,
      recall: 78,
      recognition: 82,
      attention: 68,
      engagement: 92,
      avgResponseTime: '3.8s',
      weeklyCompleted: 16,
      hintsUsedThisWeek: 4
    },
    recentSessions: [
      { game: 'Memory Garden', difficulty: 'Medium', accuracy: '100%', time: '2.4 min', hints: 0, date: 'Today, 10:30 AM' },
      { game: 'Sounds From Home', difficulty: 'Gentle', accuracy: '100%', time: '1.8 min', hints: 0, date: 'Today, 9:15 AM' },
      { game: 'Who Is This?', difficulty: 'Medium', accuracy: '100%', time: '1.2 min', hints: 1, date: 'Yesterday, 4:20 PM' },
      { game: 'Words We Know', difficulty: 'Gentle', accuracy: '100%', time: '2.0 min', hints: 0, date: 'Yesterday, 11:00 AM' }
    ],
    trendExplanation: 'Meera completed 4 personalized memory activities this week with improving recall and strong engagement (+11%). Family photo associations and nature soundscapes show the highest immediate recognition latency.'
  },

  // Complete 10-Game Library
  games: [
    {
      id: 'family_match',
      title: 'Memory Garden',
      nativeTitle: 'স্মৃতিৰ বাগিচা',
      category: 'memory',
      categoryLabel: '❤️ Memory',
      skill: 'Visual & Pair Recall',
      difficulty: 'Medium',
      duration: '3 min',
      desc: 'Flip and match familiar faces of Ananya, Rohan, and family garden memories.',
      icon: '🌿',
      heroImg: 'assets/family_ananya.jpg',
      featured: true
    },
    {
      id: 'who_is_this',
      title: 'Who Is This?',
      nativeTitle: 'এইজন কোন?',
      category: 'recognition',
      categoryLabel: '👀 Recognition',
      skill: 'Family Kinship Recall',
      difficulty: 'Gentle',
      duration: '2 min',
      desc: 'Recognize beloved family members with voice answering and personalized stories.',
      icon: '❤️',
      heroImg: 'assets/family_ananya.jpg'
    },
    {
      id: 'sounds_home',
      title: 'Sounds From Home',
      nativeTitle: 'ঘৰৰ চিনাকি সুৰ',
      category: 'sound',
      categoryLabel: '🎵 Sound',
      skill: 'Auditory Memory',
      difficulty: 'Gentle',
      duration: '3 min',
      desc: 'Close your eyes and identify morning birds, Brahmaputra waters, and tea gardens.',
      icon: '🔊',
      heroImg: 'assets/brahmaputra.jpg'
    },
    {
      id: 'words_we_know',
      title: 'Words We Know',
      nativeTitle: 'চিনাকি শব্দ',
      category: 'language',
      categoryLabel: '🗣️ Language',
      skill: 'Multilingual Recall',
      difficulty: 'Easy',
      duration: '2 min',
      desc: 'Connect cherished Assamese greetings and words with audio pronunciation.',
      icon: 'অ',
      heroImg: 'assets/tea_gardens.jpg'
    },
    {
      id: 'place_memory',
      title: 'Places That Feel Like Home',
      nativeTitle: 'চিনাকি ঠাইৰ স্মৃতি',
      category: 'places',
      categoryLabel: '🏡 Familiar Places',
      skill: 'Spatial & Emotional Memory',
      difficulty: 'Easy',
      duration: '3 min',
      desc: 'Identify familiar North-East landscapes and tea garden sanctuaries.',
      icon: '🍃',
      heroImg: 'assets/tea_gardens.jpg'
    },
    {
      id: 'story_memory',
      title: 'Remember the Story',
      nativeTitle: 'সাধু কথাৰ স্মৃতি',
      category: 'stories',
      categoryLabel: '📖 Stories',
      skill: 'Sequential Story Recall',
      difficulty: 'Medium',
      duration: '4 min',
      desc: 'Read a sweet short story about Ananya visiting Grandma and answer 3 questions.',
      icon: '📖',
      heroImg: 'assets/bihu_story.jpg'
    },
    {
      id: 'pattern_garden',
      title: 'Pattern Garden',
      nativeTitle: 'ৰূপালী আৰ্হি',
      category: 'patterns',
      categoryLabel: '🧩 Patterns',
      skill: 'Visual Pattern Recognition',
      difficulty: 'Medium',
      duration: '3 min',
      desc: 'Discover what comes next in nature-inspired floral and leaf sequences.',
      icon: '🌸',
      heroImg: 'assets/tea_gardens.jpg'
    },
    {
      id: 'daily_routine',
      title: 'Meera’s Morning Routine',
      nativeTitle: 'পুৱাৰ সুন্দৰ নিয়ম',
      category: 'daily',
      categoryLabel: '⏰ Daily Life',
      skill: 'Routine Sequencing',
      difficulty: 'Medium',
      duration: '3 min',
      desc: 'Arrange morning medicine, tea, walk, and family call in the right sequence.',
      icon: '☀️',
      heroImg: 'assets/hero_banner.jpg'
    },
    {
      id: 'object_memory',
      title: 'Objects on the Veranda',
      nativeTitle: 'মেজৰ চিনাকি বস্তু',
      category: 'recognition',
      categoryLabel: '👀 Recognition',
      skill: 'Short-Term Object Recall',
      difficulty: 'Medium',
      duration: '3 min',
      desc: 'Look at the veranda table scene for 8 seconds, then remember what was there.',
      icon: '☕',
      heroImg: 'assets/hero_banner.jpg'
    },
    {
      id: 'sound_image',
      title: 'Sound & Scene Harmony',
      nativeTitle: 'শব্দ আৰু ছবিৰ মিল',
      category: 'sound',
      categoryLabel: '🎵 Sound + Image',
      skill: 'Multi-Sensory Association',
      difficulty: 'Gentle',
      duration: '3 min',
      desc: 'Listen to a natural ambient sound and select the picture that matches it.',
      icon: '🎨',
      heroImg: 'assets/brahmaputra.jpg'
    }
  ],

  // Regional State Profiles
  regions: {
    assam: {
      id: 'assam',
      name: 'Assam',
      nativeName: 'অসম',
      language: 'Assamese (অসমীয়া)',
      soundscape: 'Assam Morning',
      culturalTheme: 'Tea Gardens, Brahmaputra River Mist, Majuli Pottery & Gamusa Weaves'
    },
    meghalaya: {
      id: 'meghalaya',
      name: 'Meghalaya',
      nativeName: 'মেঘালয়',
      language: 'Khasi / Garo',
      soundscape: 'Meghalaya Pine Rain',
      culturalTheme: 'Living Root Bridges, Pine Whispers & Sohra Rains'
    },
    arunachal: {
      id: 'arunachal',
      name: 'Arunachal Pradesh',
      nativeName: 'অৰুণাচল প্ৰদেশ',
      language: 'Nyishi / Monpa / Hindi',
      soundscape: 'Tawang Monastery Dawn',
      culturalTheme: 'Tawang Monastery Bells, Snow Streams & Orchid Valleys'
    },
    manipur: {
      id: 'manipur',
      name: 'Manipur',
      nativeName: 'মণিপুৰ',
      language: 'Meitei (Manipuri)',
      soundscape: 'Loktak Lake Breeze',
      culturalTheme: 'Loktak Phumdi Sanctuary, Pena Melodies & Handloom Patterns'
    },
    mizoram: {
      id: 'mizoram',
      name: 'Mizoram',
      nativeName: 'মিজোৰাম',
      language: 'Mizo',
      soundscape: 'Aizawl Hilltop Dusk',
      culturalTheme: 'Bamboo Groves, Cheraw Rhythms & Cloud-Lined Ridges'
    },
    nagaland: {
      id: 'nagaland',
      name: 'Nagaland',
      nativeName: 'নাগালেণ্ড',
      language: 'Nagamese / Ao / Angami',
      soundscape: 'Dzukou Valley Stream',
      culturalTheme: 'Dzukou Valley Lilies, Traditional Hearth Woodfire & Heritage Weaves'
    },
    tripura: {
      id: 'tripura',
      name: 'Tripura',
      nativeName: 'ত্ৰিপুৰা',
      language: 'Kokborok / Bengali',
      soundscape: 'Rudrasagar Water Birds',
      culturalTheme: 'Neermahal Floating Palace, Bamboo Craft & Lake Echoes'
    },
    sikkim: {
      id: 'sikkim',
      name: 'Sikkim',
      nativeName: 'চিক্কিম',
      language: 'Nepali / Bhutia / Lepcha',
      soundscape: 'Rumtek Wind Chimes',
      culturalTheme: 'Kanchenjunga Dawn Glow, Prayer Flags & Organic Cardamom Terraces'
    }
  },

  // Multi-Lingual Matrix
  translations: {
    en: {
      goodMorning: 'Good Morning, Meera!',
      talkToSmaran: 'Talk to SMARAN',
      memoriesThatMatter: 'Memories That Matter',
      memoriesSubtitle: 'People, places and moments that feel like home.',
      playHubTitle: "Let's Play, Meera ❤️",
      playHubSubtitle: "Fun activities built around memories, attention and familiar things.",
      featuredGameTitle: "MEMORY GARDEN",
      featuredGameSub: "Your memories are waiting.",
      playNow: "Play Now"
    },
    as: {
      goodMorning: 'সুপ্ৰভাত, মীৰা ☀️',
      talkToSmaran: 'স্মৰণৰ লগত কথা পাতক',
      memoriesThatMatter: 'হৃদয়ৰ চিনাকি স্মৃতি',
      memoriesSubtitle: 'আপোনাৰ নিজৰ মানুহ, আপোন ঠাই আৰু অমূল্য মুহূৰ্তসমূহ।',
      playHubTitle: "আহক খেলোঁ, মীৰা বাইদেউ ❤️",
      playHubSubtitle: "স্মৃতি, মনোযোগ আৰু চিনাকি মুহূৰ্তৰে সজোৱা আনন্দময় কাৰ্যকলাপ।",
      featuredGameTitle: "স্মৃতিৰ বাগিচা",
      featuredGameSub: "আপোনাৰ হৃদয়ৰ স্মৃতিবোৰ অপেক্ষা কৰিছে।",
      playNow: "এতিয়াই খেলক"
    },
    hi: {
      goodMorning: 'शुभ प्रभात, मीरा!',
      talkToSmaran: 'स्मरण से बात करें',
      memoriesThatMatter: 'अनमोल यादें',
      memoriesSubtitle: 'अपने लोग, परिचित स्थान और सुकून भरे लम्हे।',
      playHubTitle: "आइए खेलें, मीरा जी ❤️",
      playHubSubtitle: "यादों, ध्यान और परिचित चीज़ों पर आधारित आनंदमयी गतिविधियाँ।",
      featuredGameTitle: "स्मृति वाटिका",
      featuredGameSub: "आपकी अपनी यादें आपका इंतज़ार कर रही हैं।",
      playNow: "अभी खेलें"
    }
  },

  // Rich Memory Items
  memories: [
    {
      id: 'ananya',
      category: 'people',
      tag: '❤️ People',
      name: 'Ananya',
      relation: 'Granddaughter (নাতিনী)',
      story: 'Visits Grandma every Sunday with fresh sweet pitha. Loves hearing stories of Tezpur childhood.',
      favoritePlace: 'Tezpur Home Veranda',
      imageType: 'portrait_ananya',
      audioNote: '“Aita, I brought your favorite coconut pitha!”'
    },
    {
      id: 'teagarden',
      category: 'places',
      tag: '🏡 Places',
      name: 'Our Tea Garden',
      relation: 'Favourite Sanctuary',
      story: 'Where Meera spent many peaceful mornings breathing the fresh aroma of tender green tea leaves.',
      favoritePlace: 'Jorhat Heritage Estate',
      imageType: 'landscape_tea',
      audioNote: 'Morning birds whistling in the lush tea canopy.'
    },
    {
      id: 'bihu',
      category: 'moments',
      tag: '📅 Moments',
      name: 'Family Bihu Reunion',
      relation: 'Rongali Bihu Gathering',
      story: 'Everyone came home for Rongali Bihu. Three generations dancing to dhol and pepa under the jackfruit tree.',
      favoritePlace: 'Ancestral Courtyard',
      imageType: 'moment_bihu',
      audioNote: 'Soft dhol rhythm and laughter of children.'
    },
    {
      id: 'brahmaputra',
      category: 'places',
      tag: '🏡 Places',
      name: 'Brahmaputra Sunset Walk',
      relation: 'Cherished Evening Walk',
      story: 'Evening walks by the river ghat in Tezpur watching the crimson sun melt into the mighty water expanse.',
      favoritePlace: 'Bhairabi Ghat, Tezpur',
      imageType: 'landscape_river',
      audioNote: 'Water lapping against wooden fishing boats.'
    }
  ],

  // Procedural Soundscapes
  soundscapes: [
    { id: 'birds', icon: '🌿', name: 'Morning Birds', nativeName: 'পুৱাৰ চৰাইৰ কলকাকলি', desc: 'Gentle chirping of bulbul and magpie robins at dawn.' },
    { id: 'river', icon: '🌊', name: 'Brahmaputra River', nativeName: 'লুইতৰ শান্ত পানীৰ ধ্বনি', desc: 'Rhythmic water ripples against riverbanks.' },
    { id: 'rain', icon: '🌧️', name: 'Monsoon Rain', nativeName: 'বৰষুণৰ টোপাল', desc: 'Soft monsoon droplets on banana leaves.' },
    { id: 'tea', icon: '🍃', name: 'Tea Garden Ambience', nativeName: 'চাহ বাগিচাৰ নিস্তব্ধতা', desc: 'Breeze rustling through rows of tea bushes.' },
    { id: 'home', icon: '🏡', name: 'Home Environment', nativeName: 'ঘৰুৱা পৰিৱেশ', desc: 'Familiar hearth warmth and distant wind chimes.' }
  ]
};

// Load persistent stats from localStorage if available
try {
  const savedUser = localStorage.getItem('smaran_meera_user');
  if (savedUser) {
    SMARAN_STATE.user = JSON.parse(savedUser);
  }
} catch (e) {}

window.SMARAN_STATE = SMARAN_STATE;
