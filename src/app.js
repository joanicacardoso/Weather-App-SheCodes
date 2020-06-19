// Set local time
function formatDate(timestamp) {
  let currentdate = new Date(timestamp);
  let date = currentdate.getDate();
  let hours = currentdate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = currentdate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[currentdate.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[currentdate.getMonth()];
  return `${day}, ${month} ${date}</br>${hours}:${minutes}`;
}

//Search Engine

function showTemperature(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  celsiusTemp = response.data.main.temp;
  document.querySelector("#temperature").innerHTML = Math.round(celsiusTemp);
  savedTemperature = Math.round(response.data.main.temp);
  document.querySelector("#current-condition").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#date").innerHTML = formatDate(
    response.data.dt * 1000
  );
  let icon = document.querySelector("#icon");
  icon.setAttribute("src", `img/${response.data.weather[0].icon}.svg`);
}

function formatHours(timestamp) {
  let currentdate = new Date(timestamp);
  let hours = currentdate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = currentdate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;
  for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `<div class="col">
                    <p>${formatHours(forecast.dt * 1000)}</p>
                    <img id="icon-forecast" src="img/${
                      forecast.weather[0].icon
                    }.svg" width="30" height="30" alt="icon">
                    <p class="forecast-temp"> <span id="min-temp">${Math.round(
                      forecast.main.temp_min
                    )}</span>º <span id="max-temp">${Math.round(
      forecast.main.temp_max
    )}</span>º</p>
                </div>`;
  }
}

function search(city) {
  let apiKey = "48f466c2eeef74f8d4b3c29e67806457";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function searchCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  search(city);
}

let cityForm = document.querySelector("#search-form");
cityForm.addEventListener("submit", searchCity);

let savedTemperature = 0;

// Current location

function retrievePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "48f466c2eeef74f8d4b3c29e67806457";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}
let buttonCurrentLocation = document.querySelector("#current-location");
buttonCurrentLocation.addEventListener("click", getPosition);

// Change temperature units - WIP

function convertCel(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#temperature");
  let minTemp = document.querySelector("#min-temp");
  let maxTemp = document.querySelector("#max-temp");
  currentTemp.innerHTML = Math.round(celsiusTemp);
  minTemp.innerHTML = Math.round(celsiusTemp);
  maxTemp.innerHTML = Math.round(celsiusTemp);
  celsiusButton.classList.add("active");
  fahrButton.classList.remove("active");
}

function convertFah(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#temperature");
  let minTemp = document.querySelector("#min-temp");
  let maxTemp = document.querySelector("#max-temp");
  let fTemp = (celsiusTemp * 9) / 5 + 32;
  currentTemp.innerHTML = Math.round(fTemp);
  minTemp.innerHTML = Math.round(fTemp);
  maxTemp.innerHTML = Math.round(fTemp);
  celsiusButton.classList.remove("active");
  fahrButton.classList.add("active");
}
search("Lisbon");
let celsiusTemp = null;

let fahrButton = document.querySelector("#fahr");
fahrButton.addEventListener("click", convertFah);

let celsiusButton = document.querySelector("#celsius");
celsiusButton.addEventListener("click", convertCel);
