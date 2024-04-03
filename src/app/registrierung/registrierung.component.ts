import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RegistrierungFormComponent } from './registrierung-form/component/registrierung-form.component';
import { RegistrierungSuccessComponent } from './registrierung-success/registrierung-success.component';
import { Kleiderspende } from '../shared/models/kleiderspende';
import {Dienststelle} from "../shared/models/dienststelle";

@Component({
  selector: 'app-registrierung',
  standalone: true,
  imports: [NgIf, RegistrierungFormComponent, RegistrierungSuccessComponent],
  templateUrl: './registrierung.component.html',
  styleUrl: './registrierung.component.scss',
})
export class RegistrierungComponent {
  default_dienststelle : Dienststelle = {plz: 41460, ort: "Neuss"};

  kleiderspende: Kleiderspende | null = null;

  onRegistrierungClicked(kleiderspende: Kleiderspende): void {
    this.kleiderspende = kleiderspende;
  }

  onWeitereSpende(): void {
    this.kleiderspende = null;
  }
}
