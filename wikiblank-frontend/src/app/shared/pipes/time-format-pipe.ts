import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
  standalone: true 
})
export class FormatTimePipe implements PipeTransform {
  
  transform(ms: number | null | undefined): string {
    // controllo valori errati
    if (ms === null || ms === undefined || isNaN(ms) || ms < 0) {
      return '---';
    }
    // calcolo
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    // formattazione
    let timeString = '';
    if (hours > 0) {
      timeString += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) { 
      timeString += `${minutes}m `;
    }
    timeString += `${seconds}s`;

    return timeString.trim() || '0s'; 
  }
}