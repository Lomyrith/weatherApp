import { rootElement } from "../main";
import { createElement } from "../utils";

export function getDetailHeader({ goBack, setFavorite }) {
  getTemplate({ goBack, setFavorite });
}

function getTemplate({ goBack, setFavorite }) {
  const container = createElement("div", "detailHeader");
  const backBtn = createElement("button", "detailHeader__backButton");
  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("goBack");
    goBack();
  });

  const favoriteBtn = createElement("button", "detailHeader__favoriteButton");
  favoriteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const city = document.querySelector(".topInfo__Location");
    console;
    setFavorite(city?.textContent);
  });

  container.appendChild(backBtn);
  container.appendChild(favoriteBtn);

  rootElement.appendChild(container);
}
