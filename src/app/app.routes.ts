import { Routes } from '@angular/router';
import { HomeContainerComponent } from './containers/home/home-container/home-container.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginContainerComponent } from './containers/auth/auth-container.component';
import { UserContainerComponent } from './containers/user/user-container/user-container.component';

export const routes: Routes = [
  {
    path: 'auth',
    data: {
      withNavbar: false,
    },
    component: LoginContainerComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeContainerComponent,
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    component: UserContainerComponent,
    data: {

    },
  },

  // Autres routes modales et panneaux
  // ...ModalsRouting,
  // ...PanelsRouting
];
