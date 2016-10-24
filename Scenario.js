class Scenario {

	constructor(scenes = {}) {
		this.scenes = scenes;
		this._finishTime = 0;
		this._startTime = 0;
		this._nowTime = 0;
		this._speed = 1;	
		this._isStart = false;
	}
	isFinish()  {
		const distTime = this._nowTime - this._startTime;
		
		return distTime >= _finishTime;
	}
	addScene(time, scene) {
		this.scenes[time] = scene;
		return this;
	}
	
	tick(resolve, reject) {
		if(!this._isStart)
			return;
		this._nowTime = Date.now();
		var duration = (this._nowTime - this._startTime) / 1000 * this._speed;
		
		if(duration > this._finishTime) {
			this.finish(resolve, reject);
			return;
		}
		
		
		this.setTime(duration);	

		const self = this;
		requestAnimFrame(() => {
			self.tick(resolve, reject);
		});
		
		return;
	}
	setTime(_time) {
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

	initFinishTime(){
		let finishTime = 0;
		
		const scenes = this.scenes;
		let distTime = 0;
		for(let time in scenes) {
			distTime = parseFloat(time) + scenes[time].getFinishTime() / scenes[time].getPlaySpeed();
			console.log(distTime);
			if(distTime > finishTime)
				finishTime = distTime;
		}
		this._finishTime = finishTime;
		return this;
	}
	play() {
		if(this._isStart)
			return;
			
		this.initFinishTime();
		this._isStart = true;
		const self = this;		
		self._startTime =  Date.now();
		return new Promise(resolve => {
		
			self.tick(resolve);
		});
	}
	finish(resolve, reject) {
		this._isStart = false;
		
		if(resolve)
			resolve();
	}
	
	stop() {
		
	}
}