import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { AbgabeOptions } from '../../shared/models/abgabe-options';
import { KleiderArten } from '../../shared/models/kleider-arten';
import { Krisengebiete } from '../../shared/models/krisengebiete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlzService } from '../../shared/services/plz.service';
import { Kleiderspende } from '../../shared/models/kleiderspende';
import { PlzModule } from '../../shared/services/plz.module';
import { MatDivider } from '@angular/material/divider';
import {
  plzLengthValidator,
  plzNaeheValidator,
} from '../validators/plz-validator';

@Component({
  selector: 'app-registrierung-form',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatFormField,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatInput,
    MatSelect,
    MatLabel,
    MatOption,
    MatCardActions,
    MatError,
    PlzModule,
    MatDivider,
  ],
  templateUrl: './registrierung-form.component.html',
  styleUrl: './registrierung-form.component.scss',
})
export class RegistrierungFormComponent implements OnInit {
  @Output()
  registrierungClicked = new EventEmitter<Kleiderspende>();

  readonly PLZ_DIENSTSTELLE = 41460;

  formGroup = new FormGroup({
    vorname: new FormControl<string | null>(null, Validators.required),
    nachname: new FormControl<string | null>(null, Validators.required),
    abgabe: new FormControl<AbgabeOptions | null>(
      AbgabeOptions.ABHOLUNG,
      Validators.required,
    ),
    strasse: new FormControl<string | null>(null, Validators.required),
    hausnr: new FormControl<string | null>(null, Validators.required),
    plz: new FormControl<number | null>(null, [
      Validators.required,
      plzNaeheValidator(this.PLZ_DIENSTSTELLE),
      plzLengthValidator(),
    ]),
    ort: new FormControl<string | null>({ value: null, disabled: true }),
    kleiderarten: new FormControl<KleiderArten[] | null>(
      null,
      Validators.required,
    ),
    krisengebiet: new FormControl<Krisengebiete | null>(
      null,
      Validators.required,
    ),
  });

  abgabeOptions: { label: string; value: AbgabeOptions }[] = [];
  krisengebiete: { label: string; value: Krisengebiete }[] = [];
  kleiderarten: { label: string; value: KleiderArten }[] = [];

  private readonly destroyRef = inject(DestroyRef);
  private readonly plzService = inject(PlzService);

  ngOnInit(): void {
    this.initKrisengebiete();
    this.initKleiderarten();
    this.initAbgabeOptions();

    this.formGroup.controls.abgabe.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((abgabe) => {
        if (abgabe === AbgabeOptions.ABHOLUNG) {
          this.formGroup.controls.strasse.enable();
          this.formGroup.controls.hausnr.enable();
          this.formGroup.controls.plz.enable();
        } else {
          this.formGroup.controls.strasse.disable();
          this.formGroup.controls.hausnr.disable();
          this.formGroup.controls.plz.disable();
        }
      });

    this.formGroup.controls.plz.valueChanges.subscribe((plz) => {
      if (
        plz &&
        this.formGroup.controls.plz.status === 'VALID' &&
        String(plz).length == 5
      ) {
        this.setOrtForPlz(plz);
      } else {
        this.formGroup.controls.ort.setValue(null);
      }
    });
  }

  protected initKleiderarten(): void {
    this.kleiderarten = Object.keys(KleiderArten).map((kleidung: string) => {
      return {
        label: KleiderArten[kleidung as keyof typeof KleiderArten],
        value: KleiderArten[kleidung as keyof typeof KleiderArten],
      };
    });
  }

  protected initAbgabeOptions(): void {
    this.abgabeOptions = Object.keys(AbgabeOptions).map(
      (abgabeOption: string) => {
        return {
          label: AbgabeOptions[abgabeOption as keyof typeof AbgabeOptions],
          value: AbgabeOptions[abgabeOption as keyof typeof AbgabeOptions],
        };
      },
    );
  }

  protected initKrisengebiete(): void {
    this.krisengebiete = Object.keys(Krisengebiete).map(
      (krisengebiet: string) => {
        return {
          label: Krisengebiete[krisengebiet as keyof typeof Krisengebiete],
          value: Krisengebiete[krisengebiet as keyof typeof Krisengebiete],
        };
      },
    );
  }

  protected isAbgabeOptionAbholung(): boolean {
    return this.formGroup.controls.abgabe.value === AbgabeOptions.ABHOLUNG;
  }

  protected getPlzErrorMessage(): string {
    if (this.formGroup.controls.plz.hasError('length')) {
      return 'Das Format entspricht nicht einer Postleitzahl';
    } else if (this.formGroup.controls.plz.hasError('plzNaehe')) {
      return 'Abholadresse liegt nicht in der Nähe der Geschaeftsstelle';
    } else if (this.formGroup.controls.plz.hasError('notValid')) {
      return 'Diese Postleitzahl gibt es nicht';
    } else {
      return '';
    }
  }

  protected onRegistrierenClick(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const kleiderspende: Kleiderspende = {
        vorname: this.formGroup.controls.vorname.value!,
        nachname: this.formGroup.controls.nachname.value!,
        abgabeOption: this.formGroup.controls.abgabe.value!,
        strasse: this.formGroup.controls.strasse.value,
        hausnr: this.formGroup.controls.hausnr.value,
        plz: this.formGroup.controls.plz.value,
        ort: this.formGroup.controls.ort.value,
        kleiderarten: this.formGroup.controls.kleiderarten.value!,
        krisengebiet: this.formGroup.controls.krisengebiet.value!,
        timestamp: new Date(),
      };

      this.registrierungClicked.emit(kleiderspende);
    }
  }

  protected setOrtForPlz(plz: number): void {
    this.plzService
      .findOrtForPostleitzahl(plz)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ort: string | null) => {
        if (ort == null) {
          this.formGroup.controls.plz.setErrors({ notValid: true });
        } else {
          this.formGroup.controls.ort.setValue(ort);
          this.formGroup.controls.plz.setErrors(null);
        }
      });
  }
}
