class AIVoiceWidget {
    constructor() {
        this.button = document.getElementById('ai-voice-btn');
        if (!this.button) return;

        this.icon = this.button.querySelector('i');
        this.textSpan = this.button.querySelector('.tooltip-text');
        this.synth = window.speechSynthesis;
        this.isPlaying = false;

        this.resumeText = "Hi, I'm Kaushik Reddy, an Innovative Data Analyst and AI Engineer. Welcome to my portfolio. I specialize in high-performance systems and Generative AI, building privacy-preserving infrastructure using Rust and Python. Let's build something amazing together.";

        this.init();
    }

    init() {
        this.button.addEventListener('click', () => this.toggleSpeech());

        // Handle when speech ends naturally
        if (this.synth) {
            this.synth.onvoiceschanged = () => {
                // Ensure voices are loaded
            };
        }
    }

    toggleSpeech() {
        if (!this.synth) {
            alert("Sorry, your browser doesn't support text to speech!");
            return;
        }

        if (this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
    }

    play() {
        // Cancel any ongoing speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(this.resumeText);

        // Try to find a good English voice
        const voices = this.synth.getVoices();
        const preferredVoice = voices.find(voice =>
            voice.name.includes('Google US English') ||
            voice.name.includes('Samantha') ||
            voice.lang.startsWith('en-US')
        );

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.1; // Slightly higher pitch for a friendly AI vibe

        utterance.onstart = () => {
            this.isPlaying = true;
            this.button.classList.add('playing');
            this.icon.className = 'fas fa-stop';
            if (this.textSpan) this.textSpan.textContent = "Stop AI Voice";
        };

        utterance.onend = () => {
            this.resetState();
        };

        utterance.onerror = () => {
            this.resetState();
        };

        this.synth.speak(utterance);
    }

    stop() {
        this.synth.cancel();
        this.resetState();
    }

    resetState() {
        this.isPlaying = false;
        this.button.classList.remove('playing');
        this.icon.className = 'fas fa-robot';
        if (this.textSpan) this.textSpan.textContent = "Talk to my Resume";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIVoiceWidget();
});
