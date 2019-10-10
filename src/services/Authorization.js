/** AmbitJsX library - a neXt generation Ambit queries JavaScript library.
 * Skills for conducting the actual Ambit server queries.
 *
 * Author: Ivan (Jonan) Georgiev
 * Copyright © 2019, IDEAConsult Ltd. All rights reserved.
 */

import a$ from 'as-sys';

function Authorization(settings) {
    a$.setup(this, settings);
};

Authorization.prototype = {
    afterResponse: null,

    loadRoles() {
    },

    loadPolicies() {

    },

    addPolicy(data) {

    }
};

export default Authorization;