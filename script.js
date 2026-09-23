/**
 * 🎂 ASAWARI'S 19TH BIRTHDAY - JAVASCRIPT LOGIC 💖
 * Handles unboxing, synthesized birthday music, candle blow-outs,
 * polaroid rendering, flip cards, balloon popping, and customizer modal.
 */

// Load saved customizations from localStorage if available
let activeData = { ...CONFIG };
try {
  const saved = localStorage.getItem("asawari_birthday_custom_data");
  if (saved) {
    const parsed = JSON.parse(saved);
    activeData = { ...activeData, ...parsed };
  }
} catch (e) {
  console.warn("Could not load local storage data", e);
}

/* ==========================================================
   🎵 WEB AUDIO SYNTHESIZER (Happy Birthday Melody & Sound FX)
   Zero external audio files required! Works everywhere.
   ========================================================== */
class BirthdayAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentTimeout = null;
    this.currentTrack = 0; // 0: Classic, 1: Dreamy Lofi, 2: Sweet Kalimba
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single soft music-box note
  playTone(freq, duration = 0.4, timeOffset = 0, type = 'sine') {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + timeOffset);

    // Cute music-box bell-like envelope
    const startTime = this.ctx.currentTime + timeOffset;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Note Frequencies
  getMelody() {
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00, B5 = 987.77;
    const C3 = 130.81, E3 = 164.81, F3 = 174.61, G3 = 196.00, A3 = 220.00;

    // Track 0: Classic Happy Birthday
    if (this.currentTrack === 0) {
      return [
        { f: G4, d: 0.35, pause: 0.4, type: 'triangle' },
        { f: G4, d: 0.25, pause: 0.3, type: 'triangle' },
        { f: A4, d: 0.5,  pause: 0.6, type: 'triangle' },
        { f: G4, d: 0.5,  pause: 0.6, type: 'triangle' },
        { f: C5, d: 0.6,  pause: 0.7, type: 'triangle' },
        { f: B4, d: 0.9,  pause: 1.1, type: 'triangle' },

        { f: G4, d: 0.35, pause: 0.4, type: 'triangle' },
        { f: G4, d: 0.25, pause: 0.3, type: 'triangle' },
        { f: A4, d: 0.5,  pause: 0.6, type: 'triangle' },
        { f: G4, d: 0.5,  pause: 0.6, type: 'triangle' },
        { f: D5, d: 0.6,  pause: 0.7, type: 'triangle' },
        { f: C5, d: 0.9,  pause: 1.1, type: 'triangle' },

        { f: G4, d: 0.35, pause: 0.4, type: 'triangle' },
        { f: G4, d: 0.25, pause: 0.3, type: 'triangle' },
        { f: G5, d: 0.6,  pause: 0.65, type: 'triangle' },
        { f: E5, d: 0.6,  pause: 0.65, type: 'triangle' },
        { f: C5, d: 0.5,  pause: 0.55, type: 'triangle' },
        { f: B4, d: 0.5,  pause: 0.55, type: 'triangle' },
        { f: A4, d: 0.8,  pause: 1.0, type: 'triangle' },

        { f: F5, d: 0.35, pause: 0.4, type: 'triangle' },
        { f: F5, d: 0.25, pause: 0.3, type: 'triangle' },
        { f: E5, d: 0.6,  pause: 0.65, type: 'triangle' },
        { f: C5, d: 0.6,  pause: 0.65, type: 'triangle' },
        { f: D5, d: 0.6,  pause: 0.7, type: 'triangle' },
        { f: C5, d: 1.2,  pause: 1.8, type: 'triangle' }
      ];
    }

    // Track 1: Dreamy Lofi Chimes (Aesthetic Chill Chords)
    if (this.currentTrack === 1) {
      return [
        { f: C4, d: 0.6, pause: 0.4, type: 'sine' },
        { f: E4, d: 0.6, pause: 0.4, type: 'sine' },
        { f: G4, d: 0.7, pause: 0.4, type: 'sine' },
        { f: B4, d: 1.0, pause: 0.8, type: 'sine' },

        { f: A3, d: 0.6, pause: 0.4, type: 'sine' },
        { f: C4, d: 0.6, pause: 0.4, type: 'sine' },
        { f: E4, d: 0.7, pause: 0.4, type: 'sine' },
        { f: G4, d: 1.0, pause: 0.8, type: 'sine' },

        { f: F3, d: 0.6, pause: 0.4, type: 'sine' },
        { f: A3, d: 0.6, pause: 0.4, type: 'sine' },
        { f: C4, d: 0.7, pause: 0.4, type: 'sine' },
        { f: E4, d: 1.0, pause: 0.8, type: 'sine' },

        { f: G3, d: 0.6, pause: 0.4, type: 'sine' },
        { f: B3, d: 0.6, pause: 0.4, type: 'sine' },
        { f: D4, d: 0.7, pause: 0.4, type: 'sine' },
        { f: F4, d: 1.2, pause: 1.2, type: 'sine' }
      ];
    }

    // Track 2: Sweet Kalimba Melody (Cute & Upbeat)
    return [
      { f: E5, d: 0.3, pause: 0.35, type: 'sine' },
      { f: G5, d: 0.3, pause: 0.35, type: 'sine' },
      { f: A5, d: 0.4, pause: 0.45, type: 'sine' },
      { f: G5, d: 0.3, pause: 0.35, type: 'sine' },
      { f: E5, d: 0.4, pause: 0.45, type: 'sine' },
      { f: D5, d: 0.3, pause: 0.35, type: 'sine' },
      { f: C5, d: 0.6, pause: 0.7, type: 'sine' },

      { f: D5, d: 0.3, pause: 0.35, type: 'sine' },
      { f: E5, d: 0.3, pause: 0.35, type: 'sine' },
      { f: F5, d: 0.4, pause: 0.45, type: 'sine' },
      { f: E5, d: 0.3, pause: 0.35, type: 'sine' },
      { f: D5, d: 0.4, pause: 0.45, type: 'sine' },
      { f: C5, d: 0.8, pause: 1.2, type: 'sine' }
    ];
  }

  setTrack(trackIndex) {
    this.currentTrack = trackIndex;
    if (this.isPlaying) {
      this.stopMelody();
      this.startMelody();
    }
  }

  startMelody() {
    this.init();
    this.isPlaying = true;
    const melody = this.getMelody();
    let index = 0;

    const playNext = () => {
      if (!this.isPlaying) return;
      const note = melody[index];
      this.playTone(note.f, note.d, 0, note.type || 'triangle');
      
      // Also play gentle harmonic octave
      this.playTone(note.f * 2, note.d * 0.7, 0.02, 'sine');

      index = (index + 1) % melody.length;
      this.currentTimeout = setTimeout(playNext, note.pause * 1000);
    };

    playNext();
  }

  stopMelody() {
    this.isPlaying = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  // Sound FX: Gentle Pop
  playPop() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Sound FX: Celebratory Chime / Flourish
  playCheerChime() {
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.6, idx * 0.1, 'sine');
    });
  }

  // Sound FX: Candle Blow Out Whoosh
  playWhoosh() {
    this.init();
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }
}

const audio = new BirthdayAudioEngine();

/* ==========================================================
   🎉 CONFETTI CANNON
   ========================================================== */
function launchConfetti(originY = 0.6, particleCount = 70) {
  if (typeof confetti !== 'function') return;
  confetti({
    particleCount: particleCount,
    spread: 80,
    origin: { y: originY },
    colors: ['#ff6b8b', '#ffd1dc', '#ffd700', '#9d71e8', '#7ae582', '#ffeed1']
  });
}

function launchMegaCelebration() {
  if (typeof confetti !== 'function') return;
  const duration = 3.5 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff6b8b', '#ffd1dc', '#ffd700', '#9d71e8']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff6b8b', '#ffd1dc', '#ffd700', '#7ae582']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

/* ==========================================================
   🖼️ RENDER CONTENT FROM CONFIG / ACTIVE DATA
   ========================================================== */
function renderUI() {
  // Update header text
  document.getElementById("display-name").textContent = activeData.name || "Asawari";
  document.getElementById("display-tagline").textContent = activeData.tagline;

  // Render Polaroids
  const polaroidsGrid = document.getElementById("polaroids-grid");
  polaroidsGrid.innerHTML = "";
  (activeData.memories || []).forEach((mem, index) => {
    const card = document.createElement("div");
    card.className = "polaroid-card";
    card.innerHTML = `
      <div class="washi-tape"></div>
      <div class="polaroid-img-wrapper relative group">
        <img src="${mem.image}" alt="Memory with ${activeData.name}" loading="lazy">
        <div class="polaroid-overlay">
          <button class="photo-action-btn view-btn" data-idx="${index}">
            <span>🔍 View Full</span>
          </button>
          <label class="photo-action-btn cursor-pointer">
            <span>📷 Change</span>
            <input type="file" accept="image/*" class="hidden individual-photo-input" data-idx="${index}">
          </label>
        </div>
      </div>
      <div class="mt-3 text-center px-1 relative">
        <p class="handwritten text-lg">${mem.caption}</p>
        <span class="text-[11px] text-pink-400 font-semibold tracking-wider uppercase block mt-1">${mem.date}</span>
        <span class="polaroid-heart-badge">💖</span>
      </div>
    `;

    // Click on photo or view button opens lightbox
    card.querySelector(".polaroid-img-wrapper").addEventListener("click", (e) => {
      if (e.target.closest(".individual-photo-input") || e.target.closest("label")) return;
      openLightbox(index);
    });

    // Individual photo file change
    const indInput = card.querySelector(".individual-photo-input");
    indInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          activeData.memories[index].image = event.target.result;
          saveData();
          renderUI();
          launchConfetti(0.5, 30);
          audio.playCheerChime();
        };
        reader.readAsDataURL(file);
      }
    });

    polaroidsGrid.appendChild(card);
  });

  // Render Reasons Flip Cards
  const reasonsGrid = document.getElementById("reasons-grid");
  reasonsGrid.innerHTML = "";
  (activeData.reasons || []).forEach((reason) => {
    const card = document.createElement("div");
    card.className = "reason-card";
    card.innerHTML = `
      <div class="reason-inner">
        <div class="reason-front">
          <span class="text-3xl mb-2">${reason.icon}</span>
          <h3 class="font-heading font-bold text-gray-800 text-base">${reason.title}</h3>
          <span class="text-xs text-pink-500 font-semibold mt-2">Tap to flip ✨</span>
        </div>
        <div class="reason-back">
          <span class="text-2xl mb-1">${reason.icon}</span>
          <p class="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">${reason.desc}</p>
        </div>
      </div>
    `;
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
      audio.playPop();
    });
    reasonsGrid.appendChild(card);
  });

  // Render Letter
  if (activeData.letter) {
    document.getElementById("letter-salutation").textContent = activeData.letter.salutation || `Dearest ${activeData.name},`;
    document.getElementById("letter-closing").textContent = activeData.letter.closing || "Forever your best friend,";
    document.getElementById("letter-signature").textContent = activeData.letter.signature || "With love & hugs 🧸✨";

    const bodyContainer = document.getElementById("letter-body-container");
    bodyContainer.innerHTML = "";
    (activeData.letter.body || []).forEach(paragraph => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      bodyContainer.appendChild(p);
    });
  }
}

/* ==========================================================
   🎁 UNWRAPPING THE SURPRISE
   ========================================================== */
function setupUnboxing() {
  const introScreen = document.getElementById("intro-screen");
  const giftBox = document.getElementById("gift-box-container");
  const openBtn = document.getElementById("open-box-btn");

  const triggerUnwrap = () => {
    giftBox.classList.add("opening");
    audio.playPop();
    setTimeout(() => {
      audio.playCheerChime();
      launchMegaCelebration();
    }, 250);

    setTimeout(() => {
      introScreen.classList.add("unwrapped");
      // Start background melody automatically upon interaction
      audio.startMelody();
      document.getElementById("music-icon").textContent = "🔊";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  };

  giftBox.addEventListener("click", triggerUnwrap);
  openBtn.addEventListener("click", triggerUnwrap);
}

/* ==========================================================
   🕯️ INTERACTIVE CAKE & CANDLE BLOWOUT
   ========================================================== */
function setupCakeInteraction() {
  const candles = [
    document.getElementById("candle-1"),
    document.getElementById("candle-2"),
    document.getElementById("candle-3")
  ];
  const cakeInteractive = document.getElementById("cake-interactive");
  const wishBanner = document.getElementById("wish-banner");
  const relightBtn = document.getElementById("relight-btn");
  let blownOut = false;

  const blowOutCandles = () => {
    if (blownOut) return;
    blownOut = true;

    audio.playWhoosh();
    candles.forEach((c, idx) => {
      setTimeout(() => {
        c.classList.add("blown-out");
      }, idx * 120);
    });

    setTimeout(() => {
      audio.playCheerChime();
      launchMegaCelebration();

      wishBanner.classList.remove("hidden");
      setTimeout(() => {
        wishBanner.classList.remove("opacity-0", "scale-95");
        wishBanner.classList.add("opacity-100", "scale-100");
      }, 50);
    }, 600);
  };

  cakeInteractive.addEventListener("click", blowOutCandles);

  relightBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    blownOut = false;
    candles.forEach(c => c.classList.remove("blown-out"));
    wishBanner.classList.add("opacity-0", "scale-95");
    wishBanner.classList.remove("opacity-100", "scale-100");
    setTimeout(() => {
      wishBanner.classList.add("hidden");
    }, 400);
    launchConfetti(0.4, 25);
  });
}

/* ==========================================================
   🎈 INTERACTIVE BALLOON POPPING
   ========================================================== */
function setupBalloons() {
  const buttons = document.querySelectorAll(".balloon-btn");
  const msgBox = document.getElementById("balloon-message-box");

  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      audio.playPop();
      launchConfetti(0.7, 30);

      const msg = btn.getAttribute("data-msg");
      btn.style.opacity = "0.2";
      btn.style.pointerEvents = "none";
      btn.style.transform = "scale(0.8)";

      msgBox.style.opacity = "0";
      setTimeout(() => {
        msgBox.innerHTML = `✨ "${msg}" ✨`;
        msgBox.style.opacity = "1";
      }, 150);
    });
  });
}

/* ==========================================================
   🎶 AUDIO CONTROLS
   ========================================================== */
function setupAudioControls() {
  const musicToggleBtn = document.getElementById("music-toggle-btn");
  const musicIcon = document.getElementById("music-icon");
  const musicMenu = document.getElementById("music-menu");
  const closeMenuBtn = document.getElementById("close-music-menu");
  const playPauseBtn = document.getElementById("music-play-pause-btn");
  const playText = document.getElementById("music-play-text");
  const trackButtons = document.querySelectorAll(".track-btn");
  const customAudioUpload = document.getElementById("custom-audio-upload");
  const customAudioElement = document.getElementById("custom-audio-element");
  const uploadedSongName = document.getElementById("uploaded-song-name");
  const nowPlayingBadge = document.getElementById("now-playing-badge");

  let isUsingCustomAudio = false;

  // Toggle Music Drawer
  musicToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    musicMenu.classList.toggle("hidden");
  });

  closeMenuBtn.addEventListener("click", () => {
    musicMenu.classList.add("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#music-player-container")) {
      musicMenu.classList.add("hidden");
    }
  });

  const updatePlayingState = (isPlaying, label = "Playing") => {
    if (isPlaying) {
      musicIcon.textContent = "🔊";
      playText.textContent = "Pause ⏸️";
      nowPlayingBadge.textContent = label;
      nowPlayingBadge.className = "text-[10px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-bold";
    } else {
      musicIcon.textContent = "🔇";
      playText.textContent = "Play ▶️";
      nowPlayingBadge.textContent = "Paused";
      nowPlayingBadge.className = "text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold";
    }
  };

  // Preset Track Switcher
  trackButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const trackId = parseInt(btn.getAttribute("data-track"), 10);
      
      // Stop custom audio if playing
      if (isUsingCustomAudio) {
        customAudioElement.pause();
        isUsingCustomAudio = false;
      }

      audio.setTrack(trackId);
      audio.startMelody();

      // Update UI active styles
      trackButtons.forEach(b => {
        b.classList.remove("active-track");
        b.querySelector(".track-status").textContent = "";
      });
      btn.classList.add("active-track");
      btn.querySelector(".track-status").textContent = "✓";

      updatePlayingState(true, "Playing");
      launchConfetti(0.2, 15);
    });
  });

  // Custom Audio File Upload
  customAudioUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      audio.stopMelody();
      const objectUrl = URL.createObjectURL(file);
      customAudioElement.src = objectUrl;
      customAudioElement.play().catch(err => console.log("Audio play error", err));
      isUsingCustomAudio = true;

      // Update UI
      trackButtons.forEach(b => {
        b.classList.remove("active-track");
        b.querySelector(".track-status").textContent = "";
      });
      uploadedSongName.textContent = `🎵 ${file.name}`;
      uploadedSongName.classList.remove("hidden");
      updatePlayingState(true, "Playing Song");
      launchConfetti(0.2, 20);
    }
  });

  // Master Play / Pause
  playPauseBtn.addEventListener("click", () => {
    if (isUsingCustomAudio) {
      if (customAudioElement.paused) {
        customAudioElement.play();
        updatePlayingState(true, "Playing Song");
      } else {
        customAudioElement.pause();
        updatePlayingState(false);
      }
    } else {
      if (audio.isPlaying) {
        audio.stopMelody();
        updatePlayingState(false);
      } else {
        audio.startMelody();
        updatePlayingState(true, "Playing");
      }
    }
  });
}

/* ==========================================================
   ✏️ IN-BROWSER CUSTOMIZER MODAL
   ========================================================== */
function setupCustomizer() {
  const modal = document.getElementById("customizer-modal");
  const openBtn = document.getElementById("edit-mode-btn");
  const closeBtn = document.getElementById("close-modal-btn");
  const saveBtn = document.getElementById("save-customizer-btn");
  const resetBtn = document.getElementById("reset-default-btn");

  const nameInput = document.getElementById("edit-name");
  const taglineInput = document.getElementById("edit-tagline");
  const letterInput = document.getElementById("edit-letter");
  const photoInputs = document.querySelectorAll(".file-input-photo");

  // Open modal & populate fields
  openBtn.addEventListener("click", () => {
    nameInput.value = activeData.name || "Asawari";
    taglineInput.value = activeData.tagline || "";
    letterInput.value = (activeData.letter?.body || []).join("\n\n");
    modal.classList.add("active");
  });

  // Close modal
  const closeModal = () => modal.classList.remove("active");
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle Photo File Uploads (Convert to base64 and save in activeData)
  photoInputs.forEach(input => {
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      const idx = parseInt(input.getAttribute("data-idx"), 10);
      if (file && idx >= 0 && idx < activeData.memories.length) {
        const reader = new FileReader();
        reader.onload = (event) => {
          activeData.memories[idx].image = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // Save changes
  saveBtn.addEventListener("click", () => {
    activeData.name = nameInput.value.trim() || activeData.name;
    activeData.tagline = taglineInput.value.trim() || activeData.tagline;

    const rawLetter = letterInput.value.trim();
    if (rawLetter) {
      activeData.letter.body = rawLetter.split(/\n\s*\n/).filter(Boolean);
    }

    saveData();
    renderUI();
    closeModal();
    launchMegaCelebration();
    audio.playCheerChime();
  });

  // Reset to original CONFIG
  resetBtn.addEventListener("click", () => {
    if (confirm("Reset all customizations back to default?")) {
      localStorage.removeItem("asawari_birthday_custom_data");
      activeData = JSON.parse(JSON.stringify(CONFIG));
      renderUI();
      closeModal();
    }
  });
}

function saveData() {
  try {
    localStorage.setItem("asawari_birthday_custom_data", JSON.stringify(activeData));
  } catch (err) {
    console.warn("Storage quota full or disabled", err);
  }
}

/* ==========================================================
   💖 7. CURSOR LOVE PARTICLES & FLOATING TRAIL
   ========================================================== */
function setupCursorLoveTrail() {
  const emojis = ['💖', '🌸', '✨', '💕', '🧁', '🎀', '🧸', '🍰'];
  let lastSpawn = 0;

  const createParticle = (x, y) => {
    const now = Date.now();
    if (now - lastSpawn < 45) return; // Smooth 45ms throttle
    lastSpawn = now;

    const particle = document.createElement("span");
    particle.className = "love-particle";
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.fontSize = `${Math.floor(Math.random() * 14 + 14)}px`;

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1300);
  };

  window.addEventListener("mousemove", (e) => {
    createParticle(e.clientX, e.clientY);
  });

  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) {
      createParticle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
}

/* ==========================================================
   📸 8. MEMORY MANAGER (Add real photos easily)
   ========================================================== */
let activeLightboxIndex = 0;

function openLightbox(index) {
  if (!activeData.memories || !activeData.memories[index]) return;
  activeLightboxIndex = index;
  const mem = activeData.memories[index];

  document.getElementById("lightbox-img").src = mem.image;
  document.getElementById("lightbox-caption").textContent = mem.caption;
  document.getElementById("lightbox-date").textContent = mem.date || "Core Memory";

  document.getElementById("photo-lightbox").classList.add("active");
  audio.playPop();
  launchConfetti(0.4, 15);
}

function setupPhotoLightbox() {
  const modal = document.getElementById("photo-lightbox");
  const closeBtn = document.getElementById("close-lightbox-btn");
  const replaceInput = document.getElementById("lightbox-replace-input");

  const closeModal = () => modal.classList.remove("active");
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Direct replace while in lightbox
  replaceInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && activeData.memories[activeLightboxIndex]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        activeData.memories[activeLightboxIndex].image = event.target.result;
        document.getElementById("lightbox-img").src = event.target.result;
        saveData();
        renderUI();
        launchConfetti(0.5, 30);
        audio.playCheerChime();
      };
      reader.readAsDataURL(file);
    }
  });
}

function setupMemoryManager() {
  const directAddInput = document.getElementById("direct-add-photo-input");
  const addMemoryCardBtn = document.getElementById("add-memory-card-btn");

  // Direct Add Photo Input
  directAddInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMemory = {
          id: Date.now(),
          image: event.target.result,
          caption: "A magical moment with Asu! 💖",
          date: "Best Day Ever"
        };
        activeData.memories.push(newMemory);
        saveData();
        renderUI();
        launchMegaCelebration();
        audio.playCheerChime();
        // Scroll to the new polaroid
        setTimeout(() => {
          const cards = document.querySelectorAll(".polaroid-card");
          if (cards.length) cards[cards.length - 1].scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  });

  // Add Memory Card Button
  addMemoryCardBtn.addEventListener("click", () => {
    directAddInput.click();
  });
}

/* ==========================================================
   💖 9. BESTIE LOVE METER & VIRTUAL HUGS
   ========================================================== */
function setupLoveMeterAndHugs() {
  const testBtn = document.getElementById("test-love-meter-btn");
  const hugsBtn = document.getElementById("send-hugs-btn");
  const bar = document.getElementById("love-meter-bar");
  const percentText = document.getElementById("meter-percent-text");
  const statusMsg = document.getElementById("meter-status-msg");

  let isTesting = false;

  testBtn.addEventListener("click", () => {
    if (isTesting) return;
    isTesting = true;
    testBtn.disabled = true;

    audio.playPop();
    bar.style.width = "0%";
    percentText.textContent = "0%";
    statusMsg.textContent = "Analyzing friendship chemistry & laughter levels... 🧪✨";

    let count = 0;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 8 + 3);
      if (count > 100) count = 100;
      bar.style.width = `${count}%`;
      percentText.textContent = `${count}%`;
      audio.playTone(300 + count * 5, 0.08);

      if (count >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Overload jump!
          percentText.textContent = "999,999% 💖";
          statusMsg.innerHTML = "🚨 <strong>MAX CAPACITY OVERLOAD!</strong> Unconditional Soulmate-Besties! Absolutely inseparable! 👭✨";
          statusMsg.className = "text-sm font-heading font-bold text-pink-600 scale-105 transition-transform duration-300";
          audio.playCheerChime();
          launchMegaCelebration();
          isTesting = false;
          testBtn.disabled = false;
        }, 400);
      }
    }, 40);
  });

  // Send Infinite Virtual Hugs Shower
  hugsBtn.addEventListener("click", () => {
    audio.playCheerChime();
    launchConfetti(0.5, 40);

    const hugEmojis = ['🧸', '💖', '🫂', '🌸', '✨', '🎀', '🧁', '💕'];
    for (let i = 0; i < 28; i++) {
      setTimeout(() => {
        const hug = document.createElement("div");
        hug.textContent = hugEmojis[Math.floor(Math.random() * hugEmojis.length)];
        hug.className = "love-particle";
        hug.style.left = `${Math.random() * 85 + 7.5}vw`;
        hug.style.top = `${Math.random() * 60 + 20}vh`;
        hug.style.fontSize = `${Math.random() * 24 + 24}px`;
        document.body.appendChild(hug);
        setTimeout(() => hug.remove(), 1600);
      }, i * 45);
    }

    const prevMsg = statusMsg.innerHTML;
    statusMsg.innerHTML = "🧸 <strong>1,000,000 WARM VIRTUAL HUGS DELIVERED TO ASAWARI!</strong> 💖";
    setTimeout(() => {
      statusMsg.innerHTML = prevMsg;
    }, 3500);
  });
}

/* ==========================================================
   🌸 10. AESTHETIC BACKGROUND PARTICLES & INTERACTIVE RIPPLES
   ========================================================== */
function setupAestheticBackgroundParticles() {
  const bgContainer = document.getElementById("bg-decorations");
  if (!bgContainer) return;

  // 1. Spawning interactive iridescent bubbles
  const spawnBubble = () => {
    // Keep max 10 active bubbles at a time to keep performance buttery smooth
    if (document.querySelectorAll(".cutu-bubble").length > 10) return;

    const bubble = document.createElement("div");
    bubble.className = "cutu-bubble";
    const size = Math.floor(Math.random() * 32 + 28); // 28px - 60px
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 92 + 4}vw`;
    bubble.style.animationDuration = `${Math.random() * 6 + 10}s`; // 10s - 16s

    // Click to pop bubble!
    bubble.addEventListener("click", (e) => {
      e.stopPropagation();
      audio.playPop();
      launchConfetti(0.5, 15);

      // Create burst of mini hearts
      for (let i = 0; i < 4; i++) {
        const mini = document.createElement("span");
        mini.textContent = "💖";
        mini.className = "love-particle";
        mini.style.left = `${e.clientX + (Math.random() * 40 - 20)}px`;
        mini.style.top = `${e.clientY + (Math.random() * 40 - 20)}px`;
        mini.style.fontSize = "16px";
        document.body.appendChild(mini);
        setTimeout(() => mini.remove(), 1000);
      }
      bubble.remove();
    });

    bgContainer.appendChild(bubble);
    // Auto cleanup after animation ends
    setTimeout(() => {
      if (bubble.parentElement) bubble.remove();
    }, 16000);
  };

  // Spawn initial bubbles
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnBubble, i * 1500);
  }
  setInterval(spawnBubble, 2600);

  // 2. Spawning drifting sakura petals
  const spawnPetal = () => {
    if (document.querySelectorAll(".sakura-petal").length > 12) return;

    const petal = document.createElement("div");
    petal.className = "sakura-petal";
    petal.style.left = `${Math.random() * 95}vw`;
    petal.style.animationDuration = `${Math.random() * 5 + 7}s`; // 7s - 12s
    petal.style.transform = `scale(${Math.random() * 0.5 + 0.7})`;

    bgContainer.appendChild(petal);
    setTimeout(() => {
      if (petal.parentElement) petal.remove();
    }, 13000);
  };

  for (let i = 0; i < 5; i++) {
    setTimeout(spawnPetal, i * 1800);
  }
  setInterval(spawnPetal, 3000);

  // 3. Interactive background ripple wave on click
  window.addEventListener("click", (e) => {
    // Only trigger if not clicking buttons, cards, or inputs
    if (e.target.closest("button") || e.target.closest("input") || e.target.closest("textarea") || e.target.closest(".polaroid-card") || e.target.closest(".reason-card")) {
      return;
    }

    const ripple = document.createElement("div");
    ripple.className = "bg-ripple";
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 850);
  });
}

/* ==========================================================
   🚀 INITIALIZATION
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderUI();
  setupUnboxing();
  setupCakeInteraction();
  setupBalloons();
  setupAudioControls();
  setupCustomizer();
  setupCursorLoveTrail();
  setupMemoryManager();
  setupPhotoLightbox();
  setupLoveMeterAndHugs();
  setupAestheticBackgroundParticles();
});


