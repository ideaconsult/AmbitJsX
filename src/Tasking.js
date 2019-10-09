/** AmbitJsX library - a neXt generation Ambit queries JavaScript library.
 * Skills for managing task-based queries.
 *
 * Author: Ivan (Jonan) Georgiev
 * Copyright © 2019, IDEAConsult Ltd. All rights reserved.
 */

import a$ from 'as-sys';

function Tasking(settings) {
	a$.setup(this, settings);
};

Tasking.prototype = {
	pollDelay: 250, // how often to check for task completion. In milliseconds.
	pollTimeout: 15000, // after how many milliseconds to give up.

	init: function (manager) {
		a$.pass(this, Tasking, "init", manager);
		this.manager = manager;
	},

	/**
	 * Poll on a task, until it is finished. Pay attention to the fact that the taskUri could be URI 
	 * of any service that _returns_ task definition.
	 */
	pollTask: function (taskUri, callback) {
		var self = this,
			proceedOnTask,
			queryTask,
			taskStart = null;

		queryTask = function (settings) {
			if (typeof settings === 'string')
				settings = {
					url: settings,
					method: 'GET'
				};

			settings.error = function (jhr) {
				callback(null, jhr);
			};

			settings.success = proceedOnTask;
			settings.dataType = "json";
			self.manager.doRequest(settings);
		}

		proceedOnTask = function (task, jhr) {
			if (task == null || task.task == null || task.task.length < 1) {
				callback(task, jhr);
				return;
			}
			task = task.task[0];
			if (task.completed > -1 || !!task.error) // i.e. - we're ready or we're in trouble.
				callback(task, jhr);
			else if (taskStart == null) { // first round
				taskStart = Date.now();
				setTimeout(function () {
					queryTask(task.result);
				}, self.pollDelay);
			} else if (Date.now() - taskStart > self.poolTimeout) // timedout
				callback(task, jhr);
			else
				setTimeout(function () {
					queryTask(task.result);
				}, self.pollDelay); // normal round.
		}

		// Initiate the cycle.
		queryTask(taskUri);
	}

};

export default Tasking;
