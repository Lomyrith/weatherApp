import { rootElement } from "../main.js";

export function renderLoadingScreen(message = "Lade Daten...") {
  rootElement.innerHTML = getLoadingHtml(message);
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
