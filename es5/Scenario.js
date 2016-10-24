"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scenario = function () {
	function Scenario() {
		var scenes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Scenario);

		this.scenes = scenes;
		this._finishTime = 0;
		this._startTime = 0;
		this._nowTime = 0;
		this._speed = 1;
		this._isStart = false;
	}

	_createClass(Scenario, [{
		key: "isFinish",
		value: function isFinish() {
			var distTime = this._nowTime - this._startTime;

			return distTime >= _finishTime;
		}
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

			if (duration > this._finishTime) {
				this.finish(resolve, reject);
				return;
			}

			this.setTime(duration);

			var self = this;
			requestAnimFrame(function () {
				self.tick(resolve, reject);
			});

			return;
		}
	}, {
		key: "setTime",
		value: function setTime(_time) {
			var scenes = this.scenes;
			var distTime = 0;
			for (var time in scenes) {
				distTime = _time - time;

				if (distTime < 0) continue;

				scenes[time].setTime(distTime);
			}

			return this;
		}
	}, {
		key: "initFinishTime",
		value: function initFinishTime() {
			var finishTime = 0;

			var scenes = this.scenes;
			var distTime = 0;
			for (var time in scenes) {
				distTime = parseFloat(time) + scenes[time].getFinishTime() / scenes[time].getPlaySpeed();
				if (distTime > finishTime) finishTime = distTime;
			}
			this._finishTime = finishTime;
			return this;
		}
	}, {
		key: "play",
		value: function play() {
			if (this._isStart) return;

			this.initFinishTime();
			this._isStart = true;
			var self = this;
			self._startTime = Date.now();
			return new Promise(function (resolve) {

				self.tick(resolve);
			});
		}
	}, {
		key: "finish",
		value: function finish(resolve, reject) {
			this._isStart = false;

			if (resolve) resolve();
		}
	}, {
		key: "stop",
		value: function stop() {}
	}]);

	return Scenario;
}();