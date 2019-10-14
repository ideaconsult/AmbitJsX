/** AmbitJsX - Ambit chem-informatics services communication library.
 * A model running skill, based on AMBIT API.
 *
 * Author: Ivan (Jonan) Georgiev
 * Copyright © 2016-2019, IDEAConsult Ltd. All rights reserved.
 */

import a$ from 'as-sys';
import _ from 'lodash';

var defSettings = {
	baseUrl: null, // The URL which is going to be used as a default base, like for images.
};

/* Grab the paging information from the given URL and place it into the settings of passed
kit, as <kit>.settings.pageStart and <kit>.settings.pageSize. Pay attention that it is 'pageStart'
and not 'pageNo'.
*/
function grabPaging(kit, url) {
	var urlObj = this.parseURL(url);
	if (urlObj.params['pagesize'] !== undefined) {
		var sz = parseInt(urlObj.params['pagesize']);
		if (sz > 0)
			kit.settings.pageSize = kit.pageSize = sz;
		url = ccLib.removeParameter(url, 'pagesize');
	}

	if (urlObj.params['page'] !== undefined) {
		var beg = parseInt(urlObj.params['page']);
		if (beg >= 0)
			kit.settings.pageStart = kit.pageStart = beg * kit.settings.pageSize;
		url = ccLib.removeParameter(url, 'page');
	}

	return url;
};

function Querying(settings) {
	a$.setup(this, defSettings, settings);

	if (!this.baseUrl)
		this.baseUrl = this.serverUrl;
	// TODO: Make some fixes for the baseUrl.

};

Querying.prototype.__expects = [ "buildUrl" ];

/**
 * Preparing an Ambit query.
 */
Querying.prototype.prepareQuery = function (servlet) {
	var url, questionIdx;

	if (typeof servlet !== 'object') {
		url = servlet;
		servlet = {};
	} else
		url = servlet.url;
	
	questionIdx = url.indexOf('?');
	return _.defaults({
		url: this.buildUrl(url),
		serviceId: questionIdx > 0 ? url.substr(0, questionIdx) : url
	}, servlet);
};


export default Querying;

