'use strict';

//Foods service used to communicate Foods REST endpoints
angular.module('foods').factory('Foods', ['$resource',
	function($resource) {
		return $resource('foods/:foodId', { foodId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);