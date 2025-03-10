import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgCircleProgressModule } from 'ng-circle-progress';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    NgCircleProgressModule.forRoot({}),
  ],
  exports: [NgCircleProgressModule],
})
export class SharedModule { }
