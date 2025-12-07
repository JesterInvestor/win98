document.addEventListener("DOMContentLoaded", () => {
  const floppies = document.querySelectorAll('.floppy');
  const gameContainer = document.getElementById('gameContainer');
  const bgMusic = document.getElementById('bgMusic');
  const instructions = document.getElementById('instructions');

  // Music control - start on first user interaction
  let musicStarted = false;
  const startMusic = () => {
    if (!musicStarted) {
      bgMusic.volume = 0.3; // Set volume to 30%
      bgMusic.play().catch(err => {
        console.log('Audio playback failed:', err);
      });
      musicStarted = true;
    }
  };

  // Add click events to floppy disks
  floppies.forEach((floppy) => {
    floppy.addEventListener('click', (e) => {
      startMusic();
      
      // Add click animation
      floppy.classList.add('clicked');
      setTimeout(() => {
        floppy.classList.remove('clicked');
      }, 300);

      const action = floppy.dataset.action;
      const diskNumber = action.replace('load', '');
      const diskName = floppy.querySelector('.floppy-text').textContent;
      const diskProgram = floppy.querySelector('.floppy-subtitle').textContent;
      
      // Play floppy disk sound effect (if available)
      playFloppySound();
      
      // Show retro-style alert
      showRetroAlert(`Loading ${diskName}`, `Executing: ${diskProgram}\n\nPlease wait...`);
      
      // Simulate loading
      setTimeout(() => {
        handleDiskAction(action);
      }, 1500);
    });

    // Add hover sound effect
    floppy.addEventListener('mouseenter', () => {
      playHoverSound();
    });
  });

  // Handle disk-specific actions
  function handleDiskAction(action) {
    switch(action) {
      case 'load1':
        showRetroAlert('GAMES.EXE', 'Loading classic Windows 98 games...\n\n• Minesweeper\n• Solitaire\n• Snake\n\nClick OK to continue.');
        break;
      case 'load2':
        showRetroAlert('APPS.EXE', 'Loading applications...\n\n• Notepad\n• Paint\n• Calculator\n• Internet Explorer\n\nClick OK to continue.');
        break;
      case 'load3':
        showRetroAlert('SETTINGS.EXE', 'Opening Control Panel...\n\n• Display Settings\n• Sound Settings\n• System Properties\n\nClick OK to continue.');
        break;
      case 'load4':
        showRetroAlert('SECRET.EXE', '🎮 You found the secret disk! 🎮\n\nThis unlocks hidden features and easter eggs.\n\nCongratulations!');
        break;
      default:
        showRetroAlert('Unknown Disk', 'This disk format is not recognized.\n\nPlease try another disk.');
    }
  }

  // Detect swipe down (for mobile)
  let touchStartY = 0;
  let touchEndY = 0;
  const swipeThreshold = 50; // Minimum distance for swipe

  gameContainer.addEventListener('touchstart', (e) => {
    startMusic();
    touchStartY = e.changedTouches[0].pageY;
  }, { passive: true });

  gameContainer.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].pageY;
    const swipeDistance = touchEndY - touchStartY;
    
    if (swipeDistance > swipeThreshold) {
      handleSwipeDown();
    }
  }, { passive: true });

  // Detect arrow key press
  document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowDown") {
      startMusic();
      handleArrowDown();
    }
  });

  // Handle swipe down action
  function handleSwipeDown() {
    playSwipeSound();
    showRetroAlert('Swipe Down Detected!', 'You swiped down on the screen.\n\nThis can be used to navigate through menus or trigger special actions.');
    animateInstructionsBlink();
  }

  // Handle arrow down key action
  function handleArrowDown() {
    playSwipeSound();
    showRetroAlert('Arrow Key Detected!', 'You pressed the Down Arrow key (↓).\n\nThis can be used to navigate through menus or trigger special actions.');
    animateInstructionsBlink();
  }

  // Animate instructions text
  function animateInstructionsBlink() {
    instructions.style.animation = 'none';
    setTimeout(() => {
      instructions.style.animation = '';
    }, 10);
  }

  // Retro-style alert function
  function showRetroAlert(title, message) {
    // Create a Windows 98-style dialog
    const dialog = document.createElement('div');
    dialog.className = 'retro-dialog';
    dialog.innerHTML = `
      <div class="retro-dialog-content">
        <div class="retro-dialog-titlebar">
          <span class="retro-dialog-title">${title}</span>
          <button class="retro-dialog-close">×</button>
        </div>
        <div class="retro-dialog-body">
          <div class="retro-dialog-icon">ℹ️</div>
          <div class="retro-dialog-message">${message.replace(/\n/g, '<br>')}</div>
        </div>
        <div class="retro-dialog-footer">
          <button class="retro-dialog-button">OK</button>
        </div>
      </div>
    `;

    // Add styles for the dialog
    if (!document.getElementById('retro-dialog-styles')) {
      const styles = document.createElement('style');
      styles.id = 'retro-dialog-styles';
      styles.textContent = `
        .retro-dialog {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .retro-dialog-content {
          background: #c0c0c0;
          border: 3px solid;
          border-color: #ffffff #000000 #000000 #ffffff;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.8);
          min-width: 300px;
          max-width: 500px;
        }
        .retro-dialog-titlebar {
          background: linear-gradient(90deg, #000080, #1084d0);
          color: white;
          padding: 3px 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
          font-size: 14px;
        }
        .retro-dialog-close {
          background: #c0c0c0;
          border: 2px solid;
          border-color: #ffffff #000000 #000000 #ffffff;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          padding: 0;
        }
        .retro-dialog-close:active {
          border-color: #000000 #ffffff #ffffff #000000;
        }
        .retro-dialog-body {
          padding: 20px;
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }
        .retro-dialog-icon {
          font-size: 32px;
          flex-shrink: 0;
        }
        .retro-dialog-message {
          font-size: 13px;
          line-height: 1.5;
          color: #000;
        }
        .retro-dialog-footer {
          padding: 10px 20px;
          display: flex;
          justify-content: center;
        }
        .retro-dialog-button {
          background: #c0c0c0;
          border: 2px solid;
          border-color: #ffffff #000000 #000000 #ffffff;
          padding: 5px 30px;
          font-size: 13px;
          cursor: pointer;
          min-width: 80px;
        }
        .retro-dialog-button:active {
          border-color: #000000 #ffffff #ffffff #000000;
        }
        .retro-dialog-button:focus {
          outline: 1px dotted #000000;
          outline-offset: -4px;
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(dialog);

    // Close dialog handlers
    const closeDialog = () => {
      dialog.style.animation = 'fadeIn 0.2s reverse';
      setTimeout(() => {
        dialog.remove();
      }, 200);
    };

    dialog.querySelector('.retro-dialog-button').addEventListener('click', closeDialog);
    dialog.querySelector('.retro-dialog-close').addEventListener('click', closeDialog);
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeDialog();
    });
  }

  // Sound effect functions (using Web Audio API for retro beeps)
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  function playFloppySound() {
    // Simulate floppy disk drive sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  function playHoverSound() {
    // Subtle hover beep
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  }

  function playSwipeSound() {
    // Swipe/navigation sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(300, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  // Add keyboard click sound when keys are pressed
  document.addEventListener('keydown', (e) => {
    if (e.key.length === 1 || ['Enter', 'Backspace', 'Tab', 'Space'].includes(e.key)) {
      playKeySound();
    }
  });

  function playKeySound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400 + Math.random() * 200, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.03);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.03);
  }

  // Easter egg: Konami code
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        showRetroAlert('🎮 KONAMI CODE ACTIVATED! 🎮', 'You discovered the secret Konami Code!\n\nUnlocking super retro mode...\n\n↑ ↑ ↓ ↓ ← → ← → B A');
        konamiIndex = 0;
        // Add special effect
        gameContainer.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
          gameContainer.style.filter = '';
        }, 3000);
      }
    } else {
      konamiIndex = 0;
    }
  });

  console.log('%c🎮 WIN98 RETRO GAME MENU 🎮', 'font-size: 20px; font-weight: bold; color: #008080;');
  console.log('%cTry the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'font-size: 12px; color: #666;');
});
