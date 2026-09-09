import "./styles/main.scss";
import {
  renderLoadingScreen,
  hideLoadingScreen,
  showLoadingScreen,
} from "./components/loading.js";
import {
  getCurrentWeather,
  getForecastWeather,
  getCitySuggestions,
} from "./weatherApi.js";
import { Overview } from "./components/overview.js";
import { setBackgroundImageForComponent } from "./components/background.js";
import { getDetailHeader } from "./components/detailHeader.js";
import { loadTopInfos, setTopInfos } from "./components/topInfos.js";
import * as forecast from "./components/hoursForecast.js";
import * as dailyForecast from "./components/daysForecast.js";
import * as moreDetails from "./components/moreDetails.js";

export const rootElement = document.querySelector("#app");
const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [
  "Sundern",
  "New York",
  "Dänemark",
];
var tempCity = "Dänemark";
let amountDays = 3;
var overView = undefined;

///////////////////////////////////////////////////
showOverview();
//showDetails(tempCity);

async function showDetails(value) {
  rootElement.innerHTML = "";
  console.log("showDetails");
  console.log(value);
  renderLoadingScreen(`Lade Wetterdaten für ${value}...`);

  getDetailHeader({
    goBack: () => showOverview(),
    setFavorite: (city) => {
      saveCityToFavorites(city);
    },
  });
  loadTopInfos(value);
  forecast.appendForecastUI(rootElement);
  dailyForecast.appendDailyForecastUI(rootElement);
  let currentWeather = await getForecastWeather(value, amountDays);

  if (currentWeather) {
    setTopInfos(currentWeather);
    forecast.setForecastData(currentWeather);
    dailyForecast.setDailyForecastData(currentWeather, amountDays);
    moreDetails.getMoreDetails(currentWeather);
    setBackgroundImageForComponent(rootElement, currentWeather);
    hideLoadingScreen();
  }
}

async function showOverview() {
  console.log("showOverview", tempCity);
  renderLoadingScreen(`Lade Wetterdaten...`);

  try {
    /*
    const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [
      "Sundern",
      "New York",
      "Dänemark",
    ];
    */

    const favoriteWeatherData = await loadFavorites();

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
  } catch (error) {
    console.error(error);
    throw new Error(`Weather API error (showOverview): ${error.message}`);
  } finally {
    hideLoadingScreen();
  }
}

function saveCityToFavorites(city) {
  console.log("saveCityToFavorites", city);

  if (city && city.length > 2) {
    localStorage.setItem("favorites", JSON.stringify([...favorites, city]));
  }
}

async function loadFavorites() {
  //
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
