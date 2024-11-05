import { CommonModule } from '@angular/common';
import { Component, input, model, OnInit } from '@angular/core';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { ChartModule } from 'primeng/chart';
import { AverageTicketsCreated } from '../../dashboard.component';
@Component({
  selector: 'app-chart-average-ticket',
  templateUrl: './chart-average-ticket.component.html',
  styleUrls: ['./chart-average-ticket.component.scss'],
  standalone: true,
  imports: [CommonModule, WidgetTitleComponent, ChartModule],
})
export class ChartAverageTicketComponent implements OnInit {
  averageTicketsCreated = model<AverageTicketsCreated>(null);
  basicData: any;
  basicOptions: any;

  constructor() {}

  ngOnInit() {
    this.calculateAverageTickets();
    this.initializeChart();
  }
  calculateAverageTickets() {
    // Vérifiez que les données d'entrée sont disponibles et définies
    const averageData = this.averageTicketsCreated();

    if (averageData) {
        // Utilisez les valeurs passées à partir de averageTicketsCreated
        const averagePerMonth = averageData.averagePerMonth || 0;
        const averagePerWeek = averageData.averagePerWeek || 0;
        const averagePerYear = averageData.averagePerYear || 0;

        // Mettez à jour la structure des données pour le graphique
        this.basicData = {
            labels: ['Average per Month', 'Average per Week', 'Average per Year'],
            datasets: [
                {
                    label: 'Average Tickets Created',
                    data: [averagePerMonth, averagePerWeek, averagePerYear],
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                    ],
                    borderWidth: 1,
                },
            ],
        };

        // Initialisez le graphique
        this.initializeChart();
    } else {
        console.warn('Average tickets data is not available.');
    }
}


  initializeChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicData = {
      labels: ['Tickets par mois', 'Tickets par semaine', 'Tickets par an'],
      datasets: [
        {
          label: 'Moyennes des tickets créés',
          data: [
            this.averageTicketsCreated().averagePerMonth,
            this.averageTicketsCreated().averagePerWeek,
            this.averageTicketsCreated().averagePerYear,
          ],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
          ],
          borderWidth: 1,
        },
      ],
    };

    this.basicOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

  }
}
