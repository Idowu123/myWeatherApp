var myWeatherApp = {

  init: function(){
    var mapOptions = {
      zoom: 10
    };
    myWeatherApp.config = {
      map: new google.maps.Map(document.getElementById('map-canvas'), mapOptions),
      geocoder: new google.maps.Geocoder(),
      marker: 0
    };

    myWeatherApp.loadMapCurrentLoc();
    myWeatherApp.loadWeather('');
    myWeatherApp.setupListeners();
  
  },


  loadMapCurrentLoc :  function () { 
      // Try HTML5 geolocation
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                                           position.coords.longitude);
            myWeatherApp.loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates

            myWeatherApp.config.marker = new google.maps.Marker({
                map: myWeatherApp.config.map,
                animation: google.maps.Animation.DROP,
                position: pos
            });

            myWeatherApp.config.map.setCenter(pos);
        },function() {
          myWeatherApp.handleNoGeolocation(true);
          });

      } 
      else 
      {
        // Browser doesn't support Geolocation
        myWeatherApp.handleNoGeolocation(false);
      }
  },

  handleNoGeolocation: function (errorFlag) {
    if (errorFlag) 
    {
      var content = 'Error: The Geolocation service failed.';
    } 
    else 
    {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
      map: myWeatherApp.config.map,
      position: new google.maps.LatLng(60, 105),
      content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    myWeatherApp.config.map.setCenter(options.position);
  },

  loadWeather:   function (location) {
    $.simpleWeather({
      location: location,
      unit: 'f',
      woeid: 'woeid',
      success: function(weather) { 
        html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.alt.temp+'&deg;C</h2>';
        html += '<ul><li class="currently">'+weather.currently+'</li>';
        html += '<li>'+weather.temp+'&deg;'+weather.units.temp+'</li></ul>';
        var my_li = '<div class="mycity"><p>'+weather.city+','+weather.country+'</p></div>';  

        
        
        if(weather.code>= 0 && weather.code<=17){
        $("#weather").css("background-color","lightblue");
        }
        else if(weather.code> 17 && weather.code<=23){
        $("#weather").css("background-color","lightblue");
        }
        else if(weather.code<23 ){
        $("#weather").css("background-color","yellow");
        }
        else if(weather.code>= 24 && weather.code<=28){
        $("#weather").css("background-color","lightblue");
        }
        else if(weather.code==29 && weather.code==30){
        $("#weather").css("background-color","grey");
        }
        else if(weather.code==="SUNNY"){
        $("#weather").css("background-color","black");
        }
        else if(weather.text>32 && weather.code <36){
        $("#weather").css("background-color","lightgrey");
        }
        else if(weather.code===36){
        $("#weather").css("background-color","#FFCC66");
        }
        else if(weather.code>37){
        $("#weather").css("background-color","lightblue");
        }
         $('#my_img').css("align-self", "center");
        $("#weather").html(html);
        $('#my_img').hide();
        $('#region_div').html(my_li).show();
     
      },
      error: function(error) {
        $("#weather").html('<p>'+error+'</p>');
      }
    });
  },

  codeLocation: function(results, status){
    if (status == google.maps.GeocoderStatus.OK) {
      myWeatherApp.config.map.setCenter(results[0].geometry.location);
      myWeatherApp.config.marker.setPosition(results[0].geometry.location);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  },

  placeMarker: function(location) {

    if (myWeatherApp.config.marker == undefined){
        myWeatherApp.config.marker.setPosition(location);
    }
    else{
      myWeatherApp.config.marker.setPosition(location);

    }
    myWeatherApp.config.map.setCenter(location);
    myWeatherApp.loadWeather(location.lat() + ',' + location.lng());

  },

  setupListeners: function(){

    $("#searchForm").submit(function(event){
      event.preventDefault();
      var address = $("#search").val();
      myWeatherApp.loadWeather(address);
      myWeatherApp.config.geocoder.geocode({ 'address': address}, myWeatherApp.codeLocation);
      var address= $('#search').val("");
    });

    $('#search').keyup(function(event) {
      if (event.keyCode == 13) {
        event.preventDefault();
      $('#searchForm').submit();
      }
    });

    google.maps.event.addListener(myWeatherApp.config.map, 'click', function(event) {
      myWeatherApp.placeMarker(event.latLng);
    });

  }

};

$(document).ready(function(){
  myWeatherApp.init();  
});
