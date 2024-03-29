import { AbgabeOptions } from './abgabe-options';
import { KleiderArten } from './kleider-arten';
import { Krisengebiete } from './krisengebiete';

export interface Kleiderspende {
  vorname: string;
  nachname: string;
  abgabeOption: AbgabeOptions;
  strasse: string | null;
  hausnr: string | null;
  plz: number | null;
  ort: string | null;
  kleiderarten: KleiderArten[];
  krisengebiet: Krisengebiete;
  timestamp: Date;
}
