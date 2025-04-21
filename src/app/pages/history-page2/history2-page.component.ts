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
  counterData = signal(20);
  private auxTimerID:any;


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

  createChart() {

    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: [],
        datasets: [
          {
            label: "Eje X",
            data: [],
            backgroundColor: 'blue',
            pointRadius:4
          },
          {
            label: "Eje Y",
            data: [],
            //borderColor:'#36A2EB',
            backgroundColor: 'gray',
            pointRadius:4
          },
          {
            label: "Eje Z",
            data: [],
            //borderColor:'#36A2EB',
            backgroundColor: 'red',
            pointRadius:4
          },
        ]
      },
      options: {
        aspectRatio: 4.5,
      }

    });
  }

//Update
  updateChart(chart:any){
    this.datosTabla.set(this.setDataTabla());
    chart.data.labels=[];
    chart.data.datasets[0].data=[];
    chart.data.datasets[1].data=[];
    chart.data.datasets[2].data=[];
    this.datosTabla().forEach(element => {
      chart.data.labels.unshift(element.fecha);
      chart.data.datasets[0].data.unshift(element.valor.x);
      chart.data.datasets[1].data.unshift(element.valor.y);
      chart.data.datasets[2].data.unshift(element.valor.z);
    });

    console.log(chart.data.labels);

    chart.update();
  }

  //Init interval
  initUpdateInteval():void {

    this.auxTimerID = setInterval(() =>{
      this.updateChart(this.chart);

    },1000);
  }

  // init
  ngOnInit(): void {

    // console.log('Genero CHART');
    this.createChart();
    this.initUpdateInteval();
  }

  ngOnDestroy(){
    // console.log('Destroyed');

    clearInterval(this.auxTimerID);
  }

}
