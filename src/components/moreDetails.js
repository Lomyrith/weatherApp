import { logConsole, createElement } from "../utils.js";
import { rootElement } from "../main.js";

export function getMoreDetails(data) {
  logConsole("getMoreDetailsHtml", data);

  const moreDetails = createElement("div", "moreDetails__container");
  rootElement.appendChild(moreDetails);

  moreDetails.appendChild(
    createInfoBox("Feuchtigkeit", data.current.humidity, "humidity"),
  );
  moreDetails.appendChild(
    createInfoBox("Test1", data.current.humidity, "humidity"),
  );
  moreDetails.appendChild(
    createInfoBox("Test2", data.current.humidity, "humidity", true),
  );
}

function createInfoBox(title, value, subclass, wideBox = false) {
  const infoBox = createElement(
    "div",
    `moreDetails__infoBox${wideBox ? "--wide" : ""}`,
  );

  const titleElement = createElement(
    "h3",
    "moreDetails__infoBox__title",
    title,
  );
  titleElement.classList.add(subclass);

  const valueElement = createElement("p", "moreDetails__infoBox__value", value);
  valueElement.classList.add(subclass);

  infoBox.appendChild(titleElement);
  infoBox.appendChild(valueElement);
  return infoBox;
}
