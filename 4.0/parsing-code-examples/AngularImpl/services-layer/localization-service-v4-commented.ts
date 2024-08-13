import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private currentLocale: string = 'en-US';
  private localizationData: { [key: string]: { [key: string]: string } } = {};
  private localeSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.currentLocale);

  /**
   * Sets the localization data
   * @param data The localization data object
   */
  setLocalizationData(data: { [key: string]: { [key: string]: string } }) {
    this.localizationData = data;
  }

  /**
   * Gets the translated value for a given key
   * @param key The key to translate
   * @param params Optional parameters for string interpolation
   * @returns The translated string
   */
  translate(key: string, params?: { [key: string]: string }): string {
    const translation = this.localizationData[this.currentLocale]?.[key] || key;
    if (params) {
      return this.interpolate(translation, params);
    }
    return translation;
  }

  /**
   * Sets the current locale
   * @param locale The locale to set
   */
  setLocale(locale: string) {
    if (this.localizationData[locale]) {
      this.currentLocale = locale;
      this.localeSubject.next(locale);
    } else {
      console.warn(`Locale ${locale} not found in localization data`);
    }
  }

  /**
   * Gets the current locale
   * @returns The current locale
   */
  getLocale(): string {
    return this.currentLocale;
  }

  /**
   * Gets an Observable of the current locale
   * @returns An Observable that emits the current locale
   */
  getLocale$(): Observable<string> {
    return this.localeSubject.asObservable();
  }

  /**
   * Interpolates a string with provided parameters
   * @param str The string to interpolate
   * @param params The parameters for interpolation
   * @returns The interpolated string
   */
  private interpolate(str: string, params: { [key: string]: string }): string {
    return str.replace(/{(\w+)}/g, (match, key) => {
      return params.hasOwnProperty(key) ? params[key] : match;
    });
  }
}
