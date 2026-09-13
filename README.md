# SMARAN (স্মৰণ) — Because Every Memory Matters

> **India's First Voice-First, Culturally-Rooted Cognitive Care, Reminiscence & Clinical Engagement Platform for Elderly Care in North-East India.**

[![Live Demo](https://img.shields.io/badge/Demo-Local%20Port%208080-success?style=flat-square)](http://localhost:8080/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Mahimachandna28%2FSmaran-blue?style=flat-square&logo=github)](https://github.com/Mahimachandna28/Smaran)

---

## 🌸 Overview

**SMARAN (স্মৰণ)** is an intelligent, compassionate web application designed specifically for senior citizens living with Mild Cognitive Impairment (MCI) and early-stage dementia in North-East India (Patient Archetype: *Meera Sharma, 72, Tezpur / Guwahati, Assam*).

By blending **Cognitive Stimulation Therapy (CST)** with authentic regional soundscapes, native dialects, family reminiscence assets, and an advanced **Caregiver Clinical Dashboard**, SMARAN provides gentle daily cognitive exercises while giving families and neurologists actionable clinical insights.

---

## 🌟 Key Capabilities & Features

### 1. 🎙️ Voice-First Conversational Assistant
- Hands-free, low-cognitive-load speech interaction powered by the **Web Speech API** (`SpeechRecognition` & `SpeechSynthesis`).
- Fuzzy command parser understanding **English**, **Assamese (অসমীয়া)**, **Hindi (हिन्दी)**, and **Khasi**.
- Visual glowing microphone orb, animated audio waveforms, and tactile voice chips (*"Start my memory game"*, *"Show my memories"*, *"What is my next activity?"*).

### 2. 🎮 10 Culturally Rooted Cognitive Mini-Games
Personalized cognitive games across 5 core clinical domains:
1. **Memory Garden** *(Visual & Pair Matching — Ananya & Tea Garden Photos)*
2. **Who Is This?** *(Family Kinship & Facial Recognition with Voice Answering)*
3. **Sounds From Home** *(Auditory Memory — Brahmaputra River, Monsoon Rain, Bihu Dhol)*
4. **Words We Know** *(Multilingual Native Dialect Association)*
5. **Places That Feel Like Home** *(Spatial Landmark Recall across 8 NE States)*
6. **Remember the Story** *(Episodic Comprehension & 3-Step Narrative Recall)*
7. **Pattern Garden** *(Visual Sequencing & Attention)*
8. **Morning Routine Sequencing** *(Daily Life Temporal Alignment)*
9. **Objects on the Veranda** *(Short-Term Working Memory)*
10. **Sound & Scene Harmony** *(Multi-Sensory Association)*

### 3. 🖼️ North-Eastern Cultural Memory Vault
- 15 rich memory entries spanning all 8 North-Eastern states:
  - **Assam**: Ananya's Sunday Visits, Jorhat Tea Estate, Rongali Bihu Courtyard Dance, Brahmaputra Sunset Ferry.
  - **Meghalaya**: Cherrapunji Living Root Bridges, Shillong Pine Hearth & Folk Songs.
  - **Arunachal Pradesh**: Tawang Monastery Dawn Bells, Ziro Valley Golden Apatani Rice Terraces.
  - **Manipur**: Loktak Lake Floating Phumdi Islands, Ima Keithel All-Mothers Market.
  - **Nagaland**: Dzukou Valley Wild Lily Trails.
  - **Mizoram**: Aizawl Cheraw Bamboo Dance.
  - **Tripura**: Neermahal Water Palace at Full Moon.
  - **Sikkim**: Kanchenjunga Golden Sunrise & Rumtek Monastery.
- **`🔊 Listen Story` Voice Narrator**: Reads the memory in a gentle, warm tone with soothing background nature sounds.
- **`🌿 Play Memory Game`**: One-click launch into mapped cognitive activities.

### 4. ☀️ Circadian Daily Rhythm & Hydration Manager
- **Time-of-Day Segmented Flow**: Morning Dawn (6:00 AM), Midday (1:00 PM), Sunset (5:00 PM), and Night Serenity (9:00 PM).
- **Live Wellness Progress Card**: Segmented visual tracker with real-time completion percentages.
- **One-Tap Tactile Completion**: 54px buttons with soft success chimes and celebratory feedback.
- **Voice Guidance**: Instant audio prompts for every medicine, walk, or family call.
- **`+ Add Daily Reminder` Modal**: Caregiver scheduling with customizable voice prompts and presets (*Coconut water, Blood pressure check, Temple prayers, Evening walk*).

### 5. 📊 Caregiver & Clinical Intelligence Dashboard
- **7-Day Cognitive Recall & Retention Area Chart**: Visual comparison of personalized cultural memories (88% peak accuracy) vs generic abstract tests (72%).
- **5-Pillar CST Competency Breakdown**: Facial Kinship (92%), Auditory/Native Dialect (88%), Spatial Landmarks (82%), Episodic Comprehension (78%), and Daily Sequencing (74%).
- **Circadian Focus & Calming Rhythm Heatmap**: Alertness levels across waking hours to prevent sundowning agitation.
- **Caregiver Security PIN Gate**: 4-digit numeric keypad (`1234`) with instant auto-lock and PIN reset.
- **Emergency SOS Command Center**: 1-tap SOS trigger, emergency siren audio, and geofence tracking.

### 6. ✨ Caregiver Memory Studio with Live AI Visualizer
- Caregivers can enter family moments (e.g. *"Rohan loves eating your sweets on the veranda"*).
- **Real-Time AI Artwork Synthesizer**: Automatically pairs the memory with high-resolution imagery (`assets/rohan_sweets.jpg`, `assets/loktak_lake.jpg`, etc.).
- **Automatic Publishing**: Instantly adds the memory to the Memory Vault, creates a new game in the Game Hub, and logs the clinical entry.

### 7. 📄 Medical-Grade Clinical PDF Report Generator
- Built-in **jsPDF** integration to export formal neurological assessments with clinical metrics, 5-domain tables, sundowning risk analysis, and physician sign-off fields.

---

## 🛠️ Technology Stack

- **Structure**: Semantic HTML5 (Elderly-friendly accessibility, large touch targets, high-contrast modes)
- **Styles**: Vanilla CSS3 (Custom design system, tokens, glassmorphism, responsive grid layouts)
- **Logic**: Modern Vanilla JavaScript (Modular ES6 Classes, State Store, Web Audio API, Web Speech API)
- **PDF Engine**: jsPDF UMD Minified
- **Audio Engine**: Web Audio API Sound Synthesizer + Nature Soundscapes

---

## 🚀 Quickstart & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mahimachandna28/Smaran.git
   cd Smaran
   ```

2. **Start a local development server**:
   ```bash
   # Using Python 3
   python -m http.server 8080
   ```

3. **Open the application**:
   Open [http://localhost:8080/](http://localhost:8080/) in any modern browser (Chrome, Edge, Safari, Firefox).

4. **Caregiver PIN**: Default PIN is `1234`.

---

## 📂 Project Structure

```
Smaran/
├── index.html              # Main single-page application & all 6 views
├── README.md               # System documentation & architectural reference
├── css/
│   ├── tokens.css          # Design tokens (colors, typography, spacing)
│   ├── main.css            # Core application styles, modals, layout
│   └── components.css      # Games, memory cards, circadian rhythm styles
├── js/
│   ├── state.js            # Global store (user profile, 10 games, 15 memories, rhythm)
│   ├── i18n.js             # Internationalization engine (EN, AS, HI, KH)
│   ├── audio.js            # Web Audio API Soundscape & chime engine
│   ├── voice.js            # Web Speech API assistant & command parser
│   ├── games.js            # 10 playable cognitive game engines
│   ├── app.js              # Application controller & view orchestrator
│   └── jspdf.umd.min.js    # Clinical PDF report generator
└── assets/                 # High-resolution North-Eastern images & artworks
```

---

## 🌿 Authors & Acknowledgements

Created with love for our elders across North-East India.  
**Repository**: [https://github.com/Mahimachandna28/Smaran](https://github.com/Mahimachandna28/Smaran)