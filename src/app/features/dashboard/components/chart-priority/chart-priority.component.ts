import { CommonModule } from '@angular/common';
import { Component, model, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TicketCountByPriority } from '../../dashboard.component';
import { PriorityLabels } from '@app/core/models/enums/priority.enum';

@Component({
  selector: 'app-chart-priority',
  templateUrl: './chart-priority.component.html',
  styleUrls: ['./chart-priority.component.scss'],
  standalone: true,
  imports: [CommonModule, ChartModule],
})
export class ChartPriorityComponent implements OnInit {

  ticketCountByPriority = model<TicketCountByPriority[]>([]);
  data: any;
  options: any;

  ngOnInit() {


    // Obtenir le style du document pour les couleurs
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    // Extraire les catégories et les comptes
    const categories = this.ticketCountByPriority().map(item => PriorityLabels[item.priority]);
    const counts = this.ticketCountByPriority().map(item => item.count);

    // Configurez les données pour le graphique
    this.data = {
      labels: categories, // Utilisez les catégories extraites
      datasets: [
        {
          data: counts, // Utilisez les comptes extraits
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'), 
            documentStyle.getPropertyValue('--yellow-500'), 
            documentStyle.getPropertyValue('--green-500'),
            // Ajoutez plus de couleurs si nécessaire pour toutes les catégories
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'), 
            documentStyle.getPropertyValue('--yellow-400'), 
            documentStyle.getPropertyValue('--green-400'),
          ]
        }
      ]
    };

    // Configurez les options du graphique
    this.options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor // Utilisez la couleur du texte du document
          }
        }
      }
    };
  }


}
