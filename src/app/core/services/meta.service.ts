import { Injectable, DestroyRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {}

  updateTitle() {
  
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(event => event instanceof NavigationEnd),
        switchMap(() => {
          const fullTitle = this.getTitle(this.activatedRoute.root);
          return of(fullTitle);
        }),
        distinctUntilChanged() 
      )
      .subscribe((fullTitle: string) => {
        this.titleService.setTitle(fullTitle); 
      });
  }
  
  private getTitle(route: ActivatedRoute): string {
    let mainTitle = route.snapshot.data['title'] || '';
    let childTitle = '';
  

    if (route.firstChild) {
      childTitle = this.getTitle(route.firstChild); 
    }
  
    const appName = 'Tickly';
    
    if (mainTitle) {
      return `${mainTitle}`.trim();
    }
  
    
    if (childTitle) {
      return `${childTitle}`.trim(); 
    }
  
    return appName;
  }
  

}
