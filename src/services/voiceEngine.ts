class VoiceEngine {
  private isEnabled: boolean = true;
  private lang: string = 'ms-MY';

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  public setLang(lang: 'ms-MY' | 'en-US'): void {
    this.lang = lang;
  }

  public speakEquation(factorA: number, factorB: number, product?: number): void {
    if (!this.isEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    let text = '';
    if (this.lang.startsWith('ms')) {
      text = product !== undefined
        ? `${factorA} kali ${factorB} sama dengan ${product}`
        : `${factorA} kali ${factorB}`;
    } else {
      text = product !== undefined
        ? `${factorA} times ${factorB} equals ${product}`
        : `${factorA} times ${factorB}`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    window.speechSynthesis.speak(utterance);
  }
}

export const voiceEngine = new VoiceEngine();
