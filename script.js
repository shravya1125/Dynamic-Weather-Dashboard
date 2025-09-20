const API_KEY = 'YOUR_API_KEY_HERE'; //Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const loadingDiv = document.getElementById('loading');
const weatherDisplay = document.getElementById('weather-display');
const noData = document.getElementById('no-data');
const cityName = document.getElementById('city-name');
const dateTime = document.getElementById('date-time');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const messageBox = document.getElementById('message-box');
const messageText = document.getElementById('message-text');

// Function to show a temporary message box
function showMessage(message, type = 'error') {
    messageText.textContent = message;
    messageBox.className = `absolute top-4 left-1/2 -translate-x-1/2 p-3 rounded-xl shadow-lg transition-transform duration-300 ease-out transform scale-100 origin-top ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`;
    messageBox.classList.remove('hidden');

    setTimeout(() => {
        messageBox.classList.remove('scale-100');
        messageBox.classList.add('scale-0');
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 300);
    }, 3000);
}

// Function to show the loading indicator
function showLoading() {
    loadingDiv.classList.remove('hidden');
    noData.classList.add('hidden');
    weatherDisplay.classList.add('hidden');
}

// Function to hide the loading indicator and show the weather display
function showWeather() {
    loadingDiv.classList.add('hidden');
    noData.classList.add('hidden');
    weatherDisplay.classList.remove('hidden');
}

// Function to update the UI with weather data
function updateUI(data) {
    const tempCelsius = data.main.temp;
    cityName.textContent = data.name;
    dateTime.textContent = new Date().toLocaleString();
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherDescription.textContent = data.weather[0].description;
    temperature.textContent = `${Math.round(tempCelsius)}°C`;
    humidity.textContent = data.main.humidity;
    windSpeed.textContent = data.wind.speed;
    showWeather();
}

// Function to fetch weather data by coordinates
async function fetchWeatherByCoords(latitude, longitude) {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        showMessage("Please get an API key from OpenWeatherMap and paste it into the code.");
        return;
    }
    showLoading();
    try {
        const response = await fetch(`${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if (data.cod !== 200) {
            showMessage(data.message);
            noData.classList.remove('hidden');
            return;
        }
        updateUI(data);
    } catch (error) {
        showMessage('Error fetching weather data. Please try again.');
        console.error('Error:', error);
        noData.classList.remove('hidden');
    }
}

// Function to fetch weather data by city name
async function fetchWeatherByCity(city) {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        showMessage("Please get an API key from OpenWeatherMap and paste it into the code.");
        return;
    }
    showLoading();
    try {
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if (data.cod !== 200) {
            showMessage(data.message);
            noData.classList.remove('hidden');
            return;
        }
        updateUI(data);
    } catch (error) {
        showMessage('Error fetching weather data. Please try again.');
        console.error('Error:', error);
        noData.classList.remove('hidden');
    }
}

// Geolocation setup
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                showMessage('Geolocation denied. Please enter a city name.');
            }
        );
    } else {
        showMessage('Geolocation is not supported by your browser.');
    }
}

// Event listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    } else {
        showMessage('Please enter a city name.');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Initial call to get user's location
getLocation();