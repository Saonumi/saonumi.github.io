import { compileTemplate } from "./template";
import { translations, locale } from "../store";

export const t = (key: string, props: { [key: string]: any } = {}) => {
  const translation = translations.value[key];
  if (!translation) return "";

  const render = compileTemplate(translation);
  return render(props);
};

// Personal copy remains editable in saonumi.ts; untranslated names keep their original spelling.
export type LocalizedCopy = string | { vi: string; en: string };
export const translateContent = (text: LocalizedCopy) =>
  typeof text === "string" ? t(`content:${text}`) || text : text[locale.value === "vi" ? "vi" : "en"];
