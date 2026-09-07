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
  }
}
