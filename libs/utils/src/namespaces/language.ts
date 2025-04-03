// Languages
export type Language = {
  id: string;
  name: string;
  locale: string;
  editorCode: string;
  progress?: number;
  countryCode: string;
};

export const languages: Language[] = [
  {
    id: "af",
    name: "Afrikaans",
    editorCode: "af",
    locale: "af-ZA",
    countryCode: "za",
  },
  {
    id: "sq",
    name: "Albanian",
    editorCode: "sq",
    locale: "sq-AL",
    countryCode: "al",
  },
  {
    id: "am",
    name: "Amharic",
    editorCode: "am",
    locale: "am-ET",
    countryCode: "et",
  },
  {
    id: "ar",
    name: "Arabic",
    editorCode: "ar",
    locale: "ar-SA",
    countryCode: "sa",
  },
  {
    id: "bn",
    name: "Bengali",
    editorCode: "bn",
    locale: "bn-BD",
    countryCode: "bd",
  },
  {
    id: "bg",
    name: "Bulgarian",
    editorCode: "bg",
    locale: "bg-BG",
    countryCode: "bg",
  },
  {
    id: "ca",
    name: "Catalan",
    editorCode: "ca",
    locale: "ca-ES",
    countryCode: "es",
  },
  {
    id: "zh-CN",
    name: "Chinese Simplified",
    editorCode: "zhcn",
    locale: "zh-CN",
    countryCode: "cn",
  },
  {
    id: "zh-TW",
    name: "Chinese Traditional",
    editorCode: "zhtw",
    locale: "zh-TW",
    countryCode: "tw",
  },
  {
    id: "cs",
    name: "Czech",
    editorCode: "cs",
    locale: "cs-CZ",
    countryCode: "cz",
  },
  {
    id: "da",
    name: "Danish",
    editorCode: "da",
    locale: "da-DK",
    countryCode: "dk",
  },
  {
    id: "nl",
    name: "Dutch",
    editorCode: "nl",
    locale: "nl-NL",
    countryCode: "nl",
  },
  {
    id: "en-US",
    name: "English",
    editorCode: "en",
    locale: "en-US",
    countryCode: "us",
  },
  {
    id: "fi",
    name: "Finnish",
    editorCode: "fi",
    locale: "fi-FI",
    countryCode: "fi",
  },
  {
    id: "fr",
    name: "French",
    editorCode: "fr",
    locale: "fr-FR",
    countryCode: "fr",
  },
  {
    id: "de",
    name: "German",
    editorCode: "de",
    locale: "de-DE",
    countryCode: "de",
  },
  {
    id: "el",
    name: "Greek",
    editorCode: "el",
    locale: "el-GR",
    countryCode: "gr",
  },
  {
    id: "he",
    name: "Hebrew",
    editorCode: "he",
    locale: "he-IL",
    countryCode: "il",
  },
  {
    id: "hi",
    name: "Hindi",
    editorCode: "hi",
    locale: "hi-IN",
    countryCode: "in",
  },
  {
    id: "hu",
    name: "Hungarian",
    editorCode: "hu",
    locale: "hu-HU",
    countryCode: "hu",
  },
  {
    id: "id",
    name: "Indonesian",
    editorCode: "id",
    locale: "id-ID",
    countryCode: "id",
  },
  {
    id: "it",
    name: "Italian",
    editorCode: "it",
    locale: "it-IT",
    countryCode: "it",
  },
  {
    id: "ja",
    name: "Japanese",
    editorCode: "ja",
    locale: "ja-JP",
    countryCode: "jp",
  },
  {
    id: "kn",
    name: "Kannada",
    editorCode: "kn",
    locale: "kn-IN",
    countryCode: "in",
  },
  {
    id: "km",
    name: "Khmer",
    editorCode: "km",
    locale: "km-KH",
    countryCode: "kh",
  },
  {
    id: "ko",
    name: "Korean",
    editorCode: "ko",
    locale: "ko-KR",
    countryCode: "kr",
  },
  {
    id: "lv",
    name: "Latvian",
    editorCode: "lv",
    locale: "lv-LV",
    countryCode: "lv",
  },
  {
    id: "lt",
    name: "Lithuanian",
    editorCode: "lt",
    locale: "lt-LT",
    countryCode: "lt",
  },
  {
    id: "ms",
    name: "Malay",
    editorCode: "ms",
    locale: "ms-MY",
    countryCode: "my",
  },
  {
    id: "ml-IN",
    name: "Malayalam",
    editorCode: "mlin",
    locale: "ml-IN",
    countryCode: "in",
  },
  {
    id: "mr",
    name: "Marathi",
    editorCode: "mr",
    locale: "mr-IN",
    countryCode: "in",
  },
  {
    id: "ne-NP",
    name: "Nepali",
    editorCode: "nenp",
    locale: "ne-NP",
    countryCode: "np",
  },
  {
    id: "no",
    name: "Norwegian",
    editorCode: "no",
    locale: "no-NO",
    countryCode: "no",
  },
  {
    id: "or",
    name: "Odia",
    editorCode: "or",
    locale: "or-IN",
    countryCode: "in",
  },
  {
    id: "fa",
    name: "Persian",
    editorCode: "fa",
    locale: "fa-IR",
    countryCode: "ir",
  },
  {
    id: "pl",
    name: "Polish",
    editorCode: "pl",
    locale: "pl-PL",
    countryCode: "pl",
  },
  {
    id: "pt-PT",
    name: "Portuguese",
    editorCode: "pt",
    locale: "pt-PT",
    countryCode: "pt",
  },
  {
    id: "pt-BR",
    name: "Portuguese, Brazilian",
    editorCode: "ptbr",
    locale: "pt-BR",
    countryCode: "br",
  },
  {
    id: "ro",
    name: "Romanian",
    editorCode: "ro",
    locale: "ro-RO",
    countryCode: "ro",
  },
  {
    id: "ru",
    name: "Russian",
    editorCode: "ru",
    locale: "ru-RU",
    countryCode: "ru",
  },
  {
    id: "sr",
    name: "Serbian (Cyrillic)",
    editorCode: "sr",
    locale: "sr-SP",
    countryCode: "rs",
  },
  {
    id: "es-ES",
    name: "Spanish",
    editorCode: "es",
    locale: "es-ES",
    countryCode: "es",
  },
  {
    id: "sv-SE",
    name: "Swedish",
    editorCode: "sv",
    locale: "sv-SE",
    countryCode: "se",
  },
  {
    id: "ta",
    name: "Tamil",
    editorCode: "ta",
    locale: "ta-IN",
    countryCode: "in",
  },
  {
    id: "te",
    name: "Telugu",
    editorCode: "te",
    locale: "te-IN",
    countryCode: "in",
  },
  {
    id: "th",
    name: "Thai",
    editorCode: "th",
    locale: "th-TH",
    countryCode: "th",
  },
  {
    id: "tr",
    name: "Turkish",
    editorCode: "tr",
    locale: "tr-TR",
    countryCode: "tr",
  },
  {
    id: "uk",
    name: "Ukrainian",
    editorCode: "uk",
    locale: "uk-UA",
    countryCode: "ua",
  },
  {
    id: "uz",
    name: "Uzbek",
    editorCode: "uz",
    locale: "uz-UZ",
    countryCode: "uz",
  },
  {
    id: "vi",
    name: "Vietnamese",
    editorCode: "vi",
    locale: "vi-VN",
    countryCode: "vn",
  },
];
