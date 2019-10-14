/** AmbitJsX - Ambit chem-informatics services communication library.
 * A model listing & running skill, based on AMBIT API.
 *
 * Author: Ivan (Jonan) Georgiev
 * Copyright © 2016-2019, IDEAConsult Ltd. All rights reserved.
 */

import a$ from 'as-sys';

var serviceId = 'model',
	defSettings = {
		forceCreate: false, // upon creating a model from algorithm - whether to attempt getting a prepared one, or always create it new.
		defaultUri: null, // A model URI that will be used on a parameterless calls.
	};

function Modelling(settings) {
	a$.setup(this, defSettings, settings);

	this.models = null;
}

Modelling.prototype.__expects = ["pollTask", "populate"];
Modelling.prototype.serviceId = serviceId;

Modelling.prototype.init = function (manager) {
	// Let the other initializers.
	a$.pass(this, Modelling, "init", manager);

	this.manager = manager;
};

/* List all models provided from the server
 */
Modelling.prototype.doRequest = function (uri) {
	var self = this;

	self.manager.doRequest(uri || this.defaultUri || serviceId, function (result, jhr) {
		if (result && result.model)
			self.models = result.model;
		else if (jhr.status == 200)
			result = {
				model: []
			}; // empty one. The self.model is already in this state.

		a$.act(self, self.populate, result.model);
	});
};

/**
 * Get a runnable model for the given algorithm
 */
Modelling.prototype.getModel = function (algoUri, callback) {
	var self = this,
		reportIt = function (task, jhr) {
			return callback(task && task.completed > -1 ? task.result : null, jhr);
		},
		createIt = function () {
			self.pollTask({
				url: algoUri,
				method: 'POST'
			}, reportIt);
		};

	if (self.forceCreate)
		createIt();
	else
		self.manager.doRequest(serviceId + '?algorithm=' + encodeURIComponent(algoUri), function (result, jhr, opts) {
			if (!result && jhr.status != 404) // Some kind of error.
				callback(null, jhr, opts);
			else if (!result || result.model.length == 0) // Ok, we need to create it.
				createIt();
			else // Bingo - we've got it!
				callback(result.model[0].URI, jhr, opts);
		});
};

/**
 * Run a prediction on a created/obtained model
 */
Modelling.prototype.runPrediction = function (datasetUri, modelUri, callback) {
	var self = this,
		createAttempted = false,
		obtainResults = null,
		createIt = null;
	
	// Now, define the actual handlers;
	createIt = function (jhr) {
		if (createAttempted) {
			callback(null, jhr);
			return;
		}
		self.pollTask({
			url: modelUri,
			method: "POST",
			data: { dataset_uri: datasetUri },
		}, function (task, jhr) {
			createAttempted = true;
			if (task && task.completed > -1)
				obtainResults(task.result);
		});
	};

	obtainResults = function (url) {
		var query = {
				url: url,
				method: 'GET',
				dataType: 'json' 
			};
		self.manager.doRequest(query, function (result, jhr, opts) {
			if (!result)
				callback(result, jhr);
			else if (result && result.dataEntry && result.dataEntry.length > 0) {
				var empty = true;
				for (var i = 0, rl = result.dataEntry.length; i < rl; ++i)
					if (a$.weight(result.dataEntry[i].values) > 0) {
						empty = false;
						break;
					}
				if (empty)
					createIt(jhr);
				else
					callback(result, jhr);
			} else
				createIt(jhr);
		});
	};

	if (self.forceCreate)
		createIt();
	else
		obtainResults(self.manager.addUrlParameters(datasetUri, 'feature_uris[]=' + encodeURIComponent(modelUri + '/predicted')));
};

export default Modelling;