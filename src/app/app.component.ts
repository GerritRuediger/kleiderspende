import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { RegistrierungFormComponent } from './registrierung/registrierung-form/component/registrierung-form.component';
import { Kleiderspende } from './shared/models/kleiderspende';
import { RegistrierungSuccessComponent } from './registrierung/registrierung-success/registrierung-success.component';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RegistrierungComponent } from './registrierung/registrierung.component';
import { NavigationComponent } from './navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbar,
    RegistrierungFormComponent,
    RegistrierungSuccessComponent,
    NgIf,
    MatNavList,
    MatListItem,
    NgOptimizedImage,
    RegistrierungComponent,
    NavigationComponent,
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
}
