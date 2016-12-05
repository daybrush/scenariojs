"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scenario = function () {
	/**
     * create a Scenario
     * @class
     * @param {Object} [scenes=false] scenes.
     * @example
 var scenario = new Scenario({
 0 : scene1,
 0.4 : scene2,
 0.7 : scene3
 });
     */
	function Scenario() {
		var scenes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Scenario);

		this.scenes = scenes;
		this._startTime = 0;
		this._nowTime = 0;
		this._speed = 1;
		this._isStart = false;
		this._finishCount = 0;
	}

	/**
     * Checks whether the scenario is finish.
     * @return {Boolean} true : finish , false : not finish
     */


	_createClass(Scenario, [{
		key: "isFinish",
		value: function isFinish() {
			return Object.keys(this.scenes).length <= this._finishCount;
		}

		/**
      * Add Scene in time
      * @param {number} time - Play Time.
      * @param {Scene} Scene - Scene.
      * @return {Scenario} An instance.
      * @example
  var scenario = new Scenario();
  scenario.addScene(0, scene1);
  scenario.addScene(0.5, scene2);
  scenario.addScene(1, scene3);
      */

	}, {
		key: "addScene",
		value: function addScene(time, scene) {
			this.scenes[time] = scene;
			return this;
		}
	}, {
		key: "tick",
		value: function tick(resolve, reject) {
			if (!this._isStart) return;
			this._nowTime = Date.now();
			var duration = (this._nowTime - this._startTime) / 1000 * this._speed;

			if (this.isFinish()) {
				this.finish(resolve, reject);
				return;
			}

			this.setTime(duration, true);

			var self = this;
			requestAnimFrame(function () {
				self.tick(resolve, reject);
			});

			return;
		}
		/**
      * set Time in Scenario
      * @param {number} time - Play Time.
      * @param {Boolean} [isPlay=false] - Playing or Not Playing.
      * @return {Scenario} An instance.
      * @example
  var scenario = new Scenario();
  scenario.addScene(0, scene1);
  scenario.addScene(0.5, scene2);
  scenario.addScene(1, scene3);
      */

	}, {
		key: "setTime",
		value: function setTime(_time) {
			var isPlay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var self = this;
			var scenes = this.scenes;
			var distTime = 0;
			for (var time in scenes) {
				distTime = _time - time;

				if (distTime < 0) continue;

				if (!scenes[time].isFinish() && !scenes[time].isPlay()) {

					scenes[time].play({ time: distTime }).then(function () {
						self._finishCount++;
					});
					if (!isPlay) scenes[time].stop();
				}
			}

			return this;
		}
	}, {
		key: "init",
		value: function init() {
			this._finishCount = 0;
			var scenes = this.scenes;
			for (var time in scenes) {
				scenes[time].stop();
				scenes[time].setTime(0);
			}
			return this;
		}

		/**
      * Play Scenario
      * @return {Promise} Promise for playing state. <br/> if playing state is finish , call resolve.
      */

	}, {
		key: "play",
		value: function play() {
			if (this._isStart) return;
			this.init();
			this._isStart = true;
			var self = this;
			self._startTime = Date.now();
			return new Promise(function (resolve) {

				self.tick(resolve);
			});
		}
		/**
      * a Scenario is finish
      * @param {Promise.resolve}[resolve=] if scenario is finish, call resolve function
      * @return {Scenario} An instance.
      */

	}, {
		key: "finish",
		value: function finish(resolve) {
			this._isStart = false;

			if (resolve) resolve();

			return this;
		}
	}, {
		key: "stop",
		value: function stop() {}
	}]);

	return Scenario;
}();
//# sourceMappingURL=Scenario.js.map
