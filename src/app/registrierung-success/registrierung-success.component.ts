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
import dayjs from 'dayjs';

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
    let date: Date = this.kleiderspende.timestamp;

    if (this.kleiderspende.abgabeOption == AbgabeOptions.ABHOLUNG) {
      date = dayjs(date)
        .add(Math.random() * 5 + 1, 'days')
        .set('hour', 8)
        .set('minute', 0)
        .toDate();
    }
    return dayjs(date).format('DD.MM.YYYY hh:mm');
  }
}
