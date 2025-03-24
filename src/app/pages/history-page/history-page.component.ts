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
   dps:any = [];
	chart: any;
	
	chartOptions = {
	  exportEnabled: true,
	  title: {
		text: "Angular Dynamic Chart"
	  },
	  data: [{
		type: "line",
    //color: '#351387',
		dataPoints: this.dps,
	  }]
	}
	getChartInstance(chart: object) {
		this.chart = chart;
		setTimeout(this.updateChart, 5000); //Chart updated every 5 second
	}
	 updateChart = () => {
		this.dps.push({ label: this.loraService.temperatura().fecha, y: this.loraService.temperatura().valor, x: this.loraService.temperatura().id });
 
		if (this.dps.length >  10 ) {
			this.dps.shift();
		}
		console.log(this.dps);
		
		this.chart.render();
		setTimeout(this.updateChart, 5000); //Chart updated every 1 second
	} 
}
