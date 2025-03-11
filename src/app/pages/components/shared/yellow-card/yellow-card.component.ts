import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Coordenadas{
  x:number;
  y:number;
  z:number;
}

@Component({
  selector: 'yellow-card',
  standalone: true,
  imports: [RouterLink,],
  templateUrl: './yellow-card.component.html',
  styleUrl: './yellow-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YellowCardComponent {

  title= input.required<string>();
  coordenadas =input.required<Coordenadas>();

}
