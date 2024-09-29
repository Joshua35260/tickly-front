import { ChangeDetectionStrategy, Component, signal, Signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { PrimaryNavbarComponent } from './shared/primary-navbar/primary-navbar.component';
import { filter, map } from 'rxjs';
import { PageHeaderComponent } from './shared/common/layout/page-header/page-header.component';
import { PanelService } from './core/services/panel.service';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { MetaService } from './core/services/meta.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormDialogComponent, FormDialogSize } from './shared/common/form-dialog/form-dialog.component';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet,
    CommonModule,
    PrimaryNavbarComponent,
    PageHeaderComponent,
    FormDialogComponent,
    SidebarModule,
    ToastModule,
    ConfirmDialogModule,
  ],

})
export class AppComponent {
  title = 'Tickly';
  showNavbar = signal<boolean>(true);

  panelAuxiliaryRoute: Signal<boolean>;
  modalAuxiliaryRoute: Signal<boolean>;

  classWidePanel = signal<boolean>(true);
  showHeader = signal<boolean>(true);
  showSmallNavbar = signal<boolean>(false);

  modalSize: Signal<FormDialogSize | undefined>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private translateService: TranslateService,
    private primengConfig: PrimeNGConfig,
    private destroyRef: DestroyRef,
    protected panelService: PanelService,
  ) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
   
        const currentRoute = this.router.routerState.root.firstChild;
        if (currentRoute) {
          this.showNavbar.set(currentRoute.snapshot.data['withNavbar'] !== false);
          this.showHeader.set(currentRoute.snapshot.data['showHeader'] !== false);
        }
      });

      
      // listen event navigation end for panel visibility based on route auxiliary outlet
      this.panelAuxiliaryRoute = toSignal(
      this.router.events.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(event => event instanceof NavigationEnd),
        map(() => {
          const panelRoute = this.route.snapshot.children.find(
            (c: ActivatedRouteSnapshot) => c.outlet === 'panel'
          );
          const isVisible = !!panelRoute;
          const widePanel = panelRoute?.data['widePanel'] ?? true;
          this.classWidePanel.set(widePanel);
          this.panelService.isPanelVisible.set(isVisible);
          return isVisible;
        })
      )
    );

    this.modalAuxiliaryRoute = toSignal(
      this.router.events.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(event => event instanceof NavigationEnd),
        map(
          () =>
            !!this.route.snapshot.children.find(
              (c: ActivatedRouteSnapshot) => c.outlet === 'modal'
            )
        )
      )
    );

    this.modalSize = toSignal(
      this.router.events.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(event => event instanceof NavigationEnd),
        map(() => {
          const modalRoute = this.route.snapshot.children.find(
            (c: ActivatedRouteSnapshot) => c.outlet === 'modal'
          );
          return modalRoute?.data['size'];
        })
      )
    );
  }

  ngOnInit() {
    // update title of application
    this.metaService.updateTitle();
    // define default language for translation
    this.translateService.setDefaultLang('fr');
    this.translateService.use('fr');

    // define primeng translation
    this.translateService
      .get('primeng')
      .subscribe((res) => this.primengConfig.setTranslation(res));
  }

  closeDialog() {
    this.router.navigate([{ outlets: { modal: null } }]);
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