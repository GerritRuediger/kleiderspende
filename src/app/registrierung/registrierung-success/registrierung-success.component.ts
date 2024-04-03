import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';
import { Kleiderspende } from '../../shared/models/kleiderspende';
import { MatList, MatListItem } from '@angular/material/list';
import { NgIf } from '@angular/common';
import { AbgabeOptions } from '../../shared/models/abgabe-options';
import { MatButton } from '@angular/material/button';
import dayjs from 'dayjs';
import {Dienststelle} from "../../shared/models/dienststelle";

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
  styleUrl: './registrierung-success.component.scss',
})
export class RegistrierungSuccessComponent {
  @Input()
  kleiderspende!: Kleiderspende;

  @Input()
  dienststelle! : Dienststelle

  @Output()
  weitereSpendeClicked = new EventEmitter<void>();

  protected getSelectedKleiderarten(): string {
    return this.kleiderspende.kleiderarten.join(', ');
  }

  protected isAdresseVisible(): boolean {
    return this.isAbholung();
  }

  protected isAbholung(): boolean {
    return this.kleiderspende.abgabeOption === AbgabeOptions.ABHOLUNG;
  }

  onWeitereSpende(): void {
    this.weitereSpendeClicked.emit();
  }

  protected zeitraum(): string {
    const zeitpunkt = this.isAbholung()
      ? this.kleiderspende.abholzeitpunkt
      : this.kleiderspende.timestamp;

    return dayjs(zeitpunkt).format('DD.MM.YYYY HH:mm');
  }
}
