import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "id";

const KEY = "rinjani-lang";

const LocaleContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({
  lang: "en",
  setLang: () => undefined,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "id" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(next: Lang) {
    setLangState(next);
    localStorage.setItem(KEY, next);
  }

  return <LocaleContext.Provider value={{ lang, setLang }}>{children}</LocaleContext.Provider>;
}

export function useLang() {
  return useContext(LocaleContext);
}

export function useT() {
  const { lang } = useLang();
  return (en: string, id: string) => (lang === "id" ? id : en);
}
