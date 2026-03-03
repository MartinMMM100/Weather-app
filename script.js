const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const buttonText = document.getElementById('buttonText');
const apiKey = 'YOUR_API_KEY_HERE'; // Your OpenWeatherMap API key here

function getWeatherClass(description) {
    const desc = description.toLowerCase();
    
    if (desc.includes('sunny') || desc.includes('clear')) {
        return 'sunny';
    } else if (desc.includes('partly cloudy')) {
        return 'partly cloudy';
    } else if (desc.includes('cloudy')) {
        return 'cloudy';
    } else if (desc.includes('overcast')) {
        return 'overcast';
    } else if (desc.includes('rain')) {
        return 'rainy';
    } else {
        return 'clear';
    }
}

async function getWeather() {
    
    const city = cityInput.value.trim();
    if (!city){
        alert('Please enter a city name.');
        return;
    } 

    // Disable button and show loading state
    searchBtn.disabled = true;
    buttonText.textContent = 'Loading...';

    try {
        const cord = await GetCord(city);
        const resposne = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cord.lat}&lon=${cord.lon}&appid=${apiKey}`);
        const data = await resposne.json();
        console.log(data);
        const {main: {temp, humidity}, weather: [{description}]} = data.list.at(-1);

        document.getElementById('cityName').textContent = city;
        document.getElementById('temperature').textContent = (temp - 273.15).toFixed(1) + '°C';
        document.getElementById('humidity').textContent = humidity + '%';
        document.getElementById('description').textContent = description;

        // Remove all previous weather classes
        weatherCard.className = 'weather-card';
        
        // Add the appropriate weather class based on condition
        const weatherClass = getWeatherClass(description);
        const classes = weatherClass.split(' ');
        weatherCard.classList.add('show', ...classes);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
    finally {
        // Re-enable button
        searchBtn.disabled = false;
        buttonText.textContent = 'Get Weather';
    }    

}

async function GetCord(city) {
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
        const data = await response.json();
        const [{lat: lat, lon: lon}] = data;
        return {lat, lon};
    }
    catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
}
    

// Event listeners
searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});