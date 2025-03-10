import { Component, input } from '@angular/core';

interface Coordenadas{
  x:number;
  y:number;
  z:number;
}

@Component({
  selector: 'yellow-card',
  standalone: true,
  imports: [],
  templateUrl: './yellow-card.component.html',
  styleUrl: './yellow-card.component.css'
})
export class YellowCardComponent {

  title= input.required<string>();
  coordenadas =input.required<Coordenadas>();

}
