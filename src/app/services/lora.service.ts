import { effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sensor, Coordenadas } from '../interfaces/lora.interface';
import { environment } from '../environments/environment.development';


import * as serialService from '../../assets/SerialService';


@Injectable({ providedIn: 'root' })
export class LoraService {

  private http = inject(HttpClient)

  constructor() {
    this.loadTempFromDB();
  }

  //const serialS = new serialService();

  private timerID: any;
  private conTemporal: number = 0;

  // DATOS
  loraDate = new Date();
  fechaApi = "";

  //Habilita boton conectar o desconectar puerto COM
  linkLora = signal(false);

  //Verifica estado de la Bateria
  bateria = signal(100);


  //Seccion de datos del LORA
  acelerometro = signal<Coordenadas>({ id: 0, fecha: '', valor: { x: 0, y: 0, z: 0 } });
  giroscopio = signal<Coordenadas>({ id: 0, fecha: '', valor: { x: 0, y: 0, z: 0 } });

  temperatura = signal<Sensor>({
    id: 0,
    fecha: Date(),
    valor: 0
  });

  presion = signal<Sensor>({
    id: 0,
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
  addDataDB() {

    //PRUEBA DE JS
    //serialService.default.reqPrueba();

    this.connectPort()
      .then(() => {
        this.linkLora.set(true);
        this.timerID = setInterval(() => {
        console.log(serialService.default.getCache());

        this.bateria.update((current) => current - 1); //bateria seteada descuenta en 1
        this.conTemporal++;
        this.loraDate = new Date();
        this.fechaApi = this.loraDate.getDay() + "/" + this.loraDate.getMonth() + "/" + this.loraDate.getFullYear() + " " + this.loraDate.getHours() + ":" + this.loraDate.getMinutes() + ":" + this.loraDate.getSeconds();

        this.saveAndUpdateData(serialService.default.getCache())
        }, 2000)   //  <----- Modificar tiempo para almacenar y mostrar datos!!!! ------
      })
      .catch(err => console.log(err));

  }
  //Fucion Detener actualizacion de datos y desconecion del Puerto COM
  stopAdd() {
    this.disconnectPort()
    clearInterval(this.timerID);
    this.linkLora.set(false);
  }

  //Primera carga de datos desde la API
  private loadTempFromDB() {

    this.http.get<Coordenadas[]>(`${environment.backUrl}/acelerometro`).subscribe((resp) => {
      console.log(resp);
      this.acelerometro.set(resp[resp.length - 1]);
    });

    this.http.get<Coordenadas[]>(`${environment.backUrl}/giroscopio`).subscribe((resp) => {
      console.log(resp);
      this.giroscopio.set(resp[resp.length - 1]);
    });

    this.http.get<Sensor[]>(`${environment.backUrl}/temperatura`).subscribe((resp) => {
      console.log(resp);
      this.temperatura.set(resp[resp.length - 1]);
    });

    this.http.get<Sensor[]>(`${environment.backUrl}/presion`).subscribe((resp) => {
      console.log(resp);
      this.presion.set(resp[resp.length - 1]);
    });

    this.http.get<Sensor[]>(`${environment.backUrl}/co2`).subscribe((resp) => {
      console.log(resp);
      this.co2.set(resp[resp.length - 1]);
    });

    this.http.get<Sensor[]>(`${environment.backUrl}/altura`).subscribe((resp) => {
      console.log(resp);
      this.altura.set(resp[resp.length - 1]);
    });

  }

  //Retorna los ultimos registros de la API, por defecto 10
  historialAPI(pagina: string, cantidad: number = 10) {

    this.http
      .get<Sensor[]>(`${environment.backUrl}/${pagina}/`, {
        params: {
          _sort: 'id',
          _order: 'desc',
          _end: cantidad
        }
      })
      .subscribe((resp) => {
        this.datosBDSensor.set(resp);
        //console.log(resp);
      });
    return this.datosBDSensor();
  }

  //Llama funcion conectar de SerialService - Hendrik
  async connectPort() {
    const port = await serialService.default.reqPort();
    console.log(port);
    await serialService.default.connect(9600)
      .then((resp) => {
        console.log(resp);
      })
      .catch(err => console.log(err))

  }
  //Llama funcion disconnect de SerialService - Hendrik
  async disconnectPort() {
    await serialService.default.disconnect();
  }

  // Actualiza data para Interfaz y envia info a la API para almacenar
  saveAndUpdateData(data: string | any[]) {
    // Actualiza y formatea datos
    this.temperatura.update((temp) => temp = { id: this.conTemporal, fecha: this.fechaApi, valor: this.bateria() });
    this.presion.update((temp) => temp = { id: this.conTemporal, fecha: this.fechaApi, valor: this.bateria() });
    this.co2.update((temp) => temp = { id: this.conTemporal, fecha: this.fechaApi, valor: this.bateria() });
    this.altura.update((temp) => temp = { id: this.conTemporal, fecha: this.fechaApi, valor: this.bateria() });
    this.acelerometro.update((temp) => temp = { id: this.conTemporal, fecha: this.fechaApi, valor: { x: 0, y: 0, z: 0 } });
    this.giroscopio.update((temp) => temp = { id: this.conTemporal, fecha: this.fechaApi, valor: { x: 0, y: 0, z: 0 } });

    //Almacena en BD de la API
    this.http.post<Sensor>(`${environment.backUrl}/temperatura`, this.temperatura())
      .subscribe((resp) => console.log(resp));
    this.http.post<Sensor>(`${environment.backUrl}/presion`, this.presion())
      .subscribe((resp) => console.log(resp));
    this.http.post<Sensor>(`${environment.backUrl}/co2`, this.co2())
      .subscribe((resp) => console.log(resp));
    this.http.post<Sensor>(`${environment.backUrl}/altura`, this.altura())
      .subscribe((resp) => console.log(resp));
    this.http.post<Sensor>(`${environment.backUrl}/acelerometro`, this.acelerometro())
      .subscribe((resp) => console.log(resp));
    this.http.post<Sensor>(`${environment.backUrl}/giroscopio`, this.giroscopio())
      .subscribe((resp) => console.log(resp));
  }

}
