import { Injectable, signal } from '@angular/core';
import { Sensor, Coordenadas } from '../interfaces/lora.interface';

@Injectable({providedIn: 'root'})
export class LoraService {
    constructor() { }


    // DATOS
    loraDate = new Date();
    bateria = signal(85);
    acelerometro = signal<Coordenadas>({x:21.51,y:0.52,z:10.48});
    giroscopio = signal<Coordenadas>({x:4.23,y:21.5,z:8.51});

    sensores = signal<Sensor[]>([
      {
        nombre: 'Temperatura',
        unidad: 'K',
        valor: 253
      },
      {
        nombre: 'Presion',
        unidad: 'atm',
        valor: 0.98
      },
      {
        nombre: 'CO2',
        unidad: 'ppm',
        valor: 2.35
      },
      {
        nombre: 'Altitud',
        unidad: 'm',
        valor: 238.50
      },
    ]);


}
