// server.js
import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to fetch weather data
app.get('/', (req, res) => {
    res.render('index', { weatherData: null, error: null });
});

app.post('/search', async (req, res) => {
    const WeatherName = req.body.weather;
    const apiKey = 'c3b9c7899ec2f5b14f90e2bc0ad8e21b';
    console.log(WeatherName);
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: WeatherName,
                appid: apiKey,
                units: 'metric', // Use 'imperial' for Fahrenheit
            },
        });
        const weatherData = response.data;
        console.log(response.data);
        res.render('index', { weatherData });
    } catch (error) {
        console.error(error);
        res.render('index', { weatherData: null, error: 'Not found.' });
    }
});

// In server.js
function getWeatherIcon(condition) {
    const iconMap = {
        'clear': '/icons/clear.png',
        'clear sky': '/icons/clear.png',
        'few clouds': '/icons/cloud.png',
        'scattered clouds': '/icons/cloud.png',
        'broken clouds': '/icons/cloud.png',
        'overcast clouds': '/icons/cloud.png',
        'clouds': '/icons/cloud.png',
        'mist': '/icons/mist.png',
        'smoke': '/icons/mist.png',
        'haze': '/icons/mist.png',
        'fog': '/icons/mist.png',
        'dust': '/icons/sand.png',
        'sand': '/icons/sand.png',
        'volcanic ash': '/icons/ash.png',
        'tornado': '/icons/windy.png',
        'rain': '/icons/rain.png',
        'light rain': '/icons/rain.png',
        'moderate rain': '/icons/rain.png',
        'heavy rain': '/icons/rain.png',
        'snow': '/icons/snow.png',
        'light snow': '/icons/snow.png',
        'heavy snow': '/icons/snow.png',
        'thunderstorm': '/icons/thunderstorm.png',
        // Add more conditions as needed
    };
    return iconMap[condition.toLowerCase()] || '/icons/default.png';
}

// Pass the function to EJS
app.locals.getWeatherIcon = getWeatherIcon;


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
