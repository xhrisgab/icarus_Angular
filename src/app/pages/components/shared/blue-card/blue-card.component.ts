import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Sensor } from '../../../../interfaces/lora.interface';


@Component({
  selector: 'blue-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blue-card.component.html',
  styleUrl: './blue-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlueCardComponent {
  nameCard = input.required<string>();
  datoSensor = input.required<Sensor>();

 }
