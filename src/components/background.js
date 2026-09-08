import { rootElement } from "../main.js";
import { getConditionImagePath } from "./conditions.js";
import { logConsole } from "../utils.js";

export function setBackgroundImage(data) {
  const conditionImagePath = getConditionImagePath(
    data.current.condition.code,
    data.current.is_day,
  );

  if (conditionImagePath) {
    if (!rootElement.classList.contains("showBackground")) {
      rootElement.classList.add("showBackground");
    }
    rootElement.style = `--detail-condition-image: url(${conditionImagePath});`;

    rootElement.classList.toggle(
      "is-dark-background",
      data.current.is_day === 0,
    );

    rootElement.classList.toggle(
      "is-light-background",
      data.current.is_day === 1,
    );
  }
}
