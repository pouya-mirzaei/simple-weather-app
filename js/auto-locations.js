const weatherCodes = [
  { code: 0, description: 'Clear sky' },
  { code: 1, description: 'Mainly clear, partly cloudy, and overcast' },
  { code: 2, description: 'Mainly clear, partly cloudy, and overcast' },
  { code: 3, description: 'Mainly clear, partly cloudy, and overcast' },
  { code: 45, description: 'Fog and depositing rime fog' },
  { code: 48, description: 'Fog and depositing rime fog' },
  { code: 51, description: 'Drizzle: Light, moderate, and dense intensity' },
  { code: 53, description: 'Drizzle: Light, moderate, and dense intensity' },
  { code: 58, description: 'Drizzle: Light, moderate, and dense intensity' },
  { code: 56, description: 'Freezing Drizzle: Light and dense intensity' },
  { code: 57, description: 'Freezing Drizzle: Light and dense intensity' },
  { code: 61, description: 'Rain: Slight, moderate and heavy intensity' },
  { code: 63, description: 'Rain: Slight, moderate and heavy intensity' },
  { code: 65, description: 'Rain: Slight, moderate and heavy intensity' },
  { code: 66, description: 'Freezing Rain: Light and heavy intensity' },
  { code: 67, description: 'Freezing Rain: Light and heavy intensity' },
  { code: 71, description: 'Snow fall: Slight, moderate, and heavy intensity' },
  { code: 73, description: 'Snow fall: Slight, moderate, and heavy intensity' },
  { code: 75, description: 'Snow fall: Slight, moderate, and heavy intensity' },
  { code: 77, description: 'Snow grains' },
  { code: 80, description: 'Rain showers: Slight, moderate, and violent' },
  { code: 81, description: 'Rain showers: Slight, moderate, and violent' },
  { code: 82, description: 'Rain showers: Slight, moderate, and violent' },
  { code: 85, description: 'Snow showers slight and heavy' },
  { code: 86, description: 'Snow showers slight and heavy' },
  { code: 95, description: 'Thunderstorm: Slight or moderate' },
  { code: 96, description: 'Thunderstorm with slight and heavy hail' },
  { code: 99, description: 'Thunderstorm with slight and heavy hail' },
];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const highLow = document.querySelector('.hi-low');
const currentTemp = document.querySelector('.temp');
const weather = document.querySelector('.weather');
// const searchInput = document.querySelector('.search-box');
const startBtn = document.getElementById('btn');
const loader = document.querySelector('.app-loader');
const searchResult = document.querySelector('.search-result');
const cityOutput = document.querySelector('.city');
const dateOutput = document.querySelector('.date');

let weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=51.5072&longitude=0.1276&howeatherApiy=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto&forecast_days=1`;
// let cityNameApi = `https://api.api-ninjas.com/v1/geocoding?city=${cityName}`;

// event listeners

startBtn.addEventListener('click', () => {
  activeLoader();
  handleGeo();
});

function activeLoader() {
  loader.style.display = 'flex';
}
function loaderOff() {
  loader.style.display = 'none';
}

// handling current user location

async function handleGeo() {
  navigator.geolocation.getCurrentPosition((pos) => {
    console.log(pos);

    getCityInfo(pos.coords.latitude, pos.coords.longitude).then((res) => {
      processCoords(res);
    });
  });
}

async function getCityInfo(lat, lon) {
  let reverseGeoCode = `https://api.api-ninjas.com/v1/reversegeocoding?lat=${lat}&lon=${lon}`;

  const res = await fetch(reverseGeoCode, {
    headers: {
      'X-Api-Key': 'ln6LX2iXbPDWlinal0qWBQ==F3ooB8uo1zi4mn0f',
    },
  });

  const data = await res.json();
  return { ...data[0], lat, lon };
}

function processCoords(city) {
  let { lat, lon, name, country } = city;

  // console.log(lat, lon);

  let weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&howeatherApiy=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto&forecast_days=1`;

  getData(weatherApi, parsWeatherData);

  processCityNames(name, country);
}

function processCityNames(cityName, country) {
  cityOutput.innerHTML = `${cityName} , ${country}`;
}

function getData(apiLink, callback, headers = null) {
  fetch(apiLink, headers)
    .then((res) => res.json())
    .then((res) => {
      //   console.log(res);
      callback(res);
    })
    .catch((err) => console.log(err));
}

function parsWeatherData(data) {
  const unit = data.daily_units.temperature_2m_min;

  let currentTemp = data.current_weather.temperature;
  let minTemp = data.daily.temperature_2m_min[0];
  let maxTemp = data.daily.temperature_2m_max[0];

  processDate(data.current_weather.time);
  processCurrentTemp(currentTemp, unit);
  processHighLowTemp(maxTemp, minTemp, unit);
  processWeatherCode(data.current_weather.weathercode);
  loaderOff();
  document.querySelector('main').style.display = 'flex';
}

function processHighLowTemp(high, low, unit) {
  highLow.textContent = `${low}${unit} / ${high}${unit}`;
}

function processCurrentTemp(currentTemperature, unit) {
  currentTemp.innerHTML = `${currentTemperature}<span>${unit}</span>`;
}

function processWeatherCode(weatherCode) {
  let weatherStatus = weatherCodes.find((code) => weatherCode === code.code);
  weather.textContent = weatherStatus.description;
}

function processDate(date) {
  let cityDate = new Date(date);

  let day = days[cityDate.getDay()];
  let dateNumber = cityDate.getDate();
  let month = months[cityDate.getMonth()];
  let year = cityDate.getFullYear();

  dateOutput.textContent = `${day} ${dateNumber} ${month} ${year}`;
}
