import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appFileSize',
  standalone: true,
  pure: true
})
export class FilesizePipe implements PipeTransform {
  private static readonly UNITS: string[] = ['o', 'Ko', 'Mo', 'Go', 'To', 'Po'];

  transform(value: number): string {
    if (value) {
      let transformedValue = value;
      let unitIndex = 0;
      while (transformedValue > 1024) {
        transformedValue /= 1024;
        unitIndex++;
      }
      return `${transformedValue.toFixed(2)} ${FilesizePipe.UNITS[unitIndex]}`;
    }
    return '';
  }
}
