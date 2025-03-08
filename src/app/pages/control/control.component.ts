import { Component, inject } from '@angular/core';
import { LoraService } from '../../services/lora.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './control.component.html',
  styleUrl: './control.component.css'
})
export class ControlComponent {

  public loraService = inject(LoraService);
  //const cp = new CircleProgress();

}
