import { PanelService } from '../../../../core/services/panel.service';
import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  input,
  model,
  output,
  ViewChild,
} from '@angular/core';
import {
  RightPanelSection,
  RightPanelSectionLabel,
} from '../../../../core/models/enums/right-panel-section.enum';
import { MenuSidebar } from './sidebar.model';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements AfterViewChecked {
  activePanelChange = output<RightPanelSection>();

  activePanel = model<RightPanelSection>();
  activePanel$ = toObservable(this.activePanel);
  dataMenu = model<MenuSidebar[]>();
  dataMenu$ = toObservable(this.dataMenu);
  label = input<string>();
  icon = input<string>();

  rightPanelLabel = RightPanelSectionLabel;
  loadingComplete = false;

  maskY: string = 'null';
  baseOffset: number;
  liHeight: number;
  maskHeight: number;
  offsetCorrection: number;
  @ViewChild('navbar') navbar: ElementRef;
  @ViewChild('li') li: ElementRef;
  get activePanelIndex(): number {
    return (
      this.filteredDataMenu.findIndex(
        (menu: MenuSidebar) => menu.panel === this.activePanel()
      ) || 0
    );
  }

  constructor(
    protected panelService: PanelService,
    private router: Router,
    private destroyRef: DestroyRef,
    private elem: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    this.dataMenu$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dataMenu: MenuSidebar[]) => {
        this.dataMenu.set(dataMenu);
      });
  }

  get filteredDataMenu(): MenuSidebar[] {
    return this.dataMenu()?.filter((menu: MenuSidebar) => !menu.hide) ?? [];
  }
  
  ngAfterViewChecked(): void {
    this.updateNavbarDimensions();
    this.activePanel$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((panel: RightPanelSection) => {
        this.maskY = `${
          this.baseOffset +
          this.activePanelIndex * this.liHeight -
          this.offsetCorrection
        }px`;
        this.cdr.markForCheck();
      });
  }

  updateNavbarDimensions(): void {
      if (this.li?.nativeElement) {
      this.baseOffset = this.li.nativeElement.offsetTop;
      this.liHeight = this.li.nativeElement.offsetHeight;

      const maskHeightCSS = getComputedStyle(this.navbar.nativeElement)
        .getPropertyValue('--mask-height')
        .trim();

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
  
  onSelectItem(panel: RightPanelSection) {
    this.activePanel.set(panel);
    this.activePanelChange.emit(panel);
  }

  closePanel() {
    this.panelService.closePanel();
    setTimeout(() => {
      this.router.navigate([{ outlets: { panel: null } }], {
        queryParamsHandling: 'preserve',
      });
      this.panelService.clearUrlStack();
    }, 300);
  }
  
}
