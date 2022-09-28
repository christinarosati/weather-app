// DISPLAY DAY & TIME

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  return `${day}, ${hour}:${minute}`;
}

// WEATHER API

function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");

  let days = ["Wed", "Thu", "Fri", "Sat", "Sun"];

  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
    <div class="col-2">
    <div class="forecast-date">${day}</div>
      <img
       src="#"
       width="42"
       />
    <div class="forecast-temperature">
      <span class="forecast-temperature-max">
        18°
      </span>
      <span class="forecast-temperature-min">
        12°
      </span>
    </div>  
    </div>
    `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "c819171fe0abdc14039af4ef5dda283b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showCityTemperature(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#windspeed").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#day-time").innerHTML = formatDate(
    response.data.dt * 1000
  );
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#icon")
    .setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiKey = "f3009e4852fa0a079dab291dabf020c4";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showCityTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

function searchCity(city) {
  let units = "metric";
  let apiKey = "f3009e4852fa0a079dab291dabf020c4";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showCityTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city-form-input").value;
  searchCity(city);
}

function showFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celciusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function showCelciusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celciusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let form = document.querySelector("#search-city-form");
form.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celciusLink = document.querySelector("#celsius-link");
celciusLink.addEventListener("click", showCelciusTemperature);

searchCity("Montreal");
