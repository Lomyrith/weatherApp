export class SearchField {
  constructor(container, options = {}) {
    this.container =
      typeof container == "string"
        ? document.querySelector(container)
        : container;

    this.placeholder = options.placeholder || "Suchen....";
    this.onSearch = options.onSearch || (() => {});
    this.delay = options.delay || 500;
    this.timeout = null;

    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="search-box">
        <input 
          type="text" 
          class="search-input" 
          placeholder="${this.placeholder}" 
          aria-label="Suchfeld"
        />
        <button class="clear-btn" style="display: none;" aria-label="Suche zurücksetzen">&times;</button>
      </div>
    `;

    this.input = this.container.querySelector(".search-input");
    this.clearBtn = this.container.querySelector(".clear-btn");

    this.input.addEventListener("input", (e) => this.handleInput(e));
    this.input.addEventListener("keydown", (e) => this.handleKeyDown(e));
    this.clearBtn.addEventListener("click", () => this.clear());
  }

  async handleInput(e) {
    const value = e.target.value?.trim();

    this.clearBtn.style.display = value ? "block" : "none";

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.onSearch(value);
    }, this.delay);
  }

  handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();

      clearTimeout(this.timeout);
      this.onSearch(this.input.value);
      const value = this.input.value.trim();
      this.onSearch(value);
    }
  }

  clear() {
    clearTimeout(this.timeout);
    this.input.value = "";
    this.clearBtn.style.display = "none";
    this.input.focus();
    this.onSearch("");
  }
}
