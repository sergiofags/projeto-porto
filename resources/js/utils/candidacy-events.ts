// Sistema de eventos para sincronização de candidaturas entre páginas

export interface CandidacyEventData {
  candidacyId: number;
  userId: number;
  action: 'created' | 'cancelled';
  timestamp: number;
}

class CandidacyEventBus {
  private eventTarget = new EventTarget();

  // Disparar evento quando candidatura for criada ou cancelada
  emit(data: CandidacyEventData) {
    const event = new CustomEvent('candidacy-changed', {
      detail: data
    });
    this.eventTarget.dispatchEvent(event);
    
    // Também disparar um evento global no window para comunicação entre páginas
    window.dispatchEvent(new CustomEvent('candidacy-changed', { detail: data }));
  }

  // Escutar mudanças de candidatura
  on(callback: (data: CandidacyEventData) => void) {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<CandidacyEventData>;
      callback(customEvent.detail);
    };

    this.eventTarget.addEventListener('candidacy-changed', handler);
    window.addEventListener('candidacy-changed', handler);

    // Retornar função de cleanup
    return () => {
      this.eventTarget.removeEventListener('candidacy-changed', handler);
      window.removeEventListener('candidacy-changed', handler);
    };
  }
}

export const candidacyEventBus = new CandidacyEventBus();
