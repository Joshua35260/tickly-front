import { Routes } from '@angular/router';
import { HomeContainerComponent } from './containers/home/home-container/home-container.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginContainerComponent } from './containers/auth/auth-container.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: LoginContainerComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeContainerComponent,
    children: [

      // {
      //   path: 'contacts',
      //   loadChildren: () => import('./contacts/contacts-routing.container.module').then(m => m.ContactsRoutingContainerModule),
      //   data: {
      //     showSecondaryNavBar: true
      //   }
      // },

      // Autres routes modales et panneaux
      // ...ModalsRouting,
      // ...PanelsRouting
    ],
    // canActivateChild: [AuthGuard]
  }
];