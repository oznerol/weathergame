'use strict';

//var request = require('request');

angular.module('location').controller('LocationController', ['$scope', '$http', 
	function($scope, $http) {
		// Controller Logic
		
		$scope.load = function() 
		{
			//var latMax = 45;
		   	//var longMax = 180;

		   	//var lat = Math.random() * (latMax + latMax) - latMax;
		   	//var lon = Math.random() * (longMax + longMax) - longMax;
			//var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon;
			//console.log('win!');

			var retryCount = 0;

			var zipMax = 210;
			var zipMin = 99950;

			function pad(num, size) {
			    var s = '000000000" ' + num;
			    return s.substr(s.length-size);
			}

			function getRandomInt(min, max) {
			    return Math.floor(Math.random() * (max - min + 1)) + min;
			}

			var zip = getRandomInt(zipMin, zipMax);
			zip = pad(zip, 5);
			var url = 'http://api.zippopotam.us/US/'+zip;

		
			var completed = function(data, status, headers, config)
			{
				var places = data.places[0];
    			console.log(places['place name'] + ', ' + places.state + ', ' + data['post code']);

    			$scope.city= places['place name'];
    			$scope.state = places.state;
    			$scope.zip = data['post code'];

    			var now = new Date();
			    var weatherUrl = 'http://query.yahooapis.com/v1/public/yql?format=json&rnd='+now.getFullYear()+now.getMonth()+now.getDay()+now.getHours()+'&diagnostics=true&q=';
			        weatherUrl += 'select * from weather.forecast where woeid in (select woeid from geo.placefinder where text="'+data['post code']+'" and gflags="R" limit 1) and u="f"';
    			weatherUrl = encodeURI(weatherUrl);
    			//weatherUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20WHERE%20symbol%3D"NPO"&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

    			//console.log(weatherUrl);
    			$http.get(weatherUrl)
    				.success(function(data, status, headers, config){
        				var result = data.query.results.channel;
        				var temp = result.item.condition.temp;
        				console.log('temp: ' + temp + ' at ' + result.item.pubDate);

        				$scope.temp = temp;
        			})
        			.error(function(data, status, headers, config){

					});
			};


			var requestPlace = function(){
				zip = getRandomInt(zipMin, zipMax);
				zip = pad(zip, 5);	
				url = 'http://api.zippopotam.us/US/'+zip;

				$http.get(url)
					.success(completed)
					.error(failed);
			};

			var failed = function()
			{
				retryCount++;

				if(retryCount < 20)
				{
					console.log('retrying...');

					requestPlace();
				}
				else
				{
					console.log('failed...');
					$scope.city= 'Unknown';
	    			$scope.state = 'Unknown';
	    			$scope.zip = 'Unknown';
	    			$scope.temp = '?';
				}
				
			};

			requestPlace();
		};
	}
]);