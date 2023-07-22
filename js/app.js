//  VARIABLES
const weatherCodes = [
    { code: 0, description: "Clear sky" },
    { code: 1, description: "Mainly clear, partly cloudy, and overcast" },
    { code: 2, description: "Mainly clear, partly cloudy, and overcast" },
    { code: 3, description: "Mainly clear, partly cloudy, and overcast" },
    { code: 45, description: "Fog and depositing rime fog" },
    { code: 48, description: "Fog and depositing rime fog" },
    { code: 51, description: "Drizzle: Light, moderate, and dense intensity" },
    { code: 53, description: "Drizzle: Light, moderate, and dense intensity" },
    { code: 58, description: "Drizzle: Light, moderate, and dense intensity" },
    { code: 56, description: "Freezing Drizzle: Light and dense intensity" },
    { code: 57, description: "Freezing Drizzle: Light and dense intensity" },
    { code: 61, description: "Rain: Slight, moderate and heavy intensity" },
    { code: 63, description: "Rain: Slight, moderate and heavy intensity" },
    { code: 65, description: "Rain: Slight, moderate and heavy intensity" },
    { code: 66, description: "Freezing Rain: Light and heavy intensity" },
    { code: 67, description: "Freezing Rain: Light and heavy intensity" },
    { code: 71, description: "Snow fall: Slight, moderate, and heavy intensity" },
    { code: 73, description: "Snow fall: Slight, moderate, and heavy intensity" },
    { code: 75, description: "Snow fall: Slight, moderate, and heavy intensity" },
    { code: 77, description: "Snow grains" },
    { code: 80, description: "Rain showers: Slight, moderate, and violent" },
    { code: 81, description: "Rain showers: Slight, moderate, and violent" },
    { code: 82, description: "Rain showers: Slight, moderate, and violent" },
    { code: 85, description: "Snow showers slight and heavy" },
    { code: 86, description: "Snow showers slight and heavy" },
    { code: 95, description: "Thunderstorm: Slight or moderate" },
    { code: 96, description: "Thunderstorm with slight and heavy hail" },
    { code: 99, description: "Thunderstorm with slight and heavy hail" },
];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = [
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

const highLow = document.querySelector(".hi-low");
const currentTemp = document.querySelector(".temp");
const weather = document.querySelector(".weather");
const searchInput = document.querySelector(".search-box");
const searchResult = document.querySelector(".search-result");
const cityOutput = document.querySelector(".city");
const dateOutput = document.querySelector(".date");

let weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=51.5072&longitude=0.1276&howeatherApiy=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto&forecast_days=1`;

//  EVENT LISTENERS

searchInput.addEventListener("input", search);
searchInput.addEventListener("blur", () => {
    setTimeout(() => {
        disableSearchResult();
    }, 1000);
});

window.addEventListener("load", () => {
    getData(weatherApi, parsWeatherData);
});

// FUNCTIONS :

// API

function getData(apiLink, callback, headers = null) {
    fetch(apiLink, headers)
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            callback(res);
        })
        .catch((err) => console.log(err));
}

// WEATHER DATA

function parsWeatherData(data) {
    const unit = data.daily_units.temperature_2m_min;

    let currentTemp = data.current_weather.temperature;
    let minTemp = data.daily.temperature_2m_min[0];
    let maxTemp = data.daily.temperature_2m_max[0];

    processDate(data.current_weather.time);
    processCurrentTemp(currentTemp, unit);
    processHighLowTemp(maxTemp, minTemp, unit);
    processWeatherCode(data.current_weather.weathercode);
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

function processCityNames(cityName, country) {
    cityOutput.innerHTML = `${cityName} , ${country}`;
}

// SEARCHING PROCESS

function search() {
    if (!searchInput.value) {
        disableSearchResult();
        return;
    }

    let cityName = searchInput.value;
    setTimeout(() => {
        // checking for if users is still typing
        if (cityName !== searchInput.value) {
            return;
        }

        let cityNameApi = `https://api.api-ninjas.com/v1/geocoding?city=${cityName}`;

        let headers = {
            headers: {
                "X-Api-Key": "ln6LX2iXbPDWlinal0qWBQ==F3ooB8uo1zi4mn0f",
            },
        };

        // console.log("stopped");

        getData(cityNameApi, parseCityNames, headers);
    }, 500);
}

function parseCityNames(cities) {
    clearSearchBox();
    if (!cities[0]) {
        showSearchResult();
        let liError = document.createElement("li");
        liError.textContent = "City not found , try again ...";
        liError.classList.add("not-found");

        searchResult.append(liError);

        return;
    }

    showSearchResult();
    cities.forEach((city) => {
        let newCity = document.createElement("li");
        if (city.state) {
            newCity.textContent = `${city.name}, ${city.state}, ${city.country}`;
        } else {
            newCity.textContent = `${city.name}, ${city.country}`;
        }

        newCity.addEventListener("click", () => {
            processCoords(city);
        });

        searchResult.append(newCity);
    });
}

function showSearchResult() {
    searchResult.classList.add("visible");
}
function disableSearchResult() {
    searchResult.classList.remove("visible");
    searchInput.value = "";
    clearSearchBox();
}

function clearSearchBox() {
    searchResult.innerHTML = "";
}

function processCoords(city) {
    let lat = city.latitude;
    let log = city.longitude;

    console.log(lat, log);

    let cityName = city.name;
    let country = city.country;
    console.log(lat);
    let weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${log}&howeatherApiy=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto&forecast_days=1`;

    getData(weatherApi, parsWeatherData);

    processCityNames(cityName, country);

    disableSearchResult();
}
