import { watch } from "vue";
import { loadTranslations } from "../utils/load";
import { locale, translations } from "../store";
import { onMounted } from "vue";
import { LOCALES } from "../constants";
import { nextTick } from "vue";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Locale } from "../types";

export const useTranslations = () => {
  onMounted(() => {
    const saved = window.localStorage.getItem("portfolio-locale");
    if (saved && Object.hasOwn(LOCALES, saved)) {
      locale.value = saved as Locale;
    } else {
      const preferredLocale = navigator.language.split("-")[0] as Locale;

      if (preferredLocale in LOCALES) {
        locale.value = preferredLocale;
      } else {
        locale.value = "en";
      }
    }
  });

  watch(locale, () => {
    if (!locale.value) return;
    window.localStorage.setItem("portfolio-locale", locale.value);
  });

  watch(
    locale,
    async (newLocale, _, onCleanup) => {
      if (!newLocale) return;
      let cancelled = false;
      onCleanup(() => { cancelled = true; });
      const messages = await loadTranslations("common", newLocale);
      if (cancelled) return;
      translations.value = messages ?? {};
      document.documentElement.lang = newLocale;
      document.title = messages?.['page-title'] || 'Saonumi — AI Researcher / Engineer';
      await nextTick();
      await document.fonts.ready;
      if (cancelled) return;
      // Translated copy can change section height and carousel width.
      ScrollTrigger.refresh();
    },
    { immediate: true },
  );
};
