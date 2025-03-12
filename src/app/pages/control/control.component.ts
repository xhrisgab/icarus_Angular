import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoraService } from '../../services/lora.service';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../components/shared/shared.module';
import { YellowCardComponent } from '../components/shared/yellow-card/yellow-card.component';
import { BlueCardComponent } from '../components/shared/blue-card/blue-card.component';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [DatePipe, SharedModule,YellowCardComponent, BlueCardComponent],
  templateUrl: './control.component.html',
  styleUrl: './control.component.css',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlComponent {

  public loraService = inject(LoraService);

  constructor(){}

}
