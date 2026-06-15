import axios from "axios";

export type NameLanguage = "en" | "ar" | "hi" | "ur" | "bn";

// Proxied through Vite (see vite.config.ts) so the DeepL key stays server-side.
const DEEPL_PROXY_URL = import.meta.env.VITE_DEEPL_URL ?? "/deepl";
const DEEPL_API_KEY = import.meta.env.VITE_DEEPL_API_KEY;

// DeepL source codes. English is plain "EN" as a source.
const DEEPL_SOURCE_LANG: Record<NameLanguage, string> = {
  en: "EN",
  ar: "AR",
  hi: "HI",
  ur: "UR",
  bn: "BN",
};

// DeepL target codes. As a target, English must be a regional variant.
const DEEPL_TARGET_LANG: Record<NameLanguage, string> = {
  en: "EN-US",
  ar: "AR",
  hi: "HI",
  ur: "UR",
  bn: "BN",
};

async function translateText(
  text: string,
  source: NameLanguage,
  target: NameLanguage
): Promise<string> {
  const { data } = await axios.post(
    DEEPL_PROXY_URL,
    {
      text: [text],
      target_lang: DEEPL_TARGET_LANG[target],
      source_lang: DEEPL_SOURCE_LANG[source],
    },
    {
      headers: {
        "Authorization": `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const translated = data?.translations?.[0]?.text;
  if (typeof translated !== "string" || !translated) return "";
  return translated;
}

export function useTranslateNameComposable() {
  // Translate `text` from `source` into each target language in parallel.
  // Returns a partial map; failed/empty translations are omitted so callers
  // can decide whether to overwrite existing values.
  async function translateInto(
    text: string,
    source: NameLanguage,
    targets: NameLanguage[]
  ): Promise<Partial<Record<NameLanguage, string>>> {
    const trimmed = text.trim();
    if (!trimmed) return {};

    const results = await Promise.all(
      targets.map(async (target) => {
        try {
          const value = await translateText(trimmed, source, target);
          return [target, value] as const;
        } catch {
          return [target, ""] as const;
        }
      })
    );

    return results.reduce<Partial<Record<NameLanguage, string>>>(
      (acc, [target, value]) => {
        if (value) acc[target] = value;
        return acc;
      },
      {}
    );
  }

  return { translateInto };
}
