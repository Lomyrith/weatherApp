export function createElement(tag, className, innerText) {
  const element = document.createElement(tag);
  element.className = className;
  if (innerText !== undefined) {
    element.innerText = innerText;
  }
  return element;
}

export function logConsole(log1, log2) {
  console.log(`###${log1}`);
  console.log(log2);
}

export const formatTime = (timeOriginal) => {
  if (!timeOriginal) return "";

  const [time, modifier] = timeOriginal.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const d = new Date();
  d.setHours(hours, minutes, 0, 0);

  const userLocale = navigator.language || "de-DE";

  const formattedTime = d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return userLocale.startsWith("de") ? `${formattedTime} Uhr` : formattedTime;
};
