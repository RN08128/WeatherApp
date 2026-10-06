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
const weatherBox = document.getElementById("weather-box");
const weekContainer = document.getElementById("cards-container");

// Elementos do Painel Lateral
const sideTimePanel = document.getElementById("side-time-panel");
const timeSlider = document.getElementById("time-slider");
const selectedTimeLabel = document.getElementById("selected-time");
const timeMinLabel = document.getElementById("time-min");
const timeMaxLabel = document.getElementById("time-max");

const clicksnd = document.createElement("audio");
clicksnd.src = "sound/clicksound.mp3";

infoBox.style.display = 'none';

let groupedForecasts = {}; 
let currentSelectedDay = "";
let currentDayHourlyForecasts = [];

async function checkWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== "200") {
            throw new Error("Cidade não encontrada");
        }

        // Agrupa todas as previsões da API pela data (YYYY-MM-DD)
        groupedForecasts = groupForecastsByDay(data.list);

        menuBox.classList.add("active");
        cityName.innerText = `${data.city.name}, ${data.city.country}`;

        document.getElementById("weather-details-box").innerHTML = `
            <div class="weather-details">
                <p>Vento</p>
                <span id="wind"></span>
            </div>
            <div class="weather-details">
                <p>Humidade</p>
                <span id="humidity"></span>
            </div>`;

        weekContainer.style.display = "flex";
        weatherBox.style.display = "flex";
        weatherDetails.style.display = "flex";
        infoBox.style.display = "block";

        // Exibe os cards de preview e seleciona o primeiro dia por padrão
        const availableDays = Object.keys(groupedForecasts);
        displayForecastCards(availableDays);
        
        if (availableDays.length > 0) {
            selectDay(availableDays[0]);
        }

        cityInput.value = "";
        cityInput.focus();

    } catch (error) {
        menuBox.classList.remove("active");
        sideTimePanel.classList.add("hidden");
        console.error("Erro ao buscar dados do clima", error);
        alert("Erro ao buscar! Verifique o nome da cidade.");

        weatherBox.style.display = "none";
        weatherDetails.style.display = "none";
        weekContainer.style.display = "none";
        infoBox.style.display = 'none';
        
        weatherIcon.src = "";
        cityName.innerText = "";
        temperature.innerText = "";
        weatherDescription.innerText = "";
        menuBox.className = "sunny deactive";
        document.body.className = "sunny";
        document.getElementById("weather-details-box").innerHTML = "";
    }
}

// Organiza as leituras por dia no formato "YYYY-MM-DD"
function groupForecastsByDay(list) {
    const groups = {};
    list.forEach(item => {
        const dateKey = item.dt_txt.split(" ")[0];
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(item);
    });
    return groups;
}

// Seleciona o dia ativo e recarrega os horários no Slider
function selectDay(dateKey) {
    currentSelectedDay = dateKey;
    currentDayHourlyForecasts = groupedForecasts[dateKey] || [];

    if (currentDayHourlyForecasts.length === 0) return;

    // Destaca o card ativo
    document.querySelectorAll(".wkcards").forEach(card => {
        if (card.dataset.date === dateKey) {
            card.classList.add("active");
        } else {
            card.classList.remove("active");
        }
    });

    // Exibe o painel lateral
    sideTimePanel.classList.remove("hidden");

    // Reconfigura o Slider para a quantidade de horários do dia selecionado
    timeSlider.max = currentDayHourlyForecasts.length - 1;
    timeSlider.value = 0;

    const firstHour = getFormattedHour(currentDayHourlyForecasts[0].dt_txt);
    const lastHour = getFormattedHour(currentDayHourlyForecasts[currentDayHourlyForecasts.length - 1].dt_txt);
    
    if (timeMinLabel) timeMinLabel.innerText = firstHour;
    if (timeMaxLabel) timeMaxLabel.innerText = lastHour;

    renderWeatherForSelectedHour(0);
}

function getFormattedHour(dateTimeStr) {
    const dateObj = new Date(dateTimeStr);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function renderWeatherForSelectedHour(index) {
    const selectedData = currentDayHourlyForecasts[index];
    if (!selectedData) return;

    selectedTimeLabel.innerText = getFormattedHour(selectedData.dt_txt);

    weatherIcon.src = `https://openweathermap.org/img/wn/${selectedData.weather[0].icon}@2x.png`;
    temperature.innerText = selectedData.main.temp.toFixed(0) + "°C";
    weatherDescription.innerText = selectedData.weather[0].description;

    const wind = document.getElementById("wind");
    const humidity = document.getElementById("humidity");
    if (wind && humidity) {
        humidity.innerText = `${selectedData.main.humidity}%`;
        let windValue = selectedData.wind.speed * 3.6;
        wind.innerText = windValue.toFixed(1) + " km/h";
    }

    updateWeatherTheme(selectedData);
}

function displayForecastCards(dayKeys) {
    weekContainer.innerHTML = "";

    // Pega até 4 ou 5 dias da lista agrupada
    dayKeys.slice(0, 5).forEach(dateKey => {
        const dayItems = groupedForecasts[dateKey];
        // Busca a leitura próxima do meio-dia ou a primeira disponível
        const representative = dayItems.find(item => item.dt_txt.includes("12:00:00")) || dayItems[0];
        
        const dateObj = new Date(representative.dt_txt);
        let dayName = dateObj.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");

        const card = document.createElement("div");
        card.className = "wkcards";
        card.dataset.date = dateKey;
        card.innerHTML = `
            <span class="cardname">${dayName}</span>
            <img src="https://openweathermap.org/img/wn/${representative.weather[0].icon}.png" alt="Clima-imagem">
            <span class="cardtemp">${representative.main.temp.toFixed(0)}°C</span>
        `;

        card.addEventListener("click", () => {
            clicksnd.play();
            selectDay(dateKey);
        });

        weekContainer.appendChild(card);
    });
}

function updateWeatherTheme(data) {
    document.body.classList.remove("sunny", "rainy", "cloudy", "night");
    menuBox.classList.remove("sunny", "rainy", "cloudy", "night");

    const mainCondition = data.weather[0].main;
    const iconCode = data.weather[0].icon;

    if (iconCode.endsWith("n")) {
        document.body.classList.add("night");
        menuBox.classList.add("night");
        return;
    }

    switch (mainCondition) {
        case "Clear":
            document.body.classList.add("sunny");
            menuBox.classList.add("sunny");
            break;
        case "Rain":
        case "Drizzle":
        case "Thunderstorm":
            document.body.classList.add("rainy");
            menuBox.classList.add("rainy");
            break;
        case "Clouds":
            document.body.classList.add("cloudy");
            menuBox.classList.add("cloudy");
            break;
        default:
            document.body.classList.add("sunny");
            menuBox.classList.add("sunny");
            break;
    }
}

timeSlider.addEventListener("input", (e) => {
    renderWeatherForSelectedHour(e.target.value);
});

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