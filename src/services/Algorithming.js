/** AmbitJsX - Ambit chem-informatics services communication library.
 * A model running skill, based on AMBIT API.
 *
 * Author: Ivan (Jonan) Georgiev
 * Copyright © 2016-2019, IDEAConsult Ltd. All rights reserved.
 */

import a$ from 'as-sys';

var serviceId = "algorithm",
	defSettings = {
		defaultFilter: null, // What needle to use when obtaining model/algorithm list.
	};

function Algorithming(settings) {
	a$.setup(this, defSettings, settings);

	this.algorithms = null;
}

Algorithming.prototype.__expects = [ "populate" ];

Algorithming.prototype.serviceId = serviceId;

Algorithming.prototype.init = function (manager) {
	// Let the other initializers.
	a$.pass(this, Algorithming, "init", manager);

	this.manager = manager;
};

/* List algorithms that contain given 'needle' in their name
 */
Algorithming.prototype.doRequest = function (needle) {
	var self = this,
		servlet = serviceId,
		theNeedle = needle || this.defaultFilter;

	if (!!theNeedle)
		servlet = serviceId + '?search=' + theNeedle;

	self.manager.doRequest(servlet, function (result, jhr) {
		if (result && result.algorithm)
			self.algorithm = result.algorithm;
		else if (jhr.status == 200)
			result = { algorithm: [] }; // empty one

		self.populate(result.algorithm);
	});
};

export default Algorithming;