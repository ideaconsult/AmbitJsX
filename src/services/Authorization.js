/** AmbitJsX library - a neXt generation Ambit queries JavaScript library.
 * Skills for conducting the actual Ambit server queries.
 *
 * Author: Ivan (Jonan) Georgiev
 * Copyright © 2019, IDEAConsult Ltd. All rights reserved.
 */

import a$ from 'as-sys';

var defSettings = {

};

function Authorization(settings) {
    a$.setup(this, defSettings, settings);
};

Authorization.prototype.init = function (manager) {
	// Let the other initializers.
	a$.pass(this, Authorization, "init", manager);

	this.manager = manager;
}


Authorization.prototype.loadRoles = function () {
    this.manager.doRequest("admin/restpolicy", function (result, jhr, opts) {

    });
};

Authorization.prototype.loadPolicies = function () {
    this.manager.doRequest("admin/restpolicy", function (result, jhr, opts) {

    });
};

Authorization.prototype.addPolicy = function (data) {
    this.manager.doRequest("admin/restpolicy", function (result, jhr, opts) {

    });
};

export default Authorization;