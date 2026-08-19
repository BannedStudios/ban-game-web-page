import { ui, defaultLang } from './ui';
import type { AstroCookies } from 'astro';

export type Lang = keyof typeof ui;
export type TranslationKey = keyof typeof ui[typeof defaultLang];

export function getLang(cookies?: AstroCookies, request?: Request): Lang {
  if (cookies) {
    const cookieLang = cookies.get('user_lang')?.value;
    if (cookieLang && cookieLang in ui) return cookieLang as Lang;
  }
  if (request) {
    const acceptLang = request.headers.get('accept-language');
    if (acceptLang && acceptLang.toLowerCase().startsWith('en')) return 'en';
  }
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return ui[lang]?.[key] ?? ui[defaultLang][key] ?? (key as string);
  };
}