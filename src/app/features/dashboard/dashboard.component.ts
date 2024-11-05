import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { TicketService } from '@app/core/services/ticket.service';
import { UserRowComponent } from '../user/components/user-row/user-row.component';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { WidgetComponent } from '@app/shared/common/widget/widget.component';
import { Router } from '@angular/router';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { User } from '@app/core/models/user.class';
import { Structure } from '@app/core/models/structure.class';
import { StructureRowComponent } from '../structure/components/structure-row/structure-row.component';
import { TicketOpenComponent } from './components/ticket-open/ticket-open.component';
import { ChartAverageTicketComponent } from './components/chart-average-ticket/chart-average-ticket.component';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { ChartCategoryComponent } from './components/chart-category/chart-category.component';
import { ChartPriorityComponent } from './components/chart-priority/chart-priority.component';
interface top5Users {
  numberOfTickets: number;
  user: User;
}
interface top5Structures {
  numberOfTickets: number;
  structure: Structure;
}
export interface AverageTicketsCreated {
  averagePerMonth: number;
  averagePerWeek: number;
  averagePerYear: number;
}

export interface TicketCountByCategory {
  category: string;
  count: number;
}

export interface TicketCountByPriority {
  priority: string;
  count: number;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TicketOpenComponent,
    UserRowComponent,
    StructureRowComponent,
    WidgetTitleComponent,
    WidgetComponent,
    ChartAverageTicketComponent,
    ChartCategoryComponent,
    ChartPriorityComponent,
    TabMenuModule,
  ],
})
export class DashboardComponent implements OnInit {
  
  stats = signal<any>(null);
  top5Users = signal<top5Users[]>([]);
  top5Structures = signal<top5Structures[]>([]);
  averageTicketsCreated = signal<AverageTicketsCreated>(null);
  ticketCountByCategory = signal<TicketCountByCategory[]>([]);
  ticketCountByPriority= signal<TicketCountByPriority[]>([]);

  activeGrid = signal<number>(0);
  items: MenuItem[];
  constructor(private ticketService: TicketService, private router: Router) {
    {
      this.items = [
        {
          label: 'Données générales',
          icon: 'icon-dashboard',
          command: () => this.navigateTo(0),
        },
        {
          label: 'Fréquence des tickets',
          icon: 'pi pi-chart-line',
          command: () => this.navigateTo(1),
        },
        {
          label: 'Tickets par categories/priorités',
          icon: 'pi pi-chart-pie',
          command: () => this.navigateTo(2),
        },
      ];
  }
}
navigateTo(gridIndex: number) {
  this.activeGrid.set(gridIndex);
  
  if (gridIndex ===1 ) {
    setTimeout(() => {
      const targetElement = document.querySelector('app-chart-average-ticket');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn('L’élément cible n’a pas été trouvé.');
      }
    }, 100);
  } else if (gridIndex === 2) {
    setTimeout(() => {
      const targetElement = document.querySelector('app-chart-category');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn('L’élément cible n’a pas été trouvé.');
      }
    }, 100);
  }
}

  ngOnInit() {
    this.getStats();
  }
  getStats() {
    this.ticketService.getTicketStats().subscribe((data) => {

      this.stats.set(data);

      // Extracting average tickets created
      this.averageTicketsCreated.set({
        averagePerMonth: data.averageTicketsCreated.averagePerMonth,
        averagePerWeek: data.averageTicketsCreated.averagePerWeek,
        averagePerYear: data.averageTicketsCreated.averagePerYear,
      });

      // Extracting tickets count by category
      this.ticketCountByCategory.set(
        data.ticketsCountByCategory.map((categoryData) => ({
          category: categoryData.category,
          count: categoryData.count,
        }))
      );

      // Extracting tickets count by priority
      this.ticketCountByPriority.set(
        data.ticketsCountByPriority.map((priorityData) => ({
          priority: priorityData.priority,
          count: priorityData.count,
        }))
      );
      // Extracting top 5 users
      const topUsers = data.topTicketsByUser
        .map((userData) => ({
          numberOfTickets: userData._count.id,
          user: userData.author,
        }))
        .slice(0, 5);

      this.top5Users.set(topUsers);

      // Extracting top 5 structures
      const topStructures = data.topTicketsByStructure
        .map((structureData) => ({
          numberOfTickets: structureData._count.id,
          structure: structureData.structure,
        }))
        .slice(0, 5);

      this.top5Structures.set(topStructures);
    });
  }

  displayUserView(userId: number) {
    this.router.navigate(
      [
        {
          outlets: {
            panel: [
              'user',
              'view',
              userId,
              RightPanelSection.RIGHT_PANEL_SECTION_INFO,
            ],
          },
        },
      ],
      { queryParamsHandling: 'preserve' }
    );
  }
  displayStructureView(structureId: number) {
    this.router.navigate(
      [
        {
          outlets: {
            panel: [
              'structure',
              'view',
              structureId,
              RightPanelSection.RIGHT_PANEL_SECTION_INFO,
            ],
          },
        },
      ],
      { queryParamsHandling: 'preserve' }
    );
  }
}
