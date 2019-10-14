/** jToxKit - chem-informatics multi-tool-kit.
 * A model running skill, based on AMBIT API.
 *
 * Author: Ivan (Jonan) Georgiev
 * Copyright © 2016-2017, IDEAConsult Ltd. All rights reserved.
 */

import a$ from 'as-sys';

var defSettings = {
	algorithms: false, // ask for algorithms, not models.
	forceCreate: false, // upon creating a model from algorithm - whether to attempt getting a prepared one, or always create it new.
	loadOnInit: false, // whether to make a (blank) request upon loading.
	listFilter: null, // What needle to use when obtaining model/algorithm list.
	onLoaded: null, // callback to be called when data has arrived.
};

function Modelling(settings) {
	a$.setup(this, defSettings, settings);

	this.models = null;
}

Modelling.prototype.__expects = ['pollTask'];

Modelling.prototype.init = function (manager) {
	// Let the other initializers.
	a$.pass(this, Modelling, "init", manager);

	this.manager = manager;
	if (this.loadOnInit)
		this.queryList();
};

/* List all models provided from the server
 */
Modelling.prototype.listModels = function () {
	var self = this;

	self.manager.doRequest('model', function (result, jhr) {
		if (result && result.model)
			self.models = result.model;
		else if (jhr.status == 200)
			result = {
				model: []
			}; // empty one. The self.model is already in this state.

		a$.act(self, self.onLoaded, result);
	});
};

/* List algorithms that contain given 'needle' in their name
 */
Modelling.prototype.listAlgorithms = function (needle) {
	var self = this,
		servlet = 'algorithm';

	if (!!needle)
		servlet += '?search=' + needle;

	self.manager.doRequest(servlet, function (result, jhr) {
		if (result && result.algorithm)
			self.algorithm = result.algorithm;
		else if (jhr.status == 200)
			result = {
				algorithm: []
			}; // empty one

		a$.act(self, self.onLoaded, result, jhr);
	});
};

/**
 * Get a runnable model for the given algorithm
 */
Modelling.prototype.getModel = function (algoUri, callback) {
	var self = this,
		reportIt = function (task, jhr) {
			return callback(task && task.completed > -1 ? task.result : null, jhr);
		};

	if (self.forceCreate)
		self.pollTask({
			url: algoUri,
			method: 'POST'
		}, reportIt);
	else
		self.manager.doRequest('model?algorithm=' + encodeURIComponent(algoUri), function (result, jhr) {
			if (!result && jhr.status != 404) // Some kind of error.
				callback(null, jhr);
			else if (!result || result.model.length == 0) // Ok, we need to create it.
				self.pollTask({
					url: algoUri,
					method: 'POST'
				}, reportIt);
			else // Bingo - we've got it!
				callback(result.model[0].URI, jhr);
		});
};

/**
 * Run a prediction on a created/obtained model
 */
Modelling.prototype.runPrediction = function (datasetUri, modelUri, callback) {
	var self = this,
		createAttempted = false,
		obtainResults = null,
		createIt = function (jhr) {
			if (createAttempted) {
				callback(null, jhr);
				return;
			}
			self.pollTask({
				url: modelUri,
				method: "POST",
				data: {
					dataset_uri: datasetUri
				},
			}, function (task, jhr) {
				createAttempted = true;
				if (task && task.completed > -1)
					obtainResults(task.result);
			});
		};

	obtainResults = function (uri) {
		self.manager.connector({
			url: uri,
			method: 'GET',
			dataType: 'json',
			error: function (jhr) {
				callback(null, jhr);
			},
			success: function (result, jhr) {
				if (result && result.dataEntry && result.dataEntry.length > 0) {
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
			}
		});
	};

	if (self.forceCreate)
		createIt();
	else
		obtainResults(jT.addParameter(datasetUri, 'feature_uris[]=' + encodeURIComponent(modelUri + '/predicted')));
};

/**
 * Query the list of algorithms or models on the server
 */
Modelling.prototype.queryList = function (needle) {
	if (this.algorithms)
		this.listAlgorithms(this.listFilter = (needle || this.listFilter));
	else
		this.listModels(this.modelUri);
};

export default Modelling;