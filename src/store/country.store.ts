import { makeAutoObservable } from "mobx";
import type { Country } from "../domain/country.types";

export class CountryStore {
  countries: Country[] = [];
 
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  loadCountries(countries: Country[]) {
    this.countries = countries;
  }

 
}

export const countryStore = new CountryStore();