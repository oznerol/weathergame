'use strict';

var locations = require('../../app/controllers/location');

module.exports = function(app) 
{
	app.route('/location')
		.get(locations.load);
};