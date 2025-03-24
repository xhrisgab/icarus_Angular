import { effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sensor, Coordenadas } from '../interfaces/lora.interface';
import { environment } from '../environments/environment.development';

@Injectable({providedIn: 'root'})
export class LoraService {

  private http = inject(HttpClient)

    constructor() {
      this.loadTempFromDB();
    }

    private timerID: any;
    private conTemporal:number = 0;

    // DATOS
    loraDate = new Date();
    linkLora = signal(false);
    bateria = signal(100);
    acelerometro = signal<Coordenadas>({x:21.51,y:0.52,z:10.48});
    giroscopio = signal<Coordenadas>({x:4.23,y:21.5,z:8.51});

    temperatura = signal<Sensor>({
      id:0,
      fecha: Date(),
      valor: 0
    });

    presion = signal<Sensor>({
      id:0,
      fecha: Date(),
      valor: 0
    });
    co2 = signal<Sensor>({
      id: 0,
      fecha: Date(),
      valor: 0
    });
    altura = signal<Sensor>({
      id: 0,
      fecha: Date(),
      valor: 0
    });


    addDataDB(){

      this.timerID=setInterval(()=>{
        this.linkLora.set(true);
        this.bateria.update((current)=> current = Number((Math.random()*100).toFixed(2)));

        // Actualiza datos en tiempo real
        this.temperatura.update((temp)=> temp={
          id:this.conTemporal+1,
          fecha:Date(),
          valor: this.bateria()
        })
        this.conTemporal++;

        //Almacena en BD
        this.http.post<Sensor>(`${ environment.backUrl }/temperatura`, this.temperatura())
        .subscribe( (resp) => console.log(resp) );
  
      },3000)
    }

    stopAdd(){
      clearInterval(this.timerID);
      this.linkLora.set(false);
    }

    saveTemperaturaToLS = effect( ()=> {
        localStorage.setItem('temp', JSON.stringify(this.temperatura()));
    });


    private loadTempFromDB(){
      this.http.get<Sensor[]>(`${ environment.backUrl }/temperatura`).subscribe((resp) =>{
        console.log(resp);
        this.temperatura.set(resp[resp.length-1]);
      });
    }
}
