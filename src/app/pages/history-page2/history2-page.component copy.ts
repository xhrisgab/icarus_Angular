import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SharedModule } from '../components/shared/shared.module';

import { TitleCasePipe } from '@angular/common';

import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { LoraService } from '../../services/lora.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Coordenadas } from '../../interfaces/lora.interface';

@Component({
	selector: 'app-history2-page',
	standalone: true,
	imports: [SharedModule, CanvasJSAngularChartsModule, TitleCasePipe],
	templateUrl: './history2-page.component.html',
	styleUrl: './history2-page.component.css',
	//changeDetection: ChangeDetectionStrategy.OnPush,
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
	dps: any = [];
	chart: any;
	chartOptions = {
		exportEnabled: true,
		theme: "dark2",
		title: {
			text: "Histograma de " + this.query(),
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

		this.dps.push({ y: this.aux, label: this.setDataTabla()[this.setDataTabla().length-1].fecha, x: this.setDataTabla()[this.setDataTabla().length-1].id });

		if (this.dps.length >  this.counterData() ) {
			this.dps.shift();
		}
		
		/* var auxDatos:any =[];

		this.setDataTabla().forEach((elt) => {
			auxDatos.push({ y: elt.valor.x, label: elt.fecha, x: elt.id });
			console.log(elt);
			
		});
		this.dps=auxDatos;
			
			console.log(this.dps); */
		//console.log('de la API:',this.loraService.historialAPI(this.query()));

		this.datosTabla.set(this.setDataTabla());
		// console.log(this.dps);

		this.chart.render();
		setTimeout(this.updateChart, 1000); //Chart updated every 3 second
	}


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

	/* 	ngOnInit(): void {
			
			const dataAux=this.setDataTabla();
	
			dataAux.forEach( (elt) =>{
				this.dps.push({ y:elt.valor.x, label:elt.fecha, x:elt.id+1 });
			} )
		} */

}
