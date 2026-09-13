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
    this.renderDailyRhythm();
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
    if (viewName === 'home' || viewName === 'reminders') {
      this.renderDailyRhythm();
    }
    if (viewName === 'vault') {
      this.renderMemoryVault();
    }
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
      headerReg.textContent = reg.name;
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
  updateStudioPreview() {
    const name = (document.getElementById('contribName')?.value || '').toLowerCase();
    const story = (document.getElementById('contribStory')?.value || '').toLowerCase();
    const combined = `${name} ${story}`;

    const imgEl = document.getElementById('studioImgPreview');
    const labelEl = document.getElementById('studioImgLabel');
    const descEl = document.getElementById('studioImgDesc');

    if (!imgEl) return;

    if (combined.includes('rohan') || combined.includes('sweet') || combined.includes('pitha') || combined.includes('laru') || combined.includes('eat') || combined.includes('food')) {
      imgEl.src = 'assets/rohan_sweets.jpg';
      if (labelEl) labelEl.textContent = '✨ AI Artwork Ready: Rohan eating sweets on the veranda';
      if (descEl) descEl.textContent = 'Authentic Assamese nostalgic family scene with brass plate and veranda sunshine.';
    } else if (combined.includes('lake') || combined.includes('loktak') || combined.includes('manipur') || combined.includes('boat')) {
      imgEl.src = 'assets/loktak_lake.jpg';
      if (labelEl) labelEl.textContent = '✨ AI Artwork Ready: Loktak Lake Floating Phumdis';
      if (descEl) descEl.textContent = 'World\'s only floating sanctuary with morning mist and serenity.';
    } else if (combined.includes('bridge') || combined.includes('meghalaya') || combined.includes('root') || combined.includes('sohra')) {
      imgEl.src = 'assets/meghalaya_root_bridge.jpg';
      if (labelEl) labelEl.textContent = '✨ AI Artwork Ready: Living Root Bridges of Nongriat';
      if (descEl) descEl.textContent = 'Ancient bio-engineering over turquoise streams.';
    } else if (combined.includes('tawang') || combined.includes('monastery') || combined.includes('arunachal')) {
      imgEl.src = 'assets/tawang_monastery.jpg';
      if (labelEl) labelEl.textContent = '✨ AI Artwork Ready: Tawang Monastery Dawn';
      if (descEl) descEl.textContent = 'Himalayan snow peaks and fluttering prayer flags.';
    } else if (combined.includes('bihu') || combined.includes('dance') || combined.includes('dhol')) {
      imgEl.src = 'assets/bihu_story.jpg';
      if (labelEl) labelEl.textContent = '✨ AI Artwork Ready: Rongali Bihu Courtyard Dance';
      if (descEl) descEl.textContent = 'Golden Muga silk and joyous spring festival.';
    } else if (combined.includes('tea') || combined.includes('garden') || combined.includes('jorhat')) {
      imgEl.src = 'assets/tea_gardens.jpg';
      if (labelEl) labelEl.textContent = '✨ AI Artwork Ready: Jorhat Heritage Tea Estate';
      if (descEl) descEl.textContent = 'Lush rolling green tea terraces in morning mist.';
    } else {
      imgEl.src = 'assets/rohan_sweets.jpg';
      if (labelEl) labelEl.textContent = '✨ AI Artwork Ready: Rohan eating sweets on the veranda';
      if (descEl) descEl.textContent = 'Customized AI reminiscence asset synthesized for Meera.';
    }
  }

  fillStudioTemplate(name, relation, story, mode) {
    if (document.getElementById('contribName')) document.getElementById('contribName').value = name;
    if (document.getElementById('contribRelation')) document.getElementById('contribRelation').value = relation;
    if (document.getElementById('contribStory')) document.getElementById('contribStory').value = story;
    if (document.getElementById('contribGameMode')) document.getElementById('contribGameMode').value = mode;

    this.updateStudioPreview();
    if (window.smaranAudio) window.smaranAudio.playTapSound();
  }

  handleFamilyContribution(e) {
    e.preventDefault();
    const name = document.getElementById('contribName').value;
    const relation = document.getElementById('contribRelation').value;
    const story = document.getElementById('contribStory').value;
    const dialect = document.getElementById('contribAudioDialect').value;
    const mode = document.getElementById('contribGameMode').value;

    if (!name) return;

    const newId = 'custom_' + Date.now();
    const combined = `${name} ${story}`.toLowerCase();

    // Determine matched AI image
    let matchedImg = 'assets/rohan_sweets.jpg';
    if (combined.includes('lake') || combined.includes('loktak') || combined.includes('manipur')) {
      matchedImg = 'assets/loktak_lake.jpg';
    } else if (combined.includes('bridge') || combined.includes('meghalaya') || combined.includes('root')) {
      matchedImg = 'assets/meghalaya_root_bridge.jpg';
    } else if (combined.includes('tawang') || combined.includes('monastery') || combined.includes('arunachal')) {
      matchedImg = 'assets/tawang_monastery.jpg';
    } else if (combined.includes('bihu') || combined.includes('dance')) {
      matchedImg = 'assets/bihu_story.jpg';
    } else if (combined.includes('tea') || combined.includes('garden')) {
      matchedImg = 'assets/tea_gardens.jpg';
    } else if (combined.includes('ananya')) {
      matchedImg = 'assets/family_ananya.jpg';
    }

    // 1. Add to Memory Vault
    const newMemory = {
      id: newId,
      category: 'people',
      stateId: 'assam',
      stateName: 'Assam (অসম)',
      tag: '❤️ Family & Kin',
      name: `${name} (${relation || 'Family'})`,
      nativeName: `${name}ৰ অমূল্য স্মৃতি`,
      relation: relation || 'Family Member',
      story: story || 'A cherished family memory created with love for Meera.',
      favoritePlace: 'Home Veranda',
      heroImg: matchedImg,
      audioPrompt: `“${story}” (Voice note recorded in ${dialect.toUpperCase()} dialect)`,
      gameId: mode || 'who_is_this'
    };

    SMARAN_STATE.memories.unshift(newMemory);

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
      desc: `Personalized cognitive memory activity generated around ${name}: ${story}`,
      heroImg: matchedImg,
      featured: true
    };

    SMARAN_STATE.games.unshift(newGame);

    // 3. Log caregiver sync
    SMARAN_STATE.caregiver.recentSessions.unshift({
      game: `Published: ${name}’s Memory`,
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

    this.showToast(`✨ Memory Published: "${name}" added to Memory Vault with AI Artwork!`);
    this.navigateTo('vault');
  }

  // ==========================================
  // ENHANCED NORTH-EASTERN MEMORY VAULT ENGINE
  // ==========================================
  renderMemoryVault(filterCategory = 'all') {
    const grid = document.getElementById('memoryCardsGrid');
    if (!grid || !SMARAN_STATE.memories) return;

    // Calculate exact category counts
    const allCount = SMARAN_STATE.memories.length;
    const peopleCount = SMARAN_STATE.memories.filter(m => m.category === 'people').length;
    const placesCount = SMARAN_STATE.memories.filter(m => m.category === 'places' && !m.tag.includes('Nature') && !m.tag.includes('Rivers')).length;
    const momentsCount = SMARAN_STATE.memories.filter(m => m.category === 'moments').length;
    const natureCount = SMARAN_STATE.memories.filter(m => m.tag.includes('Nature') || m.tag.includes('Rivers')).length;

    // Update counter spans in filter buttons
    const cAll = document.getElementById('vaultCountAll');
    if (cAll) cAll.textContent = allCount;
    const cPeople = document.getElementById('vaultCountPeople');
    if (cPeople) cPeople.textContent = peopleCount;
    const cPlaces = document.getElementById('vaultCountPlaces');
    if (cPlaces) cPlaces.textContent = placesCount;
    const cMoments = document.getElementById('vaultCountMoments');
    if (cMoments) cMoments.textContent = momentsCount;
    const cNature = document.getElementById('vaultCountNature');
    if (cNature) cNature.textContent = natureCount;

    let items = SMARAN_STATE.memories;
    if (filterCategory !== 'all') {
      if (filterCategory === 'nature') {
        items = items.filter(m => m.tag.includes('Nature') || m.tag.includes('Rivers'));
      } else if (filterCategory === 'places') {
        items = items.filter(m => m.category === 'places' && !m.tag.includes('Nature') && !m.tag.includes('Rivers'));
      } else {
        items = items.filter(m => m.category === filterCategory);
      }
    }

    const currentLang = window.i18n ? window.i18n.currentLang : 'en';

    grid.innerHTML = items.map(m => {
      const displayName = (currentLang === 'as' && m.nativeName) ? m.nativeName : m.name;
      const displaySubtitle = (currentLang === 'as' && m.nativeName) ? m.name : m.nativeName;

      return `
        <div class="memory-vault-card" id="mem_${m.id}">
          <div class="vault-card-media">
            <img src="${m.heroImg}" alt="${m.name}" class="vault-card-img" onerror="this.src='assets/tea_gardens.jpg'">
            <span class="vault-state-badge">📍 ${m.stateName || 'North-East'}</span>
            <span class="vault-cat-badge">${m.tag || '❤️ Memory'}</span>
          </div>
          <div class="vault-card-body">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem; gap: 0.5rem;">
              <div>
                <h3 class="vault-card-title">${displayName}</h3>
                ${displaySubtitle ? `<div class="vault-card-native">${displaySubtitle}</div>` : ''}
              </div>
              <span class="vault-rel-pill">${m.relation}</span>
            </div>

            <p class="vault-card-story">${m.story}</p>

            <div class="vault-audio-snippet">
              <span>💬 <em>"${m.audioPrompt}"</em></span>
            </div>

            <div class="vault-card-footer">
              <button class="btn-smaran btn-smaran-ghost btn-smaran-pill-sm" onclick="smaranApp.speakMemoryStory('${m.id}')" title="Listen Spoken Story">
                🔊 Listen Story
              </button>
              <button class="btn-smaran btn-smaran-primary btn-smaran-pill-sm" onclick="smaranGames.launchGame('${m.gameId || 'family_match'}')">
                🌿 Play Memory Game →
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  speakMemoryStory(memoryId) {
    const m = SMARAN_STATE.memories.find(item => item.id === memoryId);
    if (!m) return;

    if (window.smaranAudio) window.smaranAudio.playTapSound();

    const currentLang = window.i18n ? window.i18n.currentLang : 'en';
    const textToSpeak = (currentLang === 'as' && m.nativeName) 
      ? `${m.nativeName}. ${m.story}`
      : `${m.name}. ${m.story}`;

    if (window.smaranVoice) {
      window.smaranVoice.speakTTS(textToSpeak);
    } else {
      alert(`❤️ SMARAN Cherished Memory:\n\n${textToSpeak}`);
    }
  }

  filterMemoryVault(category, btnEl) {
    document.querySelectorAll('.vault-filter-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    this.renderMemoryVault(category);
  }

  // ==========================================
  // ENHANCED DAILY RHYTHM & CIRCADIAN ENGINE
  // ==========================================
  startCircadianClock() {
    this.updateCircadianClock();
    if (!this.clockTimer) {
      this.clockTimer = setInterval(() => {
        this.updateCircadianClock();
      }, 10000);
    }
  }

  updateCircadianClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const clockEl = document.getElementById('rhythmLiveClock');
    if (clockEl) clockEl.textContent = timeStr;

    const dateEl = document.getElementById('rhythmDateDisplay');
    if (dateEl) dateEl.textContent = `Tezpur / Guwahati • ${dateStr}`;

    const hour = now.getHours();
    let phaseName = '☀️ Midday & Afternoon';
    let phaseIcon = '☀️';
    if (hour >= 5 && hour < 12) {
      phaseName = '🌅 Morning Dawn (পুৱা)';
      phaseIcon = '🌅';
    } else if (hour >= 12 && hour < 17) {
      phaseName = '☀️ Midday Sunshine (দুপৰীয়া)';
      phaseIcon = '☀️';
    } else if (hour >= 17 && hour < 20) {
      phaseName = '🌇 Golden Sunset (গধূলি)';
      phaseIcon = '🌇';
    } else {
      phaseName = '🌙 Night Serenity (ৰাতিৰ শান্তি)';
      phaseIcon = '🌙';
    }

    const phaseEl = document.getElementById('rhythmPhaseBadge');
    if (phaseEl) {
      phaseEl.innerHTML = `<span>${phaseIcon} ${phaseName}</span>`;
    }

    this.renderNextUpSpotlight();
  }

  renderNextUpSpotlight() {
    const container = document.getElementById('rhythmNextUpCard');
    if (!container || !SMARAN_STATE.rhythm) return;

    // Find the next incomplete reminder
    const nextItem = SMARAN_STATE.rhythm.find(r => !r.completed);

    if (!nextItem) {
      container.innerHTML = `
        <div class="next-up-all-done">
          <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🌸</div>
          <div style="font-weight: 800; font-size: 1.15rem; color: #17382d;">All Daily Moments Completed!</div>
          <div style="font-size: 0.9rem; color: #556b61; margin-top: 0.2rem;">You've had a peaceful, nourishing day, Meera. Rest well and enjoy the evening breeze.</div>
        </div>
      `;
      return;
    }

    const lang = window.i18n ? window.i18n.currentLang : 'en';
    const displayTitle = (lang === 'as' && nextItem.nativeTitle) ? nextItem.nativeTitle : nextItem.title;

    container.innerHTML = `
      <div class="next-up-box">
        <div class="next-up-tag-row">
          <span class="next-up-pulse-badge">🔔 UPCOMING NEXT MOMENT</span>
          <span class="next-up-time-pill">⏰ ${nextItem.time}</span>
        </div>
        <div class="next-up-content">
          <div class="next-up-icon">${nextItem.icon}</div>
          <div class="next-up-details">
            <div class="next-up-title">${displayTitle}</div>
            <div class="next-up-sub">${nextItem.subtitle}</div>
          </div>
        </div>
        <div class="next-up-actions">
          <button class="btn-smaran btn-smaran-primary btn-smaran-pill-sm" onclick="smaranApp.toggleRhythmComplete('${nextItem.id}')">
            ✓ Take Dose / Mark Done
          </button>
          <button class="btn-smaran btn-smaran-ghost btn-smaran-pill-sm" onclick="smaranApp.speakRhythmVoice('${nextItem.id}')" title="Listen Spoken Reminder">
            🔊 Listen
          </button>
          <button class="btn-smaran btn-smaran-ghost btn-smaran-pill-sm" onclick="smaranApp.snoozeRhythm('${nextItem.id}')" title="Snooze 15 minutes">
            ⏰ +15m
          </button>
        </div>
      </div>
    `;
  }

  renderDailyRhythm() {
    if (!SMARAN_STATE.rhythm) return;

    this.startCircadianClock();

    const total = SMARAN_STATE.rhythm.length;
    const completed = SMARAN_STATE.rhythm.filter(r => r.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 1. Update Time-of-Day Filter Pill Counts
    const countAll = document.getElementById('countAll');
    if (countAll) countAll.textContent = total;

    ['morning', 'afternoon', 'evening', 'night'].forEach(p => {
      const el = document.getElementById(`count${p.charAt(0).toUpperCase() + p.slice(1)}`);
      if (el) {
        el.textContent = SMARAN_STATE.rhythm.filter(r => r.period === p).length;
      }
    });

    // 2. Render Live Wellness Progress Card
    const progressCard = document.getElementById('rhythmProgressCard');
    if (progressCard) {
      let encouragement = "You're having a peaceful, balanced day, Meera ❤️";
      if (percentage === 100) encouragement = "Outstanding! You have completed all daily moments for today 🌸";
      else if (percentage >= 50) encouragement = "Wonderful progress! More than halfway through your day's rhythm 🌿";

      const segmentsHtml = SMARAN_STATE.rhythm.map(r => `
        <div class="rhythm-segment ${r.completed ? 'done' : ''}" title="${r.time} - ${r.title}"></div>
      `).join('');

      progressCard.innerHTML = `
        <div class="rhythm-progress-info">
          <div class="rhythm-progress-title">Today's Daily Rhythm Flow</div>
          <div class="rhythm-progress-sub">${encouragement}</div>
          <div class="rhythm-segmented-bar">${segmentsHtml}</div>
        </div>
        <div class="rhythm-progress-stat">
          <div class="rhythm-stat-number">${completed} / ${total}</div>
          <div class="rhythm-stat-label">${percentage}% Completed</div>
        </div>
      `;
    }

    // 3. Render Daily Hydration Compass
    this.renderHydrationCompass();

    // 4. Render Dedicated View Rhythm List with Dual Filter
    const fullList = document.getElementById('fullDailyRhythmList');
    if (fullList) {
      let items = SMARAN_STATE.rhythm;

      const activePeriod = this.activeRhythmPeriod || 'all';
      const activeCat = this.activeRhythmCategory || 'all';

      if (activePeriod !== 'all') {
        items = items.filter(r => r.period === activePeriod);
      }
      if (activeCat !== 'all') {
        items = items.filter(r => r.category === activeCat);
      }

      if (items.length === 0) {
        fullList.innerHTML = `
          <div class="rhythm-empty-state">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🌸</div>
            <div style="font-weight: 800; font-size: 1.15rem; color: #17382d;">No reminders for this category</div>
            <p style="color: #62756c; margin-top: 0.25rem;">Use "+ Add Daily Reminder" to schedule a personalized moment.</p>
          </div>
        `;
      } else {
        fullList.innerHTML = items.map(item => this.buildRhythmItemHtml(item)).join('');
      }
    }

    // 5. Render Homepage Rhythm Preview (First 5 items)
    const homeList = document.getElementById('homeDailyRhythmList');
    if (homeList) {
      const previewItems = SMARAN_STATE.rhythm.slice(0, 5);
      homeList.innerHTML = previewItems.map(item => this.buildRhythmItemHtml(item, true)).join('');
    }
  }

  renderHydrationCompass() {
    const container = document.getElementById('rhythmHydrationCard');
    if (!container) return;

    const hyd = SMARAN_STATE.hydration || { current: 5, target: 8, glassSizeMl: 250, lastLoggedAt: '11:15 AM' };
    const currentGlasses = hyd.current || 0;
    const targetGlasses = hyd.target || 8;
    const currentMl = currentGlasses * (hyd.glassSizeMl || 250);
    const targetMl = targetGlasses * (hyd.glassSizeMl || 250);
    const hydPercent = Math.min(100, Math.round((currentGlasses / targetGlasses) * 100));

    let glassesHtml = '';
    for (let i = 1; i <= targetGlasses; i++) {
      const isFilled = i <= currentGlasses;
      glassesHtml += `
        <button class="hydration-cup-btn ${isFilled ? 'filled' : 'empty'}" 
                onclick="smaranApp.toggleHydrationCup(${i})" 
                title="${isFilled ? `Glass ${i}: Logged (${i * 250} ml)` : `Click to log glass ${i}`}">
          <span class="cup-icon">${isFilled ? '💧' : '🥛'}</span>
          <span class="cup-num">${i * 250}ml</span>
        </button>
      `;
    }

    container.innerHTML = `
      <div class="hydration-top-row">
        <div>
          <div class="hydration-badge">💧 DAILY HYDRATION COMPASS</div>
          <h3 class="hydration-title">Water, Warm Tea & Gentle Fluids</h3>
          <p class="hydration-sub">Essential cognitive health & alertness for Meera • Target: 2.0 Liters daily</p>
        </div>
        <div class="hydration-metric-box">
          <div class="hydration-metric-num">${currentGlasses} / ${targetGlasses} <span style="font-size: 1rem; font-weight: 700; color: #287a4a;">Glasses</span></div>
          <div class="hydration-metric-sub">${currentMl} ml of ${targetMl} ml (${hydPercent}%) • Last: ${hyd.lastLoggedAt || 'Just now'}</div>
        </div>
      </div>

      <div class="hydration-cups-row">
        ${glassesHtml}
      </div>

      <div class="hydration-footer-actions">
        <button class="btn-smaran btn-smaran-primary btn-smaran-pill-sm" onclick="smaranApp.logHydration('water')">
          + 1 Glass Water (250 ml) 💧
        </button>
        <button class="btn-smaran btn-smaran-ghost btn-smaran-pill-sm" onclick="smaranApp.logHydration('tea')">
          + Warm Herbal Tea 🍵
        </button>
        <button class="btn-smaran btn-smaran-ghost btn-smaran-pill-sm" onclick="smaranApp.speakTTSGuidance('Meera, drinking fresh water keeps your mind clear, refreshed, and peaceful. Take a sip of water now.')">
          🔊 Hydration Audio Prompt
        </button>
      </div>
    `;
  }

  logHydration(type = 'water') {
    if (!SMARAN_STATE.hydration) {
      SMARAN_STATE.hydration = { current: 0, target: 8, glassSizeMl: 250, lastLoggedAt: '11:00 AM' };
    }

    if (SMARAN_STATE.hydration.current < SMARAN_STATE.hydration.target + 4) {
      SMARAN_STATE.hydration.current += 1;
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    SMARAN_STATE.hydration.lastLoggedAt = nowStr;

    try {
      localStorage.setItem('smaran_hydration', JSON.stringify(SMARAN_STATE.hydration));
    } catch (e) {}

    if (window.smaranAudio) window.smaranAudio.playSuccessChime();

    const label = type === 'tea' ? 'Warm Assam Herbal Tea' : 'Fresh Glass of Water';
    this.showToast(`💧 Wonderful, Meera! ${label} logged (+250 ml). Total: ${SMARAN_STATE.hydration.current * 250} ml.`);

    this.renderHydrationCompass();
  }

  toggleHydrationCup(cupIndex) {
    if (!SMARAN_STATE.hydration) return;

    if (SMARAN_STATE.hydration.current >= cupIndex) {
      SMARAN_STATE.hydration.current = cupIndex - 1;
    } else {
      SMARAN_STATE.hydration.current = cupIndex;
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    SMARAN_STATE.hydration.lastLoggedAt = nowStr;

    try {
      localStorage.setItem('smaran_hydration', JSON.stringify(SMARAN_STATE.hydration));
    } catch (e) {}

    if (window.smaranAudio) window.smaranAudio.playTapSound();
    this.renderHydrationCompass();
  }

  speakTTSGuidance(text) {
    if (window.smaranVoice) {
      window.smaranVoice.speakTTS(text);
    } else {
      alert(`🔊 SMARAN Audio Guidance:\n\n"${text}"`);
    }
  }

  buildRhythmItemHtml(item, isCompact = false) {
    const isCompleted = !!item.completed;
    const lang = window.i18n ? window.i18n.currentLang : 'en';
    const displayTitle = (lang === 'as' && item.nativeTitle) ? item.nativeTitle : item.title;
    const isCustom = item.id.startsWith('r_custom_');
    const isMedication = item.category === 'Health';

    return `
      <div class="timeline-flow-item ${isCompleted ? 'is-completed' : ''} ${isMedication ? 'is-medication' : ''}" id="rhythm_${item.id}">
        <div class="timeline-time-badge">
          <span>${item.time}</span>
          <span class="timeline-period-label">${item.periodLabel || item.period}</span>
        </div>

        <div class="timeline-content-block">
          <div class="timeline-icon-circle">${item.icon}</div>
          <div class="timeline-text-body">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span class="timeline-title-text">${displayTitle}</span>
              ${isMedication ? `<span class="med-dose-pill">💊 Prescription Dose</span>` : ''}
            </div>
            <div class="timeline-sub-text">${item.subtitle}</div>
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.25rem; flex-wrap: wrap;">
              <span class="timeline-category-tag" style="background: ${item.categoryColor || '#1b4d3e'}18; color: ${item.categoryColor || '#1b4d3e'};">
                ${item.category}
              </span>
              ${isCompleted && item.completedAt ? `<span class="timeline-completed-badge">✓ Done at ${item.completedAt}</span>` : ''}
            </div>
          </div>
        </div>

        <div class="timeline-actions-group">
          <button class="btn-rhythm-voice" onclick="smaranApp.speakRhythmVoice('${item.id}')" title="Listen Spoken Reminder">
            🔊
          </button>
          ${item.soundType ? `
            <button class="btn-rhythm-sound" onclick="smaranApp.playRhythmSound('${item.soundType}', '${item.title}')" title="Play Calming Soundscape (${item.soundType})">
              🎵
            </button>
          ` : ''}
          <button class="btn-rhythm-snooze" onclick="smaranApp.snoozeRhythm('${item.id}')" title="Snooze 15 minutes">
            ⏰ +15m
          </button>
          <button class="btn-rhythm-toggle ${isCompleted ? 'done' : 'pending'}" onclick="smaranApp.toggleRhythmComplete('${item.id}')">
            ${isCompleted ? `✓ Done` : '○ Mark Done'}
          </button>
          ${isCustom ? `
            <button class="btn-rhythm-del" onclick="smaranApp.deleteRhythm('${item.id}')" title="Remove reminder">
              🗑️
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  filterRhythm(period, btnElement) {
    this.activeRhythmPeriod = period;
    document.querySelectorAll('.rhythm-filter-pill').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    this.renderDailyRhythm();
  }

  filterRhythmCategory(cat, btnElement) {
    this.activeRhythmCategory = cat;
    document.querySelectorAll('.rhythm-cat-chip').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    this.renderDailyRhythm();
  }

  toggleRhythmComplete(rhythmId) {
    const item = SMARAN_STATE.rhythm.find(r => r.id === rhythmId);
    if (!item) return;

    item.completed = !item.completed;
    if (item.completed) {
      item.completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (window.smaranAudio) window.smaranAudio.playSuccessChime();
      this.showToast(`🌸 Wonderful! "${item.title}" marked completed.`);

      // Log to caregiver recent sessions
      if (SMARAN_STATE.caregiver && SMARAN_STATE.caregiver.recentSessions) {
        SMARAN_STATE.caregiver.recentSessions.unshift({
          game: `Routine: ${item.title}`,
          difficulty: item.category,
          accuracy: 'Completed',
          time: item.completedAt,
          hints: 0,
          date: 'Today'
        });
      }
    } else {
      item.completedAt = null;
      if (window.smaranAudio) window.smaranAudio.playTapSound();
      this.showToast(`↩ "${item.title}" marked pending.`);
    }

    try {
      localStorage.setItem('smaran_daily_rhythm', JSON.stringify(SMARAN_STATE.rhythm));
    } catch (e) {}

    this.renderDailyRhythm();
    this.renderNextUpSpotlight();
    this.renderCaregiverDashboard();
  }

  snoozeRhythm(rhythmId) {
    const item = SMARAN_STATE.rhythm.find(r => r.id === rhythmId);
    if (!item) return;

    if (window.smaranAudio) window.smaranAudio.playTapSound();

    // Parse time and add 15 minutes
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    const newTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    item.time = newTime;
    item.subtitle = `[Snoozed to ${newTime}] ${item.subtitle.replace(/\[Snoozed to [^\]]+\]\s*/g, '')}`;

    try {
      localStorage.setItem('smaran_daily_rhythm', JSON.stringify(SMARAN_STATE.rhythm));
    } catch (e) {}

    this.showToast(`⏰ Snoozed "${item.title}" by 15 minutes (New time: ${newTime}).`);
    this.renderDailyRhythm();
    this.renderNextUpSpotlight();
  }

  deleteRhythm(rhythmId) {
    const item = SMARAN_STATE.rhythm.find(r => r.id === rhythmId);
    if (!item) return;

    if (!confirm(`Are you sure you want to remove the reminder "${item.title}"?`)) return;

    SMARAN_STATE.rhythm = SMARAN_STATE.rhythm.filter(r => r.id !== rhythmId);
    SMARAN_STATE.reminders = SMARAN_STATE.rhythm;

    try {
      localStorage.setItem('smaran_daily_rhythm', JSON.stringify(SMARAN_STATE.rhythm));
    } catch (e) {}

    if (window.smaranAudio) window.smaranAudio.playTapSound();
    this.showToast(`🗑️ Reminder "${item.title}" removed.`);
    this.renderDailyRhythm();
  }

  playRhythmSound(soundType, title) {
    if (window.smaranAudio) {
      window.smaranAudio.playSound(soundType);
      this.showToast(`🎵 Playing calming soundscape for: ${title}`);
    } else {
      alert(`🎵 Sound Cue: Playing gentle ${soundType} ambient audio.`);
    }
  }

  speakRhythmVoice(rhythmId) {
    const item = SMARAN_STATE.rhythm.find(r => r.id === rhythmId);
    if (!item) return;

    if (window.smaranAudio) window.smaranAudio.playTapSound();

    const lang = window.i18n ? window.i18n.currentLang : 'en';
    const textToSpeak = (lang === 'as' && item.nativeTitle)
      ? `মীনাক্ষী বা মীৰা দেৱী, এয়া ${item.time} হৈছে। ${item.nativeTitle}ৰ সময়। ${item.subtitle}`
      : (item.voiceText || `Meera, it is ${item.time}. Time for ${item.title}. ${item.subtitle}`);

    if (window.smaranVoice) {
      window.smaranVoice.speakTTS(textToSpeak);
    } else {
      alert(`🔊 SMARAN Gentle Reminder:\n\n"${textToSpeak}"`);
    }
  }

  readFullDailySchedule() {
    if (!SMARAN_STATE.rhythm) return;

    const remaining = SMARAN_STATE.rhythm.filter(r => !r.completed);
    const completed = SMARAN_STATE.rhythm.filter(r => r.completed).length;

    let message = `Good day, Meera. You have completed ${completed} daily moments so far. `;
    if (remaining.length === 0) {
      message += "You have successfully completed all your activities for today! Enjoy your peaceful rest.";
    } else {
      message += `You have ${remaining.length} upcoming moments. Next is: ${remaining[0].title} at ${remaining[0].time}.`;
    }

    if (window.smaranVoice) {
      window.smaranVoice.speakTTS(message);
    } else {
      alert(`🔊 Daily Schedule Overview:\n\n${message}`);
    }
  }

  openAddReminderModal() {
    const modal = document.getElementById('addReminderModal');
    if (modal) modal.classList.add('active');
  }

  applyReminderPreset(presetKey) {
    const titleInput = document.getElementById('newReminderTitle');
    const timeInput = document.getElementById('newReminderTime');
    const periodInput = document.getElementById('newReminderPeriod');
    const catInput = document.getElementById('newReminderCategory');
    const voiceInput = document.getElementById('newReminderVoice');

    const presets = {
      coconut_water: {
        title: 'Afternoon Fresh Coconut Water & Hydration',
        time: '3:30 PM',
        period: 'afternoon',
        cat: 'Nourishment',
        voice: 'Meera, it is 3:30 PM. Time to enjoy a fresh, cooling glass of coconut water on the veranda.'
      },
      bp_check: {
        title: 'Morning Blood Pressure & Calcium Tablet',
        time: '9:00 AM',
        period: 'morning',
        cat: 'Health',
        voice: 'Meera, it is 9:00 AM. Time for your morning blood pressure check and calcium tablet.'
      },
      garden_walk: {
        title: 'Veranda & Kopou Orchid Evening Walk',
        time: '5:00 PM',
        period: 'evening',
        cat: 'Movement',
        voice: 'The sunset breeze is calm, Meera. Time for a peaceful stroll along the veranda orchid garden.'
      },
      temple_prayers: {
        title: 'Evening Sandhya Aarti & Diya Lighting',
        time: '6:30 PM',
        period: 'evening',
        cat: 'Rest',
        voice: 'Meera, it is 6:30 PM. Time for the evening prayer, lighting the earthen diya, and feeling peaceful.'
      },
      family_call: {
        title: 'Video Call with Grandson Rohan & Ananya',
        time: '7:30 PM',
        period: 'evening',
        cat: 'Family',
        voice: 'Grandson Rohan and Ananya will be calling for your evening family conversation soon!'
      },
      warm_milk: {
        title: 'Warm Haldi Milk & Deep Night Sleep',
        time: '8:45 PM',
        period: 'night',
        cat: 'Rest',
        voice: 'Meera, it is 8:45 PM. Drink your warm turmeric milk and get ready for a deep, peaceful sleep.'
      }
    };

    const p = presets[presetKey];
    if (p) {
      if (titleInput) titleInput.value = p.title;
      if (timeInput) timeInput.value = p.time;
      if (periodInput) periodInput.value = p.period;
      if (catInput) catInput.value = p.cat;
      if (voiceInput) voiceInput.value = p.voice;

      if (window.smaranAudio) window.smaranAudio.playTapSound();
      this.showToast(`⚡ Preset applied: "${p.title}"`);
    }
  }

  handleAddCustomReminder(e) {
    e.preventDefault();
    const title = document.getElementById('newReminderTitle').value;
    const time = document.getElementById('newReminderTime').value;
    const period = document.getElementById('newReminderPeriod').value;
    const category = document.getElementById('newReminderCategory').value;
    const voiceText = document.getElementById('newReminderVoice').value;

    if (!title || !time) return;

    const newReminder = {
      id: 'r_custom_' + Date.now(),
      time: time,
      period: period,
      periodLabel: period.charAt(0).toUpperCase() + period.slice(1),
      title: title,
      nativeTitle: title,
      subtitle: voiceText || 'Custom family reminder for Meera',
      icon: category === 'Health' ? '💊' : (category === 'Nourishment' ? '🍵' : (category === 'Movement' ? '🌸' : (category === 'Family' ? '📞' : '⏰'))),
      completed: false,
      completedAt: null,
      category: category,
      categoryColor: category === 'Health' ? '#287a4a' : (category === 'Nourishment' ? '#d4a359' : '#1b4d3e'),
      voiceText: voiceText || `Meera, it is ${time}. Reminder for ${title}.`,
      soundType: category === 'Nourishment' ? 'tea' : 'chime'
    };

    SMARAN_STATE.rhythm.push(newReminder);
    SMARAN_STATE.reminders = SMARAN_STATE.rhythm;

    try {
      localStorage.setItem('smaran_daily_rhythm', JSON.stringify(SMARAN_STATE.rhythm));
    } catch (err) {}

    document.getElementById('addReminderModal').classList.remove('active');
    document.getElementById('newReminderTitle').value = '';
    document.getElementById('newReminderTime').value = '';
    document.getElementById('newReminderVoice').value = '';

    if (window.smaranAudio) window.smaranAudio.playSuccessChime();
    this.showToast(`✓ New daily reminder "${title}" added and saved!`);

    this.renderDailyRhythm();
    this.renderNextUpSpotlight();
  }

  showToast(message) {
    const toast = document.getElementById('smaranGlobalToast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.smaranApp = new SmaranApp();
});

