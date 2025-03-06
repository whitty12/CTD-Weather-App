var userLat = "-10.55152";
var userLong = "-67.50496";

//temperatures
var url = "https://api.open-meteo.com/v1/forecast?latitude=" + userLat + "&longitude="+ userLong + "&current=temperature_2m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min";

//precipitation and wind gusts
var conditionsURL = "https://api.open-meteo.com/v1/forecast?latitude=" + userLat + "&longitude=" + userLong + "&current=relative_humidity_2m,precipitation,weather_code,wind_gusts_10m&daily=weather_code,precipitation_sum,precipitation_probability_max";

//contains the weather codes for each key
const weatherCodeDict = {
	'0': 'Clear Skies',
	'1': 'Mainly Clear',
	'2': 'Partly Cloudy',
	'3': 'Overcast',
	'45': 'Fog',
	'48': 'Depositing Rime Fog',
	'51': 'Light Drizzle',
	'52': 'Moderate Drizzle',
	'53': 'Dense Drizzle',
	'55': 'Light Freezing Drizzle',
	'56': 'Moderate Freezing Drizzle',
	'57': 'Dense Freezing Drizzle',
	'61': 'Slight Rain',
	'63': 'Moderate Rain',
	'65': 'Heavy Rain',
	'66': 'Slight Freezing Rain',
	'67': 'Heavy Freezing Rain',
	'71': 'Slight Snow Fall',
	'73': 'Moderate Snow Fall',
	'75': 'Heavy Snow Fall',
	'77': 'Snow Grains',
	'80': 'Slight Rain Showers',
	'81': 'Moderate Rain Showers',
	'82': 'Violent Rain Showers',
	'85': 'Slight Snow Showers',
	'86': 'Heavy Snow Showers',
	'95': 'Slight Thunderstorms',
	'96': 'Thunderstorm with Slight Hail',
	'99': 'Thunderstorm with Heavy Hail'
};

const iconDictionary = {
	'0': '☀️',
	'1': '☀️',
	'2': '⛅',
	'3': '☁️',
	'45': '🌫️',
	'48': '🌫️',
	'51': '🌦️',
	'52': '🌦️',
	'53': '🌦️',
	'55': '🌦️❄️',
	'56': '🌦️❄️',
	'57': '🌦️❄️',
	'61': '🌧️',
	'63': '🌧️',
	'65': '🌧️',
	'66': '🌧️❄️',
	'67': '🌧️❄️',
	'71': '🌨️',
	'73': '🌨️',
	'75': '🌨️',
	'77': '🌨️',
	'80': '🌧️',
	'81': '🌧️',
	'82': '🌧️',
	'85': '🌨️',
	'86': '🌨️',
	'95': '⛈️',
	'96': '⛈️❄️',
	'99': '⛈️❄️'
};

function splitInput(string) {
	return string.split(/[ ,]+/).map(function(item) {
		return item.trim();
	  });
}

//takes latitude, longitude arr of size two and sees if it is a number
function searchIsValid(inputArr) {
	if(isNaN(inputArr[0]) || isNaN(inputArr[1])){
		document.getElementById('search-text').value = "Query empty.";
		return false;
	}
	if(containsLetters == true){
		return false;
	}
	return true;
}
//check for letters in coorinates
function containsLetters(str) {
    if(/[a-zA-Z]/.test(str) == true){
		return true;
	}
	return false;
}

//Use default latitude/longitude
function urlParametersEmpty(urlParams){
	if (urlParams == null || urlParams != ""){
		return true;
	}
	return false;
}

function initializeWeather(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	var searchParams = "";

	//set search text
	document.getElementById('search-text').value = urlParams.get('search');

	//Check to see if we need to use the default params or not
	if(urlParametersEmpty(urlParams) && ((document.getElementById('search-text').value) != null)){
		searchParams = splitInput(urlParams.get('search'));

		//if search is valid, update parameters
		if(searchIsValid(searchParams)){
			// Get the value of a specific parameter
			userLat = searchParams[0];
			console.log(userLat);
			
			userLong = searchParams[1];
			console.log(userLong)
		}
		else{
			//ADD ERROR ELEMENT LATER
			console.log("ERROR: Query empty, using default location.");
		}
	}
	//otherwise use default search starting with update temperature url
	url = "https://api.open-meteo.com/v1/forecast?latitude=" + userLat + "&longitude="+ userLong + "&current=temperature_2m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min";

	//update conditions url
	conditionsURL = "https://api.open-meteo.com/v1/forecast?latitude=" + userLat + "&longitude=" + userLong + "&current=relative_humidity_2m,precipitation,weather_code,wind_gusts_10m&daily=weather_code,precipitation_sum,precipitation_probability_max";

	//Updating based on which page we are on
	if (document.title == 'Temperature') {
		console.log("Calling update weather");
		updateWeather();
	}
	else{
		console.log("Calling update precipitation")
		updatePrecipitation();
	}
}

window.onload = function () {
	initializeWeather();
  };

function getSearchText(){
	const input = document.getElementById("search-text").value;

	//test for value
	console.log(input)

	//split input into array
	const inputArr = splitInput(input);

	//for debugging purposes
	console.log(inputArr);

	//if the input is not a number, it can't be lat/long
	if(searchIsValid(inputArr)){
		userLat = inputArr[0];
		console.log(userLat);

		userLong = inputArr[1];
		console.log(userLong);
		document.querySelector(".error-text").innerText = null;
	}
	else{
		document.getElementById("search-text").value = '';

		//log error and display to user
		document.querySelector(".error-text").innerText = "Please input a number for latitude and longitude!";
		console.error("Please input a number for latitude and longitude.");

	}

	//update temperature url
	url = "https://api.open-meteo.com/v1/forecast?latitude=" + userLat + "&longitude="+ userLong + "&current=temperature_2m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min";

	//update conditions url
	conditionsURL = "https://api.open-meteo.com/v1/forecast?latitude=" + userLat + "&longitude=" + userLong + "&current=relative_humidity_2m,precipitation,weather_code,wind_gusts_10m&daily=weather_code,precipitation_sum,precipitation_probability_max";

	//Updating based on which page we are on
	if (document.title == 'Temperature') {
		console.log("Calling update weather");
		updateWeather();

	}
	else{
		console.log("Calling update precipitation")
		updatePrecipitation();
	}

	console.log(conditionsURL);
	console.log(url);
}

//Updates the page containing the information for precipitation
function updatePrecipitation(){
	fetch(conditionsURL).then(response =>
		{
			if(!response.ok){
				throw new Error('Response Error');
			}
			return response.json();
		})
		.then(data => {
			//load the data for this moment
			document.getElementById("current-precipitation").innerText = (data.current.precipitation * 100) + '%';
			document.getElementById("current-weather").innerText = parseWeatherCode(data.current.weather_code);
			//add the physical time later
			document.getElementById("current-day").innerText = timestampToDay(data.daily.time[0]);
			document.getElementById("current-gusts").innerText = "Wind Gusts: " + data.current.wind_gusts_10m;
			document.getElementById("current-humidity").innerText = "Humidity: " + data.current.relative_humidity_2m;
			document.getElementById('current-icon').innerText = changeWeatherIcon(data.current.weather_code);

			//load the data for tomorrow
			document.getElementById('tomorrow').innerText = timestampToDay(data.daily.time[1]);
			document.querySelector('.daily-precipitation').innerText = data.daily.precipitation_probability_max[1] + '%';
			document.getElementById('second-icon').innerText = changeWeatherIcon(data.daily.weather_code[1]);
			
			//load the data for the third day
			document.getElementById('third-day').innerText = timestampToDay(data.daily.time[2]);
			document.getElementById('third-precipitation-chance').innerText = data.daily.precipitation_probability_max[2] + '%';
			document.getElementById('third-icon').innerText = changeWeatherIcon(data.daily.weather_code[2]);
		
			//load the data for the fourth day
			document.getElementById('fourth-day').innerText = timestampToDay(data.daily.time[3]);
			document.getElementById('fourth-precipitation-chance').innerText = data.daily.precipitation_probability_max[3] + '%';
			document.getElementById('fourth-icon').innerText = changeWeatherIcon(data.daily.weather_code[3]);

			//load the data for the fifth day
			document.getElementById('fifth-day').innerText = timestampToDay(data.daily.time[4]);
			document.getElementById('fifth-precipitation-chance').innerText = data.daily.precipitation_probability_max[4] + '%';
			document.getElementById('fifth-icon').innerText = changeWeatherIcon(data.daily.weather_code[4]);
			
			//load the data for the sixth day
			document.getElementById('sixth-day').innerText = timestampToDay(data.daily.time[5]);
			document.getElementById('sixth-precipitation-chance').innerText = data.daily.precipitation_probability_max[5] + '%';
			document.getElementById('sixth-icon').innerText = changeWeatherIcon(data.daily.weather_code[5]);

			//load the data for the seventh day
			document.getElementById('seventh-day').innerText = timestampToDay(data.daily.time[6]);
			document.getElementById('seventh-precipitation-chance').innerText = data.daily.precipitation_probability_max[6] + '%';
			document.getElementById('seventh-icon').innerText = changeWeatherIcon(data.daily.weather_code[6]);

			console.log(data);
		})
		.catch(error => {
			console.error('There was an error in the fetch operation:', error);	
		});	
}

function updateWeather(){
	fetch(url).then(response =>
		{
			if(!response.ok){
				throw new Error('Response Error');
			}
			return response.json();
		})
		.then(data => {
			//load the data for this moment
			document.getElementById("current-temperature").innerText = data.current.temperature_2m + ' C';
			document.getElementById("current-weather").innerText = parseWeatherCode(data.current.weather_code);
			//add the physical time later
			document.getElementById("current-day").innerText = timestampToDay(data.daily.time[0]);
			document.getElementById("current-apparent").innerText = 'Feels like: ' + data.current.apparent_temperature;
			document.getElementById("current-high").innerText = "High: " + data.daily.temperature_2m_max[0];
			document.getElementById("current-low").innerText = "Low: " + data.daily.temperature_2m_min[0];
			document.getElementById('current-icon').innerText = changeWeatherIcon(data.current.weather_code);

			//load the data for tomorrow
			document.getElementById('tomorrow').innerText = timestampToDay(data.daily.time[1]);
			document.getElementById('tomorrow-high').innerText = data.daily.temperature_2m_max[1];
			document.getElementById('tomorrow-low').innerText = data.daily.temperature_2m_min[1];
			document.getElementById('second-icon').innerText = changeWeatherIcon(data.daily.weather_code[1]);
			
			//load the data for the third day
			document.getElementById('third-day').innerText = timestampToDay(data.daily.time[2]);
			document.getElementById('third-high').innerText = data.daily.temperature_2m_max[2];
			document.getElementById('third-low').innerText = data.daily.temperature_2m_min[2];
			document.getElementById('third-icon').innerText = changeWeatherIcon(data.daily.weather_code[2]);

			//load the data for the fourth day
			document.getElementById('fourth-day').innerText = timestampToDay(data.daily.time[3]);
			document.getElementById('fourth-high').innerText = data.daily.temperature_2m_max[3];
			document.getElementById('fourth-low').innerText = data.daily.temperature_2m_min[3];
			document.getElementById('fourth-icon').innerText = changeWeatherIcon(data.daily.weather_code[3]);

			//load the data for the fifth day
			document.getElementById('fifth-day').innerText = timestampToDay(data.daily.time[4]);
			document.getElementById('fifth-high').innerText = data.daily.temperature_2m_max[4];
			document.getElementById('fifth-low').innerText = data.daily.temperature_2m_min[4];
			document.getElementById('fifth-icon').innerText = changeWeatherIcon(data.daily.weather_code[4]);

			//load the data for the sixth day
			document.getElementById('sixth-day').innerText = timestampToDay(data.daily.time[5]);
			document.getElementById('sixth-high').innerText = data.daily.temperature_2m_max[5];
			document.getElementById('sixth-low').innerText = data.daily.temperature_2m_min[5];
			document.getElementById('sixth-icon').innerText = changeWeatherIcon(data.daily.weather_code[5]);

			//load the data for the seventh day
			document.getElementById('seventh-day').innerText = timestampToDay(data.daily.time[6]);
			document.getElementById('seventh-high').innerText = data.daily.temperature_2m_max[6];
			document.getElementById('seventh-low').innerText = data.daily.temperature_2m_min[6];
			document.getElementById('seventh-icon').innerText = changeWeatherIcon(data.daily.weather_code[6]);

			console.log(data);
		})
		.catch(error => {
			console.error('There was an error in the fetch operation:', error);	
		});	
}

function parseWeatherCode(weatherCode){
	if(weatherCodeDict[weatherCode] != null){
		return weatherCodeDict[weatherCode];
	}
	else{
		console.error('The weather code does not exist.');
		return "Error"
	}
}

function changeWeatherIcon(weatherCode){
	if(iconDictionary[weatherCode] != null){
		return iconDictionary[weatherCode];
	}
	else{
		console.error('The weather code does not exist.');
		return "Error"
	}
}

function timestampToDay(isoTimestamp){
	// Create a Date object from the ISO 8601 timestamp
	const date = new Date(isoTimestamp);

	// Get the day of the week (0 = Sunday, 1 = Monday, etc.)
	const dayIndex = date.getUTCDay();

		// Get the name of the day
	const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const dayName = daysOfWeek[dayIndex];

	//return the day
	return dayName;
}

