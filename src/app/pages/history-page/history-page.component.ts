import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SharedModule } from '../components/shared/shared.module';

import { Chart } from "chart.js/auto";

import { TitleCasePipe } from '@angular/common';

import { LoraService } from '../../services/lora.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Sensor } from '../../interfaces/lora.interface';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [SharedModule, TitleCasePipe],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.css',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPageComponent {

  //Recuperamos params del link
  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map(params => params['id'])
    )
  )

  public loraService = inject(LoraService);


  //-----
  datosTabla = signal<Sensor[]>([]);
  counterData = signal(10);
  private auxTimerID: any;

  private setDataTabla() {
    const fromAPI = this.loraService.historialAPI(this.query(), this.counterData());
    return fromAPI;
  }

  private aux: number = 0;

  getCircleData(valor: string) {
    switch (valor) {
      case 'temperatura':
        this.aux = this.loraService.temperatura().valor;
        break;
      case 'presion':
        this.aux = this.loraService.presion().valor;
        break;
      case 'co2':
        this.aux = this.loraService.co2().valor;
        break;
      case 'altura':
        this.aux = this.loraService.altura().valor;
        break;
    }
    return this.aux;
  }

  private unidad = { u: '', n: '' };

  getUnidades(valor: string) {
    switch (valor) {
      case 'temperatura':
        this.unidad = { u: 'K', n: 'Kelvin' };
        break;
      case 'presion':
        this.unidad = { u: 'atm', n: 'Atmosferas' };
        break;
      case 'co2':
        this.unidad = { u: 'CO2', n: 'Partes por Millon Co2' };
        break;
      case 'altura':
        this.unidad = { u: 'm', n: 'Metros' };
        break;
    }
    return this.unidad;
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
            label: this.query(),
            data: [],
            backgroundColor: 'blue',
            pointRadius:4
          }
        ]
      },
      options: {
        aspectRatio: 2.5,
      }

    });
  }

//Update
  updateChart(chart:any){
    this.datosTabla.set(this.setDataTabla());
    chart.data.labels=[];
    chart.data.datasets[0].data=[];
    this.datosTabla().forEach(element => {
      chart.data.labels.push(element.fecha);
      chart.data.datasets[0].data.unshift(element.valor);
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
