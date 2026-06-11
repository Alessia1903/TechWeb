import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Per la corretta formattazione di titoli di paragrafi/sottoparagrafi/liste
@Pipe({
  name: 'wikiFormat',
  standalone: true
})
export class WikiFormatPipe implements PipeTransform {
  
  sanitizer = inject(DomSanitizer);

  transform(rawText: string, isInline: boolean = false): SafeHtml {
    if (!rawText) return '';

    // se è il titolo
    if (isInline) {
      const inlineHtml = rawText.replace(/(_+)/g, '<span class="redacted-word">$1</span>');
      return this.sanitizer.bypassSecurityTrustHtml(inlineHtml);
    }

    const lines = rawText.split('\n');
    const processedElements: string[] = [];
    let listBuffer: string[] = [];
    
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

      // GESTIONE TITOLI 
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
        currentSectionName = headingText.toLowerCase();
        continue;
      }

      // IDENTIFICAZIONE DELLE LISTE 
      let isListItem = false;
      // Controlliamo se siamo in una sezione in cui ci aspettiamo liste
      const inListSection = listHeavySections.some(sec => currentSectionName.includes(sec));

      // Liste esplicite di Wikipedia (* o note come (__))
      if (trimmed.startsWith('*')) {
        isListItem = true;
        trimmed = trimmed.substring(1).trim();
      } 
      else if (trimmed.startsWith('(__)')) {
        isListItem = true;
      }
      // Liste implicite
      else if (inListSection) {
        if (trimmed.includes(': ') || /\s+[-\u2013\u2014]\s+/.test(trimmed) || !/[.!?:"'»\u201D]$/.test(trimmed)) {
          isListItem = true;
        }
      }
      else {
        if (/, su /i.test(trimmed) && trimmed.length < 300) {
          isListItem = true; 
        } 
        else if (trimmed.length < 150 && !/[.!?:"'»\u201D]$/.test(trimmed)) {
          isListItem = true;
        }
      }

      // COSTRUZIONE DELL'HTML
      if (isListItem) {
        listBuffer.push(`<li>${trimmed}</li>`);
      } else {
        flushList(); // Se troviamo un paragrafo, chiudiamo la lista precedente
        processedElements.push(`<p>${trimmed}</p>`);
      }
    }
    flushList(); 
    
    let finalHtml = processedElements.join('\n');

    // Per non visualizzare i trattini
    finalHtml = finalHtml.replace(/(_+)/g, '<span class="redacted-word">$1</span>');
    
    return this.sanitizer.bypassSecurityTrustHtml(finalHtml);
  }
}