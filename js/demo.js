/**
 * SMARAN 12-Step Guided Judge Demo Engine
 * Guides the hackathon evaluator seamlessly through the entire innovation story:
 * North-East Elderly -> Memory Vault -> AI Pipeline -> Cognitive Game -> Adaptive Difficulty -> Caregiver Insights -> Regional Theme -> Offline Sync!
 */

class SmaranJudgeDemo {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 12;
    this.isActive = false;

    this.steps = [
      {
        step: 1,
        title: 'Meet Meera Sharma (72, Assam)',
        narrative: 'Meera is 72 years old, living in Assam. She communicates in Assamese, Hindi, and English. She needs an intuitive, culturally familiar cognitive memory companion.',
        targetView: 'home',
        focusSelector: '#elderlyHeroVoiceCard',
        action: () => {}
      },
      {
        step: 2,
        title: 'Her Family Adds a Cherished Memory',
        narrative: 'Her daughter added a memory of Granddaughter Ananya visiting every Sunday with traditional pitha. Let\'s explore the Memory Vault.',
        targetView: 'vault',
        focusSelector: '#memoryCard-ananya',
        action: () => {}
      },
      {
        step: 3,
        title: 'SMARAN AI Understands the Memory',
        narrative: 'When the family clicks "Create Activity", SMARAN\'s AI parses the emotional connection, relationships, and regional context in real time.',
        targetView: 'vault',
        focusSelector: '#btnCreateActivityAnanya',
        action: () => {
          if (window.smaranGames) window.smaranGames.triggerAIPipeline('ananya');
        }
      },
      {
        step: 4,
        title: 'Generating Personalized Cognitive Task',
        narrative: 'The 5-step AI pipeline converts the personal memory into a customized, non-clinical recognition exercise.',
        targetView: 'games',
        focusSelector: '#gameActiveContainer',
        action: () => {
          if (window.smaranGames) window.smaranGames.startPersonalMemoryGame();
        }
      },
      {
        step: 5,
        title: 'Interactive Memory Recognition: "Who is this?"',
        narrative: 'Meera sees her granddaughter Ananya in a culturally warm illustration with familiar details.',
        targetView: 'games',
        focusSelector: '.game-options-grid',
        action: () => {}
      },
      {
        step: 6,
        title: 'Positive Validation & Performance Gain',
        narrative: 'Correct recognition provides positive, warm emotional validation and updates cognitive recall scores (+8%).',
        targetView: 'games',
        focusSelector: '#gameFeedbackBanner',
        action: () => {
          const firstBtn = document.querySelector('.game-opt-btn');
          if (firstBtn && !firstBtn.disabled) {
            firstBtn.click();
          }
        }
      },
      {
        step: 7,
        title: 'Adaptive Difficulty Engine in Action',
        narrative: 'SMARAN automatically calibrates difficulty from Easy (78%) -> Medium (84%) -> Advanced (89%) based on engagement metrics.',
        targetView: 'caregiver',
        focusSelector: '#adaptiveDifficultySection',
        action: () => {}
      },
      {
        step: 8,
        title: 'Caregiver Dashboard & AI Insights',
        narrative: 'Caregivers see objective engagement metrics without alarming clinical labels. AI explains the reason for positive trends.',
        targetView: 'caregiver',
        focusSelector: '#aiInsightCard',
        action: () => {}
      },
      {
        step: 9,
        title: 'Regional Personalization: "YOUR WORLD"',
        narrative: 'Assamese language, tea garden visuals, and ambient morning birds converge into a single holistic sanctuary.',
        targetView: 'world',
        focusSelector: '#yourWorldShowcase',
        action: () => {
          if (window.smaranAudio) window.smaranAudio.playSound('birds');
        }
      },
      {
        step: 10,
        title: 'Simulating Offline Mode in Remote Regions',
        narrative: 'Connectivity in remote North-East hills can be intermittent. Let\'s simulate loss of internet connection.',
        targetView: 'home',
        focusSelector: '#offlineStatusPill',
        action: () => {
          if (window.smaranApp) window.smaranApp.setOfflineMode(true);
        }
      },
      {
        step: 11,
        title: 'SMARAN Continues Working 100% Offline',
        narrative: 'All cognitive activities, voice guidance, saved memories, and local state run completely on-device without cloud dependency.',
        targetView: 'home',
        focusSelector: '#offlineHeroBanner',
        action: () => {}
      },
      {
        step: 12,
        title: 'Instant Sync When Connectivity Returns',
        narrative: 'When internet is restored, SMARAN seamlessly synchronizes all 8 offline progress changes. "Because Every Memory Matters."',
        targetView: 'home',
        focusSelector: '#btnSyncOffline',
        action: () => {
          if (window.smaranApp) window.smaranApp.triggerOfflineSync();
        }
      }
    ];
  }

  startDemo() {
    this.isActive = true;
    this.currentStep = 1;
    const banner = document.getElementById('demoTourBanner');
    if (banner) banner.classList.add('active');
    this.renderStep();
  }

  endDemo() {
    this.isActive = false;
    const banner = document.getElementById('demoTourBanner');
    if (banner) banner.classList.remove('active');
    this.clearHighlights();
  }

  renderStep() {
    const stepData = this.steps[this.currentStep - 1];
    if (!stepData) return;

    // Navigate to view
    if (window.smaranApp && stepData.targetView) {
      window.smaranApp.navigateTo(stepData.targetView);
    }

    // Execute step action
    if (stepData.action) {
      stepData.action();
    }

    // Update Banner Content
    const numEl = document.getElementById('demoStepNumber');
    const titleEl = document.getElementById('demoStepTitle');
    const textEl = document.getElementById('demoStepNarrative');
    const prevBtn = document.getElementById('demoPrevBtn');
    const nextBtn = document.getElementById('demoNextBtn');

    if (numEl) numEl.textContent = `Screen ${this.currentStep} of ${this.totalSteps}`;
    if (titleEl) titleEl.textContent = stepData.title;
    if (textEl) textEl.textContent = stepData.narrative;

    if (prevBtn) {
      prevBtn.disabled = (this.currentStep === 1);
    }

    if (nextBtn) {
      nextBtn.textContent = (this.currentStep === this.totalSteps) ? 'Finish Demo 🎉' : 'Next Step →';
    }

    // Apply Focus Highlight
    this.clearHighlights();
    setTimeout(() => {
      if (stepData.focusSelector) {
        const target = document.querySelector(stepData.focusSelector);
        if (target) {
          target.classList.add('demo-focus-target');
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 200);
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.renderStep();
    } else {
      this.endDemo();
      alert('Demo completed! Explore SMARAN freely or test any feature.');
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.renderStep();
    }
  }

  clearHighlights() {
    document.querySelectorAll('.demo-focus-target').forEach(el => {
      el.classList.remove('demo-focus-target');
    });
  }
}

window.smaranDemo = new SmaranJudgeDemo();
