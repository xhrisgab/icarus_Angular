import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SharedModule } from '../components/shared/shared.module';

import Chart from 'chart.js/auto';
import { LoraService } from '../../services/lora.service';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPageComponent {

  public loraService = inject(LoraService);

  //title = 'ng-chart';
  //https://valor-software.com/ng2-charts/line
  chart: any = [];

  ngOnInit() {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        // LABEL inferior o datos en eje x 
        labels: this.loraService.chartTempData().map((x)=>x.hora),
        datasets: [
          {
            // Titulo superior
            label: '# of Votes',
            // Datos en eje Y, valor altura automatico.
            data: this.loraService.chartTempData().map((x)=>x.valor),
            borderWidth: 2,
            borderColor: '#1F6A73',
            fill:'origin'
          },
          /* {
            // Titulo superior
            label: '# of Decert',
            // Datos en eje Y, valor altura automatico.
            data: [19, 13, 7, 9, 4, 13],
            borderWidth: 2,
            borderColor: '#F27244'
          }, */
        ],
      },
      options: {
        elements:{
          line:{
            tension:0.1,
          }
        },
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
