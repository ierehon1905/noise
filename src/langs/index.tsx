import React, { useCallback, useContext, useState } from "react";
import ru from "./ru.json";
import en from "./en.json";

type Lang = "ru" | "en";

type I18nContextType = {
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof ru) => string;
};

const I18nContext = React.createContext<I18nContextType>({
  t: () => {
    throw new Error("Not initialized");
  },
  setLang: () => {},
});

export const useTranslation = () => {
  return useContext(I18nContext);
};

export const I18nProvider: React.FC = (props) => {
  const [lang, setLang] = useState<Lang>("ru");

  const translate: I18nContextType["t"] = useCallback(
    (key) => {
      const keys = lang === "en" ? en : ru;
      return keys[key] || key;
    },
    [lang]
  );

  return <I18nContext.Provider {...props} value={{ setLang, t: translate }} />;
};
