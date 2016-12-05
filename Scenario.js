class Scenario {
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
	constructor(scenes = {}) {
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
	isFinish()  {
		return Object.keys(this.scenes).length <= this._finishCount
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
		
		
		this.setTime(duration, true);	

		const self = this;
		requestAnimFrame(() => {
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
	init() {
		this._finishCount = 0;
		const scenes = this.scenes
		for(let time in scenes) {
			scenes[time].stop();
			scenes[time].setTime(0);
		}
		return this;
	}
	
	/**
     * Play Scenario
     * @return {Promise} Promise for playing state. <br/> if playing state is finish , call resolve.
     */
	play() {
		if(this._isStart)
			return;
		this.init();
		this._isStart = true;
		const self = this;		
		self._startTime =  Date.now();
		return new Promise(resolve => {
		
			self.tick(resolve);
		});
	}
	/**
     * a Scenario is finish
     * @param {Promise.resolve}[resolve=] if scenario is finish, call resolve function
     * @return {Scenario} An instance.
     */
	finish(resolve) {
		this._isStart = false;
		
		if(resolve)
			resolve();
			
			
		return this;
	}
	
	stop() {
		
	}
}