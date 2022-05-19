var searchBoxCity = document.getElementById("city-search");
var searchBoxState = document.getElementById("state-search");
var searchBtn = document.getElementById("search");
var loadingIcon = document.getElementById("loading");

var todayIcon = document.getElementById("today-icon");
var todayIcon1 = document.getElementById("today-icon-1");
var todayTitle = document.getElementById("today-title");
var todayTemp = document.getElementById("today-temp");
var todayWind = document.getElementById("today-wind");
var todayHum = document.getElementById("today-hum");
var todayUVI = document.getElementById("today-uvi");

var searchHistoryList = [document.getElementById("history-item-0"),
                            document.getElementById("history-item-1"),
                            document.getElementById("history-item-2"),
                            document.getElementById("history-item-3"),
                            document.getElementById("history-item-4")];
var weeklyCards = [document.getElementById("weekly-card-0"),
                    document.getElementById("weekly-card-1"),
                    document.getElementById("weekly-card-2"),
                    document.getElementById("weekly-card-3"),
                    document.getElementById("weekly-card-4")];
var weeklyDateList = [document.getElementById("weekly-date-0"),
                        document.getElementById("weekly-date-1"),
                        document.getElementById("weekly-date-2"),
                        document.getElementById("weekly-date-3"),
                        document.getElementById("weekly-date-4")];
var weeklyIconList = [document.getElementById("weekly-icon-0"),
                        document.getElementById("weekly-icon-1"),
                        document.getElementById("weekly-icon-2"),
                        document.getElementById("weekly-icon-3"),
                        document.getElementById("weekly-icon-4")];
var weeklyTempList = [document.getElementById("weekly-temp-0"),
                        document.getElementById("weekly-temp-1"),
                        document.getElementById("weekly-temp-2"),
                        document.getElementById("weekly-temp-3"),
                        document.getElementById("weekly-temp-4"),];
var weeklyWindList = [document.getElementById("weekly-wind-0"),
                        document.getElementById("weekly-wind-1"),
                        document.getElementById("weekly-wind-2"),
                        document.getElementById("weekly-wind-3"),
                        document.getElementById("weekly-wind-4"),];
var weeklyHumList = [document.getElementById("weekly-hum-0"),
                        document.getElementById("weekly-hum-1"),
                        document.getElementById("weekly-hum-2"),
                        document.getElementById("weekly-hum-3"),
                        document.getElementById("weekly-hum-4"),];

var stateCodeLibrary = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
var stateNameLibrary = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
var currentCords;
var currentWeather;
var searchHistory;

if (JSON.parse(localStorage.getItem("last10"))) {
    searchHistory = JSON.parse(localStorage.getItem("last10"));
} else {
    searchHistory = [0];
}
updateSearchHistory();
formatWeatherData(searchHistory[0]);
// add a function to fetch the data and create a new object if the data is returned
function searchCity () {
    //get the city name from the text box
    var city = searchBoxCity.value.replace(/ /g, '-');
    var state = searchBoxState.value;

    //hide the search box and display the loading icon
    searchBoxCity.classList.add("hidden");
    searchBtn.classList.add("hidden");
    searchBoxState.classList.add("hidden");
    loadingIcon.classList.remove("hidden");
    searchBoxCity.value = "";
    searchBoxState.value = "";

    // get the lat and lon cords of the place
    getPossition(city, getAbb(state)).then(
        (data) => {
            if(data !== 'error' && data.length == 1) {
                currentCords = [data[0].lat, data[0].lon, data[0].name];
                // check searchHistory to make sure the city we are looking for is not already loaded
                weatherData()
            }else {
                console.log("there was an error finding that city");
            }
            searchBoxCity.classList.remove("hidden");
            searchBtn.classList.remove("hidden");
            searchBoxState.classList.remove("hidden");
            loadingIcon.classList.add("hidden");
        });

}

function updateSearchHistory () {
    localStorage.removeItem("last10");
    localStorage.setItem("last10", JSON.stringify(searchHistory));
    for (let i = 0; i < searchHistory.length; i++) {
       if (searchHistory[i].name !== undefined) {
            searchHistoryList[i].classList.remove("hidden");
           searchHistoryList[i].textContent = searchHistory[i].name;
       }
    }
}
function getAbb (input) {
    let abb;
    for (let i = 0; i < stateNameLibrary.length; i++) {
        let into = input.toLowerCase();
        let name = stateNameLibrary[i].toLowerCase();
        let code = stateCodeLibrary[i]. toLowerCase();

        if (into == name) {
            return code;
        } else if (into == code) {
            return code;
        } else {
            abb = 'error'
        }
        
    }
    return abb;
}

const getPossition = async (city, stateCode) => {
    if (city !== "" && stateCode !== "") {
        var url = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + ',' + stateCode + ',us&limit=1&appid=4fe229b724f6cf4ed9ef27910aac4786&units=imperial';
        let response = await fetch(url);
        return await response.json();    
    }else {
        return 'error';
    }
    };
const getWeather = async (lat, lon) => {
    try{
    var url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,&appid=4fe229b724f6cf4ed9ef27910aac4786&units=imperial';
    let response = await fetch(url);
    return await response.json();
    } catch {
        return 'error';
    }
};

function weatherData () {
            for (let i = 0; i < searchHistory.length; i++) {
                if (searchHistory[i].name == currentCords[2]) {
                    console.log("loading from search history")
                    searchHistory.unshift(searchHistory[i]);
                    searchHistory.splice(5);
                    updateSearchHistory(); 
                    formatWeatherData(searchHistory[i]);
                    return searchHistory[i];
                }
            }
            console.log("loading new weather info")
            getWeather(currentCords[0], currentCords[1]).then((data) => {
            currentWeather = new WeatherInfo( 
                currentCords[2],
                data.current.dt,
                currentCords[0],
                currentCords[1],
                data.current.weather[0].id,
                data.current.weather[0].icon,
                data.current.temp,
                data.current.humidity,
                data.current.wind_speed, 
                data.current.uvi,
                [data.daily[0].dt, data.daily[1].dt, data.daily[2].dt, data.daily[3].dt, data.daily[4].dt],
                [data.daily[0].weather[0].id, data.daily[1].weather[0].id, data.daily[2].weather[0].id, data.daily[3].weather[0].id, data.daily[4].weather[0].id],
                [data.daily[0].weather[0].icon, data.daily[1].weather[0].icon, data.daily[2].weather[0].icon, data.daily[3].weather[0].icon, data.daily[4].weather[0].icon],
                [data.daily[0].temp.day, data.daily[1].temp.day, data.daily[2].temp.day, data.daily[3].temp.day, data.daily[4].temp.day],
                [data.daily[0].wind_speed, data.daily[1].wind_speed, data.daily[2].wind_speed, data.daily[3].wind_speed, data.daily[4].wind_speed],
                [data.daily[0].humidity, data.daily[1].humidity, data.daily[2].humidity, data.daily[3].humidity, data.daily[4].humidity]
                );
            searchHistory.unshift(currentWeather);
            searchHistory.splice(6); 
            updateSearchHistory(); 
            formatWeatherData(currentWeather);
            return currentWeather;
                })}
// define an object for the weather data
function WeatherInfo(name, date, lat, lon, currentId, currentIcon, currentTemp, currentHum, currentWind, currentUvi, weeklyDate, weeklyId, weeklyIcon, weeklyTemp, weeklyWind, weeklyHum) {
    this.name = name;
    this.date = date;
    this.lat = lat;
    this.lon = lon;
    this.currentId = currentId;
    this.currentIcon = currentIcon;
    this.currentTemp = currentTemp;
    this.currentWind = currentWind;
    this.currentHum = currentHum;
    this.currentUvi = currentUvi;
    this.weeklyDate = weeklyDate;
    this.weeklyId = weeklyId; 
    this.weeklyIcon = weeklyIcon,
    this.weeklyTemp = weeklyTemp;
    this.weeklyWind = weeklyWind;
    this.weeklyHum = weeklyHum;
}

function formatWeatherData (data) {
    if(data !== 0) {
        let tURL = "https://openweathermap.org/img/wn/" + data.currentIcon + "@2x.png"
        todayIcon.src = tURL;
        todayIcon1.src = tURL;
        let tTitle = data.name + ' - ' + moment.unix(data.date).format('L')
        todayTitle.textContent = tTitle;
        let tTemp = 'Temp: ' + Math.round(data.currentTemp) + '°';
        todayTemp.textContent = tTemp;
        let tWind = 'Wind Speed: ' + Math.round(data.currentWind) + 'MPH'
        todayWind.textContent = tWind;
        let tHum = 'Humidity: ' + data.currentHum + '%';
        todayHum.textContent = tHum;
        let tUVI = 'UV Index: ' + data.currentUvi;
        if (data.currentUvi <= 2) {
            tUVI = tUVI + "🟢";
        } else if (data.currentUvi <= 5) {
            tUVI = tUVI + "🟡";
        } else if (data.currentUvi <= 7){
            tUVI = tUVI + "🟠";
        } else {
            tUVI = tUVI + "🔴";
        }
        todayUVI.textContent = tUVI;
        for (let i = 0; i < 5; i++) {
            weeklyDateList[i].textContent = moment.unix(data.weeklyDate[i]).format('L');
            let tempTemp = 'Temp: ' + Math.round(data.weeklyTemp[i]) + '°';
            weeklyTempList[i].textContent = tempTemp;
            let tempWind = 'Wind Speed: ' + Math.round(data.weeklyWind[i]) + 'MPH';
            weeklyWindList[i].textContent = tempWind;
            let tempHum = 'Humidity: ' + data.weeklyHum[i] + '%';
            weeklyHumList[i].textContent = tempHum;
            weeklyCards[i].classList.remove("drizzle");
            weeklyCards[i].classList.remove("rain");
            weeklyCards[i].classList.remove("snow");
            weeklyCards[i].classList.remove("clear");
            weeklyCards[i].classList.remove("thunderstorm");
            if (data.weeklyId[i] >= 200 && data.weeklyId[i] < 300) {
                weeklyCards[i].classList.add("thunderstorm");
                weeklyIconList[i].src = "http://openweathermap.org/img/wn/11d@2x.png"
            } else if (data.weeklyId[i] >= 300 && data.weeklyId[i] < 400) {
                weeklyCards[i].classList.add("drizzle");
                weeklyIconList[i].src = "http://openweathermap.org/img/wn/09d@2x.png"
            } else if (data.weeklyId[i] >= 500 && data.weeklyId[i] < 600) {
                weeklyCards[i].classList.add("rain");
                weeklyIconList[i].src = "http://openweathermap.org/img/wn/10d@2x.png"
            } else if (data.weeklyId[i] >= 600 && data.weeklyId[i] < 700) {
                weeklyCards[i].classList.add("thunderstorm", "snow");
                weeklyIconList[i].src = "http://openweathermap.org/img/wn/13d@2x.png"
            } else {
                weeklyCards[i].classList.add("clear");
                weeklyIconList[i].src = "http://openweathermap.org/img/wn/01d@2x.png"
            }
        }
    }
    
}

