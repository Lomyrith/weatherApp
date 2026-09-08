import "./styles/main.scss";
import {
  renderLoadingScreen,
  hideLoadingScreen,
} from "./components/loading.js";
import {
  getCurrentWeather,
  getForecastWeather,
  getCitySuggestions,
} from "./weatherApi.js";
import { Overview } from "./components/overview.js";
import { setBackgroundImage } from "./components/background.js";
import { loadTopInfos, setTopInfos } from "./components/topInfos.js";
import * as forecast from "./components/hoursForecast.js";
import * as dailyForecast from "./components/daysForecast.js";
import * as moreDetails from "./components/moreDetails.js";

export const rootElement = document.querySelector("#app");
var tempCity = "Dänemark";
let amountDays = 3;

//showOverview();
showDetails(tempCity);

async function showDetails(value) {
  console.log("showDetails");
  console.log(value);
  renderLoadingScreen(`Lade Wetterdaten für ${value}...`);
  loadTopInfos(value);
  forecast.appendForecastUI(rootElement);
  dailyForecast.appendDailyForecastUI(rootElement);
  let currentWeather = await getForecastWeather(value, amountDays);

  if (currentWeather) {
    setTopInfos(currentWeather);
    forecast.setForecastData(currentWeather);
    dailyForecast.setDailyForecastData(currentWeather, amountDays);
    moreDetails.getMoreDetails(currentWeather);
    setBackgroundImage(currentWeather);
    hideLoadingScreen();
  }
}

async function showOverview() {
  console.log("showOverview", tempCity);
  renderLoadingScreen(`Lade Wetterdaten...`);
  let currentWeather = await getCurrentWeather(tempCity);

  const onSearchCity = async (query, updateSearchDataList) => {
    console.log("onSearchCity", query);
    if (query.length > 2) {
      const suggestions = await getCitySuggestions(query);
      console.log("suggestions", suggestions);
      updateSearchDataList(suggestions);
    }
  };

  const onSelectCity = (selectedValue) => {
    console.log("onSelectCity", selectedValue);
    showDetails(selectedValue.name);
  };

  const overView = new Overview({ onSearchCity, onSelectCity });

  //Todo schleife für localstorage Infos

  if (currentWeather) {
    hideLoadingScreen();
  }
}
