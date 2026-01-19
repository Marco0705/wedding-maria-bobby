import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private translations = new Map<string, any>();
  public currentLang$ = new BehaviorSubject<string>('es');
  public currentLang = 'es';

  constructor(private http: HttpClient) {}

  loadTranslations(lang: string) {
    if (!this.translations.has(lang)) {
      this.http.get<any>(`assets/i18n/${lang}.json`).subscribe((res) => {
        this.translations.set(lang, res);
        this.currentLang = lang;
        this.currentLang$.next(lang);
      });
    } else {
      this.currentLang = lang;
      this.currentLang$.next(lang);
    }
  }

  instant(key: string): string {
    const langData = this.translations.get(this.currentLang) || {};
    return (
      key.split('.').reduce((obj: any, k) => (obj ? obj[k] : key), langData) ??
      key
    );
  }

  use(lang: string) {
    this.loadTranslations(lang);
  }

  get currentLanguage() {
    return this.currentLang;
  }
}
 