'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

var request = require('request');
/**
 * Create a Location
 */
exports.create = function(req, res) 
{
	//var latMax = 45;
   	//var longMax = 180;

   	//var lat = Math.random() * (latMax + latMax) - latMax;
   	//var lon = Math.random() * (longMax + longMax) - longMax;
	//var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon;

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

	var tester = 
		function(err, response, body)
		{
			if(body)
			{
				var dataGram = JSON.parse(body);

				//console.log(body);
        		//console.log(dataGram.status);
        		if(body === '{}')
        		//if(dataGram.status !== 'OK')
        		{
        			console.log('retrying...');
					zip = getRandomInt(zipMin, zipMax);
					zip = pad(zip, 5);	
					url = 'http://api.zippopotam.us/US/'+zip;
        			//lat = Math.random() * (latMax + latMax) - latMax;
	       			//lon = Math.random() * (longMax + longMax) - longMax;
	    			//url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon;
	        		request(url,tester);
        		}
        		else
        		{
        			var places = dataGram.places[0];
        			console.log(places['place name'] + ', ' + places.state + ', ' + dataGram['post code']);

        			var now = new Date();
				      var weatherUrl = 'http://query.yahooapis.com/v1/public/yql?format=json&rnd='+now.getFullYear()+now.getMonth()+now.getDay()+now.getHours()+'&diagnostics=true&q=';
				        weatherUrl += 'select * from weather.forecast where woeid in (select woeid from geo.placefinder where text="'+dataGram['post code']+'" and gflags="R" limit 1) and u="f"';
        			weatherUrl = encodeURI(weatherUrl);
        			//weatherUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20WHERE%20symbol%3D"NPO"&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

        			//console.log(weatherUrl);
        			request(weatherUrl,function(error, resp, weathbody){
        				var result = JSON.parse(weathbody);
        				result = result.query.results.channel;
        				var temp = result.item.condition.temp;
        				console.log('temp: ' + temp + ' at ' + result.item.pubDate);

        				return res.jsonp(result);
        			});
        			//console.log(weatherUrl);

        			//console.log(dataGram.results[0].formatted_address);
        		}
			}
	    	//console.log(dataGram.results[3].formatted_address);
		};

	request(url,tester);
};

exports.load = function(req, res){

};

/**
 * Show the current Location
 */
exports.read = function(req, res) {

};

/**
 * Update a Location
 */
exports.update = function(req, res) {

};

/**
 * Delete an Location
 */
exports.delete = function(req, res) {

};

/**
 * List of Locations
 */
exports.list = function(req, res) {

};