const API_KEY = "1f513f9568d542cc8c4112817263108";
const API_URL = "https://api.weatherapi.com/v1/";
//https://api.weatherapi.com/v1/current.json?key=1f513f9568d542cc8c4112817263108&q=Arnsberg
export async function getCurrentWeather(location = "Arnsberg") {
  const url = `${API_URL}/current.json?key=${API_KEY}&q=${location}`;

  const response = await fetch(url);

  const data = await response.json();

  return data;
}

export async function getForecastWeather(location = "Arnsberg", days = 1) {
  //http://api.weatherapi.com/v1/forecast.json?key={}&q=Arnsberg&days=1&aqi=no&alerts=no
  const url = `${API_URL}/forecast.json?key=${API_KEY}&q=${location}&days=${days}&aqi=no&alerts=no`;

  const response = await fetch(url);

  const data = await response.json();

  return data;
}
