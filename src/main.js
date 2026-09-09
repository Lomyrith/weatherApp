import "./styles/main.scss";
import {
  renderLoadingScreen,
  hideLoadingScreen,
  showLoadingScreen,
} from "./components/loading.js";
import { getForecastWeather, getCitySuggestions } from "./weatherApi.js";
import { Overview } from "./components/overview.js";
import {
  setBackgroundImageForComponent,
  hideBackgroundForComponent,
} from "./components/background.js";
import {
  loadDetailHeaderInfos,
  setDetailHeaderInfos,
} from "./components/detailHeader.js";
import * as forecast from "./components/hoursForecast.js";
import * as dailyForecast from "./components/daysForecast.js";
import * as moreDetails from "./components/moreDetails.js";
import { createElement } from "./utils.js";

export const rootElement = document.querySelector("#app");
export function getAppRoot() {
  // Falls aktuell ein Detail-Container existiert, gib diesen zurück
  const details = document.querySelector(".detailRoot");
  if (details) {
    return details;
  }
  // Ansonsten die normale App-Root
  return rootElement;
}
let favorites = getFavorites();
var tempCity = "Dänemark";
let amountDays = 3;
var overView = undefined;

///////////////////////////////////////////////////
showOverview();
//showDetails(tempCity);

async function showOverview() {
  rootElement.innerHTML = "";
  console.log("showOverview", tempCity);
  renderLoadingScreen(`Lade Wetterdaten...`);

  try {
    const favoriteWeatherData = await loadFavoriteDetailsFromApi();

    const onSearchCity = async (query, updateSearchDataList) => {
      console.log("onSearchCity", query);
      if (query.length > 2) {
        showLoadingScreen(`Lade Vorschläge...`);
        const suggestions = await getCitySuggestions(query);
        console.log("suggestions", suggestions);
        updateSearchDataList(suggestions);
        hideLoadingScreen();
      }
    };

    const onSelectCity = async (selectedValue) => {
      console.log("onSelectCity", selectedValue);
      await showDetails(selectedValue.name);
    };

    overView = new Overview(favoriteWeatherData, {
      onSearchCity,
      onSelectCity,
    });

    hideBackgroundForComponent(getAppRoot());
  } catch (error) {
    console.error(error);
    throw new Error(`Weather API error (showOverview): ${error.message}`);
  } finally {
    hideLoadingScreen();
  }
}

async function showDetails(value) {
  rootElement.innerHTML = "";
  rootElement.appendChild(createElement("div", "detailRoot showBackground"));

  console.log("showDetails");
  console.log(value);
  renderLoadingScreen(`Lade Wetterdaten für ${value}...`);

  loadDetailHeaderInfos(value, {
    goBack: () => showOverview(),
    setFavorite: (city) => {
      saveCityToFavorites(city);
    },
  });

  forecast.appendForecastUI(getAppRoot());
  dailyForecast.appendDailyForecastUI(getAppRoot());
  let currentWeather = await getForecastWeather(value, amountDays);

  if (currentWeather) {
    setDetailHeaderInfos(currentWeather);
    forecast.setForecastData(currentWeather);
    dailyForecast.setDailyForecastData(currentWeather, amountDays);
    moreDetails.getMoreDetails(currentWeather);
    setBackgroundImageForComponent(getAppRoot(), currentWeather);
    hideLoadingScreen();
  }
}

function saveCityToFavorites(city) {
  console.log("saveCityToFavorites", city);

  if (city && city.length > 2) {
    localStorage.setItem(
      "favorites",
      JSON.stringify(
        favorites?.includes(city) ? favorites : [...favorites, city],
      ),
    );
  }
}

async function loadFavoriteDetailsFromApi() {
  refreshFavorites();
  if (favorites?.length > 0) {
    //methode 1, laden nach einander:
    // for (const city of [...favorites]) {
    //   const currentWeather = await getCurrentWeather(city);
    //   console.log(city, currentWeather);
    // }

    //method 2 parallel
    const favoritePromises = [...favorites].map(async (city) => {
      return await getForecastWeather(city, 1);
    });

    // Wartet, bis alle Wetterdaten geladen wurden:
    const allWeatherData = await Promise.all(favoritePromises);
    console.log(allWeatherData);
    return allWeatherData;
  }
}

function getFavorites() {
  return (
    JSON.parse(localStorage.getItem("favorites")) ?? [
      "Sundern",
      "New York",
      "Dänemark",
    ]
  );
}
function refreshFavorites() {
  favorites = getFavorites();
}
