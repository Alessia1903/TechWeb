import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'wikiFormat',
  standalone: true
})
export class WikiFormatPipe implements PipeTransform {
  
  sanitizer = inject(DomSanitizer);

  transform(rawText: string): SafeHtml {
    if (!rawText) return '';

    const lines = rawText.split('\n');
    const processedElements: string[] = [];
    let listBuffer: string[] = [];
    
    // LA CHIAVE: Teniamo traccia del capitolo che stiamo leggendo!
    let currentSectionName = '';

    // Parole chiave dei titoli in cui Wikipedia inserisce regolarmente liste
    const listHeavySections = [
      'personaggi', 'tracce', 'cast', 'doppiatori', 'doppiaggio', 
      'colonna sonora', 'brani', 'interpreti', 'riconoscimenti', 
      'premi', 'distribuzione', 'date di uscita', 'edizioni',
      'altri progetti', 'collegamenti esterni', 'bibliografia', 'filmografia'
    ];

    const flushList = () => {
      if (listBuffer.length > 0) {
        processedElements.push(`<ul class="wiki-list">\n${listBuffer.join('\n')}\n</ul>`);
        listBuffer = [];
      }
    };

    for (let line of lines) {
      let trimmed = line.trim();
      if (!trimmed) continue;

      // 1. GESTIONE TITOLI E AGGIORNAMENTO DEL CONTESTO
      let isHeading = false;
      let headingText = '';

      if (/^====\s*(.*?)\s*====$/.test(trimmed)) {
        headingText = trimmed.replace(/^====\s*(.*?)\s*====$/, '$1');
        flushList();
        processedElements.push(`<h4>${headingText}</h4>`);
        isHeading = true;
      } else if (/^===\s*(.*?)\s*===$/.test(trimmed)) {
        headingText = trimmed.replace(/^===\s*(.*?)\s*===$/, '$1');
        flushList();
        processedElements.push(`<h3>${headingText}</h3>`);
        isHeading = true;
      } else if (/^==\s*(.*?)\s*==$/.test(trimmed)) {
        headingText = trimmed.replace(/^==\s*(.*?)\s*==$/, '$1');
        flushList();
        processedElements.push(`<h2>${headingText}</h2>`);
        isHeading = true;
      } else if (/^=\s*(.*?)\s*=$/.test(trimmed)) {
        headingText = trimmed.replace(/^=\s*(.*?)\s*=$/, '$1');
        flushList();
        processedElements.push(`<h2>${headingText}</h2>`);
        isHeading = true;
      }

      if (isHeading) {
        // Memorizziamo in minuscolo il nome del capitolo in cui siamo appena entrati
        currentSectionName = headingText.toLowerCase();
        continue;
      }

      // 2. IDENTIFICAZIONE DELLE LISTE (Approccio Contestuale)
      let isListItem = false;
      
      // Controlliamo se siamo in una sezione in cui ci aspettiamo liste
      const inListSection = listHeavySections.some(sec => currentSectionName.includes(sec));

      // Caso A: Liste esplicite di Wikipedia (* o note come (__))
      if (trimmed.startsWith('*')) {
        isListItem = true;
        trimmed = trimmed.substring(1).trim();
      } 
      else if (trimmed.startsWith('(__)')) {
        isListItem = true;
      }
      
      // Caso B: REGOLE AMPIE (Se siamo in Personaggi, Tracce, Cast, ecc.)
      else if (inListSection) {
        // Se siamo in queste sezioni, consideriamo lista QUALSIASI riga che:
        // 1. Contiene due punti ": " (es. "Duchessa: Descrizione lunghissima...")
        // 2. Contiene un trattino separatore (es. "Titolo - Autore")
        // 3. NON finisce con un punto (senza nessun limite di caratteri!)
        if (trimmed.includes(': ') || /\s+[-\u2013\u2014]\s+/.test(trimmed) || !/[.!?:"'»\u201D]$/.test(trimmed)) {
          isListItem = true;
        }
        // Nota: Le brevi intro come "La colonna sonora è composta da 32 tracce." non hanno i 2 punti, 
        // non hanno trattini e finiscono col punto, quindi verranno giustamente stampate come paragrafo!
      }
      
      // Caso C: REGOLE RESTRITTIVE (Se siamo in Trama, Incassi, Produzione, ecc.)
      else {
        // Collegamenti esterni
        if (/, su /i.test(trimmed) && trimmed.length < 300) {
          isListItem = true; 
        } 
        // Elenchi generici sparsi: molto rigidi, solo righe brevi e senza punto
        else if (trimmed.length < 150 && !/[.!?:"'»\u201D]$/.test(trimmed)) {
          isListItem = true;
        }
      }

      // 3. COSTRUZIONE DELL'HTML
      if (isListItem) {
        listBuffer.push(`<li>${trimmed}</li>`);
      } else {
        flushList(); // Se troviamo un paragrafo, chiudiamo la lista precedente
        processedElements.push(`<p>${trimmed}</p>`);
      }
    }

    flushList(); // Chiude un'eventuale lista alla fine del testo
    
    return this.sanitizer.bypassSecurityTrustHtml(processedElements.join('\n'));
  }
}