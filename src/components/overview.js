import { getAppRoot, rootElement } from "../main.js";
import { createElement } from "../utils.js";
import { setBackgroundImageForComponent } from "./background.js";
let isEditing = false;
export class Overview {
  constructor(
    favoriteData = [],
    { onSearchCity, onSelectCity, onDeleteFavorite },
  ) {
    this.favoriteCities = favoriteData;
    this.onSearchCity = onSearchCity;
    this.onSelectCity = onSelectCity;
    this.onDeleteFavorite = onDeleteFavorite;
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    getAppRoot().innerHTML = this.getOverviewTemplate();
    this.renderFavorites();
  }

  getOverviewTemplate() {
    return `
      <div class="overView">
        <div class="overView__Header">
          <h1 class="overView__Title">Wetter</h1>
          <a href="#" class="overView__changeButton">Bearbeiten</a>
        </div>
        <div class="overView__SearchContainer">
          <input 
            type="text" 
            class="overView__search-input" 
            placeholder="Suche nach Stadt...."
            autocomplete="off" 
          />
          <ul class="overView__searchSuggestions" style="display: none;"></ul>  
        </div>
        <ul class="overView__favorite__list"></ul>
      </div>`.trim();
  }

  bindEvents() {
    // Bearbeiten-Button Listener
    const changeBtn = getAppRoot().querySelector(".overView__changeButton");
    if (changeBtn) {
      changeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("change Button clicked");

        isEditing = rootElement.classList.toggle("is-editing");

        isEditing
          ? (changeBtn.textContent = "Fertig")
          : (changeBtn.textContent = "Bearbeiten");
      });
    }

    // Such-Input Listener
    const searchInput = getAppRoot().querySelector(".overView__search-input");
    const suggestionsList = getAppRoot().querySelector(
      ".overView__searchSuggestions",
    );

    if (searchInput) {
      searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter" || event.key === "Return") {
          event.preventDefault();

          const query = searchInput.value.trim();
          if (!query) return;

          console.log("search for", query);
          if (typeof this.onSearchCity === "function") {
            this.onSearchCity(query, (suggestions) =>
              this.updateSearchSuggestions(suggestions),
            );
          } else {
            alert("onSearchCity is not a function");
          }
        }
      });
    }

    document.addEventListener("click", (e) => {
      if (
        !searchInput.contains(e.target) &&
        !suggestionsList?.contains(e.target)
      ) {
        this.hideSuggestions();
      }
    });
  }

  updateSearchSuggestions(suggestions = []) {
    const suggestionsList = getAppRoot().querySelector(
      ".overView__searchSuggestions",
    );
    if (!suggestionsList) return;

    suggestionsList.innerHTML = "";

    if (suggestions && suggestions.length > 0) {
      suggestions.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add("overView__suggestion-item");

        const itemName = createElement(
          "span",
          "overView__suggestion-name",
          item.name,
        );
        const itemMeta = createElement(
          "span",
          "overView__suggestion-meta",
          `(${item.country} → ${item.region})`,
        );
        li.appendChild(itemName);
        li.appendChild(itemMeta);

        // Click-Event direkt auf das Element!
        li.addEventListener("click", () => {
          if (typeof this.onSelectCity === "function") {
            this.onSelectCity(item);
          }
          this.hideSuggestions();
        });

        suggestionsList.appendChild(li);
      });

      // Liste explizit einblenden (völlig unabhängig von Async/Await!)
      suggestionsList.style.display = "block";
    } else {
      this.hideSuggestions();
    }
  }

  hideSuggestions() {
    const suggestionsList = getAppRoot().querySelector(
      ".overView__searchSuggestions",
    );
    if (suggestionsList) {
      suggestionsList.style.display = "none";
    }
  }

  renderFavorites() {
    const favList = getAppRoot().querySelector(".overView__favorite__list");

    if (favList) {
      console.log("render FavList", this.favoriteCities);

      [...this.favoriteCities].forEach((item) => {
        console.log(item);

        let favorite = createElement("li", "overView__favorite__item");
        favorite.id = item.location.name;
        favorite.addEventListener("click", () => {
          console.log("favorite clicked", item.location.name);
          this.onSelectCity(item.location);
        });

        const header = createElement("div", "overView__favorite__header");
        const location = createElement("div", "overView__favorite__location");

        const cityName = createElement(
          "p",
          "overView__favorite__city",
          item.location.name,
        );
        const country = createElement(
          "p",
          "overView__favorite__country",
          item.location.country,
        );

        const temp = createElement(
          "span",
          "overView__favorite__temperature",
          item.current.temp_c,
        );
        const deleteButton = createElement(
          "button",
          "overView__favorite__deleteButton",
        );
        deleteButton.innerHTML = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          min-height="24px"
          min-width="24px"
          viewBox="0 -960 960 960"
          fill="current"
        >
          <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </svg>`;

        deleteButton.addEventListener("click", (e) => {
          e.stopPropagation(); //sitz! bleib! click soll nicht bis zur kartenebene aufsteigen.
          e.preventDefault();
          console.log("delete Button clicked");
          this.onDeleteFavorite(item.location.name); //geht da in Schleife
        });

        let subInfoText = item.current.condition.text;
        if (item.forecast.forecastday[0]?.day) {
          subInfoText += ` H:${item.forecast.forecastday[0].day.maxtemp_c}°C T:${item.forecast.forecastday[0].day.mintemp_c}°C`;
        }
        const subInfo = createElement(
          "p",
          "overView__favorite__subInfo",
          subInfoText,
        );

        header.appendChild(location);
        location.appendChild(cityName);
        location.appendChild(country);
        header.appendChild(temp);
        header.appendChild(deleteButton);
        favorite.appendChild(header);
        favorite.appendChild(subInfo);

        setBackgroundImageForComponent(favorite, item);

        favList.appendChild(favorite);
      });
    }
  }

  removeFromFavorites(city) {
    console.log("removeFromFavorites", city);
    if (city) {
      const favList = getAppRoot().querySelector(".overView__favorite__list");
      const fav = favList.querySelector(`#${city}`);
      if (fav) {
        console.log("removeFromFavorites", fav);
        favList.removeChild(fav);
      }
    }
  }
}
