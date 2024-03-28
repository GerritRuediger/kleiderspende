import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable()
export class PlzService {
  private readonly http: HttpClient = inject(HttpClient);

  findOrtForPostleitzahl(plz: number): Observable<string | null> {
    const url = `https://openplzapi.org/de/Localities?postalCode=${plz}`;
    return this.http.get(url).pipe(
      map((response: unknown) => {
        const orte = response as { name: string }[];
        return orte.length == 0 ? null : orte[0].name;
      }),
    );
  }
}
