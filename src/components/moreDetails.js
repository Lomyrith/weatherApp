import { logConsole, createElement } from "../utils.js";
import { rootElement } from "../main.js";
import * as utils from "../utils.js";

const moonPhaseTranslations = {
  "New Moon": "Neumond",
  "Waxing Crescent": "Zunehmende Sichel",
  "First Quarter": "Erstes Viertel",
  "Waxing Gibbous": "Zunehmender Mond",
  "Full Moon": "Vollmond",
  "Waning Gibbous": "Abnehmender Mond",
  "Third Quarter": "Letztes Viertel",
  "Last Quarter": "Letztes Viertel",
  "Waning Crescent": "Abnehmende Sichel",
};

export async function getMoreDetails(data) {
  logConsole("getMoreDetailsHtml", data);

  const moreDetails = createElement("div", "moreDetails__container");
  rootElement.appendChild(moreDetails);

  moreDetails.appendChild(
    createInfoBox("Feuchtigkeit", data.current.humidity, "humidity"),
  );
  moreDetails.appendChild(
    createInfoBox("Gefühlt", data.current.humidity, "feels_like"),
  );

  const sunrise = utils.formatTime(data.forecast.forecastday[0].astro.sunrise);
  logConsole("sunris  e", sunrise);
  const sunset = utils.formatTime(data.forecast.forecastday[0].astro.sunset);

  const sunTime = `${sunrise} → ${sunset}`;
  moreDetails.appendChild(
    createInfoBox("Sonnenzeit", sunTime, "Sonnenzeit", true),
  );

  if (data.forecast.forecastday?.length >= 1) {
    moreDetails.appendChild(
      createInfoBox(
        "Niederschlag",
        data.forecast.forecastday[0].day.daily_chance_of_rain,
        "rainChance",
      ),
    );

    // Variant Mapping | naütlich hier die bessere Variante
    const rawMoonPhase = data.forecast.forecastday[0].astro.moon_phase;
    const moonPhaseDe = moonPhaseTranslations[rawMoonPhase] || rawMoonPhase;

    /*Variant2: Api Translation, hier würde dann noch ein WaitIndicator fehlen
    const lang = navigator.language.split("-")[0];
    const moonPhaseDe = await translateText(
      data.forecast.forecastday[0].astro.moon_phase,
      lang,
    );*/
    moreDetails.appendChild(
      createInfoBox("Mondphase", moonPhaseDe, "moonPhase"),
    );
  }

  moreDetails.appendChild(
    createInfoBox(
      "Windgeschwindigkeit",
      `${data.current.wind_dir} → ${data.current.wind_kph}`,
      "wind",
    ),
  );
  moreDetails.appendChild(
    createInfoBox("Luftdruck", data.current.pressure_mb, "pressure"),
  );
}

//wird wohl nur hier verwendet, also utils.js unnötig
function createInfoBox(title, value, subclass = title, wideBox = false) {
  const infoBox = createElement(
    "div",
    `moreDetails__infoBox${wideBox ? "--wide" : ""}`,
  );

  const titleElement = createElement(
    "h3",
    "moreDetails__infoBox__title",
    title,
  );
  titleElement.classList.add(`${subclass}_title`);

  const valueElement = createElement("p", "moreDetails__infoBox__value", value);
  valueElement.classList.add(`${subclass}_value`);

  infoBox.appendChild(titleElement);
  infoBox.appendChild(valueElement);
  return infoBox;
}

const translateText = async (text, targetLang = "de") => {
  if (!text) return "";
  //nur ca. 5000 Abrufe / Tag
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`,
    );
    const data = await response.json();
    return data.responseData.translatedText;
  } catch (error) {
    console.error("Übersetzungsfehler:", error);
    return text; // Fallback auf Originaltext
  }
};
