import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, map, startWith, throttleTime } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ResizeService {
  private resizeSubject = new BehaviorSubject<{
    width: number;
    height: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  resize$: Observable<{ width: number; height: number }> =
    this.resizeSubject.asObservable();

  constructor(
    private destroyRef: DestroyRef,
  ) {
    // emit inital size on init
    this.emitResize();

    fromEvent(window, 'resize')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        throttleTime(250), // Limit frequency of resize events
        debounceTime(250),
        map(() => ({
          width: window.innerWidth,
          height: window.innerHeight,
        }))
      )
      .subscribe((size) => this.resizeSubject.next(size));
  }

  emitResize() {
    this.resizeSubject.next({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }
}
