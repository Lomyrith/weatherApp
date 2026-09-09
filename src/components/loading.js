export function renderLoadingScreen(message = "Lade Daten...") {
  let loading = document.querySelector(".loading");

  if (!loading) {
    document.body.insertAdjacentHTML("beforeend", getLoadingHtml(message));
  }
}

export function showLoadingScreen(message = "Lade Daten...") {
  let loading = document.querySelector(".loading");

  if (!loading) {
    renderLoadingScreen(message);
    loading = document.querySelector(".loading");
  }

  loading.style.display = "flex";
}

export function hideLoadingScreen() {
  const loading = document.querySelector(".loading");

  if (loading) {
    loading.style.display = "none";
  }
}

function getLoadingHtml(message = "Lade Daten...") {
  const component = `
      <div class="loading">
        <div class="loading__message">${message}</div>
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
