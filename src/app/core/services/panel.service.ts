import { Injectable, signal, WritableSignal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
}) 

export class PanelService {
  isPanelVisible: WritableSignal<boolean> = signal(false);
  urlStack: string[] = []; 
  initialPanelUrl: WritableSignal<string | null> = signal(null); 
  isDifferentPanel: WritableSignal<boolean> = signal(false); 

  constructor(
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.detectPanelChange(); // Handle panel change on every navigation event
      });

    this.initializeUrl(); // Initialize with the current URL

    // Listen for popstate events (back navigation)
    window.onpopstate = () => {
      this.handleBackNavigation();
    };
  }

  initializeUrl(): void {
    const initialUrl = this.router.url;
    if (this.isPanelUrl(initialUrl)) {
      this.initialPanelUrl.set(initialUrl);
      this.urlStack.push(initialUrl);
      this.isPanelVisible.set(true);
    } 
  }

  closePanel(): void {
    this.clearUrlStack(); 
    this.isPanelVisible.set(false); 
  }

  openPanel(): void {
    this.isPanelVisible.set(true);
  }

  detectPanelChange(): void {
    const currentUrl = this.router.url;
    const previousUrl = this.urlStack[this.urlStack.length - 1] || null;

    const currentPanelType = this.getPanelType(currentUrl);
    const previousPanelType = this.getPanelType(previousUrl || '');
    const currentId = this.getPanelId(currentUrl);
    const previousId = this.getPanelId(previousUrl || '');

    const panelChanged = currentPanelType !== previousPanelType;
    const idChanged = currentId !== previousId;

    // Check if we should push the current URL to the stack
    if (this.isPanelUrl(currentUrl)) {
      if ((panelChanged || idChanged) && !this.urlStack.includes(currentUrl)) {
        this.urlStack.push(currentUrl);
        this.isDifferentPanel.set(true);
        this.openPanel();
      } else {
        this.isDifferentPanel.set(false);
      }
    }

    if (!this.isPanelUrl(currentUrl)) {
      this.closePanel();
    }
  }

  handleBackNavigation(): void {
    const currentUrl = this.router.url;
    // Remove the URL from the stack if it exists
    const index = this.urlStack.indexOf(currentUrl);
    if (index !== -1) {
      this.urlStack.splice(index, 1);
    }
  }

  getPanelType(url: string): string {
    const match = url.match(/\(panel:([^\/\?)]+)/);
    return match ? match[1] : '';
  }

  getPanelId(url: string): string | null {
    const match = url.match(/\(panel:[^\/]+\/view\/([^\/\?)]+)/);
    return match ? match[1] : null;
  }

  isPanelUrl(url: string): boolean {
    return /\(panel:/.test(url);
  }

  canGoBack(): boolean {
    const uniqueUrls = Array.from(new Set(this.urlStack)); 
    return uniqueUrls.length > 1; 
  }

  goBack(): void {
    if (this.canGoBack()) {
      this.urlStack.pop(); 
      const previousUrl = this.urlStack[this.urlStack.length - 1]; 
      if (previousUrl) {
        this.router.navigateByUrl(previousUrl); 
      } else {
        console.error('No previous URL to navigate back to.');
      }
    } else {
      console.error('No previous URL to navigate back to');
    }
  }

  clearUrlStack(): void {
    this.urlStack = []; 
    this.initialPanelUrl.set(null); 
    this.isDifferentPanel.set(false); 
  }
}