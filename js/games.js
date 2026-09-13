/**
 * SMARAN 10-Game Cognitive Engine & Interactive Game Hub
 * Playful, warm, elderly-friendly, adaptive, and culturally rooted.
 */

class SmaranGamesEngine {
  constructor() {
    this.currentGame = null;
    this.gameSession = {
      gameId: null,
      startTime: null,
      hintsUsed: 0,
      attempts: 0,
      currentStep: 0,
      score: 0,
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      routineState: []
    };
  }

  // --- 1. RENDER GAME HUB (/games) ---
  renderGameHub(filterCategory = 'all', filterDifficulty = 'all') {
    const hubGrid = document.getElementById('gamesLibraryGrid');
    if (!hubGrid) return;

    let filtered = SMARAN_STATE.games;
    if (filterCategory !== 'all') {
      filtered = filtered.filter(g => g.category === filterCategory);
    }
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(g => g.difficulty.toLowerCase() === filterDifficulty.toLowerCase());
    }

    hubGrid.innerHTML = filtered.map(game => `
      <div class="game-hub-card ${game.featured ? 'featured-game-card' : ''}" onclick="smaranGames.launchGame('${game.id}')">
        <div class="game-card-banner">
          <img src="${game.heroImg}" alt="${game.title}" class="game-card-img" onerror="this.src='assets/tea_gardens.jpg'">
          <span class="game-category-badge">${game.categoryLabel}</span>
          ${game.featured ? '<span class="game-featured-star">⭐ Featured</span>' : ''}
        </div>
        <div class="game-card-content">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 class="game-card-title">${game.title}</h3>
              <div class="game-card-native">${game.nativeTitle}</div>
            </div>
            <span class="game-diff-pill ${game.difficulty.toLowerCase()}">${game.difficulty}</span>
          </div>
          <p class="game-card-desc">${game.desc}</p>
          <div class="game-card-footer">
            <div class="game-meta-tags">
              <span>🎯 ${game.skill}</span>
              <span>⏱️ ${game.duration}</span>
            </div>
            <button class="btn-play-game" onclick="event.stopPropagation(); smaranGames.launchGame('${game.id}')">
              Play Now ▶
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Update Category Filter Buttons
    document.querySelectorAll('.game-filter-btn').forEach(btn => {
      if (btn.getAttribute('data-category') === filterCategory) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    // Update Garden Widget on Hub
    this.renderGardenWidget();
  }

  filterGames(category, btnElement) {
    document.querySelectorAll('.game-filter-btn').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    this.renderGameHub(category);
  }

  // --- 2. LAUNCH ANY GAME ---
  launchGame(gameId) {
    // Stop any previously playing soundscapes immediately
    if (window.smaranAudio) {
      window.smaranAudio.stopSound();
    }

    const game = SMARAN_STATE.games.find(g => g.id === gameId) || SMARAN_STATE.games[0];
    this.currentGame = game;
    this.gameSession = {
      gameId: game.id,
      startTime: Date.now(),
      hintsUsed: 0,
      attempts: 0,
      currentStep: 0,
      score: 0,
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      routineState: []
    };

    if (window.smaranApp) {
      window.smaranApp.navigateTo('game-player');
    }

    // Play soft tap sound
    if (window.smaranAudio) window.smaranAudio.playTapSound();

    switch (gameId) {
      case 'family_match':
        this.startFamilyMatchGame();
        break;
      case 'who_is_this':
        this.startWhoIsThisGame();
        break;
      case 'sounds_home':
        this.startSoundsHomeGame();
        break;
      case 'words_we_know':
        this.startWordsWeKnowGame();
        break;
      case 'place_memory':
        this.startPlaceMemoryGame();
        break;
      case 'story_memory':
        this.startStoryMemoryGame();
        break;
      case 'pattern_garden':
        this.startPatternGardenGame();
        break;
      case 'daily_routine':
        this.startDailyRoutineGame();
        break;
      case 'object_memory':
        this.startObjectMemoryGame();
        break;
      case 'sound_image':
        this.startSoundImageGame();
        break;
      default:
        this.startFamilyMatchGame();
    }
  }

  // ==========================================
  // GAME #1 — FAMILY MEMORY MATCH ("Memory Garden")
  // ==========================================
  startFamilyMatchGame() {
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    const pairs = [
      { id: 'ananya', name: 'Ananya (Granddaughter)', img: 'assets/family_ananya.jpg', icon: '👧' },
      { id: 'teagarden', name: 'Our Tea Garden', img: 'assets/tea_gardens.jpg', icon: '🍃' },
      { id: 'bihu', name: 'Bihu Celebration', img: 'assets/bihu_story.jpg', icon: '🎉' },
      { id: 'river', name: 'Brahmaputra Boat', img: 'assets/brahmaputra.jpg', icon: '⛵' }
    ];

    // Create 8 cards (4 pairs) shuffled
    let deck = [...pairs, ...pairs].map((item, idx) => ({
      uniqueId: idx,
      pairId: item.id,
      name: item.name,
      img: item.img,
      icon: item.icon,
      isFlipped: false,
      isMatched: false
    }));

    deck.sort(() => Math.random() - 0.5);
    this.gameSession.cards = deck;
    this.gameSession.matchedPairs = 0;
    this.gameSession.attempts = 0;

    host.innerHTML = `
      <div class="game-stage-container">
        <!-- Game Top Nav -->
        <div class="game-top-bar">
          <button class="btn-game-back" onclick="smaranApp.navigateTo('games')">← Back to Games</button>
          <div class="game-header-title">
            <span>🌿 Memory Garden</span>
            <span class="game-badge-skill">Family Pair Match</span>
          </div>
          <button class="btn-game-hint" onclick="smaranGames.showHint('Look for matching cards of Ananya and your tea garden!')">
            💡 Hint
          </button>
        </div>

        <div class="game-instruction-banner">
          Tap two cards to find matching memories. Take your time, Meera ❤️
        </div>

        <div class="match-game-stats">
          <span>🌸 Pairs Found: <strong id="matchFoundCount">0</strong> / 4</span>
          <span>❤️ Attempts: <strong id="matchAttemptCount">0</strong></span>
        </div>

        <!-- 4x2 Grid of Tactile Memory Cards -->
        <div class="memory-grid-8" id="memoryCardsGrid">
          ${deck.map((card, idx) => `
            <div class="memory-match-card" id="card-${idx}" onclick="smaranGames.handleCardFlip(${idx})">
              <div class="card-inner">
                <div class="card-front">
                  <div style="font-size: 2.5rem;">🌸</div>
                  <div style="font-size: 0.85rem; font-weight: 700; color: #1b4d3e; margin-top: 0.3rem;">SMARAN</div>
                </div>
                <div class="card-back">
                  <img src="${card.img}" alt="${card.name}" class="card-back-img" onerror="this.src='assets/tea_gardens.jpg'">
                  <div class="card-back-label">${card.name}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div id="matchFeedbackToast" class="game-feedback-toast"></div>
      </div>
    `;
  }

  handleCardFlip(cardIndex) {
    const card = this.gameSession.cards[cardIndex];
    if (card.isFlipped || card.isMatched || this.gameSession.flippedCards.length >= 2) return;

    if (window.smaranAudio) window.smaranAudio.playTapSound();

    card.isFlipped = true;
    const cardEl = document.getElementById(`card-${cardIndex}`);
    if (cardEl) cardEl.classList.add('flipped');

    this.gameSession.flippedCards.push({ index: cardIndex, data: card });

    if (this.gameSession.flippedCards.length === 2) {
      this.gameSession.attempts++;
      document.getElementById('matchAttemptCount').textContent = this.gameSession.attempts;

      const [first, second] = this.gameSession.flippedCards;

      if (first.data.pairId === second.data.pairId) {
        // MATCH!
        first.data.isMatched = true;
        second.data.isMatched = true;
        this.gameSession.matchedPairs++;

        if (window.smaranAudio) window.smaranAudio.playSuccessChime();

        document.getElementById(`card-${first.index}`).classList.add('matched');
        document.getElementById(`card-${second.index}`).classList.add('matched');
        document.getElementById('matchFoundCount').textContent = this.gameSession.matchedPairs;

        this.showToastFeedback(`✨ Wonderful! You remembered ${first.data.name}!`);
        this.gameSession.flippedCards = [];

        if (this.gameSession.matchedPairs === 4) {
          setTimeout(() => {
            this.completeGame('Memory Garden', {
              recall: '+8%',
              engagement: '+5%',
              note: 'You remembered all 4 family memories perfectly!'
            });
          }, 1200);
        }
      } else {
        // NO MATCH -> Gentle encouragement
        this.showToastFeedback("Almost! Try another one ❤️");
        setTimeout(() => {
          first.data.isFlipped = false;
          second.data.isFlipped = false;
          const el1 = document.getElementById(`card-${first.index}`);
          const el2 = document.getElementById(`card-${second.index}`);
          if (el1) el1.classList.remove('flipped');
          if (el2) el2.classList.remove('flipped');
          this.gameSession.flippedCards = [];
        }, 1100);
      }
    }
  }

  // ==========================================
  // GAME #2 — WHO IS THIS? (Personal Memory)
  // ==========================================
  startWhoIsThisGame() {
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    host.innerHTML = `
      <div class="game-stage-container">
        <div class="game-top-bar">
          <button class="btn-game-back" onclick="smaranApp.navigateTo('games')">← Back to Games</button>
          <div class="game-header-title">
            <span>❤️ Who Is This?</span>
            <span class="game-badge-skill">Personal Memory</span>
          </div>
          <button class="btn-game-hint" onclick="smaranGames.showHint('Hint: She is your loving granddaughter who visits every Sunday with sweet pitha.')">
            💡 Hint
          </button>
        </div>

        <div class="personal-photo-stage">
          <div class="personal-photo-frame">
            <img src="assets/family_ananya.jpg" alt="Ananya" class="personal-photo-img">
            <div class="photo-caption-tag">Family Portrait • Tezpur Veranda</div>
          </div>

          <div class="personal-q-box">
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem;">
              <h2 style="font-size: 2rem; font-weight: 800; color: #17382d;">Who is this in your family?</h2>
              <button class="btn-speak-question" onclick="smaranVoice.speakTTS('Who is this in your family, Meera?')">
                🔊 Listen
              </button>
            </div>
            <p style="font-size: 1.15rem; color: #556b61; margin-top: 0.25rem;">
              Select her name or answer by voice:
            </p>
          </div>

          <div class="game-choices-grid">
            <button class="game-choice-btn" onclick="smaranGames.handlePersonalAnswer(this, true, 'Ananya')">
              <span class="choice-icon">❤️</span>
              <span class="choice-text">Ananya <small>(Granddaughter / নাতিনী)</small></span>
            </button>
            <button class="game-choice-btn" onclick="smaranGames.handlePersonalAnswer(this, false, 'Riya')">
              <span class="choice-icon">🌸</span>
              <span class="choice-text">Riya <small>(Neighbor)</small></span>
            </button>
            <button class="game-choice-btn" onclick="smaranGames.handlePersonalAnswer(this, false, 'Priya')">
              <span class="choice-icon">🌿</span>
              <span class="choice-text">Priya <small>(Cousin)</small></span>
            </button>
          </div>

          <!-- Voice Answer Hero Button -->
          <div style="margin-top: 1.5rem;">
            <button class="btn-voice-answer" onclick="smaranGames.openVoiceAnswerModal('Ananya')">
              🎙 Answer by Voice
            </button>
          </div>

          <div id="personalFeedbackBanner" class="game-feedback-banner"></div>
        </div>
      </div>
    `;
  }

  handlePersonalAnswer(btn, isCorrect, name) {
    const banner = document.getElementById('personalFeedbackBanner');
    const allBtns = document.querySelectorAll('.game-choice-btn');
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      btn.classList.add('correct');
      if (window.smaranAudio) window.smaranAudio.playSuccessChime();

      banner.className = 'game-feedback-banner active';
      banner.innerHTML = `
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-success); margin-bottom: 0.5rem;">
          ✨ That's Ananya ❤️
        </div>
        <p style="font-size: 1.25rem; color: #17382d; font-weight: 600;">
          Your sweet granddaughter who visits every Sunday with fresh coconut pitha and listens to your Tezpur childhood stories.
        </p>
        <button class="btn-tactile" style="margin-top: 1.25rem;" onclick="smaranGames.completeGame('Who Is This?', { recall: '+8%', engagement: '+6%', note: 'You recognized Granddaughter Ananya immediately!' })">
          Next Activity →
        </button>
      `;
    } else {
      btn.classList.add('wrong');
      banner.className = 'game-feedback-banner active';
      banner.innerHTML = `
        <div style="font-size: 1.3rem; font-weight: 700; color: #d9822b;">
          Almost there! Would you like a gentle hint? ❤️
        </div>
        <button class="btn-tactile" style="margin-top: 0.75rem;" onclick="smaranGames.showHint('She brings you sweet pitha every Sunday morning!')">
          Show Hint 💡
        </button>
      `;
    }
  }

  // ==========================================
  // GAME #3 — SOUNDS FROM HOME
  // ==========================================
  startSoundsHomeGame() {
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    if (window.smaranAudio) {
      window.smaranAudio.playSound('birds');
    }

    host.innerHTML = `
      <div class="game-stage-container">
        <div class="game-top-bar">
          <button class="btn-game-back" onclick="smaranApp.navigateTo('games')">← Back to Games</button>
          <div class="game-header-title">
            <span>🎵 Sounds From Home</span>
            <span class="game-badge-skill">Auditory Memory</span>
          </div>
          <button class="btn-game-hint" onclick="smaranGames.showHint('Listen to the high-pitched gentle chirping common in Assam gardens at sunrise.')">
            💡 Hint
          </button>
        </div>

        <div class="audio-game-stage">
          <div class="soundscape-player-card">
            <div style="font-size: 3.5rem; animation: pulseGlow 2s infinite;">🌿 🕊️ 🔊</div>
            <h2 style="font-size: 1.8rem; font-weight: 800; margin: 0.5rem 0 0.25rem;">
              Close your eyes and listen...
            </h2>
            <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1rem;">
              Playing: <strong>Assam Morning Soundscape (পুৱাৰ প্ৰকৃতি)</strong>
            </div>

            <div style="display: flex; gap: 1rem; align-items: center; justify-content: center;">
              <button class="btn-tactile" onclick="smaranAudio.playSound('birds')">
                ▶️ Replay Sound
              </button>
              <button class="btn-tactile btn-tactile-outline" style="background: rgba(255,255,255,0.2); color: #fff; border-color: #fff;" onclick="smaranAudio.stopSound()">
                ⏸️ Pause
              </button>
            </div>
          </div>

          <div style="margin: 1.5rem 0 0.5rem; font-size: 1.35rem; font-weight: 800; color: #17382d;">
            What familiar sound did you hear in the nature ambience?
          </div>

          <div class="game-choices-grid">
            <button class="game-choice-btn" onclick="smaranGames.handleSoundAnswer(this, true, 'Morning Birds')">
              <span class="choice-icon">🌿</span>
              <span class="choice-text">Morning Birds <small>(Bulbul & Robins)</small></span>
            </button>
            <button class="game-choice-btn" onclick="smaranGames.handleSoundAnswer(this, false, 'Heavy Rain')">
              <span class="choice-icon">🌧️</span>
              <span class="choice-text">Heavy Rain <small>(Monsoon Storm)</small></span>
            </button>
            <button class="game-choice-btn" onclick="smaranGames.handleSoundAnswer(this, false, 'Brahmaputra River')">
              <span class="choice-icon">🌊</span>
              <span class="choice-text">River Waves <small>(Water Ripples)</small></span>
            </button>
            <button class="game-choice-btn" onclick="smaranGames.handleSoundAnswer(this, false, 'Market Bazaar')">
              <span class="choice-icon">🛍️</span>
              <span class="choice-text">Crowded Market <small>(Bazaar)</small></span>
            </button>
          </div>

          <div id="soundFeedbackBanner" class="game-feedback-banner"></div>
        </div>
      </div>
    `;
  }

  handleSoundAnswer(btn, isCorrect, label) {
    const banner = document.getElementById('soundFeedbackBanner');
    const allBtns = document.querySelectorAll('.game-choice-btn');
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      btn.classList.add('correct');
      if (window.smaranAudio) {
        window.smaranAudio.stopSound();
        window.smaranAudio.playSuccessChime();
      }

      banner.className = 'game-feedback-banner active';
      banner.innerHTML = `
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-success); margin-bottom: 0.5rem;">
          ✨ Yes! You recognized the morning birds!
        </div>
        <p style="font-size: 1.15rem; color: #17382d; font-weight: 600;">
          The cheerful morning songs of bulbul and magpie robins welcoming the dawn over Assam.
        </p>
        <button class="btn-tactile" style="margin-top: 1.25rem;" onclick="smaranGames.completeGame('Sounds From Home', { auditory: '+8%', recognition: '+6%', note: 'You identified the Assam morning birds soundscape!' })">
          Continue Journey →
        </button>
      `;
    } else {
      btn.classList.add('wrong');
      banner.className = 'game-feedback-banner active';
      banner.innerHTML = `
        <div style="font-size: 1.3rem; font-weight: 700; color: #d9822b;">
          Listen once more to the gentle chirps...
        </div>
        <button class="btn-tactile" style="margin-top: 0.75rem;" onclick="smaranGames.startSoundsHomeGame()">
          Listen Again 🔊
        </button>
      `;
    }
  }

  // ==========================================
  // GAME #4 — WORDS WE KNOW (Assamese Language)
  // ==========================================
  startWordsWeKnowGame() {
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    host.innerHTML = `
      <div class="game-stage-container">
        <div class="game-top-bar">
          <button class="btn-game-back" onclick="smaranApp.navigateTo('games')">← Back to Games</button>
          <div class="game-header-title">
            <span>🗣️ Words We Know</span>
            <span class="game-badge-skill">Multilingual Memory</span>
          </div>
          <button class="btn-game-hint" onclick="smaranGames.showHint('This is the warm greeting used when waking up to the morning sun.')">
            💡 Hint
          </button>
        </div>

        <div class="language-word-card">
          <div class="language-script-badge">অসমীয়া (Assamese)</div>
          <div class="language-hero-word">“সুপ্ৰভাত”</div>
          <div class="language-phonetic-sub">(Pronounced: Su-probhat)</div>
          <button class="btn-audio-pronounce" onclick="smaranVoice.speakTTS('সুপ্ৰভাত')">
            🔊 Listen Pronunciation
          </button>
        </div>

        <div style="margin: 1.5rem 0 0.5rem; font-size: 1.35rem; font-weight: 800; color: #17382d;">
          What does this familiar greeting mean?
        </div>

        <div class="game-choices-grid">
          <button class="game-choice-btn" onclick="smaranGames.handleLanguageAnswer(this, true, 'Good Morning')">
            <span class="choice-icon">☀️</span>
            <span class="choice-text">Good Morning <small>(পুৱাৰ শুভেচ্ছা)</small></span>
          </button>
          <button class="game-choice-btn" onclick="smaranGames.handleLanguageAnswer(this, false, 'Thank You')">
            <span class="choice-icon">🙏</span>
            <span class="choice-text">Thank You <small>(ধন্যবাদ)</small></span>
          </button>
          <button class="game-choice-btn" onclick="smaranGames.handleLanguageAnswer(this, false, 'Good Night')">
            <span class="choice-icon">🌙</span>
            <span class="choice-text">Good Night <small>(শুভ ৰাত্ৰি)</small></span>
          </button>
          <button class="game-choice-btn" onclick="smaranGames.handleLanguageAnswer(this, false, 'Welcome')">
            <span class="choice-icon">🏡</span>
            <span class="choice-text">Welcome <small>(স্বাগতম)</small></span>
          </button>
        </div>

        <div id="languageFeedbackBanner" class="game-feedback-banner"></div>
      </div>
    `;
  }

  handleLanguageAnswer(btn, isCorrect, meaning) {
    const banner = document.getElementById('languageFeedbackBanner');
    const allBtns = document.querySelectorAll('.game-choice-btn');
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      btn.classList.add('correct');
      if (window.smaranAudio) window.smaranAudio.playSuccessChime();

      banner.className = 'game-feedback-banner active';
      banner.innerHTML = `
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-success); margin-bottom: 0.5rem;">
          ✨ Wonderful! “সুপ্ৰভাত” means Good Morning!
        </div>
        <p style="font-size: 1.15rem; color: #17382d; font-weight: 600;">
          A joyful greeting shared across generations with warm morning tea.
        </p>
        <button class="btn-tactile" style="margin-top: 1.25rem;" onclick="smaranGames.completeGame('Words We Know', { language: '+7%', recall: '+5%', note: 'You recalled the Assamese greeting correctly!' })">
          Next Activity →
        </button>
      `;
    } else {
      btn.classList.add('wrong');
      banner.className = 'game-feedback-banner active';
      banner.innerHTML = `
        <div style="font-size: 1.3rem; font-weight: 700; color: #d9822b;">
          Let's try again with the morning sunshine ☀️
        </div>
        <button class="btn-tactile" style="margin-top: 0.75rem;" onclick="smaranGames.startWordsWeKnowGame()">
          Try Again
        </button>
      `;
    }
  }

  // ==========================================
  // GAME #5 — PLACES THAT FEEL LIKE HOME
  // ==========================================
  startPlaceMemoryGame() {
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    host.innerHTML = `
      <div class="game-stage-container">
        <div class="game-top-bar">
          <button class="btn-game-back" onclick="smaranApp.navigateTo('games')">← Back to Games</button>
          <div class="game-header-title">
            <span>🏡 Places That Feel Like Home</span>
            <span class="game-badge-skill">Spatial Recognition</span>
          </div>
          <button class="btn-game-hint" onclick="smaranGames.showHint('Look at the emerald green terrace bushes and misty blue hills.')">
            💡 Hint
          </button>
        </div>

        <div class="place-photo-frame">
          <img src="assets/tea_gardens.jpg" alt="Tea Garden" class="place-photo-img">
        </div>

        <div style="margin: 1.5rem 0 0.5rem; font-size: 1.35rem; font-weight: 800; color: #17382d;">
          Which cherished place is shown in this scenery?
        </div>

        <div class="game-choices-grid">
          <button class="game-choice-btn" onclick="smaranGames.handlePlaceAnswer(this, true, 'Lush Tea Garden')">
            <span class="choice-icon">🍃</span>
            <span class="choice-text">Lush Tea Garden <small>(Assam Greenery / চাহ বাগিচা)</small></span>
          </button>
          <button class="game-choice-btn" onclick="smaranGames.handlePlaceAnswer(this, false, 'Ocean Beach')">
            <span class="choice-icon">🏖️</span>
            <span class="choice-text">Tropical Beach <small>(Sea Coast)</small></span>
          </button>
          <button class="game-choice-btn" onclick="smaranGames.handlePlaceAnswer(this, false, 'Desert Dunes')">
            <span class="choice-icon">🏜️</span>
            <span class="choice-text">Desert Dunes <small>(Sand Dunes)</small></span>
          </button>
        </div>

        <div id="placeFeedbackBanner" class="game-feedback-banner"></div>
      </div>
    `;
  }

  handlePlaceAnswer(btn, isCorrect, label) {
    const banner = document.getElementById('placeFeedbackBanner');
    const allBtns = document.querySelectorAll('.game-choice-btn');
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      btn.classList.add('correct');
      if (window.smaranAudio) window.smaranAudio.playSuccessChime();

      banner.className = 'game-feedback-banner active';
      banner.innerHTML = `
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-success); margin-bottom: 0.5rem;">
          ✨ Beautiful! You recognized the Tea Garden!
        </div>
        <p style="font-size: 1.15rem; color: #17382d; font-weight: 600;">
          Where you spent so many peaceful mornings breathing the fresh aroma of tender green tea leaves.
        </p>
        <button class="btn-tactile" style="margin-top: 1.25rem;" onclick="smaranGames.completeGame('Places That Feel Like Home', { spatial: '+6%', recognition: '+6%', note: 'You recognized the tea garden sanctuary!' })">
          Continue Journey →
        </button>
      `;
    } else {
      btn.classList.add('wrong');
      banner.className = 'game-feedback-banner active';
      banner.innerHTML = `
        <div style="font-size: 1.3rem; font-weight: 700; color: #d9822b;">
          Look at the rolling green hills...
        </div>
        <button class="btn-tactile" style="margin-top: 0.75rem;" onclick="smaranGames.startPlaceMemoryGame()">
          Try Again
        </button>
      `;
    }
  }

  // ==========================================
  // GAME #6 — REMEMBER THE STORY (Multi-Step)
  // ==========================================
  startStoryMemoryGame() {
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    this.gameSession.currentStep = 0;

    // Step 0: Read Story
    host.innerHTML = `
      <div class="game-stage-container">
        <div class="game-top-bar">
          <button class="btn-game-back" onclick="smaranApp.navigateTo('games')">← Back to Games</button>
          <div class="game-header-title">
            <span>📖 Remember the Story</span>
            <span class="game-badge-skill">Story Memory</span>
          </div>
          <button class="btn-game-hint" onclick="smaranGames.showHint('Pay attention to who visits, where they sit, and what they drink.')">
            💡 Hint
          </button>
        </div>

        <div class="story-presentation-card">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🏡 ☕ 👧</div>
          <h2 style="font-size: 1.8rem; font-weight: 800; color: #17382d; margin-bottom: 1rem;">
            Read this lovely memory:
          </h2>
          <div class="story-text-body">
            “Ananya visits Grandma every Sunday.<br>
            They sit together on the veranda garden and have warm tea.”
          </div>

          <button class="btn-tactile btn-tactile-secondary" style="font-size: 1.2rem; margin-top: 1.75rem;" onclick="smaranGames.showStoryQuestion1()">
            I'm Ready! Ask Questions →
          </button>
        </div>
      </div>
    `;
  }

  showStoryQuestion1() {
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    host.innerHTML = `
      <div class="game-stage-container">
        <div class="game-top-bar">
          <button class="btn-game-back" onclick="smaranApp.navigateTo('games')">← Back</button>
          <div class="game-header-title"><span>📖 Story Question 1 of 3</span></div>
          <button class="btn-game-hint" onclick="smaranGames.showHint('She is your granddaughter.')">💡 Hint</button>
        </div>

        <div style="margin: 2rem 0 1rem; font-size: 1.6rem; font-weight: 800; color: #17382d;">
          Who visits Grandma every Sunday?
        </div>

        <div class="game-choices-grid">
          <button class="game-choice-btn" onclick="smaranGames.handleStoryQ1(this, true)">
            <span class="choice-icon">❤️</span>
            <span class="choice-text">Ananya</span>
          </button>
          <button class="game-choice-btn" onclick="smaranGames.handleStoryQ1(this, false)">
            <span class="choice-icon">🌸</span>
            <span class="choice-text">Rohan</span>
          </button>
          <button class="game-choice-btn" onclick="smaranGames.handleStoryQ1(this, false)">
            <span class="choice-icon">🌿</span>
            <span class="choice-text">Priya</span>
          </button>
        </div>
        <div id="storyQFeedback" class="game-feedback-banner"></div>
      </div>
    `;
  }

  handleStoryQ1(btn, isCorrect) {
    if (isCorrect) {
      btn.classList.add('correct');
      if (window.smaranAudio) window.smaranAudio.playSuccessChime();
      setTimeout(() => this.showStoryQuestion2(), 800);
    } else {
      btn.classList.add('wrong');
    }
  }

  showStoryQuestion2() {
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    host.innerHTML = `
      <div class="game-stage-container">
        <div class="game-top-bar">
          <button class="btn-game-back" onclick="smaranApp.navigateTo('games')">← Back</button>
          <div class="game-header-title"><span>📖 Story Question 2 of 3</span></div>
          <button class="btn-game-hint" onclick="smaranGames.showHint('They sit where green plants and flowers grow.')">💡 Hint</button>
        </div>

        <div style="margin: 2rem 0 1rem; font-size: 1.6rem; font-weight: 800; color: #17382d;">
          Where do they sit together?
        </div>

        <div class="game-choices-grid">
          <button class="game-choice-btn" onclick="smaranGames.handleStoryQ2(this, true)">
            <span class="choice-icon">🌿</span>
            <span class="choice-text">In the Garden</span>
          </button>
          <button class="game-choice-btn" onclick="smaranGames.handleStoryQ2(this, false)">
            <span class="choice-icon">🛍️</span>
            <span class="choice-text">At the Market</span>
          </button>
          <button class="game-choice-btn" onclick="smaranGames.handleStoryQ2(this, false)">
            <span class="choice-icon">🚗</span>
            <span class="choice-text">In the Car</span>
          </button>
        </div>
      </div>
    `;
  }

  handleStoryQ2(btn, isCorrect) {
    if (isCorrect) {
      btn.classList.add('correct');
      if (window.smaranAudio) window.smaranAudio.playSuccessChime();
      setTimeout(() => this.showStoryQuestion3(), 800);
    } else {
      btn.classList.add('wrong');
    }
  }

  showStoryQuestion3() {
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    host.innerHTML = `
      <div class="game-stage-container">
        <div class="game-top-bar">
          <button class="btn-game-back" onclick="smaranApp.navigateTo('games')">← Back</button>
          <div class="game-header-title"><span>📖 Story Question 3 of 3</span></div>
          <button class="btn-game-hint" onclick="smaranGames.showHint('A warm cup of freshly brewed Assam beverage.')">💡 Hint</button>
        </div>

        <div style="margin: 2rem 0 1rem; font-size: 1.6rem; font-weight: 800; color: #17382d;">
          What do they enjoy having together?
        </div>

        <div class="game-choices-grid">
          <button class="game-choice-btn" onclick="smaranGames.handleStoryQ3(this, true)">
            <span class="choice-icon">☕</span>
            <span class="choice-text">Warm Tea</span>
          </button>
          <button class="game-choice-btn" onclick="smaranGames.handleStoryQ3(this, false)">
            <span class="choice-icon">🍦</span>
            <span class="choice-text">Ice Cream</span>
          </button>
          <button class="game-choice-btn" onclick="smaranGames.handleStoryQ3(this, false)">
            <span class="choice-icon">🥤</span>
            <span class="choice-text">Cold Juice</span>
          </button>
        </div>
      </div>
    `;
  }

  handleStoryQ3(btn, isCorrect) {
    if (isCorrect) {
      btn.classList.add('correct');
      if (window.smaranAudio) window.smaranAudio.playSuccessChime();
      setTimeout(() => {
        this.completeGame('Remember the Story', {
          storyRecall: '+9%',
          comprehension: '+7%',
          note: 'You remembered all 3 details of Ananya’s Sunday visit story!'
        });
      }, 900);
    } else {
      btn.classList.add('wrong');
    }
  }

  // ==========================================
  // GAME #7 — PATTERN GARDEN
  // ==========================================
  startPatternGardenGame() {
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    host.innerHTML = `
      <div class="game-stage-container">
        <div class="game-top-bar">
          <button class="btn-game-back" onclick="smaranApp.navigateTo('games')">← Back to Games</button>
          <div class="game-header-title">
            <span>🧩 Pattern Garden</span>
            <span class="game-badge-skill">Pattern Attention</span>
          </div>
          <button class="btn-game-hint" onclick="smaranGames.showHint('Look at the repeating pattern: Leaf, Flower, Leaf, Flower...')">
            💡 Hint
          </button>
        </div>

        <div class="pattern-sequence-card">
          <div class="pattern-items-row">
            <span class="pattern-item">🌿</span>
            <span class="pattern-arrow">→</span>
            <span class="pattern-item">🌸</span>
            <span class="pattern-arrow">→</span>
            <span class="pattern-item">🌿</span>
            <span class="pattern-arrow">→</span>
            <span class="pattern-item">🌸</span>
            <span class="pattern-arrow">→</span>
            <span class="pattern-item pattern-question">?</span>
          </div>
        </div>

        <div style="margin: 2rem 0 0.5rem; font-size: 1.35rem; font-weight: 800; color: #17382d;">
          Which nature symbol comes next in the garden sequence?
        </div>

        <div class="game-choices-grid">
          <button class="game-choice-btn" onclick="smaranGames.handlePatternAnswer(this, true)">
            <span class="choice-icon">🌿</span>
            <span class="choice-text">Green Leaf <small>(🌿)</small></span>
          </button>
          <button class="game-choice-btn" onclick="smaranGames.handlePatternAnswer(this, false)">
            <span class="choice-icon">🌸</span>
            <span class="choice-text">Pink Flower <small>(🌸)</small></span>
          </button>
          <button class="game-choice-btn" onclick="smaranGames.handlePatternAnswer(this, false)">
            <span class="choice-icon">🌳</span>
            <span class="choice-text">Big Tree <small>(🌳)</small></span>
          </button>
        </div>

        <div id="patternFeedbackBanner" class="game-feedback-banner"></div>
      </div>
    `;
  }

  handlePatternAnswer(btn, isCorrect) {
    const banner = document.getElementById('patternFeedbackBanner');
    const allBtns = document.querySelectorAll('.game-choice-btn');
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      btn.classList.add('correct');
      if (window.smaranAudio) window.smaranAudio.playSuccessChime();

      banner.className = 'game-feedback-banner active';
      banner.innerHTML = `
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-success); margin-bottom: 0.5rem;">
          ✨ Perfect pattern recognition!
        </div>
        <p style="font-size: 1.15rem; color: #17382d; font-weight: 600;">
          The sequence repeats: Leaf, Flower, Leaf, Flower, Leaf!
        </p>
        <button class="btn-tactile" style="margin-top: 1.25rem;" onclick="smaranGames.completeGame('Pattern Garden', { attention: '+8%', patterns: '+7%', note: 'You solved the garden pattern sequence!' })">
          Continue Journey →
        </button>
      `;
    } else {
      btn.classList.add('wrong');
    }
  }

  // ==========================================
  // GAME #8 — DAILY ROUTINE PUZZLE ("Meera's Morning")
  // ==========================================
  startDailyRoutineGame() {
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    this.gameSession.routineState = [
      { id: 2, title: 'Morning Tea & Medicine 💊', icon: '🍵' },
      { id: 1, title: 'Wake Up & Fresh Water ☀️', icon: '🌅' },
      { id: 4, title: 'Family Call with Children ❤️', icon: '📞' },
      { id: 3, title: 'Peaceful Veranda Walk 🌿', icon: '🚶' }
    ];

    this.renderRoutineCards();
  }

  renderRoutineCards() {
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    host.innerHTML = `
      <div class="game-stage-container">
        <div class="game-top-bar">
          <button class="btn-game-back" onclick="smaranApp.navigateTo('games')">← Back to Games</button>
          <div class="game-header-title">
            <span>⏰ Meera's Morning Routine</span>
            <span class="game-badge-skill">Sequencing</span>
          </div>
          <button class="btn-game-hint" onclick="smaranGames.showHint('First wake up, then have morning tea & medicine, then veranda walk, then family call.')">
            💡 Hint
          </button>
        </div>

        <div class="game-instruction-banner">
          Put your morning steps in order from start to finish:
        </div>

        <div class="routine-list-board" id="routineBoard">
          ${this.gameSession.routineState.map((item, idx) => `
            <div class="routine-card-item">
              <span class="routine-step-num">${idx + 1}</span>
              <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
                <span style="font-size: 1.8rem;">${item.icon}</span>
                <span style="font-size: 1.15rem; font-weight: 700; color: #17382d;">${item.title}</span>
              </div>
              <div style="display: flex; gap: 0.35rem;">
                <button class="btn-routine-move" onclick="smaranGames.moveRoutine(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>▲</button>
                <button class="btn-routine-move" onclick="smaranGames.moveRoutine(${idx}, 1)" ${idx === this.gameSession.routineState.length - 1 ? 'disabled' : ''}>▼</button>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 1.75rem;">
          <button class="btn-tactile" style="font-size: 1.2rem;" onclick="smaranGames.validateRoutine()">
            ✓ Check My Routine Order
          </button>
        </div>

        <div id="routineFeedbackBanner" class="game-feedback-banner"></div>
      </div>
    `;
  }

  moveRoutine(index, direction) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= this.gameSession.routineState.length) return;

    if (window.smaranAudio) window.smaranAudio.playTapSound();

    const temp = this.gameSession.routineState[index];
    this.gameSession.routineState[index] = this.gameSession.routineState[targetIdx];
    this.gameSession.routineState[targetIdx] = temp;

    this.renderRoutineCards();
  }

  validateRoutine() {
    const isCorrect = this.gameSession.routineState.every((item, idx) => item.id === idx + 1);
    const banner = document.getElementById('routineFeedbackBanner');

    if (isCorrect) {
      if (window.smaranAudio) window.smaranAudio.playSuccessChime();
      banner.className = 'game-feedback-banner active';
      banner.innerHTML = `
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-success); margin-bottom: 0.5rem;">
          ✨ Wonderful! You remembered your morning routine!
        </div>
        <p style="font-size: 1.15rem; color: #17382d; font-weight: 600;">
          Wake Up → Morning Tea & Medicine → Veranda Walk → Family Call.
        </p>
        <button class="btn-tactile" style="margin-top: 1.25rem;" onclick="smaranGames.completeGame('Meera’s Morning Routine', { sequencing: '+8%', routine: '+7%', note: 'You arranged your entire morning routine perfectly!' })">
          Continue Journey →
        </button>
      `;
    } else {
      banner.className = 'game-feedback-banner active';
      banner.innerHTML = `
        <div style="font-size: 1.3rem; font-weight: 700; color: #d9822b;">
          Almost! Use the ▲ and ▼ buttons to adjust the order ❤️
        </div>
      `;
    }
  }

  // ==========================================
  // GAME #9 — OBJECT MEMORY (Table Scene)
  // ==========================================
  startObjectMemoryGame() {
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    host.innerHTML = `
      <div class="game-stage-container">
        <div class="game-top-bar">
          <button class="btn-game-back" onclick="smaranApp.navigateTo('games')">← Back to Games</button>
          <div class="game-header-title">
            <span>☕ Objects on the Veranda</span>
            <span class="game-badge-skill">Short-Term Visual</span>
          </div>
          <button class="btn-game-hint" onclick="smaranGames.showHint('Look carefully at the warm brass tea kettle, reading glasses, and fresh flower.')">
            💡 Hint
          </button>
        </div>

        <div id="objectSceneBox" class="object-scene-card">
          <div style="font-size: 1.2rem; font-weight: 700; color: #1b4d3e; margin-bottom: 1rem;">
            Remember the items on Meera's Veranda Table:
          </div>
          
          <div class="table-items-display">
            <div class="table-item-chip">☕ Brass Tea Cup</div>
            <div class="table-item-chip">👓 Reading Glasses</div>
            <div class="table-item-chip">📖 Story Book</div>
            <div class="table-item-chip">🌸 Pink Kopou Flower</div>
          </div>

          <button class="btn-tactile btn-tactile-secondary" style="margin-top: 1.75rem;" onclick="smaranGames.hideObjectScene()">
            I Remembered Them! Ask Me →
          </button>
        </div>

        <div id="objectQuestionBox" style="display: none;">
          <div style="margin: 2rem 0 1rem; font-size: 1.4rem; font-weight: 800; color: #17382d;">
            Which item was on Meera's veranda table?
          </div>

          <div class="game-choices-grid">
            <button class="game-choice-btn" onclick="smaranGames.handleObjectAnswer(this, true, 'Reading Glasses')">
              <span class="choice-icon">👓</span>
              <span class="choice-text">Reading Glasses</span>
            </button>
            <button class="game-choice-btn" onclick="smaranGames.handleObjectAnswer(this, false, 'Smartphone')">
              <span class="choice-icon">📱</span>
              <span class="choice-text">Smartphone</span>
            </button>
            <button class="game-choice-btn" onclick="smaranGames.handleObjectAnswer(this, false, 'Car Keys')">
              <span class="choice-icon">🔑</span>
              <span class="choice-text">Car Keys</span>
            </button>
          </div>
        </div>

        <div id="objectFeedbackBanner" class="game-feedback-banner"></div>
      </div>
    `;
  }

  hideObjectScene() {
    document.getElementById('objectSceneBox').style.display = 'none';
    document.getElementById('objectQuestionBox').style.display = 'block';
  }

  handleObjectAnswer(btn, isCorrect, name) {
    const banner = document.getElementById('objectFeedbackBanner');
    const allBtns = document.querySelectorAll('.game-choice-btn');
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      btn.classList.add('correct');
      if (window.smaranAudio) window.smaranAudio.playSuccessChime();

      banner.className = 'game-feedback-banner active';
      banner.innerHTML = `
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-success); margin-bottom: 0.5rem;">
          ✨ Excellent visual recall!
        </div>
        <p style="font-size: 1.15rem; color: #17382d; font-weight: 600;">
          The reading glasses were sitting right next to your morning tea cup.
        </p>
        <button class="btn-tactile" style="margin-top: 1.25rem;" onclick="smaranGames.completeGame('Objects on the Veranda', { objectMemory: '+8%', attention: '+6%', note: 'You recalled the objects from the table scene!' })">
          Continue Journey →
        </button>
      `;
    } else {
      btn.classList.add('wrong');
    }
  }

  // ==========================================
  // GAME #10 — SOUND + IMAGE MEMORY
  // ==========================================
  startSoundImageGame() {
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    if (window.smaranAudio) {
      window.smaranAudio.playSound('birds');
    }

    host.innerHTML = `
      <div class="game-stage-container">
        <div class="game-top-bar">
          <button class="btn-game-back" onclick="smaranApp.navigateTo('games')">← Back to Games</button>
          <div class="game-header-title">
            <span>🎨 Sound & Scene Harmony</span>
            <span class="game-badge-skill">Multi-Sensory</span>
          </div>
          <button class="btn-game-hint" onclick="smaranGames.showHint('Listen to the gentle bird whistles and choose the picture with birds.')">
            💡 Hint
          </button>
        </div>

        <div class="soundscape-player-card">
          <div style="font-size: 3rem; animation: pulseGlow 2s infinite;">🔊 🌿</div>
          <h2 style="font-size: 1.6rem; font-weight: 800; margin: 0.4rem 0;">
            Listen to this sound...
          </h2>
          <button class="btn-tactile" style="padding: 0.6rem 1.25rem;" onclick="smaranAudio.playSound('birds')">
            ▶️ Play Sound
          </button>
        </div>

        <div style="margin: 1.75rem 0 0.5rem; font-size: 1.35rem; font-weight: 800; color: #17382d;">
          Which picture matches the sound you hear?
        </div>

        <div class="activities-mini-grid" style="grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem;">
          <div class="activity-tile" onclick="smaranGames.handleSoundImageAnswer(this, true)">
            <div class="activity-tile-thumb" style="height: 120px; font-size: 3.5rem; background: #e8f5e9; display: flex; align-items: center; justify-content: center;">
              🕊️
            </div>
            <div class="activity-tile-name" style="font-size: 1.1rem; padding: 0.8rem;">Morning Birds in Tree</div>
          </div>

          <div class="activity-tile" onclick="smaranGames.handleSoundImageAnswer(this, false)">
            <div class="activity-tile-thumb" style="height: 120px; font-size: 3.5rem; background: #fff3e0; display: flex; align-items: center; justify-content: center;">
              🚗
            </div>
            <div class="activity-tile-name" style="font-size: 1.1rem; padding: 0.8rem;">City Car Traffic</div>
          </div>

          <div class="activity-tile" onclick="smaranGames.handleSoundImageAnswer(this, false)">
            <div class="activity-tile-thumb" style="height: 120px; font-size: 3.5rem; background: #e1f5fe; display: flex; align-items: center; justify-content: center;">
              🚂
            </div>
            <div class="activity-tile-name" style="font-size: 1.1rem; padding: 0.8rem;">Train Station</div>
          </div>
        </div>

        <div id="soundImageFeedbackBanner" class="game-feedback-banner"></div>
      </div>
    `;
  }

  handleSoundImageAnswer(tile, isCorrect) {
    const banner = document.getElementById('soundImageFeedbackBanner');
    if (isCorrect) {
      tile.style.borderColor = 'var(--color-success)';
      tile.style.background = 'var(--color-success-bg)';
      if (window.smaranAudio) {
        window.smaranAudio.stopSound();
        window.smaranAudio.playSuccessChime();
      }

      banner.className = 'game-feedback-banner active';
      banner.innerHTML = `
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-success); margin-bottom: 0.5rem;">
          ✨ Perfect match!
        </div>
        <p style="font-size: 1.15rem; color: #17382d; font-weight: 600;">
          The joyful morning birds in the shade tree match the lovely chirping soundscape.
        </p>
        <button class="btn-tactile" style="margin-top: 1.25rem;" onclick="smaranGames.completeGame('Sound & Scene Harmony', { multisensory: '+8%', audioVisual: '+7%', note: 'You matched the bird audio with the picture!' })">
          Complete Activity →
        </button>
      `;
    } else {
      tile.style.borderColor = 'var(--color-danger)';
    }
  }

  // ==========================================
  // GAME REWARD & CAREGIVER SYNC
  // ==========================================
  completeGame(gameTitle, statsUpdate) {
    if (window.smaranAudio) {
      window.smaranAudio.stopSound();
      window.smaranAudio.playCelebrationFanfare();
    }

    // Increment Gamification stats
    SMARAN_STATE.user.stats.memorySeeds += 5;
    SMARAN_STATE.user.stats.stars += 1;
    SMARAN_STATE.user.stats.completedToday = Math.min(5, SMARAN_STATE.user.stats.completedToday + 1);
    SMARAN_STATE.user.stats.gardenStage = Math.min(4, SMARAN_STATE.user.stats.gardenStage + 1);

    // Update Caregiver Metrics
    SMARAN_STATE.caregiver.metrics.memory = Math.min(96, SMARAN_STATE.caregiver.metrics.memory + 2);
    SMARAN_STATE.caregiver.metrics.recall = Math.min(98, SMARAN_STATE.caregiver.metrics.recall + 2);
    SMARAN_STATE.caregiver.metrics.engagement = Math.min(99, SMARAN_STATE.caregiver.metrics.engagement + 1);

    SMARAN_STATE.caregiver.recentSessions.unshift({
      game: gameTitle,
      difficulty: 'Medium',
      accuracy: '100%',
      time: '2.2 min',
      hints: this.gameSession.hintsUsed,
      date: 'Just now'
    });

    // Save to localStorage
    try {
      localStorage.setItem('smaran_meera_user', JSON.stringify(SMARAN_STATE.user));
    } catch (e) {}

    // Render Victory Screen
    const host = document.getElementById('gamePlayerHost');
    if (!host) return;

    host.innerHTML = `
      <div class="game-stage-container victory-container">
        <div style="font-size: 4rem; animation: bounceIn 0.8s ease;">🌸 🏆 🌿</div>
        
        <h1 style="font-size: 2.6rem; font-weight: 800; color: #17382d; margin: 0.5rem 0 0.25rem;">
          Wonderful work, Meera ❤️
        </h1>
        <p style="font-size: 1.25rem; color: #556b61; margin-bottom: 1.5rem;">
          You completed <strong>${gameTitle}</strong> with beautiful recall and warmth.
        </p>

        <!-- Memory Garden Growth Visualizer -->
        <div class="garden-growth-banner">
          <div style="font-size: 0.9rem; font-weight: 800; color: #1b4d3e; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem;">
            🌱 MEERA'S MEMORY GARDEN GREW!
          </div>
          <div class="garden-plant-stage">
            <span style="font-size: 2.8rem;">🌸</span>
            <div>
              <div style="font-weight: 800; font-size: 1.2rem; color: #17382d;">Bihu Kopou Orchid is Blooming!</div>
              <div style="font-size: 0.95rem; color: #556b61;">5-Day Activity Streak • 48 Memory Seeds Collected</div>
            </div>
          </div>
        </div>

        <!-- Qualitative Non-Clinical Score Summary -->
        <div class="victory-stats-grid">
          <div class="victory-stat-box">
            <div class="victory-stat-label">MEMORY RECALL</div>
            <div class="victory-stat-val" style="color: var(--color-success);">Excellent ✨</div>
          </div>
          <div class="victory-stat-box">
            <div class="victory-stat-label">ATTENTION SPAN</div>
            <div class="victory-stat-val" style="color: #1b4d3e;">Strong 🎯</div>
          </div>
          <div class="victory-stat-box">
            <div class="victory-stat-label">ENGAGEMENT</div>
            <div class="victory-stat-val" style="color: var(--color-secondary);">Joyful ❤️</div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem;">
          <button class="btn-tactile" onclick="smaranApp.navigateTo('games')">
            Back to Game Hub 🎮
          </button>
          <button class="btn-tactile btn-tactile-secondary" onclick="smaranApp.navigateTo('caregiver')">
            View Caregiver Progress 📊
          </button>
        </div>
      </div>
    `;
  }

  // --- HINT & VOICE MODALS ---
  showHint(hintText) {
    this.gameSession.hintsUsed++;
    alert(`💡 GENTLE HINT FOR MEERA:\n\n${hintText}`);
  }

  showToastFeedback(msg) {
    const toast = document.getElementById('matchFeedbackToast');
    if (toast) {
      toast.textContent = msg;
      toast.classList.add('active');
      setTimeout(() => toast.classList.remove('active'), 1800);
    }
  }

  openVoiceAnswerModal(expectedAnswer) {
    const modal = document.getElementById('voiceAnswerModal');
    if (modal) modal.classList.add('active');
    if (window.smaranVoice) {
      window.smaranVoice.startVoicePrompt();
    }
  }

  renderGardenWidget() {
    const gardenEl = document.getElementById('hubGardenWidget');
    if (!gardenEl) return;

    gardenEl.innerHTML = `
      <div class="garden-widget-card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <div style="font-size: 0.85rem; font-weight: 800; color: #1b4d3e; text-transform: uppercase;">
              🌺 MEERA'S MEMORY GARDEN
            </div>
            <h3 style="font-size: 1.4rem; font-weight: 800; color: #17382d;">
              ${SMARAN_STATE.user.stats.completedToday} Activities Completed Today
            </h3>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <span class="stat-pill">🌱 ${SMARAN_STATE.user.stats.memorySeeds} Seeds</span>
            <span class="stat-pill">⭐ ${SMARAN_STATE.user.stats.stars} Stars</span>
            <span class="stat-pill">🔥 ${SMARAN_STATE.user.stats.dayStreak}-Day Streak</span>
          </div>
        </div>
      </div>
    `;
  }
}

window.smaranGames = new SmaranGamesEngine();
