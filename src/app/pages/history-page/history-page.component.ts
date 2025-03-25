import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SharedModule } from '../components/shared/shared.module';

import { CanvasJS, CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { LoraService } from '../../services/lora.service';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [SharedModule, CanvasJSAngularChartsModule],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.css',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPageComponent {

  public loraService = inject(LoraService);
 //-----
   dps:any = [];
	chart: any;

	chartOptions = {
	  exportEnabled: true,
    theme: "dark2",
	  title: {
		text: "Angular Dynamic Chart"
	  },
    axisX: {
			labelFormatter: function (e:any) {
				return CanvasJS.formatDate( e.value, "DD MMM");
			},
			labelAngle: -20
		},
	  data: [{
		type: "line",
    //color: '#351387',
		dataPoints: this.dps,
	  }]
	}
	getChartInstance(chart: object) {
		this.chart = chart;
		setTimeout(this.updateChart, 3000); //Chart updated every 5 second
	}
	 updateChart = () => {
		this.dps.push({ y: this.loraService.temperatura().valor, label: this.loraService.temperatura().fecha, x: this.loraService.temperatura().id });

		if (this.dps.length >  10 ) {
			this.dps.shift();
		}
		console.log(this.dps);

		this.chart.render();
		setTimeout(this.updateChart, 5000); //Chart updated every 1 second
	}
}
