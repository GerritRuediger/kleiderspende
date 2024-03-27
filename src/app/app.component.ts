import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatError,
  MatFormField,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatToolbar } from '@angular/material/toolbar';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { AbgabeOptions } from './models/abgabe-options';
import { NgForOf, NgIf } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { KleiderArten } from './models/kleider-arten';
import { Krisengebiete } from './models/krisengebiete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import {
  HttpClient,
  HttpClientModule,
  HttpHandler,
} from '@angular/common/http';
import { mergeAll } from 'rxjs';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatFormField,
    MatInput,
    MatToolbar,
    MatRadioGroup,
    MatRadioButton,
    MatLabel,
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    MatSelect,
    MatOption,
    MatButton,
    MatError,
    HttpClientModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Kleiderspende';

  plzDienststelle = 41460;

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
      this.plzNaeheValidator(this.plzDienststelle),
      Validators.minLength(5),
      Validators.maxLength(5),
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

  abgabeOptions: { label: string; value: AbgabeOptions }[] = [
    { label: 'Abholung zuhause', value: AbgabeOptions.ABHOLUNG },
    { label: 'Übergabe an der Geschäftsstelle', value: AbgabeOptions.ABGABE },
  ];

  krisengebiete: { label: string; value: Krisengebiete }[] = Object.keys(
    Krisengebiete,
  ).map((krisengebiet: string) => {
    return {
      label: `${krisengebiet[0].toUpperCase()}${krisengebiet.slice(1).toLowerCase()}`,
      value: Krisengebiete[krisengebiet as keyof typeof Krisengebiete],
    };
  });

  kleiderarten: { label: string; value: KleiderArten }[] = Object.keys(
    KleiderArten,
  ).map((kleidung: string) => {
    return {
      label: `${kleidung[0].toUpperCase()}${kleidung.slice(1).toLowerCase()}`,
      value: KleiderArten[kleidung as keyof typeof KleiderArten],
    };
  });

  private readonly destroyRef = inject(DestroyRef);
  private readonly http = inject(HttpClient);

  ngOnInit(): void {
    this.formGroup.controls.abgabe.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((abgabe) => {
        if (abgabe == AbgabeOptions.ABHOLUNG) {
          this.formGroup.controls.strasse.setValidators(Validators.required);
          this.formGroup.controls.plz.setValidators(Validators.required);
          this.formGroup.controls.ort.setValidators(Validators.required);
          this.formGroup.updateValueAndValidity();
        } else {
          this.formGroup.controls.strasse.removeValidators(Validators.required);
          this.formGroup.controls.plz.removeValidators(Validators.required);
          this.formGroup.controls.ort.removeValidators(Validators.required);
          this.formGroup.updateValueAndValidity();
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

  protected isAbgabeOptionAbholung(): boolean {
    return this.formGroup.controls.abgabe.value == AbgabeOptions.ABHOLUNG;
  }

  protected onRegistrierenClick(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      console.log('VALID');
    }
  }

  getErrorMessage(): string {
    if (
      this.formGroup.controls.plz.hasError('minlength') ||
      this.formGroup.controls.plz.hasError('maxlength')
    ) {
      return 'Das Format entspricht nicht einer Postleitzahl';
    } else if (this.formGroup.controls.plz.hasError('plzNaehe')) {
      return 'Abholadresse liegt nicht in der Nähe der Geschaeftsstelle';
    } else if (this.formGroup.controls.plz.hasError('notValid')) {
      return 'Diese Postleitzahl gibt es nicht';
    } else {
      return '';
    }
  }

  setOrtForPlz(plz: number): void {
    const url = `https://openplzapi.org/de/Localities?postalCode=${plz}`;
    this.http
      .get(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: unknown) => {
        const orte = response as { name: string }[];
        if (orte.length == 0) {
          this.formGroup.controls.plz.setErrors({ notValid: true });
        } else {
          this.formGroup.controls.plz.setErrors(null);
          this.formGroup.controls.ort.setValue(
            orte.length > 0 ? orte[0].name : null,
          );
        }
      });
  }

  plzNaeheValidator(plz: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value || String(value).length != 5) {
        return null;
      } else if (String(plz).slice(0, 2) !== String(value).slice(0, 2)) {
        return { plzNaehe: true };
      }

      return null;
    };
  }
}
