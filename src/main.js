import "./styles/main.scss";
import { getForecastWeather } from "./weatherApi.js";
import { loadTopInfos } from "./components/topInfos.js";
import { Overview } from "./components/overview.js";
import { SearchField } from "./components/searchField.js";

export const rootElement = document.querySelector("#app");
let value = "London";

loadTopInfos(value);

// const overview = new Overview("#app");
// const searchField = new SearchField(".overView__SearchContainer", {
//   placeholder: "Suche nach einer Stadt....",
//   onSearch: async (value) => {
//     console.log(value + "test");
//     const currentWeather = await getForecastWeather(value);
//     console.log(currentWeather);
//     if (currentWeather) {
//       loadTopInfos(currentWeather);
//     }
//   },
// });

//loadTopInfos();

//document.querySelector("overView__changeButton").addEventListener("click", () => {
