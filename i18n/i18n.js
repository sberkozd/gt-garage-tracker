import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import stringsEN from "./translations/en.json";
import stringsTR from "./translations/tr.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

const languageDetector = {
    type: "languageDetector",
    async: true,
    detect: async () => {
        const currentLng = await AsyncStorage.getItem(currentLngKey);
        return !!currentLng ? currentLng : getLocales()[0].languageCode;
    },
};

export function initI18next() {

    return i18next
        .use(languageDetector)
        .use(initReactI18next)
        .init({
            compatibilityJSON: "v3",

            fallbackLng: "en",

            resources: {
                en: {
                    translation: stringsEN,
                },
                tr: {
                    translation: stringsTR,
                },
            },
        });
}

export const supportedLanguages = {
    en: "English",
    tr: "Türkçe",
};

export const currentLngKey = "current-lang";
