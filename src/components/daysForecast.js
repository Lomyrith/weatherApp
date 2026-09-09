import { createElement } from "../utils.js";

export function appendDailyForecastUI(component) {
  if (!component) {
    return;
  }
  const dailyForecastHtml = getDailyForecastContainertHtml();
  component.appendChild(dailyForecastHtml);
}

export function setDailyForecastData(data, amountDays = 3) {
  if (data) {
    //logConsole("setDailyForecastData", data);

    let days = getNextDays(data, amountDays);

    const infoElement = document.querySelector(".dailyForecast__info");
    infoElement.textContent = `Vorhersage für die nächsten ${amountDays} Tage:`;

    let list = document.querySelector(".dailyForecast__list");
    if (list) {
      days.forEach((day) => {
        //logConsole("day", day);
        var dayListItem = getDailyForecastListItem(day, list);
      });
    }
  }
}

function getNextDays(currentWeather, amountDays) {
  if (
    !currentWeather?.forecast?.forecastday ||
    currentWeather.forecast.forecastday.length < amountDays
  ) {
    alert(`Es sind noch keine Daten für ${amountDays} Tage verfügbar`);
    return [];
  }

  const currentDay = new Date(currentWeather.location.localtime_epoch * 1000)
    ?.toISOString()
    .split("T")[0];

  const nextDays = [...(currentWeather.forecast.forecastday ?? [])]
    .filter((day) => day?.date >= currentDay)
    .slice(0, amountDays);

  //logConsole("nextDays", nextDays);
  return nextDays;
}

function getDailyForecastContainertHtml() {
  console.log("getDailyForecastContainertHtml");
  const template = document.createElement("template");
  template.innerHTML = `
        <div class="dailyForecast">
          <p class="dailyForecast__info">
          Info
          </p>
          <lo class="dailyForecast__list" data-sort-by="time_epoch">
          </lo>       
        </div>`.trim();

  return template.content.firstElementChild;
}

function getDailyForecastListItem(day, list) {
  //logConsole("getDailyForecastListItem day", day);

  if (!list || !day) {
    alert("Tageslisten nicht vorhanden!");
  }

  const today = new Date().toLocaleDateString("sv-SE");
  const dateText =
    today === day.date
      ? "Heute"
      : new Date(day.date).toLocaleDateString("de-DE", {
          weekday: "short",
        });

  const itemContainer = createElement("div", "dailyForecast__item");

  const daySpan = createElement("span", "dailyForecast__date", dateText);
  const icon = createElement("img", "dailyForecast__icon");
  icon.src = day.day.condition.icon;
  const maxTemperature = createElement(
    "span",
    "dailyForecast__MaxTemperature",
    day.day.maxtemp_c,
  );
  const minTemperature = createElement(
    "span",
    "dailyForecast__MinTemperature",
    day.day.mintemp_c,
  );
  const maxWind = createElement(
    "span",
    "dailyForecast__MaxWind",
    day.day.maxwind_kph,
  );

  itemContainer.appendChild(daySpan);
  itemContainer.appendChild(icon);
  itemContainer.appendChild(maxTemperature);
  itemContainer.appendChild(minTemperature);
  itemContainer.appendChild(maxWind);

  list.appendChild(itemContainer);
}
