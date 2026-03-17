const API_KEY = "978c4feba684002dd215ff739f66a2f5";

const weatherBox = document.getElementById("weather");
const historyBox = document.getElementById("history");
const cityInput = document.getElementById("cityInput");

/* ---------- FETCH WEATHER ---------- */
async function getWeather(city) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!res.ok) {
        throw new Error("City not found");
    }

    return await res.json();
}

/* ---------- RENDER WEATHER ---------- */
function renderWeather(d) {
    const icon = d.weather[0].icon;

    weatherBox.innerHTML = `
        <div class="weather-card">
            <div class="city">${d.name}, ${d.sys.country}</div>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
            <div class="temp">${d.main.temp}°C</div>
            <div>${d.weather[0].main}</div>

            <div class="details">
                <div class="detail-item">💧 Humidity: ${d.main.humidity}%</div>
                <div class="detail-item">🌬 Wind: ${d.wind.speed} m/s</div>
                <div class="detail-item">🌡 Feels: ${d.main.feels_like}°C</div>
                <div class="detail-item">📊 Pressure: ${d.main.pressure}</div>
            </div>
        </div>
    `;
    setBackground(d.weather[0].main);
}


/* ---------- SAVE HISTORY ---------- */
function saveHistory(city) {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    if (!history.includes(city)) {
        history.unshift(city);
    }

    localStorage.setItem("history", JSON.stringify(history));
    showHistory();
}

/* ---------- SHOW HISTORY ---------- */
function showHistory() {
    const history = JSON.parse(localStorage.getItem("history")) || [];

    historyBox.innerHTML = history
        .map(city => `<button onclick="search('${city}')">${city}</button>`)
        .join("");
}

/* ---------- CLEAR HISTORY ---------- */
document.getElementById("clearHistory").onclick = () => {
    localStorage.removeItem("history");
    showHistory();
};

/* ---------- SEARCH ---------- */
async function search(city) {
    weatherBox.innerHTML = `<div class="loader">Loading...</div>`;

    try {
        const data = await getWeather(city);
        renderWeather(data);
        saveHistory(data.name);
    } catch (err) {
        weatherBox.innerHTML = `<p style="color:red">${err.message}</p>`;
    }
}

/* ---------- BUTTON ---------- */
document.getElementById("searchBtn").onclick = () => {
    const city = cityInput.value.trim();
    if (city) search(city);
};

/* ---------- ENTER KEY ---------- */
cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) search(city);
    }
});

/* ---------- INITIAL LOAD ---------- */
showHistory();
function setBackground(weather) {
    const body = document.body;

    if (weather.includes("Cloud")) {
        body.style.background = "linear-gradient(135deg, #757F9A, #D7DDE8)";
    } 
    else if (weather.includes("Rain")) {
        body.style.background = "linear-gradient(135deg, #2c3e50, #4ca1af)";
    } 
    else if (weather.includes("Clear")) {
        body.style.background = "linear-gradient(135deg, #56ab2f, #a8e063)";
    } 
    else if (weather.includes("Snow")) {
        body.style.background = "linear-gradient(135deg, #e6dada, #274046)";
    } 
    else {
        body.style.background = "linear-gradient(135deg, #85b79a, #3a915e)";
    }
}
