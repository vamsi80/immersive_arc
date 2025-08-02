import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

// Register English locale
countries.registerLocale(enLocale);

// Return array of country names
export const getAllCountryNames = (): string[] => {
  const countryObj = countries.getNames("en", { select: "official" });
  return Object.values(countryObj).sort((a, b) => a.localeCompare(b));
};
