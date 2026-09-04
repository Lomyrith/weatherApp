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
