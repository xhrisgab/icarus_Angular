import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SharedModule } from '../components/shared/shared.module';

import { TitleCasePipe } from '@angular/common';

import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { LoraService } from '../../services/lora.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Sensor } from '../../interfaces/lora.interface';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [SharedModule, CanvasJSAngularChartsModule, TitleCasePipe],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.css',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPageComponent {

	//Recuperamos params del link
	query = toSignal(
		inject(ActivatedRoute).params.pipe(
			map( params => params['id'])
		)
	)

  public loraService = inject(LoraService);


 //-----
	datosTabla = signal<Sensor[]>([]);
	counterData = signal(10);
   	dps:any = [];
	chart: any;
	chartOptions = {
	exportEnabled: true,
    theme: "dark2",
	  title: {
		text: "Histograma de "+this.query(),
	  },
    axisX: {
			labelFormatter: "",
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
		setTimeout(this.updateChart, 1000); //Chart updated every 3 second
	}

	updateChart = () => {

		this.dps.push({ y: this.setDataTabla()[this.setDataTabla().length-1].valor, label: this.setDataTabla()[this.setDataTabla().length-1].fecha, x: this.setDataTabla()[this.setDataTabla().length-1].id });

		if (this.dps.length >  this.counterData() ) {
			this.dps.shift();
		}
		//console.log('de la API:',this.loraService.historialAPI(this.query()));

		this.datosTabla.set(this.setDataTabla());
		// console.log(this.dps);

		this.chart.render();
		setTimeout(this.updateChart, 1000); //Chart updated every 3 second
	}


	private setDataTabla(){
		const fromAPI= this.loraService.historialAPI(this.query(),this.counterData());
		return fromAPI;
	}

    private aux:number=0;

    getCircleData(valor:string){
      switch(valor) {
        case 'temperatura':
          this.aux =this.loraService.temperatura().valor;
          break;
        case 'presion':
          this.aux =this.loraService.presion().valor;
          break;
        case 'co2':
          this.aux =this.loraService.co2().valor;
          break;
        case 'altura':
          this.aux =this.loraService.altura().valor;
          break;
      }
      return this.aux;
    }

	private unidad={u:'',n:''};

	getUnidades(valor:string){
		switch(valor) {
		  case 'temperatura':
			this.unidad={u:'K',n:'Kelvin'};
			break;
		  case 'presion':
			this.unidad={u:'atm',n:'Atmosferas'};
			break;
		  case 'co2':
			this.unidad={u:'CO2',n:'Dioxido de Carbono'};
			break;
		  case 'altura':
			this.unidad={u:'m',n:'Metros'};
			break;
		}
		return this.unidad;
	  }

	increaseBy(value: number) {
		this.counterData.update((current) => current + value);
	  }
}
