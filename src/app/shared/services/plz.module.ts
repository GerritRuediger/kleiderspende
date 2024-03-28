import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PlzService } from './plz.service';

@NgModule({
  providers: [PlzService],
  imports: [CommonModule, HttpClientModule],
})
export class PlzModule {}
