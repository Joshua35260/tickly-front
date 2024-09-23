import { AfterViewInit, Component, DestroyRef, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { combineLatest, distinctUntilChanged } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-primary-navbar',
  templateUrl: './primary-navbar.component.html',
  standalone: true,
  styleUrls: ['./primary-navbar.component.scss'],
  imports: [
    RouterLink,  
    RouterLinkActive,
  ]
})

export class PrimaryNavbarComponent implements AfterViewInit, OnInit {
  @ViewChildren(RouterLinkActive) routesWithActive!: QueryList<RouterLinkActive>;

  maskY: string = 'null';
  baseOffset: number;
  liHeight: number;
  maskHeight: number;
  offsetCorrection : number;
  constructor(
    private destroyRef: DestroyRef,
    private elem: ElementRef,
    private router: Router,
  ) {}
  ngOnInit(): void {
    let activeElem = this.elem.nativeElement.querySelector('ul li');
    let navbarElem = this.elem.nativeElement.querySelector('.primary-navbar');
    if (activeElem) {
      this.baseOffset = activeElem.offsetTop;
      this.liHeight = activeElem.offsetHeight;
      
      const maskHeightCSS = getComputedStyle(navbarElem).getPropertyValue('--mask-height').trim();
    
      if (maskHeightCSS) {
        this.maskHeight = parseFloat(maskHeightCSS);
      } else {
        this.maskHeight = this.liHeight; // if maskheight is not defined, use the li height
      }

      // adjust the offsetCorrection according to the theme
      if (this.maskHeight > this.liHeight) {
        this.offsetCorrection = (this.maskHeight - this.liHeight) / 2;
      } else {
        this.offsetCorrection = 0;
      }
    }
  }

  ngAfterViewInit(): void {
    combineLatest(
      this.routesWithActive.map((routeWithActive: RouterLinkActive) => routeWithActive.isActiveChange.pipe(startWith(false)))
    ).pipe(
      takeUntilDestroyed(this.destroyRef),
      map((actives: boolean[]) => actives.findIndex((active: boolean) => active)),
      distinctUntilChanged()
    ).subscribe((activeIndex: number) => {
      this.maskY = `${this.baseOffset + activeIndex * this.liHeight - this.offsetCorrection}px`;
    });
  }

  

}
