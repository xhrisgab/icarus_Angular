import { Component } from '@angular/core';
import { SharedModule } from '../components/shared/shared.module';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.css'
})
export class HistoryPageComponent {
  title = 'ng-chart';
  chart: any = [];

  ngOnInit() {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        // LABEL inferior o datos en eje x 
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            // Titulo superior
            label: '# of Votes',
            // Datos en eje Y, valor altura automatico.
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 2,
            borderColor: '#1F6A73'
          },
          {
            // Titulo superior
            label: '# of Decert',
            // Datos en eje Y, valor altura automatico.
            data: [19, 13, 7, 9, 4, 13],
            borderWidth: 2,
            borderColor: '#F27244'
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#F2B441',
            },
          },
        },
      },
    });
  }
}
