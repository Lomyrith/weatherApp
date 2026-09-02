import "./styles/main.scss";
import {
  renderLoadingScreen,
  hideLoadingScreen,
} from "./components/loading.js";
import { getForecastWeather } from "./weatherApi.js";
import { Overview } from "./components/overview.js";
import { loadTopInfos, setTopInfos } from "./components/topInfos.js";
import * as forecast from "./components/hoursForecast.js";

export const rootElement = document.querySelector("#app");
let value = "Arnsberg";

showDetails(value);

async function showDetails(value) {
  console.log("showDetails");
  console.log(value);
  renderLoadingScreen(`Lade Wetterdaten für ${value}...`);
  loadTopInfos(value);
  forecast.appendForecastUI(rootElement);
  let currentWeather = await getForecastWeather(value);

  if (currentWeather) {
    setTopInfos(currentWeather);
    console.log(currentWeather);
    forecast.setForecastData(currentWeather);
    hideLoadingScreen();
  }
}

// const overview = new Overview("#app");
// const searchField = new SearchField(".overView__SearchContainer", {
//   placeholder: "Suche nach einer Stadt....",
//   onSearch: async (value) => {
//     console.log(value + "test");
//     const currentWeather = await getForecastWeather(value);
//     console.log(currentWeather);
//     if (currentWeather) {
//       loadTopInfos(currentWeather);
//     }
//   },
// });

//loadTopInfos();

//document.querySelector("overView__changeButton").addEventListener("click", () => {
