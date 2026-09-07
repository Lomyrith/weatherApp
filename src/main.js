import "./styles/main.scss";
import {
  renderLoadingScreen,
  hideLoadingScreen,
} from "./components/loading.js";
import { getForecastWeather } from "./weatherApi.js";
import { Overview } from "./components/overview.js";
import { setBackgroundImage } from "./components/background.js";
import { loadTopInfos, setTopInfos } from "./components/topInfos.js";
import * as forecast from "./components/hoursForecast.js";
import * as dailyForecast from "./components/daysForecast.js";
import * as moreDetails from "./components/moreDetails.js";

export const rootElement = document.querySelector("#app");
let value = "Dänemark";
let amountDays = 3;

showDetails(value);

async function showDetails(value) {
  console.log("showDetails");
  console.log(value);
  renderLoadingScreen(`Lade Wetterdaten für ${value}...`);
  loadTopInfos(value);
  forecast.appendForecastUI(rootElement);
  dailyForecast.appendDailyForecastUI(rootElement);
  let currentWeather = await getForecastWeather(value, amountDays);

  if (currentWeather) {
    setBackgroundImage(currentWeather);
    setTopInfos(currentWeather);

    forecast.setForecastData(currentWeather);
    dailyForecast.setDailyForecastData(currentWeather, amountDays);
    moreDetails.getMoreDetails(currentWeather);
    hideLoadingScreen();
  }
}
