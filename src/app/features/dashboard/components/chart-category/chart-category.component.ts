import { CommonModule } from '@angular/common';
import { Component, OnInit, model } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TicketCountByCategory } from '../../dashboard.component';
import { CategoryLabels } from '@app/core/models/enums/category.enum';

@Component({
  selector: 'app-chart-category',
  templateUrl: './chart-category.component.html',
  styleUrls: ['./chart-category.component.scss'],
  standalone: true,
  imports: [CommonModule, ChartModule],
})
export class ChartCategoryComponent implements OnInit {
  ticketCountByCategory = model<TicketCountByCategory[]>([]);
  data: any;
  options: any;

  ngOnInit() {
    // Obtenir le style du document pour les couleurs
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    // Extraire les catégories et les comptes
    const categories = this.ticketCountByCategory().map(item => CategoryLabels[item.category]);
    const counts = this.ticketCountByCategory().map(item => item.count);

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