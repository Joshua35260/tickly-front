import { Routes } from '@angular/router';
import { HomeContainerComponent } from './containers/home/home-container/home-container.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginContainerComponent } from './containers/auth/auth-container.component';
import { UserListContainerComponent } from './containers/user-list/user-list-container.component';


export const routes: Routes = [
  {
    path: 'auth',
    data: {
      title: 'Authentification',
      showHeader: false,
      withNavbar: false,
    },
    component: LoginContainerComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeContainerComponent,
    data: {
      showHeader: true,
      title: 'Tableau de bord',
      header: {
        title: 'Outil de planification',
        description: 'Planifier les interventions',
      },
    },
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    component: UserListContainerComponent,
    data: {
      title: 'Utilisateurs',
      header: {
        title: 'Gestion des utilisateurs',
        description: 'Gérer les utilisateurs de la plateforme',
      },
    },
  },



  // Others routes (auxiliary with outlet in url)

  // Panels
  {
    path: 'user/view/:id/:section',
    outlet: 'panel',
    loadComponent: () => import('./containers/panels/user-view-container/user-view.container.component').then(c => c.UserViewContainerComponent) // Assurez-vous que le chemin est correct
  },
  

  // ...ModalsRouting,
];
