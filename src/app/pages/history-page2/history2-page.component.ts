import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SharedModule } from '../components/shared/shared.module';

import { Chart } from "chart.js/auto";

import { TitleCasePipe } from '@angular/common';

import { LoraService } from '../../services/lora.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Coordenadas } from '../../interfaces/lora.interface';

@Component({
	selector: 'app-history2-page',
	standalone: true,
	imports: [SharedModule, TitleCasePipe],
	templateUrl: './history2-page.component.html',
	styleUrl: './history2-page.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class History2PageComponent {

	//Recuperamos params del link
	query = toSignal(
		inject(ActivatedRoute).params.pipe(
			map(params => params['id'])
		)
	)
	// inyectamos el servicio
	public loraService = inject(LoraService);


	//-----
	datosTabla = signal<Coordenadas[]>([]);
	counterData = signal(10);


	private setDataTabla() {
		const fromAPI = this.loraService.historialAPICoordenadas(this.query(), this.counterData());
		return fromAPI;
	}

	private aux: number = 0;

	getCircleData(valor: string) {
		switch (valor) {
			case 'acelerometro':
				this.aux = this.loraService.acelerometro().valor.z;
				break;
			case 'giroscopio':
				this.aux = this.loraService.giroscopio().valor.x;
				break;
		}
		return this.aux;
	}
	increaseBy(value: number) {
		this.counterData.update((current) => current + value);
	}


	///chart

	public chart: any;

	createChart(){

		this.chart = new Chart("MyChart", {
		  type: 'line', //this denotes tha type of chart
	
		  data: {// values on X-Axis
			labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13','2022-05-14', '2022-05-15', '2022-05-16','2022-05-17' ], 
			   datasets: [
			  {
				label: "Sales",
				data: ['467','576', '572', '79', '92','574', '573', '576'],
				backgroundColor: 'blue'
			  },
			  {
				label: "Profit",
				data: ['542', '542', '536', '327', '17','0.00', '538', '541'],
				borderColor:'#36A2EB',
				backgroundColor: 'gray'
			  }  
			]
		  },
		  options: {
			aspectRatio:2.5,
		  }
	
		});
	  }

	// init
	ngOnInit(): void {

		console.log('Genero CHART');
		this.createChart();
	}

}
