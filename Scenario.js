class Scenario {

	constructor(scenes = {}) {
		this.scenes = scenes;
		this._startTime = 0;
		this._nowTime = 0;
		this._speed = 1;	
		this._isStart = false;
		this._finishCount = 0;
	}
	isFinish()  {
		return Object.keys(this.scenes).length <= this._finishCount
	}
	addScene(time, scene) {
		this.scenes[time] = scene;
		return this;
	}
	
	tick(resolve, reject) {
		if(!this._isStart)
			return;
		this._nowTime = Date.now();
		const duration = (this._nowTime - this._startTime) / 1000 * this._speed
		
		if(this.isFinish()) {
			this.finish(resolve, reject)
			return
		}
		
		
		this.setTime(duration);	

		const self = this;
		requestAnimFrame(() => {
			self.tick(resolve, reject);
		});
		
		return;
	}
	setTime(_time, isPlay = false) {
		const self = this
		const scenes = this.scenes
		let distTime = 0
		for(let time in scenes) {
			distTime = _time - time;
			
			if(distTime < 0)
				continue;
			
			if(!scenes[time].isFinish() && !scenes[time].isPlay()) {
				
				scenes[time].play({time:distTime}).then(()=>{self._finishCount++})
				if(!isPlay)
					scenes[time].stop();
			}
		}
		
		return this;
		
	};
	initTime() {
		this._finishCount = 0;
		const scenes = this.scenes
		for(let time in scenes) {
			scenes[time].stop();
			scenes[time].setTime(0);
		}
	}
	initFinishTime(){
		let finishTime = 0;
		
		const scenes = this.scenes;
		let distTime = 0;
		for(let time in scenes) {
			distTime = parseFloat(time) + scenes[time].getFinishTime() / scenes[time].getPlaySpeed();
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
		this.initTime();
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