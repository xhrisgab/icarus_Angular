import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SharedModule } from '../components/shared/shared.module';

import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
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
   dps:any = []; // {x: 2, y: 13}, {x: 3, y: 18}, {x: 4, y: 20}, {x: 5, y: 17},{x: 6, y: 10}, {x: 7, y: 13}, {x: 8, y: 18}, {x: 9, y: 20}, {x: 10, y: this.loraService.chartTempData()[9].valor}];
	chart: any;
	
	chartOptions = {
	  exportEnabled: true,
	  title: {
		text: "Angular Dynamic Chart"
	  },
	  data: [{
		type: "line",
    //color: '#351387',
		dataPoints: this.dps, //[{x: this.loraService.chartTempData().map((x)=>x.hora),y: this.loraService.chartTempData().map((x)=>x.valor)}]
	  }]
	}
	getChartInstance(chart: object) {
		this.chart = chart;
		setTimeout(this.updateChart, 5000); //Chart updated every 5 second
	}
	 updateChart = () => {
		this.dps.push({ label: this.loraService.chartTempData()[this.loraService.chartTempData().length-1].hora, y: this.loraService.chartTempData()[this.loraService.chartTempData().length-1].valor});
 
		if (this.dps.length >  10 ) {
			this.dps.shift();
		}
		console.log(this.dps);
		
		this.chart.render();
		setTimeout(this.updateChart, 5000); //Chart updated every 1 second
	} 
}
