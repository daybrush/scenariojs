class Scenario {
	scenes = {};
	_finishTime = 0;
	_startTime = 0;
	_nowTime = 0;
	_speed = 1;
	
	
	_isStart = false;
	isFinish = () => {
		const distTime = this._nowTime - this._startTime;
		
		return distTime >= _finishTime;
	}
	addScene = (time, scene) => {
		this.scenes[time] = scene;
		return this;
	}
	
	tick = (resolve, reject) => {
		if(!this._isStart)
			return;
		this._nowTime = Date.now();
		var duration = (this._nowTime - this._startTime) / 1000 * this._speed;
		
		if(duration > this._finishTime) {
			this.finish(resolve, reject);
			return;
		}
			

		const self = this;
		requestAnimFrame(function() {
			self.tick(resolve, reject);
		});
		
		return;
	}
	setTime = function setTime(_time) {
		const scenes = this.scenes;
		let distTime = 0;
		for(let time in scenes) {
			distTime = _time - time;
			
			if(distTime < 0)
				continue;
			
			scenes[time].setTime(distTime);
		}
		
		return this;
		
	};

	initFinishTime = () => {
		let finishTime = 0;
		
		const scenes = this.scenes;
		let distTime = 0;
		for(let time in scenes) {
			distTime = time + scenes[time].getFinishTime() / scenes[time].getPlaySpeed();
			if(distTime > finishTime)
				finishTime = distTime;
		}
		this._finishTime = finishTime;
		return this;
	}
	play = () => {
	
		this.initFinishTime();
		
		return new Promise(resolove => {
			
		});
	}
	finish = (resolve, reject) => {
		this._isStart = false;
		
		if(resolve)
			resolve();
	}
	
	stop = () => {
		
	}
}