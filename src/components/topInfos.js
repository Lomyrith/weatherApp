import { rootElement } from "../main.js";
import { renderLoadingScreen } from "./loading.js";
import { getForecastWeather } from "../weatherApi.js";

export async function loadTopInfos(value = "Arnsberg") {
  renderLoadingScreen(`Lade Wetterdaten für ${value}...`);

  let currentWeather = await getForecastWeather(value);
  console.log(currentWeather);
  if (currentWeather) {
    renderTopInfos();
    setTopInfos(currentWeather);
  }
}

function renderTopInfos() {
  const topInfos = getTopInfosHtml();
  rootElement.innerHTML = topInfos;
}

function getTopInfosHtml() {
  const component = `
      <div class="topInfo">
        <h2 class="topInfo__Location">Entenhausen</h2>
        <h1 class="topInfo__Temperature">36</h1>
        <p class="topInfo__Condition">Wüste</p>
        <div class="topInfo_dayTemperatures">
          <span class="topInfo__maxTemperature">45</span>
          <span class="topInfo__minTemperature">19</span>
        </div>
      </div>`;

  return component;
}

export function setTopInfos(data) {
  const location = data.location.name;
  const temperature = data.current.dewpoint_c;
  console.log("setTopInfos " + location);
  const condition = data.current.condition.text;

  //forecast.forecastday[0].day
  const maxTemperature = data.forecast.forecastday[0].day.maxtemp_c;
  const minTemperature = data.forecast.forecastday[0].day.mintemp_c;

  rootElement.querySelector(".topInfo__Location").textContent = location;
  rootElement.querySelector(".topInfo__Temperature").textContent = temperature;
  rootElement.querySelector(".topInfo__Condition").textContent = condition;

  rootElement.querySelector(".topInfo__maxTemperature").textContent =
    maxTemperature;
  rootElement.querySelector(".topInfo__minTemperature").textContent =
    minTemperature;
}

/*

*/
