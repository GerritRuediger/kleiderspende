import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { RegistrierungFormComponent } from './registrierung-form/component/registrierung-form.component';
import { Kleiderspende } from './shared/models/kleiderspende';
import { RegistrierungSuccessComponent } from './registrierung-success/registrierung-success.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbar,
    RegistrierungFormComponent,
    RegistrierungSuccessComponent,
    NgIf,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Kleiderspende';
  kleiderspende: Kleiderspende | null = null;

  onRegistrierungClicked(kleiderspende: Kleiderspende): void {
    this.kleiderspende = kleiderspende;
  }

  onWeitereSpende(): void {
    this.kleiderspende = null;
  }
}
