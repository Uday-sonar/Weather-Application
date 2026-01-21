const apiKey = "4a37d5ccba42cbe97bd8d6e6e064a213"; // replace with your OpenWeatherMap API key

//const apiKey = "YOUR_VALID_API_KEY";

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const resultDiv = document.getElementById("weatherResult");

    if (city === "") {
        resultDiv.innerHTML = "<p>Please enter a city name</p>";
        return;
    }

    try {
        // CURRENT WEATHER
        const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const weatherData = await weatherRes.json();

        if (!weatherRes.ok) {
            throw new Error(weatherData.message);
        }

        const temp = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const wind = weatherData.wind.speed;
        const condition = weatherData.weather[0].main;

        // 🌈 Dynamic Background
        changeBackground(condition);

        // 🚦 Risk Indicator
        const risk = getRiskLevel(temp, wind);

        // 🧠 Recommendation
        const recommendation = getRecommendation(temp, humidity, wind);

        resultDiv.innerHTML = `
            <h3>${weatherData.name}</h3>
            <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png">
            <p>🌡 Temp: ${temp} °C</p>
            <p>💧 Humidity: ${humidity}%</p>
            <p>💨 Wind: ${wind} m/s</p>
            <p>🚦 Risk Level: <strong>${risk}</strong></p>
            <p>🧠 Recommendation: ${recommendation}</p>
        `;

        // 📊 5-Day Forecast Trend
        getForecast(city);

    } catch (error) {
        resultDiv.innerHTML = `<p style="color:red;">❌ ${error.message}</p>`;
    }
}

// =====================
// 🌈 Background Change
// =====================
function changeBackground(condition) {
    const body = document.body;

    if (condition === "Clear") {
        body.style.background = "linear-gradient(to right, #fbc531, #f5f6fa)";
    } else if (condition === "Rain") {
        body.style.background = "linear-gradient(to right, #4b79a1, #283e51)";
    } else if (condition === "Clouds") {
        body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
    } else if (condition === "Snow") {
        body.style.background = "linear-gradient(to right, #ecf0f1, #bdc3c7)";
    } else {
        body.style.background = "linear-gradient(to right, #74ebd5, #acb6e5)";
    }
}

// =====================
// 🚦 Risk Logic
// =====================
function getRiskLevel(temp, wind) {
    if (temp > 38 || wind > 15) return "🔴 High Risk";
    if (temp > 30 || wind > 8) return "🟡 Moderate Risk";
    return "🟢 Safe";
}

// =====================
// 🧠 Recommendation Logic (YOUR FUNCTION)
// =====================
function getRecommendation(temp, humidity, wind) {
    if (temp > 35 && humidity > 60) {
        return "🔥 Heat alert! Stay hydrated and avoid outdoors.";
    }
    if (temp < 10) {
        return "🧥 Cold weather! Wear warm clothes.";
    }
    if (wind > 10) {
        return "💨 Windy conditions! Be cautious.";
    }
    return "✅ Weather looks comfortable.";
}

// =====================
// 📊 Forecast Trend (5 Days)
// =====================
async function getForecast(city) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    const labels = [];
    const temps = [];

    for (let i = 0; i < data.list.length; i += 8) {
        labels.push(data.list[i].dt_txt.split(" ")[0]);
        temps.push(data.list[i].main.temp);
    }

    renderChart(labels, temps);
}

// =====================
// 📈 Chart.js
// =====================
let chart;
function renderChart(labels, temps) {
    const ctx = document.getElementById("tempChart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Temperature Trend (°C)",
                data: temps,
                fill: false,
                borderWidth: 2
            }]
        }
    });
}
