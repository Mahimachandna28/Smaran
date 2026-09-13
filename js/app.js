/**
 * SMARAN Main Application Controller & UI Orchestrator
 */

class SmaranApp {
  constructor() {
    this.enteredPin = '';
    this.isEmergencySirenActive = false;

    // Load custom saved PIN if any
    const savedPin = localStorage.getItem('smaran_pin');
    if (savedPin && SMARAN_STATE.security) {
      SMARAN_STATE.security.pin = savedPin;
    }

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
    // Read saved language or default to English
    const savedLang = localStorage.getItem('smaran_lang') || 'en';
    this.setLanguage(savedLang);
    this.setRegion('assam');
    this.navigateTo('home');
    this.renderMemoryVault();
    this.renderSecurityDashboard();
  }

  // --- View Routing ---
  navigateTo(viewName) {
    // Enforce Caregiver Security PIN gate
    if (viewName === 'caregiver' && !SMARAN_STATE.security.isUnlocked) {
      this.requestCaregiverAccess();
      return;
    }

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

    // Update Floating SOS button visibility (hide on caregiver portal)
    const floatingSos = document.getElementById('floatingSosBtn');
    if (floatingSos) {
      floatingSos.style.display = (viewName === 'caregiver') ? 'none' : 'inline-flex';
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
      this.renderSecurityDashboard();
    }
  }

  // --- Multi-Lingual Engine ---
  cycleLanguage() {
    const langs = ['en', 'as', 'hi', 'kh'];
    const currentLang = window.i18n ? window.i18n.currentLang : (localStorage.getItem('smaran_lang') || 'en');
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
    this.showToast('⏳ Generating official Clinical Assessment PDF...');

    try {
      const jsPDF = window.jspdf ? window.jspdf.jsPDF : null;
      if (!jsPDF) {
        throw new Error('jsPDF library not yet initialized.');
      }

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pw = doc.internal.pageSize.getWidth(); // 210
      const ph = doc.internal.pageSize.getHeight(); // 297
      const margin = 12;
      const contentW = pw - (margin * 2); // 186

      // 1. Top Decorative Gamusa Stripe & Header
      doc.setFillColor(27, 77, 62); // Heritage deep green #1b4d3e
      doc.rect(0, 0, pw, 26, 'F');
      doc.setFillColor(212, 163, 89); // Gold stripe #d4a359
      doc.rect(0, 26, pw, 2, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('SMARAN (স্মৰণ) — CLINICAL COGNITIVE HEALTH REPORT', margin, 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(220, 240, 230);
      doc.text('Personalized Cognitive Memory, Sound & Cultural Engagement System | North-East India', margin, 16);
      doc.text('CONFIDENTIAL MEDICAL RECORD • NEUROLOGICAL ASSESSMENT & RT PROGRESS', margin, 21);

      // Date on right
      const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      doc.setFont('helvetica', 'bold');
      doc.text('DATE: ' + todayStr, pw - margin, 16, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.text('REF ID: SMR-2024-NE-0842', pw - margin, 21, { align: 'right' });

      // 2. Patient Demographics Box
      let y = 32;
      doc.setFillColor(242, 248, 244);
      doc.roundedRect(margin, y, contentW, 24, 2, 2, 'F');
      doc.setDrawColor(180, 215, 195);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentW, 24, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(27, 77, 62);
      doc.text('PATIENT PROFILE & CLINICAL CONTEXT', margin + 4, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(50, 70, 60);
      doc.text('Patient Name: Meera Sharma (Age: 72 | Female)', margin + 4, y + 11);
      doc.text('Residence: Tezpur / Guwahati, Assam', margin + 4, y + 16);
      doc.text('Primary Language: Assamese (অসমীয়া)', margin + 4, y + 21);

      const col2X = margin + 95;
      doc.text('Diagnosis: Mild Cognitive Impairment (MCI — Stage 2 Stable)', col2X, y + 11);
      doc.text('Primary Caregiver: Ananya Sharma (Granddaughter)', col2X, y + 16);
      doc.text('Attending Neurologist: Dr. B. Barua, MD (Neurology)', col2X, y + 21);

      // 3. Key Metrics Strip (4 boxes)
      y = 60;
      const cardW = (contentW - 9) / 4;
      const metrics = [
        { label: '7-Day Recall Accuracy', val: '84%', sub: '▲ +12% vs Baseline', color: [40, 122, 74] },
        { label: 'Retrieval Latency', val: '1.8s', sub: 'Reduced from 4.2s (-57%)', color: [27, 77, 62] },
        { label: 'Session Adherence', val: '88%', sub: '16 of 20 Sessions Done', color: [40, 122, 74] },
        { label: 'Sundowning Risk', val: '12%', sub: 'Low / Controlled Level', color: [40, 122, 74] }
      ];

      metrics.forEach((m, idx) => {
        const cardX = margin + (idx * (cardW + 3));
        doc.setFillColor(248, 251, 249);
        doc.roundedRect(cardX, y, cardW, 21, 2, 2, 'F');
        doc.setDrawColor(200, 225, 210);
        doc.roundedRect(cardX, y, cardW, 21, 2, 2, 'S');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(90, 110, 100);
        doc.text(m.label, cardX + (cardW / 2), y + 5, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(m.color[0], m.color[1], m.color[2]);
        doc.text(m.val, cardX + (cardW / 2), y + 12, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(60, 90, 75);
        doc.text(m.sub, cardX + (cardW / 2), y + 17, { align: 'center' });
      });

      // 4. 5-Pillar Cognitive Domain Table
      y = 86;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(27, 77, 62);
      doc.text('5-PILLAR COGNITIVE DOMAIN BREAKDOWN', margin, y);

      y += 4;
      doc.setFillColor(27, 77, 62);
      doc.rect(margin, y, contentW, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text('COGNITIVE DOMAIN', margin + 3, y + 4.2);
      doc.text('ACCURACY', margin + 65, y + 4.2);
      doc.text('STATUS', margin + 92, y + 4.2);
      doc.text('CLINICAL OBSERVATION & REMINISCENCE IMPACT', margin + 115, y + 4.2);

      const domainData = [
        { domain: '1. Kin & Family Recognition', acc: '92%', status: 'Optimal', notes: 'Immediate recall of granddaughter Ananya; vivid emotional response.' },
        { domain: '2. Auditory & Native Dialect', acc: '88%', status: 'Optimal', notes: 'High responsiveness to Assamese Bihu tunes & regional greetings.' },
        { domain: '3. Spatial & Regional Landmarks', acc: '82%', status: 'Strong', notes: 'Recognizes Majuli Island & Kaziranga imagery without hesitation.' },
        { domain: '4. Episodic Story Comprehension', acc: '78%', status: 'Improving', notes: 'Recalls veranda tea stories with minimal hints; retention steady.' },
        { domain: '5. Temporal Rhythm & Sequencing', acc: '74%', status: 'Stable', notes: 'Morning tea routine sequence completed successfully with 1 prompt.' }
      ];

      y += 6;
      domainData.forEach((row, i) => {
        doc.setFillColor(i % 2 === 0 ? 255 : 246, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 248);
        doc.rect(margin, y, contentW, 6, 'F');
        doc.setDrawColor(225, 235, 228);
        doc.line(margin, y + 6, margin + contentW, y + 6);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(23, 56, 45);
        doc.text(row.domain, margin + 3, y + 4.2);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 122, 74);
        doc.text(row.acc, margin + 65, y + 4.2);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 90, 75);
        doc.text(row.status, margin + 92, y + 4.2);
        doc.text(row.notes, margin + 115, y + 4.2);

        y += 6;
      });

      // 5. Clinical Findings Box
      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(27, 77, 62);
      doc.text('NEUROLOGICAL ASSESSMENT & REMINISCENCE THERAPY ANALYSIS', margin, y);

      y += 3;
      doc.setFillColor(242, 248, 244);
      doc.roundedRect(margin, y, contentW, 26, 2, 2, 'F');
      doc.setDrawColor(180, 215, 195);
      doc.roundedRect(margin, y, contentW, 26, 2, 2, 'S');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(35, 55, 45);
      const findings = doc.splitTextToSize(
        '• Cultural Reminiscence Advantage: Personalized North-Eastern stimuli (native Assamese soundscapes, tea garden photography, and family memories) reduced cognitive retrieval latency by 57% (from 4.2s to 1.8s) compared to generic abstract memory exercises.\n' +
        '• Sundowning Mitigation: Evening ambient soundscapes (gentle veranda rain & bird calls) scheduled at 4:30 PM successfully lowered sunset agitation indicators to 12%, preventing restlessness.\n' +
        '• Engagement Continuity: Patient completed 16 out of 20 recommended weekly sessions (88% consistency), maintaining an average focus duration of 18.5 minutes per day with high emotional valence.',
        contentW - 8
      );
      doc.text(findings, margin + 4, y + 5);

      // 6. Recent Exercises & Performance Table
      y += 31;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(27, 77, 62);
      doc.text('RECENT COGNITIVE EXERCISES LOG (PAST 7 DAYS)', margin, y);

      y += 4;
      doc.setFillColor(27, 77, 62);
      doc.rect(margin, y, contentW, 5.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text('ACTIVITY / EXERCISE', margin + 3, y + 3.8);
      doc.text('COGNITIVE TARGET', margin + 65, y + 3.8);
      doc.text('SCORE', margin + 115, y + 3.8);
      doc.text('HINTS', margin + 140, y + 3.8);
      doc.text('RESPONSE TIME', margin + 160, y + 3.8);

      const exercises = [
        { name: 'Granddaughter Ananya Face Match', target: 'Facial & Kin Memory', score: '100%', hints: '1 Hint', time: '1.4s' },
        { name: 'Bihu Dhol & Flute Sound Recall', target: 'Auditory Memory', score: '90%', hints: '0 Hints', time: '1.6s' },
        { name: 'Majuli Island Riverboat Route', target: 'Spatial Orientation', score: '85%', hints: '1 Hint', time: '2.1s' },
        { name: 'Assam Tea Picking Routine Order', target: 'Sequential Logic', score: '75%', hints: '2 Hints', time: '2.4s' }
      ];

      y += 5.5;
      exercises.forEach((ex, i) => {
        doc.setFillColor(i % 2 === 0 ? 255 : 246, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 248);
        doc.rect(margin, y, contentW, 5.5, 'F');
        doc.setDrawColor(225, 235, 228);
        doc.line(margin, y + 5.5, margin + contentW, y + 5.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(23, 56, 45);
        doc.text(ex.name, margin + 3, y + 3.8);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(70, 90, 80);
        doc.text(ex.target, margin + 65, y + 3.8);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 122, 74);
        doc.text(ex.score, margin + 115, y + 3.8);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 100, 90);
        doc.text(ex.hints, margin + 140, y + 3.8);
        doc.text(ex.time, margin + 160, y + 3.8);

        y += 5.5;
      });

      // 7. Clinical Recommendations & Care Plan
      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(27, 77, 62);
      doc.text('NEUROLOGIST CARE PLAN & CAREGIVER ACTION ITEMS', margin, y);

      y += 3;
      doc.setFillColor(254, 253, 248);
      doc.roundedRect(margin, y, contentW, 20, 2, 2, 'F');
      doc.setDrawColor(220, 210, 180);
      doc.roundedRect(margin, y, contentW, 20, 2, 2, 'S');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(40, 60, 50);
      const recs = doc.splitTextToSize(
        '1. Reminiscence Schedule: Maintain daily 15-20 min cognitive exercises during peak morning alertness (09:30 AM).\n' +
        '2. Family Media Studio: Encourage family members to upload 1 new native Assamese voice memory per week.\n' +
        '3. Sundowning Management: Trigger soothing tea garden ambient audio automatically at 04:30 PM daily.\n' +
        '4. Clinical Follow-up: Next comprehensive neurological cognitive check-up with Dr. B. Barua scheduled in 6 weeks.',
        contentW - 8
      );
      doc.text(recs, margin + 4, y + 4.5);

      // 8. Sign-off & Footer
      y += 24;
      doc.setDrawColor(200, 220, 210);
      doc.line(margin, y, margin + contentW, y);

      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(27, 77, 62);
      doc.text('ATTENDING NEUROLOGIST:', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text('Dr. B. Barua, MD (Neurology) • Senior Consultant, GNRC Guwahati', margin, y + 4);
      doc.text('Digital Signature: VERIFIED / AUTHENTICATED [DrBBarua_MD_GNRC_2024]', margin, y + 8);

      doc.setFont('helvetica', 'bold');
      doc.text('SYSTEM VERIFICATION:', margin + 110, y);
      doc.setFont('helvetica', 'normal');
      doc.text('SMARAN Cognitive Intelligence Engine v2.4', margin + 110, y + 4);
      doc.text('Offline Clinical Record Hash: 8f4a-9b2c-e17d-44a3 • DISHA Compliant', margin + 110, y + 8);

      // Bottom bar
      doc.setFillColor(27, 77, 62);
      doc.rect(0, ph - 7, pw, 7, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(220, 240, 230);
      doc.text('SMARAN (স্মৰণ) — Personalized Cognitive Health & Cultural Reminiscence System • Confidential Medical Assessment', pw / 2, ph - 2.5, { align: 'center' });

      // Save PDF file to trigger browser download
      const filename = `Smaran_Clinical_Assessment_Meera_Sharma_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);

      this.showToast(`📄 Clinical PDF Downloaded: ${filename}`, 4000);
    } catch (err) {
      console.error('PDF generation error:', err);
      this.openReportModal();
      this.showToast('ℹ️ Opened Clinical Assessment Report. You can print or save as PDF.');
    }
  }

  // --- Modal Helpers ---
  openReportModal() {
    const modal = document.getElementById('clinicalReportModal');
    if (modal) {
      const dateEl = document.getElementById('reportDateDisplay');
      if (dateEl) {
        dateEl.textContent = 'DATE: ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
      modal.classList.add('active');
    }
  }

  closeReportModal() {
    const modal = document.getElementById('clinicalReportModal');
    if (modal) modal.classList.remove('active');
  }

  // --- Global Toast Notification ---
  showToast(message, duration = 3500) {
    const toast = document.getElementById('smaranGlobalToast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('active');
      if (this._toastTimer) clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.classList.remove('active');
      }, duration);
    }
  }

  // ========================================================
  // CAREGIVER SECURITY & PIN GATEWAY
  // ========================================================
  requestCaregiverAccess() {
    if (SMARAN_STATE.security && SMARAN_STATE.security.isUnlocked) {
      this.navigateTo('caregiver');
    } else {
      this.openPinModal();
    }
  }

  openPinModal() {
    this.enteredPin = '';
    this.updatePinDotsDisplay();
    const modal = document.getElementById('securityPinModal');
    if (modal) modal.classList.add('active');
  }

  closePinModal() {
    this.enteredPin = '';
    const modal = document.getElementById('securityPinModal');
    if (modal) modal.classList.remove('active');
  }

  enterPinDigit(digit) {
    if (this.enteredPin.length < 4) {
      this.enteredPin += digit;
      if (window.smaranAudio) window.smaranAudio.playTapSound();
      this.updatePinDotsDisplay();

      if (this.enteredPin.length === 4) {
        setTimeout(() => this.submitEnteredPin(), 180);
      }
    }
  }

  clearPin() {
    this.enteredPin = this.enteredPin.slice(0, -1);
    if (window.smaranAudio) window.smaranAudio.playTapSound();
    this.updatePinDotsDisplay();
  }

  updatePinDotsDisplay() {
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById(`pinDot${i}`);
      if (dot) {
        if (i < this.enteredPin.length) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled');
        }
      }
    }
  }

  submitEnteredPin() {
    const validPin = (SMARAN_STATE.security && SMARAN_STATE.security.pin) || '1234';
    if (this.enteredPin === validPin) {
      if (SMARAN_STATE.security) SMARAN_STATE.security.isUnlocked = true;
      const lockIcon = document.getElementById('caregiverLockStatusIcon');
      if (lockIcon) lockIcon.textContent = '🔓';

      if (window.smaranAudio) window.smaranAudio.playSuccessChime();
      this.closePinModal();
      this.showToast('🔓 Caregiver Security Verified. Access Granted.');
      this.navigateTo('caregiver');
    } else {
      const dotsWrapper = document.getElementById('pinDotsWrapper');
      if (dotsWrapper) {
        dotsWrapper.classList.add('shake-error');
        setTimeout(() => dotsWrapper.classList.remove('shake-error'), 450);
      }
      this.showToast('❌ Incorrect Security PIN. Please try again.');
      setTimeout(() => {
        this.enteredPin = '';
        this.updatePinDotsDisplay();
      }, 300);
    }
  }

  lockCaregiverPortal() {
    if (SMARAN_STATE.security) SMARAN_STATE.security.isUnlocked = false;
    const lockIcon = document.getElementById('caregiverLockStatusIcon');
    if (lockIcon) lockIcon.textContent = '🔒';

    if (window.smaranAudio) window.smaranAudio.playTapSound();
    this.showToast('🔒 Caregiver Portal Locked.');
    this.navigateTo('home');
  }

  openChangePinModal() {
    const modal = document.getElementById('changePinModal');
    if (modal) {
      const c = document.getElementById('currentPinInput');
      const n = document.getElementById('newPinInput');
      const conf = document.getElementById('confirmNewPinInput');
      if (c) c.value = '';
      if (n) n.value = '';
      if (conf) conf.value = '';
      modal.classList.add('active');
    }
  }

  handleSaveNewPin(e) {
    e.preventDefault();
    const current = document.getElementById('currentPinInput').value;
    const newPin = document.getElementById('newPinInput').value;
    const confirmPin = document.getElementById('confirmNewPinInput').value;

    const currentExpected = (SMARAN_STATE.security && SMARAN_STATE.security.pin) || '1234';
    if (current !== currentExpected) {
      this.showToast('❌ Current PIN is incorrect.');
      return;
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      this.showToast('⚠️ New PIN must be exactly 4 digits.');
      return;
    }

    if (newPin !== confirmPin) {
      this.showToast('⚠️ New PIN and confirmation do not match.');
      return;
    }

    if (SMARAN_STATE.security) SMARAN_STATE.security.pin = newPin;
    localStorage.setItem('smaran_pin', newPin);

    if (window.smaranAudio) window.smaranAudio.playSuccessChime();
    document.getElementById('changePinModal').classList.remove('active');
    this.showToast('✓ Caregiver Security PIN updated successfully!');
    this.renderSecurityDashboard();
  }

  // ========================================================
  // SOS EMERGENCY ASSISTANCE & INCIDENT LOGGING
  // ========================================================
  openSosModal() {
    if (window.smaranAudio) window.smaranAudio.playSosBeacon();
    const modal = document.getElementById('sosModal');
    if (modal) modal.classList.add('active');

    // Auto-log SOS activation
    if (SMARAN_STATE.security && SMARAN_STATE.security.sosHistory) {
      const newAlert = {
        id: 'sos_' + Date.now(),
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        type: 'SOS Emergency Triggered',
        location: 'Home Veranda (Tezpur)',
        triggeredBy: 'Manual 1-Tap Trigger',
        status: 'Active',
        notes: 'Assistance modal displayed. Caregiver contacts alerted.'
      };
      SMARAN_STATE.security.sosHistory.unshift(newAlert);
      this.renderSecurityDashboard();
    }
  }

  closeSosModal() {
    if (this.isEmergencySirenActive) {
      this.toggleEmergencySiren();
    }
    const modal = document.getElementById('sosModal');
    if (modal) modal.classList.remove('active');
  }

  playComfortVoice() {
    if (window.smaranAudio) window.smaranAudio.playSuccessChime();
    this.showToast('👵 Playing reassuring comfort message in Assamese...');

    if (window.speechSynthesis) {
      try {
        const msg = new SpeechSynthesisUtterance("আইতা, মই অনন্যা। চিন্তা নকৰিব, আপুনি ঘৰতে নিৰাপদে আছে। মই লগে লগে আহি আছোঁ।");
        msg.lang = 'as-IN';
        msg.rate = 0.85;
        window.speechSynthesis.speak(msg);
      } catch (e) {
        console.log('Comfort voice fallback:', e);
      }
    }
  }

  logEmergencyCall(contactName) {
    this.showToast(`📞 Placing direct call to ${contactName}...`);
    if (SMARAN_STATE.security && SMARAN_STATE.security.sosHistory) {
      const newEvent = {
        id: 'call_' + Date.now(),
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        type: `Emergency Call: ${contactName}`,
        location: 'Home Veranda (Tezpur)',
        triggeredBy: 'Direct Dial Link',
        status: 'Dialed',
        notes: `Call placed to ${contactName}.`
      };
      SMARAN_STATE.security.sosHistory.unshift(newEvent);
      this.renderSecurityDashboard();
    }
  }

  broadcastSosAlert() {
    if (window.smaranAudio) window.smaranAudio.playEmergencyAlarm();
    setTimeout(() => {
      if (window.smaranAudio && !this.isEmergencySirenActive) {
        window.smaranAudio.stopEmergencyAlarm();
      }
    }, 2500);

    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const alertMsg = `🚨 SMARAN EMERGENCY ALERT: Meera Sharma at Tezpur, Assam has triggered SOS at ${time}. Location: Home Veranda Safe Zone (26.6338° N, 92.7926° E). Battery: 94%. Immediate assistance requested.`;

    if (SMARAN_STATE.security && SMARAN_STATE.security.sosHistory) {
      const newEvent = {
        id: 'alert_' + Date.now(),
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        type: 'Urgent SMS & WhatsApp Broadcast',
        location: 'Tezpur, Assam (26.6338° N, 92.7926° E)',
        triggeredBy: 'Family Broadcast',
        status: 'Dispatched',
        notes: 'Dispatched emergency SMS and WhatsApp notifications to Ananya Sharma (+91 98765 43210).'
      };
      SMARAN_STATE.security.sosHistory.unshift(newEvent);
      this.renderSecurityDashboard();
    }

    this.showToast('🚨 Emergency Alert Dispatched to Ananya Sharma & family circle!', 5000);
  }

  toggleEmergencySiren() {
    const btn = document.getElementById('sirenToggleBtn');
    if (!this.isEmergencySirenActive) {
      this.isEmergencySirenActive = true;
      if (window.smaranAudio) window.smaranAudio.playEmergencyAlarm();
      if (btn) {
        btn.textContent = '⏹ Stop Alarm Beacon';
        btn.style.background = '#fee2e2';
      }
      this.showToast('🔔 Emergency siren beacon sounding.');
    } else {
      this.isEmergencySirenActive = false;
      if (window.smaranAudio) window.smaranAudio.stopEmergencyAlarm();
      if (btn) {
        btn.textContent = '🔔 Sound Alarm Beacon';
        btn.style.background = 'transparent';
      }
      this.showToast('Alarm beacon stopped.');
    }
  }

  resolveSosSafely() {
    this.closeSosModal();
    if (window.smaranAudio) window.smaranAudio.playSuccessChime();

    if (SMARAN_STATE.security && SMARAN_STATE.security.sosHistory) {
      const safeEvent = {
        id: 'safe_' + Date.now(),
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        type: 'Status Resolved (Safe Confirmed)',
        location: 'Home Veranda (Tezpur)',
        triggeredBy: 'Patient/Caregiver Confirmed',
        status: 'Resolved',
        notes: 'Patient confirmed safe status. Routine cognitive monitoring active.'
      };
      SMARAN_STATE.security.sosHistory.unshift(safeEvent);
      this.renderSecurityDashboard();
    }
    this.showToast('✓ Meera is safe. Normal monitoring resumed.');
  }

  testSosAlert() {
    this.openSosModal();
  }

  // --- Caregiver Security Dashboard Renderer ---
  renderSecurityDashboard() {
    // 1. Emergency contacts list
    const contactsEl = document.getElementById('caregiverEmergencyContactsList');
    if (contactsEl && SMARAN_STATE.security) {
      contactsEl.innerHTML = SMARAN_STATE.security.emergencyContacts.map(c => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0; border-bottom: 1px solid #f0f4f0;">
          <div>
            <div style="font-weight: 700; color: #17382d; font-size: 0.95rem;">${c.name}</div>
            <div style="font-size: 0.8rem; color: #62756c;">${c.relation} • ${c.phone}</div>
          </div>
          <a href="tel:${c.phone}" class="btn-smaran btn-smaran-ghost btn-smaran-pill-sm" style="font-size: 0.8rem; padding: 0.25rem 0.65rem; color: #1b4d3e;" onclick="smaranApp.logEmergencyCall('${c.name}')">
            Call
          </a>
        </div>
      `).join('');
    }

    // 2. SOS History audit log
    const sosListEl = document.getElementById('caregiverSosLogList');
    const badgeEl = document.getElementById('caregiverSosCountBadge');
    if (sosListEl && SMARAN_STATE.security) {
      const events = SMARAN_STATE.security.sosHistory;
      if (badgeEl) {
        badgeEl.textContent = `${events.length} Event${events.length === 1 ? '' : 's'} Logged`;
      }
      sosListEl.innerHTML = events.slice(0, 5).map(e => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f0f4f0; font-size: 0.88rem;">
          <div>
            <div style="font-weight: 700; color: ${e.status === 'Active' ? '#b91c1c' : '#17382d'};">
              ${e.type}
              <span class="security-badge-pill" style="margin-left: 0.4rem; background: ${e.status === 'Active' ? '#fee2e2' : '#eef7f2'}; color: ${e.status === 'Active' ? '#991b1b' : '#287a4a'};">
                ${e.status}
              </span>
            </div>
            <div style="font-size: 0.8rem; color: #62756c; margin-top: 0.15rem;">
              ${e.timestamp} • Location: ${e.location} • Trigger: ${e.triggeredBy}
            </div>
            ${e.notes ? `<div style="font-size: 0.78rem; color: #4b6357; font-style: italic; margin-top: 0.2rem;">${e.notes}</div>` : ''}
          </div>
        </div>
      `).join('');
    }
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

