export interface Sensor{
  id: number;
  fecha: string;
  valor: number;
}

export interface Coordenadas{
  id: number;
  fecha: string;
  valor: {
    x:number;
    y:number;
    z:number;
  }
}