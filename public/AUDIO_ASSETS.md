# Audio Assets for Retro Game Menu

## Required Audio File

The game menu requires a retro-style background music file. Place the audio file(s) in this directory with the following name:

**retro-menu-music.mp3** (or retro-menu-music.ogg for broader compatibility)

### Recommended Audio Characteristics:
- **Style**: 8-bit/16-bit chiptune or retro synthesizer music
- **Tempo**: 90-120 BPM (moderate pace)
- **Duration**: 1-3 minutes (will loop automatically)
- **Format**: MP3 (primary) and/or OGG (fallback)
- **Volume**: Normalize to -6dB to -3dB for comfortable listening
- **Mood**: Upbeat, nostalgic, menu/interface appropriate

### Suggested Sources for Retro Music:
1. **Free Resources**:
   - OpenGameArt.org (CC0/CC-BY licensed)
   - FreePD.com (Public Domain)
   - Incompetech.com (Royalty-free with attribution)
   - Chiptune.com (Various licenses)

2. **Create Your Own**:
   - Use BeepBox (beepbox.co) - free online chiptune creator
   - Use FamiTracker - NES-style music tracker
   - Use LMMS with chiptune plugins

### Example Audio Search Terms:
- "8-bit menu music"
- "retro game menu loop"
- "chiptune menu theme"
- "Windows 98 style music"
- "16-bit interface music"

### Implementation Note:
The game.html file references "retro-menu-music.mp3" and "retro-menu-music.ogg".
The audio will:
- Start playing on first user interaction (click or key press)
- Loop continuously
- Play at 30% volume (adjustable in game.js)
- Gracefully degrade if audio file is not found

### Alternative: Web Audio API Sounds
The game.js already includes Web Audio API-generated sound effects for:
- Floppy disk clicks (sawtooth wave sweep)
- Hover sounds (sine wave beep)
- Swipe/navigation sounds (square wave sweep)
- Keyboard typing sounds (random frequency sine waves)

These procedural sounds work without external audio files and provide a retro experience.

---

**Note**: Until an actual audio file is provided, the game will work perfectly with just the Web Audio API-generated sound effects. The background music is optional but enhances the retro experience.
