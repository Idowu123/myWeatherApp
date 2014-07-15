var myWeatherApp = {

  init: function(){
    var mapOptions = {
      zoom: 12
    };
    myWeatherApp.config = {
      map: new google.maps.Map(document.getElementById('map-canvas'), mapOptions),
      geocoder: new google.maps.Geocoder(),
      marker: 0
    };

    myWeatherApp.loadMapCurrentLoc();
    myWeatherApp.loadWeather("Zimbabwe");
    myWeatherApp.setupListeners();
  
  },


  loadMapCurrentLoc :  function () { 

      // Try HTML5 geolocation
      if(navigator.geolocation) 
      {

        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                                           position.coords.longitude);

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

  handleNoGeolocation:   function (errorFlag) {
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
    console.log(location);

    $.simpleWeather({
      location: location,
      unit: 'f',
      success: function(weather) {
        html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
        html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
        html += '<li class="currently">'+weather.currently+'</li>';
        html += '<li>'+weather.alt.temp+'&deg;C</li></ul>';  

        if(weather.temp<60){
      $("#weather").css("background-color","#1192d3");
      }
       else if(weather.temp>60 && weather.temp<80){
      $("#weather").css("background-color","grey");
      }
        else if(weather.temp>80){
      $("#weather").css("background-color","red");
      }
        $("#weather").html(html);
      },
      error: function(error) {
        $("#weather").html('<p>'+error+'</p>');
      }
    });
  },

  codeLocation: function(results, status){
    console.log(results);
    if (status == google.maps.GeocoderStatus.OK) {
      myWeatherApp.config.map.setCenter(results[0].geometry.location);
      // var marker = new google.maps.Marker({
      //     map: myWeatherApp.config.map,
      //     position: results[0].geometry.location
      // });
      myWeatherApp.config.marker.setPosition(results[0].geometry.location);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  },

  setupListeners: function(){
    $('.js-geolocation').click(function() {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);//this stores
        // the latitude and longitude for the present location 
        myWeatherApp.loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
        //this positions the marker on the map        
        // var marker = new google.maps.Marker({
        //   map: myWeatherApp.config.map,
        //   position: latLng
        // });
        myWeatherApp.config.marker.setPosition(latLng); 
        myWeatherApp.config.map.setCenter(latLng);

      });
    });

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
  //   google.maps.event.addListener(myWeatherApp.config.map, 'click', function(event) {
  //     placeMarker(event.latLng);
  //   });

  //   function placeMarker(location) {
  //     var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //     if (myWeatherApp.config.marker == undefined){
  //         myWeatherApp.config.marker.setPosition(latLng);
  //     }
  //     else{
  //       myWeatherApp.config.marker.setPosition(location);
  //     }
  //     myWeatherApp.config.map.setCenter(location);

  //   }

  }

};

$(document).ready(function(){
  myWeatherApp.init();  
});
