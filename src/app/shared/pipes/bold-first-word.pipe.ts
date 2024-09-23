import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'boldFirstWord',
  standalone: true
})
export class BoldFirstWordPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  transform(value: string): any {
    return this.sanitize(value?.replace(new RegExp(`(.*?) (.*)`, 'gi'), '<b>$1</b>&nbsp;$2'));
  }

  sanitize(str: string) {
    return this.sanitizer.sanitize(SecurityContext.HTML, str);
  }
}
