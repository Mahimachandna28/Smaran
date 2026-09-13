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

  // Dynamic Elderly Daily Rhythm & Circadian Schedule
  rhythm: [
    {
      id: 'r_med_morning',
      time: '8:00 AM',
      period: 'morning',
      periodLabel: 'Morning Dawn',
      title: 'Morning Medicine & BP Check',
      nativeTitle: 'পুৱাৰ ঔষধ আৰু ৰক্তচাপ পৰীক্ষা',
      subtitle: 'Thyroid & BP tablet after breakfast with warm water',
      icon: '💊',
      completed: true,
      completedAt: '8:15 AM',
      category: 'Health',
      categoryColor: '#287a4a',
      voiceText: 'Meera, it is 8:00 AM. Time for your morning medicine. Please take your BP and thyroid tablet with a glass of warm water.',
      soundType: 'chime'
    },
    {
      id: 'r_tea_snack',
      time: '10:30 AM',
      period: 'morning',
      periodLabel: 'Morning Sunshine',
      title: 'Warm Assam Tea & Veranda Sunshine',
      nativeTitle: 'গৰম চাহ আৰু বেলিৰ পোহৰ',
      subtitle: 'Fresh herbal tea and a piece of sweet coconut pitha',
      icon: '🍵',
      completed: true,
      completedAt: '10:35 AM',
      category: 'Nourishment',
      categoryColor: '#d4a359',
      voiceText: 'Time for a warm cup of fresh Assam tea and some sunshine on the veranda.',
      soundType: 'birds'
    },
    {
      id: 'r_garden_activity',
      time: '11:45 AM',
      period: 'morning',
      periodLabel: 'Late Morning',
      title: 'Memory Garden Cognitive Activity',
      nativeTitle: 'স্মৃতিৰ বাগিচা খেলা',
      subtitle: 'Gentle photo matching and remembering family stories',
      icon: '🌱',
      completed: true,
      completedAt: '11:50 AM',
      category: 'Mind',
      categoryColor: '#1b4d3e',
      voiceText: 'Let us spend a few peaceful minutes tending to your Memory Garden together.',
      soundType: 'harp'
    },
    {
      id: 'r_lunch',
      time: '1:00 PM',
      period: 'afternoon',
      periodLabel: 'Midday',
      title: 'Nourishing Homemade Lunch',
      nativeTitle: 'দুপৰীয়াৰ পুষ্টিকৰ আহাৰ',
      subtitle: 'Warm rice, seasonal vegetables, lentil dal, and lemon',
      icon: '🍲',
      completed: true,
      completedAt: '1:10 PM',
      category: 'Nourishment',
      categoryColor: '#d4a359',
      voiceText: 'Lunch time, Meera. Enjoy your warm, nourishing meal.',
      soundType: 'chime'
    },
    {
      id: 'r_rest_music',
      time: '2:30 PM',
      period: 'afternoon',
      periodLabel: 'Afternoon Calm',
      title: 'Afternoon Rest & Calming Birds',
      nativeTitle: 'দুপৰীয়াৰ জিৰণি আৰু সুৰ',
      subtitle: '30-minute peaceful resting time with river ambient breeze',
      icon: '🌿',
      completed: false,
      completedAt: null,
      category: 'Rest',
      categoryColor: '#2b6cb0',
      voiceText: 'Time for a calm afternoon rest with soothing Brahmaputra nature sounds.',
      soundType: 'flute'
    },
    {
      id: 'r_veranda_walk',
      time: '5:00 PM',
      period: 'evening',
      periodLabel: 'Golden Sunset',
      title: 'Veranda & Kopou Orchid Walk',
      nativeTitle: 'পদচাৰণা আৰু ফুল চোৱা',
      subtitle: 'Gentle stroll, fresh evening air, and checking the blooms',
      icon: '🌸',
      completed: false,
      completedAt: null,
      category: 'Movement',
      categoryColor: '#c8644a',
      voiceText: 'The evening air is fresh and pleasant. Time for a peaceful stroll in your orchid garden.',
      soundType: 'birds'
    },
    {
      id: 'r_family_call',
      time: '7:00 PM',
      period: 'evening',
      periodLabel: 'Evening Family Time',
      title: 'Family Call with Granddaughter Ananya',
      nativeTitle: 'অনন্যাৰ সৈতে কথা-বতৰা',
      subtitle: 'Video call, sharing stories, and laughing together',
      icon: '📞',
      completed: false,
      completedAt: null,
      category: 'Family',
      categoryColor: '#805ad5',
      voiceText: 'Ananya will be calling for your evening family conversation soon.',
      soundType: 'harp'
    },
    {
      id: 'r_night_med_sleep',
      time: '9:00 PM',
      period: 'night',
      periodLabel: 'Night Serenity',
      title: 'Night Medicine & Brahmaputra Lullaby',
      nativeTitle: 'ৰাতিৰ ঔষধ আৰু শান্তিময় টোপনি',
      subtitle: 'Evening dose, warm milk, and deep restful sleep soundscape',
      icon: '🌙',
      completed: false,
      completedAt: null,
      category: 'Health',
      categoryColor: '#2d3748',
      voiceText: 'Meera, remember your evening medicine before settling in for a peaceful night of rest.',
      soundType: 'chime'
    }
  ],

  // Daily Hydration & Fluid Intake Compass
  hydration: {
    current: 5,
    target: 8,
    glassSizeMl: 250,
    lastLoggedAt: '11:15 AM'
  },

  // Security & Emergency Configuration
  security: {
    pin: '1234',
    isUnlocked: false,
    autoLockMinutes: 10,
    emergencyContacts: [
      {
        id: 'c1',
        name: 'Ananya Sharma (Granddaughter)',
        nativeName: 'অনন্যা শৰ্মা (নাতিনী)',
        relation: 'Primary Caregiver',
        phone: '+91 98765 43210',
        whatsapp: true,
        priority: 'Primary'
      },
      {
        id: 'c2',
        name: 'Dr. B. Barua, MD',
        nativeName: 'ডাঃ বি. বৰুৱা (চিকিৎসক)',
        relation: 'Attending Neurologist (GNRC)',
        phone: '+91 98123 45678',
        whatsapp: true,
        priority: 'Medical'
      },
      {
        id: 'c3',
        name: 'Assam Medical Ambulance',
        nativeName: '১০৮ এম্বুলেন্স সেৱা',
        relation: 'Emergency Services',
        phone: '108',
        whatsapp: false,
        priority: 'Emergency'
      },
      {
        id: 'c4',
        name: 'Elderline Senior Citizens',
        nativeName: '১৪৫৬৭ জ্যেষ্ঠ নাগৰিক হেল্পলাইন',
        relation: 'National Helpline',
        phone: '14567',
        whatsapp: false,
        priority: 'Support'
      }
    ],
    sosHistory: [
      {
        id: 'sos_101',
        timestamp: '11 Sep 2026, 04:45 PM',
        type: 'Sundowning Agitation Alarm',
        location: 'Home Veranda (Tezpur)',
        triggeredBy: 'Voice Prompt ("Help")',
        status: 'Resolved',
        notes: 'Evening tea garden soundscape played; Ananya arrived in 2 min.'
      }
    ],
    geofence: {
      enabled: true,
      safeZoneName: 'Home & Veranda, Tezpur (Assam)',
      coordinates: '26.6338° N, 92.7926° E',
      status: 'Inside Safe Zone',
      lastChecked: 'Just now'
    },
    fallDetection: {
      enabled: true,
      sensitivity: 'High (Elderly Optimised)',
      lastStatus: 'Normal Motion'
    }
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

  // Rich North-Eastern Cultural Memory Vault
  memories: [
    {
      id: 'ananya',
      category: 'people',
      stateId: 'assam',
      stateName: 'Assam (অসম)',
      tag: '❤️ Family & Kin',
      name: 'Ananya (Granddaughter)',
      nativeName: 'অনন্যা (নাতিনী)',
      relation: 'Beloved Granddaughter',
      story: 'Visits Grandma every Sunday with fresh sweet narikol pitha and kopou orchids. Loves sitting on the veranda listening to Tezpur childhood stories.',
      favoritePlace: 'Tezpur Home Veranda',
      heroImg: 'assets/family_ananya.jpg',
      audioPrompt: 'Aita, I brought your favorite coconut pitha and fresh tea!',
      gameId: 'who_is_this'
    },
    {
      id: 'teagarden',
      category: 'places',
      stateId: 'assam',
      stateName: 'Assam (অসম)',
      tag: '🏡 Places & Heritage',
      name: 'Jorhat Heritage Tea Estate',
      nativeName: 'যোৰহাটৰ চাহ বাগিচা',
      relation: 'Peaceful Morning Sanctuary',
      story: 'Where Meera spent childhood mornings breathing the fresh dew aroma of tender green tea bushes while listening to birds whistling across the canopy.',
      favoritePlace: 'Jorhat Heritage Estate',
      heroImg: 'assets/tea_gardens.jpg',
      audioPrompt: 'The gentle morning breeze carrying the fresh scent of green tea leaves.',
      gameId: 'place_memory'
    },
    {
      id: 'bihu',
      category: 'moments',
      stateId: 'assam',
      stateName: 'Assam (অসম)',
      tag: '🎉 Cultural Festivals',
      name: 'Family Rongali Bihu Reunion',
      nativeName: 'ৰঙালী বিহুৰ আনন্দ',
      relation: 'Spring New Year Celebration',
      story: 'Three generations gathering in the courtyard wearing golden Muga silk mekhela sador, clapping along to the rhythmic beats of dhol, pepa, and gogona.',
      favoritePlace: 'Ancestral Courtyard',
      heroImg: 'assets/bihu_story.jpg',
      audioPrompt: 'Rhythmic beats of the Bihu dhol and joyous family laughter.',
      gameId: 'story_memory'
    },
    {
      id: 'brahmaputra',
      category: 'places',
      stateId: 'assam',
      stateName: 'Assam (অসম)',
      tag: '🌿 Nature & Rivers',
      name: 'Brahmaputra Sunrise & Majuli Ferry',
      nativeName: 'ব্ৰহ্মপুত্ৰৰ ঘাট আৰু মাজুলী',
      relation: 'Riverboat Crossing & Satra Heritage',
      story: 'Watching the crimson golden sun rise over the mighty Brahmaputra river as wooden ferry boats glide toward Majuli Island satras and pottery artisans.',
      favoritePlace: 'Bhairabi Ghat, Tezpur',
      heroImg: 'assets/brahmaputra.jpg',
      audioPrompt: 'Gentle river waves lapping rhythmically against the wooden ferry boat.',
      gameId: 'sounds_home'
    },
    {
      id: 'rohan_dhol',
      category: 'people',
      stateId: 'assam',
      stateName: 'Assam (অসম)',
      tag: '❤️ Family & Kin',
      name: 'Grandson Rohan & Sweet Treats',
      nativeName: 'নাতি ৰোহন আৰু বিহুৰ মিঠাই',
      relation: 'Grandson (নাতি)',
      story: 'Grandson Rohan visiting Grandma with traditional Assamese narikol laddu and pitha sweets, filling the house with cheerful laughter and sweet festival aromas.',
      favoritePlace: 'Courtyard & Veranda',
      heroImg: 'assets/rohan_sweets.jpg',
      audioPrompt: 'Aita, I brought fresh coconut pitha and laddu sweets for you!',
      gameId: 'who_is_this'
    },
    {
      id: 'meghalaya_root_bridge',
      category: 'places',
      stateId: 'meghalaya',
      stateName: 'Meghalaya (মেঘালয়)',
      tag: '🏡 Places & Heritage',
      name: 'Cherrapunji Living Root Bridges',
      nativeName: 'মেঘালয়ৰ জীৱন্ত শিপাৰ দলং',
      relation: 'Living Architecture of Nongriat',
      story: 'Marveling at the ancient ficus elastica roots woven over generations across turquoise mountain streams in Sohra, surrounded by clean rain mist.',
      favoritePlace: 'Nongriat Valley, Sohra',
      heroImg: 'assets/meghalaya_root_bridge.jpg',
      audioPrompt: 'Rushing turquoise mountain streams and monsoon rain on highland pine needles.',
      gameId: 'place_memory'
    },
    {
      id: 'shillong_pine_music',
      category: 'moments',
      stateId: 'meghalaya',
      stateName: 'Meghalaya (মেঘালয়)',
      tag: '🎉 Cultural Festivals',
      name: 'Shillong Autumn Hearth & Folk Songs',
      nativeName: 'শ্বিলঙৰ পাইন বন আৰু লোকগীত',
      relation: 'Highland Evening Fireside',
      story: 'Sitting with family around a warm wooden hearth in Shillong, sipping hot spiced tea while soft acoustic guitar melodies blend with cool pine breezes.',
      favoritePlace: 'Ward’s Lake & Pine Ridges',
      heroImg: 'assets/meghalaya_root_bridge.jpg',
      audioPrompt: 'Soft acoustic guitar chords mingling with gentle pine wind.',
      gameId: 'sounds_home'
    },
    {
      id: 'tawang_monastery',
      category: 'places',
      stateId: 'arunachal',
      stateName: 'Arunachal Pradesh',
      tag: '🏡 Places & Heritage',
      name: 'Tawang Monastery Dawn Bells',
      nativeName: 'টাৱাং আশ্ৰমৰ সোণালী পুৱা',
      relation: 'Spiritual Himalayan Sanctuary',
      story: 'The peaceful golden morning light touching snow-capped peaks above Tawang Monastery as colorful prayer flags flutter in the crisp mountain air.',
      favoritePlace: 'Tawang High Ridge (10,000 ft)',
      heroImg: 'assets/tawang_monastery.jpg',
      audioPrompt: 'Deep resonant monastery brass bells and mountain wind chimes.',
      gameId: 'place_memory'
    },
    {
      id: 'ziro_valley',
      category: 'places',
      stateId: 'arunachal',
      stateName: 'Arunachal Pradesh',
      tag: '🌿 Nature & Rivers',
      name: 'Ziro Valley Golden Rice Terraces',
      nativeName: 'জিৰো উপত্যকাৰ সোণালী ধাননি',
      relation: 'Apatani Plateau Heritage',
      story: 'Golden paddy terraces swaying under calm blue mountain skies, surrounded by tall pine groves and warm community smiles.',
      favoritePlace: 'Ziro Plateau Pines',
      heroImg: 'assets/tawang_monastery.jpg',
      audioPrompt: 'Whistling valley wind over ripe golden rice stalks.',
      gameId: 'place_memory'
    },
    {
      id: 'loktak_lake',
      category: 'places',
      stateId: 'manipur',
      stateName: 'Manipur (মণিপুৰ)',
      tag: '🌿 Nature & Rivers',
      name: 'Loktak Lake Floating Phumdis',
      nativeName: 'লোকটাক হ্ৰদৰ ওপঙা দ্বীপ',
      relation: 'World’s Only Floating Lake Sanctuary',
      story: 'Drifting on a serene wooden canoe at sunrise among the circular floating biomass islands of Loktak, watching rare dancing Sangai deer in the morning mist.',
      favoritePlace: 'Keibul Lamjao Sanctuary, Loktak',
      heroImg: 'assets/loktak_lake.jpg',
      audioPrompt: 'Gentle water ripples and morning calls of migratory water birds.',
      gameId: 'place_memory'
    },
    {
      id: 'ima_keithel',
      category: 'moments',
      stateId: 'manipur',
      stateName: 'Manipur (মণিপুৰ)',
      tag: '🎉 Cultural Festivals',
      name: 'Ima Keithel All-Mothers Market',
      nativeName: 'ইমা কেইথেল মাতৃ বজাৰ',
      relation: 'Heritage of Maternal Community',
      story: 'Walking through the historic 500-year-old market run entirely by mothers, admiring vibrant handwoven phaneks, lotus blooms, and aromatic Chak-Hao rice.',
      favoritePlace: 'Imphal City Center',
      heroImg: 'assets/loktak_lake.jpg',
      audioPrompt: 'Warm greetings of Manipuri mothers and vibrant market buzz.',
      gameId: 'story_memory'
    },
    {
      id: 'dzukou_valley',
      category: 'places',
      stateId: 'nagaland',
      stateName: 'Nagaland (নাগালেণ্ড)',
      tag: '🌿 Nature & Rivers',
      name: 'Dzukou Valley Wild Lily Trails',
      nativeName: 'জুকৌ উপত্যকাৰ বনৰীয়া ফুল',
      relation: 'Emerald Rolling Hills of Nagaland',
      story: 'Undulating emerald hills carpeted with seasonal Dzukou lilies, crystal mountain brooks, and pure peaceful tranquility.',
      favoritePlace: 'Dzukou Sanctuary Border',
      heroImg: 'assets/meghalaya_root_bridge.jpg',
      audioPrompt: 'Crisp mountain stream flowing over smooth river stones.',
      gameId: 'place_memory'
    },
    {
      id: 'aizawl_cheraw',
      category: 'moments',
      stateId: 'mizoram',
      stateName: 'Mizoram (মিজোৰাম)',
      tag: '🎉 Cultural Festivals',
      name: 'Aizawl Cheraw Bamboo Dance',
      nativeName: 'আইজলৰ চেৰাও বাঁহৰ নৃত্য',
      relation: 'Rhythmic Mizo Heritage Dance',
      story: 'Mesmerizing synchronized rhythm of bamboo staves tapped together while dancers in vibrant red-and-white Puanchei glide gracefully above.',
      favoritePlace: 'Aizawl Community Ground',
      heroImg: 'assets/bihu_story.jpg',
      audioPrompt: 'Rhythmic acoustic clacking of bamboo staves and cheerful cheers.',
      gameId: 'story_memory'
    },
    {
      id: 'neermahal_palace',
      category: 'places',
      stateId: 'tripura',
      stateName: 'Tripura (ত্ৰিপুৰা)',
      tag: '🏡 Places & Heritage',
      name: 'Neermahal Water Palace at Full Moon',
      nativeName: 'নীৰমহল জলপ্ৰাসাদ',
      relation: 'Floating Palace on Rudrasagar Lake',
      story: 'Illuminated red-and-white royal pavilion glowing over the mirror-calm waters of Rudrasagar Lake on a peaceful full moon evening.',
      favoritePlace: 'Rudrasagar Lake, Melaghar',
      heroImg: 'assets/loktak_lake.jpg',
      audioPrompt: 'Calm evening water reflections and gentle boat oars.',
      gameId: 'place_memory'
    },
    {
      id: 'kanchenjunga_dawn',
      category: 'places',
      stateId: 'sikkim',
      stateName: 'Sikkim (চিক্কিম)',
      tag: '🌿 Nature & Rivers',
      name: 'Kanchenjunga Golden Sunrise & Rumtek',
      nativeName: 'কাঞ্চনজঙ্ঘাৰ সোণালী পুৱা',
      relation: 'Five Sacred Snow Treasures',
      story: 'Watching the first golden rays of dawn illuminate the five sacred peaks of Mount Kanchenjunga from the terrace, surrounded by fragrant cardamom gardens.',
      favoritePlace: 'Rumtek Ridge, Gangtok',
      heroImg: 'assets/tawang_monastery.jpg',
      audioPrompt: 'Soft mountain wind chimes and peaceful morning silence.',
      gameId: 'place_memory'
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
  const savedRhythm = localStorage.getItem('smaran_daily_rhythm');
  if (savedRhythm) {
    SMARAN_STATE.rhythm = JSON.parse(savedRhythm);
  }
  const savedHydration = localStorage.getItem('smaran_hydration');
  if (savedHydration) {
    SMARAN_STATE.hydration = JSON.parse(savedHydration);
  }
} catch (e) {}

// Alias for convenience
SMARAN_STATE.reminders = SMARAN_STATE.rhythm;

window.SMARAN_STATE = SMARAN_STATE;
