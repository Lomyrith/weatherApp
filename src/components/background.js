import { getConditionImagePath } from "./conditions.js";

export function setBackgroundImageForComponent(component, data) {
  if (!component) return;

  const conditionImagePath = getConditionImagePath(
    data.current.condition.code,
    data.current.is_day,
  );

  if (conditionImagePath) {
    if (!component.classList.contains("showBackground")) {
      component.classList.add("showBackground");
    }
    component.style = `--detail-condition-image: url(${conditionImagePath});`;

    component.classList.toggle("is-dark-background", data.current.is_day === 0);

    component.classList.toggle(
      "is-light-background",
      data.current.is_day === 1,
    );
  }
}
