import { rootElement } from "../main.js";

export function renderLoadingScreen(message = "Lade Daten...") {
  rootElement.innerHTML = getLoadingHtml(message);
}

export function showLoadingScreen(message = "Lade Daten...") {
  let loading = rootElement.querySelector(".loading");
  if (!loading) {
    this.renderLoadingScreen(message);
  } else {
    loading.style.display = "flex";
  }
}

export function hideLoadingScreen(message = "Lade Daten...") {
  console.log("hideLoadingScreen");
  console.log(rootElement);
  console.log(rootElement.classList);
  var loading = rootElement.querySelector(".loading");

  if (!loading) {
    return;
  } else {
    console.log("hideLoadingScreen--hide");
    loading.style.display = "none";
  }
}

function getLoadingHtml(message = "Lade Daten...") {
  const component = `
      <div class="loading">
        <div class="loading_message">${message}</div>
        <div class="lds-default">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>`;

  return component;
}
