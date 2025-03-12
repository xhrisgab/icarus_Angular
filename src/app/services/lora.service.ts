import { Injectable, signal } from '@angular/core';
import { Sensor, Coordenadas } from '../interfaces/lora.interface';

@Injectable({providedIn: 'root'})
export class LoraService {
    constructor() {}

    private timerID: any;

    // DATOS
    loraDate = new Date();
    linkLora = signal(false);
    bateria = signal(100);
    acelerometro = signal<Coordenadas>({x:21.51,y:0.52,z:10.48});
    giroscopio = signal<Coordenadas>({x:4.23,y:21.5,z:8.51});

    temperatura = signal<Sensor>({
      hora: Date(),
      paquete: 0,
      unidad: 'K',
      valor: 0
    });
    presion = signal<Sensor>({
      hora: Date(),
      paquete: 0,
      unidad: 'atm',
      valor: 0
    });
    co2 = signal<Sensor>({
      hora: Date(),
      paquete: 0,
      unidad: 'ppm',
      valor: 0
    });
    altura = signal<Sensor>({
      hora: Date(),
      paquete: 0,
      unidad: 'm',
      valor: 0
    });

    addDataDB(){

      this.timerID=setInterval(()=>{
        this.linkLora.set(true);
        this.bateria.update((current)=> current = Math.random()*100);
        console.log(this.bateria(), this.timerID);   
      },2000)
    }

    stopAdd(){
      clearInterval(this.timerID);
      this.linkLora.set(false);
    }

}
