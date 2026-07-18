const apiKey = '32e0aa13e23ccc8ac279a05ca45d773e';

const cityInput = document.getElementById("cidade-input");
const searchBtn = document.getElementById("buscar-button");
const menuBox = document.getElementById("menu-box");

const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const weatherIcon = document.getElementById("weather-icon");
const weatherDescription = document.getElementById("weather-description");

const weatherDetails = document.getElementById("weather-details-box");
const infoBox = document.getElementById("weather-info");

const errorBox = document.getElementById("error-box");
const errorMessage = document.getElementById("error-message");
const weatherBox = document.getElementById("weather-box");

const weekContainer = document.getElementById("cards-container");

const clicksnd = document.createElement("audio");
clicksnd.src = "sound/clicksound.mp3";

infoBox.style.display = 'none';


async function checkWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const response = await fetch(url)

        const data = await response.json();
        const currentData = data.list[0];
        updateWeatherTheme(currentData);
        console.log(data);

        menuBox.classList.add("active");

        weatherIcon.src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`

        cityName.innerText = `${data.city.name}, ${data.city.country}`;

        let temp = currentData.main.temp;
        temperature.innerText = temp.toFixed(0) + "°C";

        document.getElementById("weather-details-box").innerHTML = `<div class="weather-details">
                <p>Vento</p>
                <span id="wind"></span>
            </div>
            <div class="weather-details">
                <p>Humidade</p>
                <span id="humidity"></span>
            </div>`;

        const wind = document.getElementById("wind");
        const humidity = document.getElementById("humidity");

        weatherDescription.innerText = `${currentData.weather[0].description}`;

        humidity.innerText = `${currentData.main.humidity}%`;

        let windvalue = (currentData.wind.speed) * 3.6;
        wind.innerText = windvalue.toFixed(1) + " km/h";

        weekContainer.style.display = "flex";
        weatherBox.style.display = "flex";
        weatherDetails.style.display = "flex";

        infoBox.style.display = "block";

        displayForecast(data.list);

        cityInput.value = "";
        cityInput.focus();

    } catch (error) {
        menuBox.classList.remove("active");
        console.error("Erro ao buscar dados do clima", error);
        alert("Erro ao buscar! Verifique a conexão ou tente novamente mais tarde");

        weatherBox.style.display = "none";
        weatherDetails.style.display = "none";
        weekContainer.style.display = "none";
        infoBox.style.display = 'none';
        weatherIcon.src = "";
        cityName.innerText = "";
        temperature.innerText = "";
        weatherDescription.innerText = "";
        humidity.innerText = "";
        wind.innerText = "";
        menuBox.classList.add("sunny");
        document.body.classList.add("sunny");
        document.getElementById("weather-details-box").innerHTML = "";
    }
}

function displayForecast(forecastList) {
    weekContainer.innerHTML = "";

    const dailyData = forecastList.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.slice(0, 4).forEach(day => {

        const date = new Date(day.dt_txt);

        let dayName = date.toLocaleDateString("pt-BR", { weekday: "short" });
        dayName = dayName.replace(".", "");

        // Criar o HTML do card
        const cardHTML = `
            <div class="wkcards">
                <span class="cardname">${dayName}</span>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Clima-imagem">
                <span class="cardtemp">${day.main.temp.toFixed(0)}°C</span>
            </div>
        `;

        // Injetar o card dentro do container do HTML
        weekContainer.innerHTML += cardHTML;
    });
}

function updateWeatherTheme(data) {
    document.body.classList.remove("sunny", "rainy", "cloudy", "night");
    menuBox.classList.remove("sunny", "rainy", "cloudy", "night")

    const mainCondition = data.weather[0].main;
    const iconCode = data.weather[0].icon;

    //noite
    if (iconCode.endsWith("n")) {
        document.body.classList.add("night");
        menuBox.classList.add("night")
        return;
    }

    //dia
    switch (mainCondition) {
        case "Clear":
            document.body.classList.add("sunny");
            menuBox.classList.add("sunny")
            break;
        case "Rain":
        case "Drizzle":
        case "Thunderstorm":
            document.body.classList.add("rainy");
            menuBox.classList.add("rainy")
            break;
        case "Clouds":
            document.body.classList.add("cloudy");
            menuBox.classList.add("cloudy")
            break;
        default:
            document.body.classList.add("sunny");
            menuBox.classList.add("sunny")
            break;
    }
}

searchBtn.addEventListener("click", () => {
    clicksnd.play();
    if (cityInput.value.trim() !== "") {
        checkWeather(cityInput.value);
        
    } else {
        alert("Insira um nome válido!");
    }

});

cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && cityInput.value.trim() !== "") {
        clicksnd.play();
        checkWeather(cityInput.value);
    } else if (event.key === "Enter") {
        clicksnd.play();
        alert("Insira um nome válido!");
    }

});