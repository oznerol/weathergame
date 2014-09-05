'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Food = mongoose.model('Food'),
	_ = require('lodash');

/**
 * Create a Food
 */
exports.create = function(req, res) {
	var food = new Food(req.body);
	food.user = req.user;

	food.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(food);
		}
	});
};

/**
 * Show the current Food
 */
exports.read = function(req, res) {
	res.jsonp(req.food);
};

/**
 * Update a Food
 */
exports.update = function(req, res) {
	var food = req.food ;

	food = _.extend(food , req.body);

	food.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(food);
		}
	});
};

/**
 * Delete an Food
 */
exports.delete = function(req, res) {
	var food = req.food ;

	food.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(food);
		}
	});
};

/**
 * List of Foods
 */
exports.list = function(req, res) { Food.find().sort('-created').populate('user', 'displayName').exec(function(err, foods) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(foods);
		}
	});
};

/**
 * Food middleware
 */
exports.foodByID = function(req, res, next, id) { Food.findById(id).populate('user', 'displayName').exec(function(err, food) {
		if (err) return next(err);
		if (! food) return next(new Error('Failed to load Food ' + id));
		req.food = food ;
		next();
	});
};

/**
 * Food authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.food.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};