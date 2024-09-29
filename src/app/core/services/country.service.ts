import { Injectable } from '@angular/core';
import * as countries from 'i18n-iso-countries';
import fr from 'i18n-iso-countries/langs/fr.json';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  constructor() {
    countries.registerLocale(fr);
  }

  getCountries(): { code: string, name: string }[] {
    const countryObj = countries.getNames('fr', { select: 'official' });
    return Object.keys(countryObj).map(code => ({
      code: code,
      name: countryObj[code]
    })).sort((a, b) => a.name.localeCompare(b.name)); 
  }

  getCountryName(code: string): string {
    const countryNames = countries.getNames('fr', { select: 'official' });

    if (countryNames[code]) {
      return countryNames[code];
    }

    return code;
  }
}