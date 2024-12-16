// Select necessary elements
const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherDisplay = document.getElementById('weather');
const saveButton = document.getElementById('save-button');

// Weatherstack API details
const apiKey = '9aaa1002c345b740303bcbff95d6b78a'; 
const apiUrl = 'http://api.weatherstack.com/current';

// Fetch weather details for a city
async function getWeather(city) {
    try {
        // API call to fetch weather data
        const response = await fetch(`${apiUrl}?access_key=${apiKey}&query=${city}`);
        const data = await response.json();

        if (data.success !== false) {
            // Display weather details
            displayWeather(data);
            // Enable the Save button
            saveButton.disabled = false;
            saveButton.setAttribute('data-city', city); // Attach city name for saving preferences
        } else {
            weatherDisplay.innerHTML = `<p>${data.error.info}</p>`;
            saveButton.disabled = true; // Disable save button
        }
    } catch (error) {
        weatherDisplay.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
        console.error('Error:', error);
    }
}

// Display weather details
function displayWeather(data) {
    weatherDisplay.innerHTML = `
        <h2>Weather in ${data.location.name}</h2>
        <p><strong>Temperature:</strong> ${data.current.temperature}°C</p>
        <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.current.wind_speed} km/h</p>
        <p><strong>Description:</strong> ${data.current.weather_descriptions[0]}</p>
    `;
}

// Save user preferences (city)
async function savePreferences(city) {
    try {
        const response = await fetch('server/save_preferences.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `city=${city}`,
        });

        const result = await response.text();
        alert(result); // Alert user about the save status
    } catch (error) {
        alert('Error saving preferences. Please try again.');
        console.error('Error:', error);
    }
}

// Event listener for search button
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city); // Fetch weather data
    } else {
        alert('Please enter a city name.');
    }
});

// Event listener for save button
saveButton.addEventListener('click', () => {
    const city = saveButton.getAttribute('data-city');
    if (city) {
        savePreferences(city); // Save the preferred city
    }
});
