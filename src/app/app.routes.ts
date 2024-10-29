import { Routes } from '@angular/router';
import { HomeContainerComponent } from './containers/home/home-container/home-container.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginContainerComponent } from './containers/auth/auth-container.component';
import { UserListContainerComponent } from './containers/user-list/user-list-container.component';
import { TicketListContainerComponent } from './containers/ticket-list/ticket-list-container.component';
import { StructureListContainerComponent } from './containers/structure-list/structure-list-container.component';

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
  {
    path: 'tickets',
    canActivate: [AuthGuard],
    component: TicketListContainerComponent,
    data: {
      title: 'Tickets',
      header: {
        title: 'Gestion des tickets',
        description: 'Gérer les tickets de la plateforme',
      },
    },
  },
  {
    path: 'structures',
    canActivate: [AuthGuard],
    component: StructureListContainerComponent,
    data: {
      title: 'Structures',
      header: {
        title: 'Gestion des structures',
        description: 'Gérer les structures de la plateforme',
      },
    },
  },

  // Others routes (auxiliary with outlet in url)


  // Panels
  {
    path: 'user/view/:id/:section',
    outlet: 'panel',
    loadComponent: () => import('./containers/panels/user-view-container/user-view.container.component').then(c => c.UserViewContainerComponent)
  },
  {
    path: 'ticket/view/:id/:section',
    outlet: 'panel',
    loadComponent: () => import('./containers/panels/ticket-view-container/ticket-view.container.component').then(c => c.TicketViewContainerComponent)
  },
  {
    path: 'structure/view/:id/:section',
    outlet: 'panel',
    loadComponent: () => import('./containers/panels/structure-view-container/structure-view.container.component').then(c => c.StructureViewContainerComponent)
  },
  

  // ...ModalsRouting,
  {
    path: 'user/edit/:id',
    outlet: 'modal',
    loadComponent: () => import('./containers/modals/user-edit-container/user-edit.container.component').then(c => c.UserEditContainerComponent)
  },
  {
    path: 'structure/edit/:id',
    outlet: 'modal',
    loadComponent: () => import('./containers/modals/structure-edit-container/structure-edit.container.component').then(c => c.StructureEditContainerComponent)
  },
  {
    path: 'structure/create',
    outlet: 'modal',
    loadComponent: () => import('./containers/modals/structure-create-container/structure-create.container.component').then(c => c.StructureCreateContainerComponent)
  },
  {
    path: 'ticket/edit/:id',
    outlet: 'modal',
    loadComponent: () => import('./containers/modals/ticket-edit-container/ticket-edit.container.component').then(c => c.TicketEditContainerComponent)
  },
  {
    path: 'ticket/create',
    outlet: 'modal',
    loadComponent: () => import('./containers/modals/ticket-create-container/ticket-create.container.component').then(c => c.TicketCreateContainerComponent)
  },
];
