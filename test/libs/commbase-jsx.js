!function(global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = factory(require("as-sys"), require("lodash")) : "function" == typeof define && define.amd ? define([ "as-sys", "lodash" ], factory) : (global = global || self)["commbase-jsx"] = factory(global.a$, global._);
}(this, (function(a$, _) {
    "use strict";
    var CommBase = {
        version: "1.0.0"
    };
    function Authenticating(settings) {
        a$.setup(this, settings), "Basic" === settings.authMethod && _.extend(this.ajaxSettings, {
            headers: {
                Authorization: "Basic " + btoa(this.username + ":" + this.password)
            }
        });
    }
    function Delaying(settings) {
        this.delayTimer = null, this.delay = settings && settings.delay || this.delay;
    }
    return Authenticating.prototype = {
        username: null,
        password: null,
        authMethod: null,
        ajaxSettings: null
    }, Delaying.prototype = {
        delay: 300,
        doRequest: function() {
            var self = this, doInvoke = function() {
                a$.pass(self, meSkill, "doRequest"), self.delayTimer = null;
            };
            if (null == this.delay || this.delay < 10) return doInvoke();
            null != this.delayTimer && clearTimeout(this.delayTimer), this.delayTimer = setTimeout(doInvoke, this.delay);
        }
    }, CommBase.Communicating = Authenticating, CommBase.Delaying = Delaying, CommBase;
}));