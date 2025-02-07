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
	'0': '<i class="fa-solid fa-sun"></i>',
	'1': '<i class="fa-solid fa-sun"></i>',
	'2': '<i class="fa-solid fa-cloud-sun"></i>',
	'3': '<i class="fa-light fa-cloud"></i>',
	'45': '<i class="fa-light fa-cloud"></i>',
	'48': '<i class="fa-light fa-cloud"></i>',
	'51': '<i class="fa-solid fa-cloud-sun-rain"></i>',
	'52': '<i class="fa-solid fa-cloud-sun-rain"></i>',
	'53': '<i class="fa-solid fa-cloud-sun-rain"></i>',
	'55': '<i class="fa-solid fa-cloud-sun-rain"></i>',
	'56': '<i class="fa-solid fa-cloud-sun-rain"></i>',
	'57': '<i class="fa-thin fa-snowflake"></i>',
	'61': '<i class="fa-solid fa-cloud-sun-rain"></i>',
	'63': '<i class="fa-solid fa-cloud-sun-rain"></i>',
	'65': '<i class="fa-solid fa-cloud-sun-rain"></i>',
	'66': '<i class="fa-thin fa-snowflake"></i>',
	'67': '<i class="fa-thin fa-snowflake"></i>',
	'71': '<i class="fa-thin fa-snowflake"></i>',
	'73': '<i class="fa-thin fa-snowflake"></i>',
	'75': '<i class="fa-thin fa-snowflake"></i>',
	'77': '<i class="fa-thin fa-snowflake"></i>',
	'80': '<i class="fa-solid fa-cloud-sun-rain"></i>',
	'81': '<i class="fa-solid fa-cloud-sun-rain"></i>',
	'82': '<i class="fa-solid fa-cloud-sun-rain"></i>',
	'85': '<i class="fa-thin fa-snowflake"></i>',
	'86': '<i class="fa-thin fa-snowflake"></i>',
	'95': '<i class="fa-light fa-cloud-bolt"></i>',
	'96': '<i class="fa-light fa-cloud-bolt"></i>',
	'99': '<i class="fa-light fa-cloud-bolt"></i>'
};

function getSearchText(){
	const input = document.getElementById("search-text").value;

	//test for value
	//console.log(input)

	const inputArr = input.split(",").map(function(item) {
		return item.trim();
	  });


	//for debugging purposes
	console.log(inputArr);

	//if the input is not a number, it can't be lat/long
	if(isNaN(inputArr[0]) || isNaN(inputArr[1])){
		throw new Error("Please input a number for latitude and longitude.");
	}
	else{
		userLat = inputArr[0];
		console.log(userLat);

		userLong = inputArr[1];
		console.log(userLong);
	}


	//update temperature url
	url = "https://api.open-meteo.com/v1/forecast?latitude=" + userLat + "&longitude="+ userLong + "&current=temperature_2m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min";

	//update conditions url
	conditionsURL = "https://api.open-meteo.com/v1/forecast?latitude=" + userLat + "&longitude=" + userLong + "&current=relative_humidity_2m,precipitation,weather_code,wind_gusts_10m&daily=weather_code,precipitation_sum,precipitation_probability_max";

	//window.location.href = "./index.html";

	if (document.title == 'temperature') {
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
			document.querySelector(".current-precipitation").innerText = (data.current.precipitation * 100) + '%';
			document.querySelector(".current-weather").innerText = parseWeatherCode(data.current.weather_code);
			//add the physical time later
			document.querySelector(".current-day").innerText = timestampToDay(data.daily.time[0]);
			document.querySelector(".current-gusts").innerText = "Wind Gusts: " + data.current.wind_gusts_10m;
			document.querySelector(".current-humidity").innerText = "Humidity: " + data.current.relative_humidity_2m;
			//document.querySelector('.first-icon').innerHTML = changeWeatherIcon(data.daily.weather_code[0]);

			//load the data for tomorrow
			document.querySelector('.tomorrow').innerText = timestampToDay(data.daily.time[1]);
			document.querySelector('.precipitation-chance').innerText = data.daily.precipitation_probability_max[1] + '%';
			//TODO: Dynamically change icon
			
			//load the data for the third day
			document.querySelector('.third-day').innerText = timestampToDay(data.daily.time[2]);
			document.querySelector('.third-precipitation-chance').innerText = data.daily.precipitation_probability_max[2] + '%';
		
			//load the data for the fourth day
			document.querySelector('.fourth-day').innerText = timestampToDay(data.daily.time[3]);
			document.querySelector('.fourth-precipitation-chance').innerText = data.daily.precipitation_probability_max[3] + '%';

			//load the data for the fifth day
			document.querySelector('.fifth-day').innerText = timestampToDay(data.daily.time[4]);
			document.querySelector('.fifth-precipitation-chance').innerText = data.daily.precipitation_probability_max[4] + '%';
			
			//load the data for the sixth day
			document.querySelector('.sixth-day').innerText = timestampToDay(data.daily.time[5]);
			document.querySelector('.sixth-precipitation-chance').innerText = data.daily.precipitation_probability_max[5] + '%';

			//load the data for the seventh day
			document.querySelector('.seventh-day').innerText = timestampToDay(data.daily.time[6]);
			document.querySelector('.seventh-precipitation-chance').innerText = data.daily.precipitation_probability_max[6] + '%';

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
			document.querySelector(".current-temperature").innerText = data.current.temperature_2m + ' C';
			document.querySelector(".current-weather").innerText = parseWeatherCode(data.current.weather_code);
			//add the physical time later
			document.querySelector(".current-day").innerText = timestampToDay(data.daily.time[0]);
			document.querySelector(".current-apparent").innerText = 'Feels like: ' + data.current.apparent_temperature;
			document.querySelector(".current-high").innerText = "High: " + data.daily.temperature_2m_max[0];
			document.querySelector(".current-low").innerText = "Low: " + data.daily.temperature_2m_min[0];
			//document.querySelector('.first-icon').innerHTML = changeWeatherIcon(data.daily.weather_code[0]);

			//load the data for tomorrow
			document.querySelector('.tomorrow').innerText = timestampToDay(data.daily.time[1]);
			document.querySelector('.tomorrow-high').innerText = data.daily.temperature_2m_max[1];
			document.querySelector('.tomorrow-low').innerText = data.daily.temperature_2m_min[1];
			//TODO: Dynamically change icon
			
			//load the data for the third day
			document.querySelector('.third-day').innerText = timestampToDay(data.daily.time[2]);
			document.querySelector('.third-high').innerText = data.daily.temperature_2m_max[2];
			document.querySelector('.third-low').innerText = data.daily.temperature_2m_min[2];

			//load the data for the fourth day
			document.querySelector('.fourth-day').innerText = timestampToDay(data.daily.time[3]);
			document.querySelector('.fourth-high').innerText = data.daily.temperature_2m_max[3];
			document.querySelector('.fourth-low').innerText = data.daily.temperature_2m_min[3];

			//load the data for the fifth day
			document.querySelector('.fifth-day').innerText = timestampToDay(data.daily.time[4]);
			document.querySelector('.fifth-high').innerText = data.daily.temperature_2m_max[4];
			document.querySelector('.fifth-low').innerText = data.daily.temperature_2m_min[4];

			//load the data for the sixth day
			document.querySelector('.sixth-day').innerText = timestampToDay(data.daily.time[5]);
			document.querySelector('.sixth-high').innerText = data.daily.temperature_2m_max[5];
			document.querySelector('.sixth-low').innerText = data.daily.temperature_2m_min[5];

			//load the data for the seventh day
			document.querySelector('.seventh-day').innerText = timestampToDay(data.daily.time[6]);
			document.querySelector('.seventh-high').innerText = data.daily.temperature_2m_max[6];
			document.querySelector('.seventh-low').innerText = data.daily.temperature_2m_min[6];

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

