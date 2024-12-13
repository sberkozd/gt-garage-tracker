import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import stringsEN from "./translations/en.json";
import stringsTR from "./translations/tr.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*
Functionality relating to i18n integration.
The localisation feature was an extra feature we decided to implement for this project.
As a disclaimer, much of this code in this file was used in mine (Aggrey's) Capstone project.
However, outside of this file, the implementation was quite different due to the architecture
of this app. In addition, the second language used for localisation is different.

Feel free to check it out here!: https://github.com/LivioDR/Fanshawe_MAP_Capstone_S1G9

*/
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
