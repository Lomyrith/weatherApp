import { rootElement } from "../main.js";
import { createElement } from "../utils.js";
import { setBackgroundImageForComponent } from "./background.js";

export class Overview {
  constructor(favoriteData = [], { onSearchCity, onSelectCity }) {
    this.favoriteCities = favoriteData;
    this.onSearchCity = onSearchCity;
    this.onSelectCity = onSelectCity;
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    rootElement.innerHTML = this.getOverviewTemplate();

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
    const changeBtn = rootElement.querySelector(".overView__changeButton");
    if (changeBtn) {
      changeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("change Button clicked");
      });
    }

    // Such-Input Listener
    const searchInput = rootElement.querySelector(".overView__search-input");
    const suggestionsList = rootElement.querySelector(
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
    const suggestionsList = rootElement.querySelector(
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
    const suggestionsList = rootElement.querySelector(
      ".overView__searchSuggestions",
    );
    if (suggestionsList) {
      suggestionsList.style.display = "none";
    }
  }

  renderFavorites() {
    const favList = rootElement.querySelector(".overView__favorite__list");

    if (favList) {
      console.log("render FavList", this.favoriteCities);

      [...this.favoriteCities].forEach((item) => {
        console.log(item);

        let favorite = createElement("li", "overView__favorite__item");

        favorite.addEventListener("click", () => {
          console.log("favorite clicked", item.location.name);
          this.onSelectCity(item.location);
        });

        //TOdo background --favorite-${favorite_city}-condition-image
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

        let subInfoText = item.current.condition.text;
        if (item.forecast.forecastday[0]?.day) {
          subInfoText += ` H:${item.forecast.forecastday[0].day.maxtemp_c} T:${item.forecast.forecastday[0].day.mintemp_c}°C`;
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
        favorite.appendChild(header);
        favorite.appendChild(subInfo);

        setBackgroundImageForComponent(favorite, item);

        favList.appendChild(favorite);
      });
    }
  }
}
