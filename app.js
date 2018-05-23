$(document).ready(function(){
  
  var lat;
  var lon;

  locateUser();


//Searh input location and return with weather info
  var locationForm = document.getElementById('location_form');
  locationForm.addEventListener('submit', geocode);

  function geocode(e){
    e.preventDefault();
    
    var location =document.getElementById('location-input').value;
    var GoogleApiKEy ="AIzaSyDTHYTdlYq-GG1W1JOiuAjd5rPf6jWkVfs";
    var url ="https://maps.googleapis.com/maps/api/geocode/json?address="+location+"&key="+GoogleApiKEy;

      $.getJSON(url,function(response){
        
        var loc = response.results[0].formatted_address;
            lat =response.results[0].geometry.location.lat;
            lon =response.results[0].geometry.location.lng;
        console.log(lat+" "+lon);

        document.getElementById('location').innerHTML = loc;
        fetchWeather();
        $('.toggle-btn').on('click', function(){
          $('.toggle-btn').toggleClass("active", convertTemp());
          return false;
        });
      })
  }

// Get user's location function
  function locateUser(){
    //using browser's geolocation
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){
        lat =position.coords.latitude;
        lon =position.coords.longitude;
        // console.log( lat+" "+lon+" "+ 'geolocate');
        physicalAdd();
        fetchWeather();
      });
    }//using IP address
    else{
          var ipApi ="https://ipapi.co/json";
          $.getJSON(ipApi, function(IPposition){
            lat =IPposition.latitude;
            lon =IPposition.longitude;
            // console.log(lat +" "+ lon+""+" IPposition");
            physicalAdd();
            fetchWeather();
          })
        }
  }
//Transform lat and long to physical address using Google Map Geocoding API
  function physicalAdd(){
    var googleApiKey="AIzaSyDTHYTdlYq-GG1W1JOiuAjd5rPf6jWkVfs";
    var googleApiUrl ="https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lon+"&key="+googleApiKey;

    $.getJSON(googleApiUrl, function(address){
      var loc =address.results[1].formatted_address;
      document.getElementById('location').innerHTML = loc;
    });
  };
//get weather data using DarkSky API
  function fetchWeather(){
    var darkSkyKey="8c8afeaf021ed74d729fb4061c690cd1";
    var darSkyUrl="https://api.darksky.net/forecast/"+darkSkyKey+"/"+lat+","+lon+"?units=ca";

    $.ajax({
      url:darSkyUrl,
      type:"GET",
      dataType:"jsonp",
      success: function(weatherResponse){
        console.log(weatherResponse);
       //get data from response
        var currentTemp =((weatherResponse.currently.temperature).toFixed(1));
        var icon = weatherResponse.currently.icon;
        var summary = weatherResponse.currently.summary; 
        var feelsLike=((weatherResponse.currently.apparentTemperature).toFixed(1)+ " °C");
        var humidity = ((weatherResponse.currently.humidity*100).toFixed(0));
        var windSpeed = ((weatherResponse.currently.windSpeed).toFixed(1));
        var minTemp =((weatherResponse.daily.data[0].temperatureMin).toFixed(1)+"°C");
        var maxTemp =((weatherResponse.daily.data[0].temperatureMax).toFixed(1)+"°C") ;
        var precip =(weatherResponse.currently.precipProbability*100).toFixed(0);
        var todaySummary=weatherResponse.hourly.summary;
        

    
        //output values on UI
        document.getElementById('currentTemp').innerHTML=currentTemp;
        document.getElementById('summary').innerHTML=summary;
        document.getElementById('feelsLike').innerHTML =feelsLike;
        document.getElementById('minTemp').innerHTML=minTemp;
        document.getElementById('maxTemp').innerHTML=maxTemp;
        document.getElementById('humidity').innerHTML=humidity;
        document.getElementById('windSpeed').innerHTML=windSpeed;
        document.getElementById('precip').innerHTML=precip;
        document.getElementById('todaySummary').innerHTML=todaySummary;

        //weather icons using Skycons
        function skycons(){
          var icons = new Skycons({"color" : "#FFFFFF","resizeClear": true});
          icons.set("weatherIcon", weatherResponse.currently.icon);
          icons.play();
        }
        skycons();

        //Convert from Celcius to Farenheit and back
        var tempF =((weatherResponse.currently.temperature*9/5)+32).toFixed(1);
        var feelsLikeF =((weatherResponse.currently.apparentTemperature*9/5)+32).toFixed(1) + " °F" ;
        var minTempF =((weatherResponse.daily.data[0].temperatureMin*9/5)+32).toFixed(1) + " °F" ;
        var maxTempF =((weatherResponse.daily.data[0].temperatureMax*9/5)+32).toFixed(1) + " °F" ;
        var tempC =((weatherResponse.currently.temperature).toFixed(1));
        var feelsLikeC =(weatherResponse.currently.apparentTemperature).toFixed(1)+ " °C";
        var minTempC=((weatherResponse.daily.data[0].temperatureMin).toFixed(1)+"°C");
        var maxTempC =((weatherResponse.daily.data[0].temperatureMax).toFixed(1)+"°C") ;
       

        $('.toggle-btn').on('click', function(){
          $('.toggle-btn').toggleClass("active", convertTemp());
          return false;
        });

          function convertTemp(){
            var tempUnit =$('#tempUnit');
            var currentTemp =$('#currentTemp');
            var feelsLike = $('#feelsLike');
            var minTemp =$('#minTemp');
            var maxTemp =$('#maxTemp');
            
            if(tempUnit.text()== "°C"){
              currentTemp.text(tempF);
              tempUnit.text("°F");
              feelsLike.text(feelsLikeF);
              minTemp.text(minTempF);
              maxTemp.text(maxTempF);
              
            }else{
              currentTemp.text(tempC);
              tempUnit.text("°C");
              feelsLike.text(feelsLikeC);
              minTemp.text(minTempC);
              maxTemp.text(maxTempC);
            }
          }
        //Show Date and Time
        
        var timestamp = weatherResponse.currently.time;
        function renderTime(timestamp){
          
          //time
          var currentTime = new Date(timestamp*1000);
          var hour = currentTime.getHours();
          var mins =currentTime.getMinutes();

            if(hour>12){
              hour-=12;
            }
            if(hour<10){
                hour="0"+hour;
            }
            if(mins<10){
              mins="0"+mins;
            }

          var time =""+hour+":"+mins;

          //date
          var myDate =new Date();
          var day = myDate.getDay();
          var month =myDate.getMonth();
          var dayM =myDate.getDate();
          var dayarray = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
          var monthArray =new Array("January","February","March","April","May","June","July","August","September","October","November","December");
          
          var date =""+dayarray[day]+", "+dayM+" "+monthArray[month];
        
          document.getElementById('date_time').innerHTML = date+ " "+time;
          
        }
        renderTime(timestamp);

      }
    })

  }
  // Autocomplete function
  


});

// https://maps.googleapis.com/maps/api/geocode/json?latlng=13.6205166,123.2385233&key=AIzaSyDTHYTdlYq-GG1W1JOiuAjd5rPf6jWkVfs
// https://api.darksky.net/forecast/8c8afeaf021ed74d729fb4061c690cd1/13.6205166,123.2385233?units=ca