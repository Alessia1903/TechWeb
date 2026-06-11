import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDiff',
  standalone: true
})
export class TimeDiffPipe implements PipeTransform {
  transform(start: string | null | undefined, end: string | null | undefined): number | null {
    if (!start || !end) {
      return null;
    }
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    
    return endTime - startTime;
  }
}