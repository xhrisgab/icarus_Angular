import { Injectable, signal } from '@angular/core';

interface Coordenadas{
  x:number;
  y:number;
  z:number;
}

@Injectable({providedIn: 'root'})
export class LoraService {
    constructor() { }

    loraDate = new Date();
    bateria = signal(85);
    acelerometro = signal<Coordenadas>({x:21.51,y:0.52,z:10.48});
    giroscopio = signal<Coordenadas>({x:4.23,y:21.5,z:8.51});


}
