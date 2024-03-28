import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';
import { Kleiderspende } from '../shared/models/kleiderspende';
import { MatList, MatListItem } from '@angular/material/list';
import { NgIf } from '@angular/common';
import { AbgabeOptions } from '../shared/models/abgabe-options';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-registrierung-success',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardActions,
    MatList,
    MatListItem,
    NgIf,
    MatButton,
  ],
  templateUrl: './registrierung-success.component.html',
  styleUrl: './registrierung-success.component.css',
})
export class RegistrierungSuccessComponent {
  @Input()
  kleiderspende!: Kleiderspende;

  @Output()
  weitereSpendeClicked = new EventEmitter<void>();

  protected getSelectedKleiderarten(): string {
    return this.kleiderspende.kleiderarten.join(', ');
  }

  protected isAdresseVisible(): boolean {
    return this.kleiderspende.abgabeOption == AbgabeOptions.ABHOLUNG;
  }

  onWeitereSpende(): void {
    this.weitereSpendeClicked.emit();
  }
}
