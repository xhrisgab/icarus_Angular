import { effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sensor, Coordenadas } from '../interfaces/lora.interface';
import { environment } from '../environments/environment.development';


import * as serialService from '../../assets/SerialService';


@Injectable({providedIn: 'root'})
export class LoraService {

  private http = inject(HttpClient)

    constructor() {
      this.loadTempFromDB();
    }

    //const serialS = new serialService();

    private timerID: any;
    private conTemporal:number = 0;

    // DATOS
    loraDate = new Date();

    //Habilita boton conectar o desconectar puerto COM
    linkLora = signal(false);

    //Verifica estado de la Bateria
    bateria = signal(100);


    //Seccion de datos del LORA
    acelerometro = signal<Coordenadas>({id:0, fecha: '', valor: {x:0,y:0,z:0}});
    giroscopio = signal<Coordenadas>({id:0, fecha: '', valor:{x:0,y:0,z:0}});

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

    private datosBDSensor = signal<Sensor[]>([]);

    //Funcion para actualizar y enviar datos a la API para almacenar
    addDataDB(){
      //PRUEBA DE JS
      //serialService.default.reqPrueba();
      this.connectPort();

      this.timerID=setInterval(()=>{
        this.linkLora.set(true);
        this.bateria.update((current)=> current = Number((Math.random()*100).toFixed(2)));
        this.loraDate = new Date();
        // Actualiza datos en tiempo real
        this.temperatura.update((temp)=> temp={
          id:this.conTemporal+1,
          fecha:this.loraDate.getDay()+"/"+this.loraDate.getMonth()+"/"+this.loraDate.getFullYear()+" "+this.loraDate.getHours()+":"+this.loraDate.getMinutes()+":"+this.loraDate.getSeconds(),
          //fecha: Date(),
          valor: this.bateria()
        })
        this.conTemporal++;

        //Almacena en BD
        this.http.post<Sensor>(`${ environment.backUrl }/temperatura`, this.temperatura())
        .subscribe( (resp) => console.log(resp) );

      },3000)
    }
    //Fucion Detener actualizacion de datos y desconecion del Puerto COM
    stopAdd(){
      clearInterval(this.timerID);
      this.desconnectPort()
      this.linkLora.set(false);
    }

    //Primera carga de datos desde la API
    private loadTempFromDB(){

      this.http.get<Coordenadas[]>(`${ environment.backUrl }/acelerometro`).subscribe((resp) =>{
        console.log(resp);
        this.acelerometro.set(resp[resp.length-1]);
      });

      this.http.get<Coordenadas[]>(`${ environment.backUrl }/giroscopio`).subscribe((resp) =>{
        console.log(resp);
        this.giroscopio.set(resp[resp.length-1]);
      });

      this.http.get<Sensor[]>(`${ environment.backUrl }/temperatura`).subscribe((resp) =>{
        console.log(resp);
        this.temperatura.set(resp[resp.length-1]);
      });

      this.http.get<Sensor[]>(`${ environment.backUrl }/presion`).subscribe((resp) =>{
        console.log(resp);
        this.presion.set(resp[resp.length-1]);
      });

      this.http.get<Sensor[]>(`${ environment.backUrl }/co2`).subscribe((resp) =>{
        console.log(resp);
        this.co2.set(resp[resp.length-1]);
      });

      this.http.get<Sensor[]>(`${ environment.backUrl }/altura`).subscribe((resp) =>{
        console.log(resp);
        this.altura.set(resp[resp.length-1]);
      });

    }

    historialAPI(pagina:string){

      this.http
        .get<Sensor[]>(`${ environment.backUrl }/${pagina}/`,{
          params: {
            _sort:'id',
            _order:'desc',
            _end:10
          }
        })
        .subscribe((resp) =>{
          this.datosBDSensor.set(resp);
        //console.log(resp);
      });
      return this.datosBDSensor();
    }

    async connectPort(){
      const port = await serialService.default.reqPort();
      console.log(port);
      await serialService.default.connect(9600);

    }

    async desconnectPort(){
      await serialService.default.disconnect();
    }

}
