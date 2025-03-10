import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Sensor } from '../../../../interfaces/lora.interface';


@Component({
  selector: 'blue-card',
  standalone: true,
  imports: [],
  templateUrl: './blue-card.component.html',
  styleUrl: './blue-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlueCardComponent {
  datoSensor = input.required<Sensor>();

 }
