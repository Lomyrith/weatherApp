import { getAppRoot } from "../main.js";

export function appendForecastUI(component) {
  if (!component) {
    component = getAppRoot();
  }
  const forecastHtml = getForecastHtml();
  component.appendChild(forecastHtml);
}

export function setForecastData(data) {
  if (data) {
    //console.log("setForecastData");
    //console.log(data);

    let hours = getNext24Hours(data);

    const infoElement = document.querySelector(".forecast__Info");
    infoElement.textContent = `Heute ${data.current.condition.text}, Wind bis zu ${data.current.wind_kph} km/h`;
    //böen gust_kph

    let list = document.querySelector(".forecast__hours__list");
    if (list) {
      hours.forEach((hour) => {
        //console.log(hour);
        var hourListItem = getForecastListItem(hour);
        list.appendChild(hourListItem);
      });
    }
  }
}

function getForecastHtml(hourInfo) {
  const template = document.createElement("template");
  template.innerHTML = `
       <div class="forecast">
         <p class="forecast__Info">
          </p>
         <ol class="forecast__hours__list" data-sort-by="time_epoch">
         </ol>       
       </div>`.trim();
  const forecastNode = template.content.firstElementChild;
  const infoElement = forecastNode.querySelector(".forecast__Info");
  const fallbackText =
    "Ob es heute sonnig wird, siehts du wenn die Daten kommen";
  infoElement.textContent = `{ ${hourInfo ?? fallbackText} }`;

  const scrollList = forecastNode.querySelector(".forecast__hours__list");

  scrollList.addEventListener(
    "wheel",
    (event) => {
      if (event.deltaY !== 0) {
        event.preventDefault();
        scrollList.scrollLeft += event.deltaY;
      }
    },
    { passive: false },
  );

  return forecastNode;
}

function getForecastListItem(hourInfo) {
  const template = document.createElement("template");
  template.innerHTML = `
        <div class="forecast__hour">
          <p class="forecast__hour__date">Jetzt</p>
          <img class="forecast__hour__image" src="https://openweathermap.org/img/wn/01d.png" alt="Sonnig" />
          <p class="forecast__hour__temperature">19°C</p>
        </div>`.trim();

  const forecastItemNode = template.content.firstElementChild;
  const timeElement = forecastItemNode.querySelector(".forecast__hour__date");
  const image = forecastItemNode.querySelector(".forecast__hour__image");
  const temperatureElement = forecastItemNode.querySelector(
    ".forecast__hour__temperature",
  );
  //console.log(hourInfo);

  const formattedTime = new Date(hourInfo.time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  timeElement.textContent = formattedTime;
  image.src = hourInfo.condition.icon;
  temperatureElement.textContent = hourInfo.temp_c;
  return forecastItemNode;
}

function getNext24Hours(currentWeather) {
  if (
    !currentWeather?.forecast?.forecastday ||
    currentWeather.forecast.forecastday.length < 2
  ) {
    alert(
      "Es sind noch keine Wetterdaten für die nächsten 24 Stunden verfügbar",
    );
    return [];
  }
  const currentEpoch = currentWeather.location.localtime_epoch;

  const next24Hours = [
    ...(currentWeather.forecast.forecastday[0].hour ?? []),
    ...(currentWeather.forecast.forecastday[1].hour ?? []),
  ]
    .filter((hour) => hour?.time_epoch >= currentEpoch)
    .slice(0, 24);

  return next24Hours;
}
