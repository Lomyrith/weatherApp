export class Overview {
  constructor(container) {
    this.container =
      typeof container == "string"
        ? document.querySelector(container)
        : container;

    this.init();
  }

  init() {
    this.container.innerHTML = `
       <div class="overView">
        <div class="overView__Header">
          <h1 class="overView__Title">Wetter</h1>
          <a href="#" class="overView__changeButton">Bearbeiten</a>
        </div>
        <div class="overView__SearchContainer">Suche</div>
        <div class="overView__Favorites">Favoriten</div>
      </div>
    `;
  }
}
