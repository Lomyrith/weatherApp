import { getAppRoot } from "../main.js";
import { createElement } from "../utils";

export async function loadDetailHeaderInfos(
  value = "Berlin",
  { goBack, setFavorite },
) {
  renderDetailHeaderInfos(goBack, setFavorite);
}

function renderDetailHeaderInfos(goBack, setFavorite) {
  const detailHeaders = getdetailHeadersHtml();
  getAppRoot().innerHTML += detailHeaders;

  const header = getAppRoot().querySelector(".detailHeader__top");
  header.prepend(getBackButton(goBack));
  header.append(getFavoriteButton(setFavorite));
  console.log("header detailHeaders", header);
}

function getdetailHeadersHtml() {
  const component = `
      <div class="detailHeader">
      <div class="detailHeader__top">  
        <h2 class="detailHeader__location">Entenhausen</h2>
      </div>
        <h1 class="detailHeader__temperature">36</h1>
        <p class="detailHeader__condition">Wüste</p>
        <div class="detailHeader_dayTemperatures">
          <span class="detailHeader__maxTemperature">45</span>
          <span class="detailHeader__minTemperature">19</span>
        </div>
      </div>`;

  return component;
}

function getBackButton(goBack) {
  const backBtn = createElement("button", "detailHeader__backButton");
  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("goBack");
    goBack();
  });

  backBtn.innerHTML = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
    >
      <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
    </svg>`;

  return backBtn;
}

function getFavoriteButton(setFavorite) {
  const favoriteBtn = createElement("button", "detailHeader__backButton");
  favoriteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("setFavorite");
    const currentLocation = getAppRoot().querySelector(
      ".detailHeader__location",
    )?.textContent;
    setFavorite(currentLocation);
  });
  favoriteBtn.innerHTML = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
    >
      <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
    </svg>`;

  return favoriteBtn;
}

export function setDetailHeaderInfos(data) {
  const location = data.location.name;
  const temperature = data.current.dewpoint_c;
  console.log("setdetailHeaders " + location);
  const condition = data.current.condition.text;

  //forecast.forecastday[0].day
  const maxTemperature = data.forecast.forecastday[0].day.maxtemp_c;
  const minTemperature = data.forecast.forecastday[0].day.mintemp_c;

  getAppRoot().querySelector(".detailHeader__location").textContent = location;
  getAppRoot().querySelector(".detailHeader__temperature").textContent =
    temperature;
  getAppRoot().querySelector(".detailHeader__condition").textContent =
    condition;

  getAppRoot().querySelector(".detailHeader__maxTemperature").textContent =
    maxTemperature;
  getAppRoot().querySelector(".detailHeader__minTemperature").textContent =
    minTemperature;
}

/*

*/
