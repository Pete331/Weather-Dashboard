$(document).ready(function() {
  var appID = "aa321bbb9feaa55e6def6f01aad2acb8";

  $(".query_btn").on("click", function() {
    // removes forecast html and title so that if another location is selected/typed it won't duplicat/show old information
    $("#forecast").html("");
    $("#forecast-title").remove();

    // gets city name typed into input
    var query_param = $(this)
      .prev()
      .val();

    currentWeather(query_param);
    forcastWeather(query_param);
  });

  function currentWeather(query_param) {
    var weather =
      "http://api.openweathermap.org/data/2.5/weather?q=" +
      query_param +
      "&APPID=" +
      appID;

    $.getJSON(weather, function(json) {
      console.log(json);

      // gets latitude and longitude for UVindex function
      var lat = json.coord.lat;
      var lon = json.coord.lon;

      // gets the utc seconds time from JSON and converts to formatted date
      var utcSeconds = json.dt;
      var today = new Date(0);
      today.setUTCSeconds(utcSeconds);
      var m = String(today.getHours());
      var ss = String(today.getMinutes());
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yy = String(today.getFullYear()).slice(0, 2);
      today =
        " (Updated: " + m + ":" + ss + "   " + dd + "/" + mm + "/" + yy + ")";
      $("#date").html(today);

      // changes appropriate html to JSON outputs
      $("#city").html(json.name);
      $("#weather_image").attr(
        "src",
        "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png"
      );
      $("#temperature").html(
        "Temperature: " + ((json.main.temp - 273.15).toFixed(1) + "°C")
      );
      $("#humidity").html("Humidity: " + (json.main.humidity + "%"));
      $("#wind-speed").html(
        "Wind Speed: " + ((json.wind.speed * 1.609).toFixed(1) + "km/h")
      );
      // runs uv index function giving it the lat and long location
      uvIndex(lat, lon);
    });
  }

  function forcastWeather(query_param) {
    var forecast =
      "http://api.openweathermap.org/data/2.5/forecast?q=" +
      query_param +
      "&APPID=" +
      appID;
    console.log(forecast);
    $.getJSON(forecast, function(json) {
      console.log(json);
      $("#forecast").before('<h2 id="forecast-title">5-day Forecast</h2>');

      for (let i = 0; i < 5; i++) {
        var divTag = $("<div>");
        divTag.attr("class", "bg-primary rounded col-2 m-2");

        // by grabbing the 4th array it is getting the midday results. it then * 8 to get each midday result there after (3 hourly outputs).
        var tempForecast =
          (json.list[i * 8 + 4].main.temp - 273.15).toFixed(1) + "°C";
        var humidityForecast = json.list[i * 8 + 4].main.humidity + "%";
        var iconForecast = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/w/" +
            json.list[i * 8 + 4].weather[0].icon +
            ".png"
        );

        var dayForecast = json.list[i * 8 + 4].dt_txt.slice(8, 10);
        var monthForecast = json.list[i * 8 + 4].dt_txt.slice(5, 7);
        var yearForecast = json.list[i * 8 + 4].dt_txt.slice(2, 4);
        var dateForecast =
          dayForecast + "/" + monthForecast + "/" + yearForecast;

        divTag.append(
          dateForecast,
          "<br>",
          iconForecast,
          "<br>Temp: ",
          tempForecast,
          "<br>Humidity: ",
          humidityForecast
        );

        $("#forecast").append(divTag);
      }
    });
  }

  function uvIndex(lat, lon) {
    var uv =
      "http://api.openweathermap.org/data/2.5/uvi?lat=" +
      lat +
      "&lon=" +
      lon +
      "&APPID=" +
      appID;

    $.getJSON(uv, function(json) {
      console.log(json);
      var uvi = json.value;
      $("#uv-index").html("UV Index: ");
      $("#uv-index-value").html("  " + uvi + "  ");
      if (uvi <= 2.5) {
        var uvColor = "green";
      } else if (uvi <= 5.5) {
        var uvColor = "yellow";
      } else if (uvi <= 7.5) {
        var uvColor = "orange";
      } else {
        var uvColor = "red";
      }
      $("#uv-index-value").css("background-color", uvColor);
    });
  }
});
