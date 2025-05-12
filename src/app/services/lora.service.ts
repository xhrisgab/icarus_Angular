import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sensor, Coordenadas, Logs } from '../interfaces/lora.interface';
import { environment } from '../environments/environment.development';


import * as serialService from '../../assets/SerialService';


@Injectable({ providedIn: 'root' })
export class LoraService {

  private http = inject(HttpClient);
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor() {
    this.loadTempFromDB();
  }


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
  private datosBDCoordenadas = signal<Coordenadas[]>([]);

  //Funcion para actualizar y enviar datos a la API para almacenar
  addDataDB() {

    //PRUEBA DE JS
    //serialService.default.reqPrueba();

    this.connectPort()
      .then(() => {
        // Lugar de recepcion de datos de SERIAL - variable data
        // console.log(data);
        //this.saveAndUpdateData (data);

        
        this.linkLora.set(true);
        this.timerID = setInterval(() => {
        console.log(serialService.default.getCache()[serialService.default.getCache().length-1]);

        this.bateria.update((current) => current - 1); //bateria seteada descuenta en 1
        this.conTemporal++;
        this.loraDate = new Date();
        this.fechaApi = this.loraDate.getDay() + "/" + this.loraDate.getMonth() + "/" + this.loraDate.getFullYear() + " " + this.loraDate.getHours() + ":" + this.loraDate.getMinutes() + ":" + this.loraDate.getSeconds();
          
        //LLAMA CACHE DEL SERIAL ************* VERIFICAR para usar data o getCache **********
        this.saveAndUpdateData(serialService.default.getCache()[serialService.default.getCache().length-1]);

        }, 1000)   //  <----- Modificar tiempo para almacenar y mostrar datos!!!! ------
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

    this.http.get<Coordenadas[]>(`${environment.backUrl}/acelerometro`,{responseType: 'json', headers: {'Accept':'application/json', "ngrok-skip-browser-warning": "69420"}}).subscribe((resp) => {
      console.log(resp);
      //this.acelerometro.set(resp[resp.length - 1]);
    });

    this.http.get<Coordenadas[]>(`${environment.backUrl}/giroscopio`,{responseType: 'json', headers: {'Accept':'application/json', "ngrok-skip-browser-warning": "69420"}}).subscribe((resp) => {
      console.log(resp);
      this.giroscopio.set(resp[resp.length - 1]);
    });

    this.http.get<Sensor[]>(`${environment.backUrl}/temperatura`,{responseType: 'json', headers: {'Accept':'application/json', "ngrok-skip-browser-warning": "69420"}}).subscribe((resp) => {
      console.log(resp);
      this.temperatura.set(resp[resp.length - 1]);
    });

    this.http.get<Sensor[]>(`${environment.backUrl}/presion`,{responseType: 'json', headers: {'Accept':'application/json', "ngrok-skip-browser-warning": "69420"}}).subscribe((resp) => {
      console.log(resp);
      this.presion.set(resp[resp.length - 1]);
    });

    this.http.get<Sensor[]>(`${environment.backUrl}/co2`,{responseType: 'json', headers: {'Accept':'application/json', "ngrok-skip-browser-warning": "69420"}}).subscribe((resp) => {
      console.log(resp);
      this.co2.set(resp[resp.length - 1]);
    });

    this.http.get<Sensor[]>(`${environment.backUrl}/altura`,{responseType: 'json', headers: {'Accept':'application/json', "ngrok-skip-browser-warning": "69420"}}).subscribe((resp) => {
      console.log(resp);
      this.altura.set(resp[resp.length - 1]);
    });

  }

  //Retorna los ultimos registros de la API, por defecto 10 ---- SENSOR
  historialAPI(pagina: string, cantidad: number = 10) {

    this.http
      .get<Sensor[]>(`${environment.backUrl}/${pagina}/`, {
        responseType: 'json', headers: {'Accept':'application/json', "ngrok-skip-browser-warning": "69420"},
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

  //Retorna los ultimos registros de la API, por defecto 10 ---- COORDENADAS
  historialAPICoordenadas(pagina: string, cantidad: number = 10) {

    this.http
      .get<Coordenadas[]>(`${environment.backUrl}/${pagina}/`, {
        responseType: 'json', headers: {'Accept':'application/json', "ngrok-skip-browser-warning": "69420"},
        params: {
          _sort: 'id',
          _order: 'desc',
          _end: cantidad
        }
      })
      .subscribe((resp) => {
        this.datosBDCoordenadas.set(resp);
        //console.log(resp);
      });
    return this.datosBDCoordenadas();
  }

  //Llama funcion conectar de SerialService - Hendrik
  async connectPort() {
    const port = await serialService.default.reqPort();
    console.log(port);
    await serialService.default.connect(115200)
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
  saveAndUpdateData(data: string | any) {

    //destructurando data recibida a un array 
    const splitedData = data.split(','); //************DESCOMENTAR******

    const [ICARUS, fechaFija, tiempoEnSeg, estadoON, alturaMSNM, tempCelsius, presionHPA, voltaje, Co2ppm, humedadRelativa, ax, ay, az, gx, gy, gz, UMSA ] = splitedData;

    // Actualiza y formatea datos -- REALES DEL SENSOR
    this.altura.update((temp) => temp = { id: tiempoEnSeg, fecha: this.fechaApi, valor: alturaMSNM });
    this.temperatura.update((temp) => temp = { id: tiempoEnSeg, fecha: this.fechaApi, valor: tempCelsius });
    this.presion.update((temp) => temp = { id: tiempoEnSeg, fecha: this.fechaApi, valor: presionHPA });
    this.co2.update((temp) => temp = { id: tiempoEnSeg, fecha: this.fechaApi, valor: Co2ppm });
    this.acelerometro.update((temp) => temp = { id: tiempoEnSeg, fecha: this.fechaApi, valor: { x: ax, y: ay, z: az } });
    this.giroscopio.update((temp) => temp = { id: tiempoEnSeg, fecha: this.fechaApi, valor: { x: gx, y: gy, z: gz } });
    
    // Actualiza y formatea datos
    // this.temperatura.update((temp) => temp = { id: tiempoEnSeg, fecha: this.fechaApi, valor: this.bateria() });
    // this.presion.update((temp) => temp = { id: tiempoEnSeg, fecha: this.fechaApi, valor: this.bateria() });
    // this.co2.update((temp) => temp = { id: tiempoEnSegl, fecha: this.fechaApi, valor: this.bateria() });
    // this.altura.update((temp) => temp = { id: tiempoEnSeg, fecha: this.fechaApi, valor: this.bateria() });
    // this.acelerometro.update((temp) => temp = { id: tiempoEnSeg, fecha: this.fechaApi, valor: { x: this.bateria(), y: this.bateria()+5, z: this.bateria()+10 } });
    // this.giroscopio.update((temp) => temp = { id: tiempoEnSeg, fecha: this.fechaApi, valor: { x: this.bateria(), y: this.bateria()+5, z: this.bateria()+10 } });

    //Almacena en BD de la API
    /* this.http.post<Logs>(`${environment.backUrl}/logs`, {id: tiempoEnSeg, valor: data}, this.httpOptions )
      .subscribe((resp) => console.log(resp)); */
    this.http.post<Sensor>(`${environment.backUrl}/temperatura`, this.temperatura(), this.httpOptions  )
      .subscribe((resp) => console.log(resp));
    this.http.post<Sensor>(`${environment.backUrl}/presion`, this.presion(), this.httpOptions)
      .subscribe((resp) => console.log(resp));
    this.http.post<Sensor>(`${environment.backUrl}/co2`, this.co2(), this.httpOptions)
      .subscribe((resp) => console.log(resp));
    this.http.post<Sensor>(`${environment.backUrl}/altura`, this.altura(), this.httpOptions)
      .subscribe((resp) => console.log(resp));
    this.http.post<Coordenadas>(`${environment.backUrl}/acelerometro`, this.acelerometro(), this.httpOptions)
      .subscribe((resp) => console.log(resp));
    this.http.post<Coordenadas>(`${environment.backUrl}/giroscopio`, this.giroscopio(), this.httpOptions)
      .subscribe((resp) => console.log(resp));
  }

}
