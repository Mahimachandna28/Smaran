/**
 * SMARAN Main Application Controller & UI Orchestrator
 */

class SmaranApp {
  constructor() {
    this.initEventListeners();
    this.renderInitialState();
  }

  initEventListeners() {
    // Navigation listeners
    document.querySelectorAll('.nav-elderly-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        if (view) this.navigateTo(view);
      });
    });

    // Regional state selector buttons
    document.querySelectorAll('.state-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const region = btn.getAttribute('data-region');
        this.setRegion(region);
      });
    });
  }

  renderInitialState() {
    // Read saved language or default to Assamese
    const savedLang = localStorage.getItem('smaran_lang') || 'as';
    this.setLanguage(savedLang);
    this.setRegion('assam');
    this.navigateTo('home');
    this.renderMemoryVault();
  }

  // --- View Routing ---
  navigateTo(viewName) {
    // Stop any background soundscape when switching views
    if (window.smaranAudio) {
      window.smaranAudio.stopSound();
    }

    SMARAN_STATE.currentView = viewName;

    // Toggle active view
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update Bottom Nav Pills
    document.querySelectorAll('.nav-elderly-pill').forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // View specific triggers
    if (viewName === 'games' && window.smaranGames) {
      window.smaranGames.renderGameHub();
    }
    if (viewName === 'caregiver') {
      this.renderCaregiverDashboard();
    }
  }

  // --- Multi-Lingual Engine ---
  cycleLanguage() {
    const langs = ['as', 'en', 'hi', 'kh'];
    const currentLang = window.i18n ? window.i18n.currentLang : (localStorage.getItem('smaran_lang') || 'as');
    const currentIdx = langs.indexOf(currentLang);
    const nextLang = langs[(currentIdx + 1) % langs.length];
    this.setLanguage(nextLang);
  }

  setLanguage(langCode) {
    if (window.i18n) {
      window.i18n.setLanguage(langCode);
    }
  }


  // --- Regional Personalization Engine ---
  setRegion(regionId) {
    const reg = SMARAN_STATE.regions[regionId];
    if (!reg) return;

    SMARAN_STATE.currentRegion = regionId;
    document.body.setAttribute('data-region', regionId);

    // Update active state selector buttons
    document.querySelectorAll('.state-select-btn').forEach(btn => {
      if (btn.getAttribute('data-region') === regionId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Header Region Text
    const headerReg = document.getElementById('headerRegionName');
    if (headerReg) {
      headerReg.textContent = `${reg.name} (${reg.nativeName})`;
    }

    // Automatically synchronize primary regional language!
    const regionLangMap = {
      meghalaya: 'kh',
      assam: 'as',
      arunachal: 'hi',
      manipur: 'as',
      mizoram: 'kh',
      nagaland: 'en',
      tripura: 'as',
      sikkim: 'hi'
    };

    const targetLang = regionLangMap[regionId] || 'as';
    this.setLanguage(targetLang);
  }


  // --- Emotional Check-in Flow ---
  handleMoodSelection(moodType) {
    const moods = {
      happy: 'Wonderful, Meera! Your joy brightens our home 🌸',
      good: 'So glad you are feeling peaceful today 🌿',
      okay: 'Take all the time you need, Meera. Let us enjoy a gentle calming memory together ❤️',
      low: 'We are right here with you. Would you like to listen to gentle morning birds?'
    };

    if (window.smaranAudio) window.smaranAudio.playSuccessChime();
    alert(`❤️ SMARAN:\n\n${moods[moodType] || moods.happy}`);
  }

  // --- Offline Mode Simulator ---
  toggleOfflineMode() {
    this.setOfflineMode(!SMARAN_STATE.isOffline);
  }

  setOfflineMode(offline) {
    SMARAN_STATE.isOffline = offline;
    const pill = document.getElementById('offlineStatusPill');
    const headerConn = document.getElementById('headerConnStatus');

    if (pill) {
      const dot = pill.querySelector('.status-dot');
      if (offline) {
        if (dot) dot.style.background = '#d9822b';
        if (headerConn) headerConn.textContent = 'Offline';
        alert("🟠 Offline Mode Active: SMARAN's cognitive games, voice guidance, and saved memories run 100% locally on your device!");
      } else {
        if (dot) dot.style.background = '#287a4a';
        if (headerConn) headerConn.textContent = 'Online';
      }
    }
  }

  triggerOfflineSync() {
    alert("⚡ Cloud Sync: Synchronizing 8 offline cognitive game progress records with family caregiver dashboard... ✓ Complete!");
    this.setOfflineMode(false);
  }

  // --- Memory Vault Rendering ---
  renderMemoryVault(filterCat = 'all') {
    const container = document.getElementById('memoryCardsGrid');
    if (!container) return;

    const list = (filterCat === 'all') 
      ? SMARAN_STATE.memories 
      : SMARAN_STATE.memories.filter(m => m.category === filterCat);

    container.innerHTML = list.map(m => `
      <div class="memory-card" id="memoryCard-${m.id}">
        <div class="memory-img-box">
          <img src="${this.getMemoryImg(m.id)}" alt="${m.name}" style="width: 100%; height: 100%; object-fit: cover;">
          <span class="memory-tag-chip">${m.tag}</span>
        </div>
        <div class="memory-body">
          <h3 class="memory-title">${m.name}</h3>
          <div class="memory-relation">${m.relation}</div>
          <p class="memory-story">${m.story}</p>
          <div style="font-size: 0.95rem; color: #1b4d3e; font-weight: 700; margin-bottom: 1rem;">
            🔊 Audio Note: ${m.audioNote}
          </div>
          <button class="btn-smaran btn-smaran-primary" onclick="smaranGames.launchGame('who_is_this')">
            ✨ Play Memory Activity
          </button>
        </div>
      </div>
    `).join('');
  }

  filterMemoryVault(cat, btnEl) {
    document.querySelectorAll('.vault-cat-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    this.renderMemoryVault(cat);
  }

  getMemoryImg(id) {
    if (id === 'ananya') return 'assets/family_ananya.jpg';
    if (id === 'teagarden') return 'assets/tea_gardens.jpg';
    if (id === 'bihu') return 'assets/bihu_story.jpg';
    return 'assets/brahmaputra.jpg';
  }

  renderCaregiverDashboard() {
    const sessions = SMARAN_STATE.caregiver.recentSessions;
    const sessionListEl = document.getElementById('caregiverSessionList');
    if (sessionListEl) {
      sessionListEl.innerHTML = sessions.map(s => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0; border-bottom: 1px solid #f0f4f0;">
          <div>
            <div style="font-weight: 800; color: #17382d; font-size: 1.05rem;">${s.game}</div>
            <div style="font-size: 0.85rem; color: #62756c;">${s.date} • ${s.difficulty} • Duration: ${s.time}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; color: #287a4a; font-size: 1.1rem;">${s.accuracy}</div>
            <div style="font-size: 0.8rem; color: #708278;">Hints: ${s.hints}</div>
          </div>
        </div>
      `).join('');
    }
  }

  // --- Clinical PDF Report Generator ---
  downloadClinicalReport() {
    if (window.smaranAudio) window.smaranAudio.playSuccessChime();

    const reportContent = `
============================================================
SMARAN (স্মৰণ) — CLINICAL COGNITIVE HEALTH ASSESSMENT REPORT
============================================================
Patient Name: Meera Sharma          Age: 72
Primary Language: Assamese (অসমীয়া)   Region: Tezpur / Guwahati, Assam
Clinical Classification: Mild Cognitive Impairment (MCI) — Stage 2 (Stable)
Primary Caregiver: Ananya Sharma (Granddaughter)
Attending Neurologist: Dr. B. Barua, MD (Neurology)
Reporting Period: Last 30 Days

------------------------------------------------------------
1. COGNITIVE STIMULATION METRICS & KEY INDICATORS
------------------------------------------------------------
• 7-Day Recall Accuracy Index: 84% (Baseline: 72% | ▲ +12%)
• Cognitive Response Latency: 1.8s (Reduced by 57% from 4.2s)
• Weekly Consistency Rate: 16 of 20 Planned Sessions (88%)
• Daily Engagement Duration: 18.5 Minutes / Day
• Sundowning Agitation Risk Index: 12% (Low / Controlled)

------------------------------------------------------------
2. 5-PILLAR COGNITIVE DOMAIN BREAKDOWN
------------------------------------------------------------
1. Kin & Family Recognition: 92% (High — Immediate recall of Granddaughter Ananya)
2. Auditory & Native Dialect Memory: 88% (High — Assamese Bihu & greetings)
3. Spatial & Regional Landmark Memory: 82% (Strong — Tea garden & Majuli island)
4. Episodic Story Comprehension: 78% (Improving — Veranda stories)
5. Temporal Rhythm & Sequencing: 74% (Consistent — Morning routine order)

------------------------------------------------------------
3. CLINICAL NEUROLOGICAL OBSERVATIONS
------------------------------------------------------------
"Reminiscence Therapy (RT) with personalized family media and authentic
North-Eastern environmental audio yielded statistically significant improvements
in attention span and retrieval speed compared to standard abstract quizzes.
Nature soundscapes (morning birds & tea garden rain) effectively prevented
evening sundowning agitation."

------------------------------------------------------------
4. MEDICAL RECOMMENDATIONS
------------------------------------------------------------
✓ Maintain daily 15-minute multi-sensory cognitive sessions in native Assamese.
✓ Continue family voice notes and morning veranda nature audio.
✓ Next follow-up neurology review scheduled in 6 weeks.
============================================================
    `;

    alert(reportContent);
  }

  // --- Family Memory Contribution & AI Game Generation ---
  handleFamilyContribution(e) {
    e.preventDefault();
    const name = document.getElementById('contribName').value;
    const relation = document.getElementById('contribRelation').value;
    const story = document.getElementById('contribStory').value;
    const dialect = document.getElementById('contribAudioDialect').value;
    const mode = document.getElementById('contribGameMode').value;

    if (!name) return;

    const newId = 'custom_' + Date.now();

    // 1. Add to Memory Vault
    SMARAN_STATE.memories.unshift({
      id: newId,
      category: 'people',
      tag: '❤️ Family Member',
      name: name,
      relation: relation || 'Family Member',
      story: story || 'A cherished family memory added for Meera.',
      favoritePlace: 'Home Veranda',
      audioNote: `“Voice note recorded in ${dialect.toUpperCase()} dialect.”`
    });

    // 2. Automatically Generate a Playable AI Cognitive Game
    const newGame = {
      id: 'game_' + newId,
      title: `${name}’s Memory Challenge`,
      nativeTitle: `${name}ৰ স্মৃতি কাৰ্যকলাপ`,
      category: 'memory',
      categoryLabel: '❤️ Family Memory',
      difficulty: 'Gentle',
      duration: '2-3 min',
      skill: 'Facial & Kin Recall',
      desc: `Personalized cognitive memory activity generated around ${name} (${relation}).`,
      heroImg: 'assets/family_ananya.jpg',
      featured: true
    };

    SMARAN_STATE.games.unshift(newGame);

    // 3. Log caregiver sync
    SMARAN_STATE.caregiver.recentSessions.unshift({
      game: `Generated: ${name}’s Memory`,
      difficulty: 'Gentle',
      accuracy: 'Ready to Play',
      time: 'Just now',
      hints: 0,
      date: 'Just now'
    });

    if (window.smaranAudio) window.smaranAudio.playSuccessChime();

    // Re-render views
    this.renderMemoryVault('all');
    this.renderCaregiverDashboard();

    alert(`✨ AI Game Engine Success!\n\nNew personalized cognitive game "${name}’s Memory Challenge" has been generated and added to Meera's Game Hub & Memory Vault.`);
    this.navigateTo('vault');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.smaranApp = new SmaranApp();
});

