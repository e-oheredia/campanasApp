import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonViewComponent } from './button-view/button-view.component';

@NgModule({
  declarations: [ButtonViewComponent],
  imports: [
    CommonModule
  ], 
  exports: [ButtonViewComponent]
})
export class TableManagementModule { }
