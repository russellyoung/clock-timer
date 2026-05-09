"use strict";
const VERSION = '0.0.1';
// query args:
// BOTH
// - noread: do not restore localStorage record
// - up: clock or timer counts up
// - down: clock or timer counts down
// - nocontext: disables the context menu, used for debugging
// CLOCK ONLY
// - curtis: load the default curtis alarm sets
// - set: sets the initial alarm set, overriding stored value
// TIMER ONLY
// - time HH[:MM[:SS]]: 
// - go: start with the timer running
// - nosleep: run the watchdog, which will recover the right timer count
//      even if the system sleeps

// TODO: fewer and better fonts - more mono fonts probably.
// (maybe allow user to add new fonts dynamically?)
var FONTS = [
	'Bebas Neue',
	'Doto',
	'Major Mono Display',
	'Martian Mono',
	'Oxygen Mono',
	'Syne Mono',
	'VT323',
	'Workbench',
	'Xanh Mono',
	'',   // divide mono from variable
	'Archivo Black',
	'Stint Ultra Condensed',
	'Saira Extra Condensed',
	'Roboto',
	'UnifractorCook',
	'Asset',
	'Eater',
	'Iceland',
	'Rubik Iso', 
	'Chokokutai',
	'Jockey One',
	'Mea Culpa',
	'Rationale',
	'Matemasie',
	'Bitcount',
	'Mansalva',
	'Dorsa'
];


// audio files for use by the alarm (add more?)
const AUDIOS = {'bell': ['ding.mp3'],
				'bzzzt': ['bzzzt.mp3'],
				'church': ['church.mp3']
};

// standard Curtis alarms
const CURTIS_ALARMS = {
	"7-8 full day":{
		"dict":{"name":"7-8 full","active":"checked"},
		"alarms":[
			{"name":"homeroom","setName":"7-8 full day","time":"08:37:00"},
			{"name":"block 1","setName":"7-8 full day","time":"09:29:00"},
			{"name":"block 2","setName":"7-8 full day","time":"10:21:00"},
			{"name":"block 3b","setName":"7-8 full day","time":"11:13:00"},
			{"name":"block 4","setName":"7-8 full day","time":"12:05:00"},
			{"name":"lunch 1","setName":"7-8 full day","time":"12:30:00"},
			{"name":"lunch 2","setName":"7-8 full day","time":"13:01:00"},
			{"name":"lunch 3","setName":"7-8 full day","time":"13:26:00"},
			{"name":"block 6","setName":"7-8 full day","time":"14:18:00"},
			{"name":"block 7","setName":"7-8 full day","time":"15:10:00"}]},
	"7-8 half day":{
		"dict":{"name":"7-8 half day","active":"checked"},
		"alarms":[
			{"name":"homeroom","setName":"7-8 half day","time":"08:35:00"},
			{"name":"block 1","setName":"7-8 half day","time":"09:11:00"},
			{"name":"block 2","setName":"7-8 half day","time":"09:47:00"},
			{"name":"block 3","setName":"7-8 half day","time":"10:23:00"},
			{"name":"block 4","setName":"7-8 half day","time":"10:59:00"},
			{"name":"block 5","setName":"7-8 half day","time":"11:34:00"},
			{"name":"block 6","setName":"7-8 half day","time":"12:09:00"},
			{"name":"block 7","setName":"7-8 half day","time":"12:45:00"}]},
	'6th full': {
		"dict":{"name":"6th full","active":"checked"},
		"alarms":[
			{"name":"homeroom","setName":"6th full day","time":"08:37:00"},
			{"name":"block 1","setName":"6th full day","time":"09:29:00"},
			{"name":"block 2","setName":"6th full day","time":"10:21:00"},
			{"name":"block 3a","setName":"6th full day","time":"10:46:00"},
			{"name":"block 3b","setName":"6th full day","time":"11:13:00"},
			{"name":"block 4a","setName":"6th full day","time":"11:38:00"},
			{"name":"lunch 4b","setName":"6th full day","time":"12:33:00"},
			{"name":"lunch","setName":"6th full day","time":"12:58:00"},
			{"name":"5c","setName":"6th full day","time":"13:26:00"},
			{"name":"block 6a","setName":"6th full day","time":"13:50:00"},
			{"name":"block 6b","setName":"6th full day","time":"14:18:00"},
			{"name":"block 7","setName":"6th full day","time":"15:10:00"}]},
	"6th half day":{
		"dict":{"name":"6th half day","active":"checked"},
		"alarms":[
			{"name":"homeroom","setName":"6th half day","time":"08:35:00"},
			{"name":"block 1","setName":"6th half day","time":"09:11:00"},
			{"name":"block 2","setName":"6th half day","time":"09:47:00"},
			{"name":"block 3a","setName":"6th half day","time":"10:05:00"},
			{"name":"block 3b","setName":"6th half day","time":"10:23:00"},
			{"name":"block 4a","setName":"6th half day","time":"10:41:00"},
			{"name":"block 4b","setName":"6th half day","time":"11:16:00"},
			{"name":"team","setName":"6th half day","time":"11:34:00"},
			{"name":"block 6a","setName":"6th half day","time":"11:52:00"},
			{"name":"block 6b","setName":"6th half day","time":"12:09:00"},
			{"name":"block 7","setName":"6th half day","time":"12:45:00"}]},
};

// HTML for both Timer and Clock
const ABOUT_HTML = `<H3>Timer functions</H3>

These 2 apps provide convenient ad-free time functions. I was using a countdown timer and clock
when teaching, but the clock app added intrusive ads, 4 or 5 of which needed to be cleared before
the clock could be used. Rather than doing that every time I decided to write my own
clock, and once I had that the other was an easy addition - and once I had those I needed to
add more bells and whistles.

<p />Both apps try to fill up most of the screen so students sitting at the back of the room
can see clearly. Different fonts and colors can be used to improve visibility, or just on a whim.
For alarms a sound can be played when they go off.
<p />
The clock app started as a simple clock, but then I added alarms. With the alarms I added
functionality either to show the clock or to count down to the next alarm. The alarms
can also be grouped into alarm sets, which are enabled or disabled by groups instead of
individually, useful to time an entire day without needing to reset or adjust.
<p />
The second app is a countdown timer. The user can set a time, start it, and it counts
down to 0. It can be paused and the time adjusted. Like the clock it can be set to count
either up or down. Counting down it is a timer, counting up a simple stopwatch.
<p />
The code is released open source, feel free to use or modify, but if you do modify it or distribute it
please leave my name in the code.<p />
<a href="https://young-0.com">Russell Young</a>`;

// constants to adjust behavior of the alarm
const DINGCOUNT = 12;     // # of flashes per ding
const DINGMS = 300;       // # of MS to hold each flash

/*******************************************************
 *
 * Config
 *
 * Kind of a potpourri: holds configuration values but also
 * adds some display functionality (fonts)
 *
 *******************************************************/
class Config {
	constructor(dict) {
		this.dict = {...this.myDescribed.DEFAULT_DICT, ...dict};
		this.dims = [0, 0];
	}
	get storeName() { return this.myDescribed.LOCAL_STORAGE_NAME; }
	// gets the object (Clock or Timer) this is called from so base class can be used for both
	get myDescribed() { return Apps[this.constructor.name]; }

	// set up all fonts in the FONTS list and add them to the select
	static init(desc) {
		CONFIG = new this(desc || {});
		let addStylesheetURL = function (url) {
		    var link = makeElt('link', {rel: 'stylesheet', href: url});
			document.getElementsByTagName('head')[0].appendChild(link);
		}
		// load the fonts into the various dropdowns
		let fontSelect = document.getElementById('font-select');
		for (let font of FONTS) {
			if (font) {
    			fontSelect.appendChild(makeElt('OPTION', {value: font, innerText: font, style: 'font-family: ' + font}));
	    		addStylesheetURL(`https://fonts.googleapis.com/css2?family=${font}&display=swap`);
			} else {
				fontSelect.appendChild(makeElt('HR'));
			}
		}
		return fontSelect;
	}
	get(key) { return this.dict[key]; }
	set(key, value) { this.dict[key] = value; }
	// this is overridden in Clock to implement cascading
	color(type) {return this.dict[type]; }
	
	merge(changes) { this.dict = {...this.dict, ...changes}; }

	save() {
		localStorage.setItem(this.storeName, JSON.stringify(this.dict));
		yorn('base configuration saved locally', 1, ['ok']);
	}

	restore() {
		let desc = {...this.myDescribed.DEFAULT_DICT, ...(JSON.parse(localStorage.getItem(this.storeName)) || {})}
		// kind of a hack, this should be overridden in ClockConfig, but I'd rather share the code if possible
		desc.config && (desc = desc.config);
		this.dict = desc;
 		setValues('config-values', desc);
		errorMsg('Restored base configuration from last saved value', 1);
	}
	
	showConfig(ev) {
		ev.preventDefault();
 		setValues('config-values', this.dict);
		modal('config-popup');
	}

    // add more?
	static keyHandler(ev) {
	    let key = ((ev.ctrlKey) ? 'ctrl' : '') + ((ev.shiftKey) ? 'shift' : '') + ev.code;
	    switch(key) {
			case 'ctrlKeyC':
				ev.preventDefault();
				ev.stopPropagation();
				modal();
				break;
		}
	}

	// apply the displayed config values
	doConfig(save) {
		this.merge(getValues('config-values'));
		if (save)
			this.save();
		Clock.instance.restyle();
	}
}
// global value: there is only one. Originally it was in the clock instance,
// but since there is only one of those too it works here to make it global
// I suppose if I really want to make it customizable I'd add a config object
// to each alarm and alarmset also, and then use the cascade of
// alarm > alarmset > clock > default to evaluate values. This would allow
// each alarm its own colors and fonts, but I think I'm beginning to get
// tired of adding to this
var CONFIG = null;

class ClockConfig extends Config {
	static init(desc) {
		desc = desc.config;
		let fontSelect = super.init(desc);
		document.getElementById('font-select1').appendChild(fontSelect.cloneNode(true));
		document.getElementById('font-select2').appendChild(fontSelect.cloneNode(true));
	}
	
	// gets the value from CONFIG. If checkInherit is false just return the CONFIG
	// (clock) value. If checkInherit is true then cascade from the active alarm
	// to the active alarm set, and CONFIG if neither of the others gives a value
	get(key, checkInherit=false) {
		if (!checkInherit) return this.dict[key];
		let set = AlarmSet.active;            // 
		let alarm = set && set.alarms[0] && set.alarms[0].get('active') && set.alarms[0];
		let ret = (alarm) ? alarm.get(key, true) : false;
		if (ret !== false) return ret;
		ret = (set) ? set.get(key, true) : false;
		if (ret !== false) return ret;
		return this.dict[key];
	}

	// special getter for color - gets active color of type WarningForeground, WarningBackground, Foreground, Background
	color(type) {
		let set = AlarmSet.active;
		let alarm = set && set.alarms[0];
		return (alarm && alarm.color(type)) || (set && set.color(type)) || this.dict[type];
	}

	save() { 
		let desc = {...this.myDescribed.DEFAULT_DICT, ...(JSON.parse(localStorage.getItem(this.storeName)) || {})}
		desc.config = this.dict;
		localStorage.setItem(this.storeName, JSON.stringify(desc));
		yorn('base configuration saved locally', 1, ['ok']);
	}
}

/*******************************************************
 *
 * Clock:
 *     the clock is the base object. It just runs a clock,
 *     but also holds the base functionality for other functios.
 *     I'm still looking into adding alarm and alarm set ability.
 *     There is only one clock per app, which is available globally
 *     in the Clock.instance variable
 *
 *     It is called from clock.html
 *
 *******************************************************/
class Clock {
	static LOCAL_STORAGE_NAME = 'clock2';
	static ConfigClass = ClockConfig;
	static init(cls) {
		document.getElementById('about-content').innerHTML = ABOUT_HTML;
		let desc = (queryArgs('noread')) ? {...cls.DEFAULT_DICT}
				 : {...cls.DEFAULT_DICT, ...(JSON.parse(localStorage.getItem(cls.LOCAL_STORAGE_NAME)) || {})}
		cls.ConfigClass.init(desc);
		queryArgs('nocontext') && CONFIG.set('contextMenu', '');
		Clock.instance = new cls();
		Clock.instance.init(desc);
		return Clock.instance;
	}

	init(desc) {
		AlarmSet.init(desc.alarmSets, desc.initial);
		this.start();
	}

	constructor() {
	    this.repeat = this.chars = 0;
		if (queryArgs('up')) this.setDown('up');
		else if (queryArgs('down')) this.setDown('down');
		else this.setDown();
	}

	// main function: called on every tick to update the time and check for alarms
	tick() {
		this.update();
		AlarmSet.check();
	}

	// update the display
	update(force=false) {
		let alarm = AlarmSet.nextAlarm();
		let time = (CONFIG.get('down') && alarm)
				 ? Clock.formatCountDown(alarm.target.getTime())
				 : Clock.formatTime();
		let secs = Number(time.substr(-2));
		if (!CONFIG.get('seconds'))
			time = time.substr(0, time.length - 3) || '0';
		let pct = (secs%60)*5/3;
		document.getElementById('slider').style.width = pct + '%';
		
		document.getElementById('clock').innerText = time;
		//console.log('update');
		this.fitFont();
		if (time.length != this.chars) {
			this.restyle();
			this.chars = time.length;
		}
	}

	// TYPE names a type of color: for now, 'Warming', 'Flash', or '' for default colors
	restyle(type='') {
		document.documentElement.style.setProperty('--foreground', 
    		CONFIG.get(type + 'Foreground', true) || CONFIG.get('Foreground', true));
		document.documentElement.style.setProperty('--background', 
    		CONFIG.get(type + 'Background', true) || CONFIG.get('Background', true));
		document.getElementById('slider').style.background = CONFIG.get('SecondsBackground', true);
		//console.log('restyle');
		this.fitFont();
	}

	// Sets the clock direction, with all the required bookkeeping
	setDown(instruction='same') {
		let hide = 'add';
		let value = CONFIG.get('down');
		switch (instruction) {
			case 'up': value=''; break;
			case 'down': value = 'on'; hide = 'remove'; break;
			case 'toggle': [value, hide] = (value) ? ['', 'add'] : ['on', 'remove']; break;
			case 'same':
			default: hide = (value) ? 'remove' : 'add'; break;  // a NOP
		}
		if (value && !AlarmSet.nextAlarm())
			return this.setDown('up');
		CONFIG.set('down', value);
        document.getElementById('down').checked = (value) ? 'checked' : '';
		document.getElementById('down-arrow').classList[hide]('hide');
	}
	
	// apply the displayed config values
	doConfig(save) {
		let oldRefresh = CONFIG.get('refresh');
		CONFIG.doConfig(false);
		CONFIG.set('fudge', Number(CONFIG.get('fudge')));
		CONFIG.set('refresh', Math.max(CONFIG.get('refresh'), 100));
		if (CONFIG.get('refresh') != oldRefresh) {
    		// changing the refresh time requires restarting the clock
			this.pause();
			this.start();
		}
		Clock.instance.setDown('same');
		if (save) this.save();
		this.restyle();
	}

	start(interval=0) {
		let obj = this;
	    this.tick();
	    //setTimeout(() => 0, 1);
		this.repeat = setInterval(() => obj.tick.call(obj), interval || CONFIG.get('refresh') || 500);
		this.restyle();
	}

	pause() {
		if (this.repeat) {
			clearInterval(this.repeat);
			this.repeat = 0;
		}
	}
	
	// quick hack so that ding() can reset the timer without breaking
	toggle() {}

	static save(ev) {
		ev && ev.stopPropagation();
		Clock.instance.save();
	}
	save() {
		//let desc = {config: CONFIG.dict, alarmSets: AlarmSet.desc(), clock: this._dict};
		let initial = AlarmSet.active && AlarmSet.active.name;
		let desc = {config: CONFIG.dict, alarmSets: AlarmSet.desc(), initial: initial};
		localStorage.setItem(Clock.LOCAL_STORAGE_NAME, JSON.stringify(desc));
		yorn('Clock saved locally', x => 1, ['ok']);
	}

	fitFont() {
		let clock = document.getElementById('clock');
	    //this.chars = clock.innerText.length;
		fitFont(clock);
	}

	// keymap
	// this is attached to body and handles all keys, for modals as well as regular. Separating
	// them makes sense, but means I need to handle the focus to get the right map. If the
	// keys in different contexts are really different it might be worth rethinking this decision
	keyHandler(ev) {
	    let key = ((ev.ctrlKey) ? 'ctrl' : '') + ((ev.shiftKey) ? 'shift' : '') + ev.code;
	    let ret = true;
	    if (!modalLevel()) {
	        switch(key) {
            case 'Digit1':
                CONFIG.set('display', 12);
                document.getElementById('d12').checked = 'checked';
                break;
            case 'Digit2':
                CONFIG.set('display', 24);
                document.getElementById('d24').checked = 'checked';
                break;
	        case 'Space': this.setDown('toggle'); break;
            case 'KeyD':
            case 'ArrowDown': this.setDown('down'); break;
            case 'KeyU':
            case 'ArrowUp':
				this.setDown('up');
				break;
            case 'ctrlKeyU':
            case 'ArrowUp':
				ev.preventDefault();
				this.setDown('up');
				break;
            case 'KeyS':   CONFIG.set('seconds', (CONFIG.get('seconds') ? '' : 'on')); break;
			case 'ctrlshiftSlash':
			case 'shiftSlash':
				modal('shortcuts', 0);
				break;
            default: ret = false;
	        }
	        if (ret) {
    			ev.preventDefault();
	    		ev.stopPropagation
                return;
	        }
	    }
	    switch (key) {
            case 'ctrlKeyA':
                Clock.showConfig(ev, 'config');
				openTab('alarms-tab', 'alarms');
                break;
            case 'ctrlKeyC':
                (modalLevel()) ? modal() :  Clock.showConfig(ev, 'config');
                break;
			case 'ctrlKeyH':
				modal('help', 0);
				ev.preventDefault();
				break;
            case 'ctrlKeyS':
                Clock.showConfig(ev, 'alarm-sets');
                break;
            case 'Escape':
            case 'Enter':
                modal();
                break;
	    }
	}

	restoreConfig() {
		CONFIG.restore();
		setValues('config-values', CONFIG.dict);
		this.doConfig();
	}

	static showConfig(ev, tab='') {
		AlarmSet.makeAlarmConfig();
		CONFIG.showConfig(ev);
		tab && openTab(tab + '-tab', tab);
	}

	// format clock output
	static formatTime() {
		let [now, time] = [new Date(), ''];
		if (CONFIG.get('fudge')) {
		    now.setTime(now.getTime() + CONFIG.get('fudge'));
		}
		let hours = now.getHours();
		if (CONFIG.get('display') == 12) {
			(hours > 12) && (hours -= 12);
		} else {
			hours = pad2(hours);
		}
		return `${hours}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
	}

	// format countdown output
	static formatCountDown(msecs) {
		let seconds = Math.floor((msecs - Date.now())/1000)%(60*60*24);
		while (seconds < 0) seconds += (60*60*24);
		let hours = Math.floor(seconds/3600);
		seconds %= 3600;
		let minutes = Math.floor(seconds/60);
		seconds %= 60;
		if (hours) return `${hours}:${pad2(minutes)}:${pad2(seconds)}`;
		if (minutes) return `${minutes}:${pad2(seconds)}`;
		return String(seconds);
	}
}
Clock.DEFAULT_DICT = {
	seconds: 'on',
	down: 0,
	refresh: 300,
	fudge: 0,
	alarmSets: {},
	display: 24,
	contextMenu: 'on',
	
	Background: '#FFFFFF',
	Foreground: '#000000',
	SecondsBackground: '#008000',
    WarningForeground: '#0000FF',
    WarningBackground: '#FFFF00',
    Warning: '2',
	Bell: 'none',
	Font: 'Bebas Neue',
	Bold: 'normal',
	Italic: 0
};

// used to hold the single instance running. It can be Clock or any of
// the other objects (note: originally Clock, CountDown, Timer, and Stopwatch
// were all different classes, but it turned out combining Clock and
// Countdown, and Timer and Stopwatch, seems to make more sense
Clock.instance = null;
// default config values
// at bottom Clock.DEFAULT_DICT = {...

// Javascript doesn't run when the machine sleeps, which causes
// the timers to stop. They can run a watchdog, which by default
// runs once a second, and calls a callback with the time since
// the last update in ms
class Watchdog {
	constructor(callback) {
		this.prev = 0;
		this.callback = callback;
		this.repeat = null; //this.run(ms, cutoffRatio);
	}
	run(cutoff=2000) {
		if (this.repeat)
			clearInterval(this.repeat);
		this.prev = new Date();
		let watchdog = this;
		this.repeat = setInterval(() => {
			let now = Date.now();
			let diff = now - watchdog.prev;
			watchdog.prev = now;
			(diff > cutoff) && !watchdog.callback(diff);
		}, 1000);
		return this;
	}
	stop() {
		this.repeat && clearInterval(this.repeat);
		this.repeat = null;
	}
	running() { return !!this.repeat; }
}

// takes a time in the future and formats the countdown to it
/*******************************************************
 *
 * Timer
 *    Clock subclass that takes a time and counts down to zero.
 *    The timer can be paused and restarted, and the target
 *    changed when paused.
 *
 *    Used in timer.html
 *
 *******************************************************/
class Timer extends Clock {
	static LOCAL_STORAGE_NAME = 'timer2';
	static ConfigClass = Config;
	static init() {
		let timer = super.init(Timer);
		let secs = secsFromText(queryArgs('time') || '', true);
		let down = !queryArgs('up');
		timer.secs = secs;
		CONFIG.set(down && 'on');
		timer.setDown();
		document.getElementById('clock').style['fontFamily'] = CONFIG.get('Font');
	    setTimeout(() => 0, 1);
		timer.display(timer.secsToArray());
		timer.restyle();
		// HACK I'm not sure why the resizing fails on startup. It may need to wait for rendering
		// before it can. On my workstation this is pretty fast, and waiting 300ms is plenty. On
		// my school chromebook sometimes even 1/2 second is not enough. A hack for this is to do
		// the resizing after a delay, but how long? This tries to smooth out the start by doing
		// a small number of repeats with a smaller interval. This way the resizing takes place
		// as soon as possible, and not too many cycles are wasted
		let repeat = 6;			// about 2 seconds - that should be long enough
		let f = () => {
			timer.fitFont();
			if (repeat-- >= 0) {
				setTimeout(f, 300)
			}
		}
		f();
		// kind of a hack: Clock.setDown() needs to look at AlarmSet.nextAlarm(), but that
		// is a superclass of this, so there isn't a good way to share the code, even though
		// it does basically the same thing. This will disable the unwanted check.
			AlarmSet.nextAlarm = () => true;
	}
	init() {};
	constructor() {
		super();
		this.setField = 2; // start in seconds field
		this.chars = -1;
		this.warned = false;
		this.watchdogCmd(-1);
		let time = queryArgs('time', 0);
		this.secs = (time) ? secsFromText(time, true) : 0;
		if (queryArgs('go') && (!CONFIG.get('down') || (this.secs > 0)))
			this.start()
		queryArgs('nosleep') && this.watchdog.run();
	}

	get running() { return this.repeat != 0; }

	// if run > 0 make sure watchdog is running, if cmd < 0 stop, if cmd == 0 toggle
	watchdogCmd(cmd=0) {
		if (!this.watchdog)
			this.watchdog = new Watchdog(function(diff) {
				if (!Clock.instance.running) return;
				diff = Math.floor(diff/1000);
				CONFIG.get('down') && (diff = -diff);
				Clock.instance.secs += diff;
			});
		if (!cmd) cmd = (this.watchdog.running()) ? -1 : 1;
		
		if (cmd < 0) {
			this.watchdog.stop();
			return null;
		}
		this.watchdog.run();
		return this.watchdog;
	}

    tick() {
		if (!CONFIG.get('down')) {
			this.secs++;
		} else if (this.secs-- <= 1) {
            this.pause();
            this.secs = 0;
            this.setField = 2;
            return ding(this);
		}
		return this.update();
    }
	
	update() {
		let text = this.display();
		let cutoff = Number(CONFIG.get('Warning'))*60;
		let type = '';
		if (this.running && CONFIG.get('down') && (this.secs < cutoff)) {
			if (!this.warned) {			
				this.warned = true;
				type = 'Warning';
				this.chars = 0;
			}
		}
		else {
			this.warned = false;
		}
		if (text.length && (text.length != this.chars)) {
			this.chars = text.length;
			this.restyle(type);
		}
		return text;
	}

	secsToArray() {
		let secs = this.secs;
		let hours = Math.floor(secs/3600);
		secs %= 3600;
		let mins = Math.floor(secs/60);
		secs %= 60;
		return [hours, mins, secs];
	}

	// takes an array [h, m, sec] amd displays it
	// if empty builds input from this.sec
	display(values) {
		if (!values) values = this.secsToArray();
		let clock = document.getElementById('clock');
		let children = Array.from(clock.children);
		// always good value, no need to test
		let pieces = [];
		if (CONFIG.get('fixedLength') || this.sixDigitDisplay()) {
			pieces = [pad2(values[0]), ':', pad2(values[1]), ':', pad2(values[2])];
		} else {
			if (values[0]) {
				pieces = [values[0], ':', pad2(values[1])];
			} else {
				pieces = ['', '', values[1]];
			}
			if (CONFIG.get('seconds')) {
				if (pieces[2] == '0') {
					pieces[2] = pieces[3] = '';
					pieces[4] = values[2];
				} else {
					pieces = pieces.concat([':', pad2(values[2])]);
				}
			} else {
				pieces = pieces.concat(['', '']);
			}
		}
		children.forEach((x, i) => x.innerText = pieces[i]);
		let change = (this.running || !CONFIG.get('down')) ? 'remove' : 'add';
		children[2*this.setField].classList[change]('setting')
		let pct = values[2]*5/3;
		document.getElementById('slider').style.width = pct + '%';
		return clock.innerText;
	}

	static TIMEFIELDS = ['hours', 'minutes', 'seconds'];
	start(secs=0) {
		stopFlash = true;
		this.warned = false;
		this.secs = secs || secsFromText();
		if (!this.secs && CONFIG.get('down')) return;
		//Timer.TIMEFIELDS.forEach(x => document.getElementById(x).classList.remove('setting'));
		let obj = this;
		this.repeat = setInterval(() => obj.tick.call(obj), 1000);
		CONFIG.get('watchdog') && this.watchdog.run();
		document.getElementById('paused').classList.add('invisible');
		document.getElementById('start-pause-menu').innerText = 'pause';
	}

	pause() {
		super.pause();
		this.watchdog.stop();
		stopFlash = true;
		document.getElementById('start-pause-menu').innerText = 'run';
		document.getElementById('paused').classList.remove('invisible');
		//CONFIG.get('down') && document.getElementById(Timer.TIMEFIELDS[this.setField]).classList.add('setting');
		this.update();
	}

	toggle() {
		(this.running) ? this.pause() : this.start();
		stopFlash = true;
		if (event) event.stopPropagation();
	}

	// force six digit display when the countdown timer can be changed
	sixDigitDisplay() { return CONFIG.get('down') && !this.running; }

	doConfig(save=false) {
		CONFIG.doConfig(save);
		document.getElementById('slider').style.background = CONFIG.get('SecondsBackground');
		this.watchdogCmd((CONFIG.get('watchdog')) ? 1 : -1);
	}
	
	keyHandler(ev) {
		let up = !CONFIG.get('down');
		if ((ev.code.startsWith('Arrow')) && this.running)
			return;
		let [hours, mins, secs] = [
			document.getElementById('hours'),
			document.getElementById('minutes'),
			document.getElementById('seconds')];
		let chars = 0;
		let code = ev.code;
		if (up) code = 'UP' + code;
	    let key = ((ev.ctrlKey) ? 'ctrl' : '')
				+ ((ev.shiftKey) ? 'shift' : '')
				+ ((this.running) ? 'R' : '')
				+ ((up) ? 'UP' : '')
				+ ev.code;
		switch(key) {
				// these are active both running and stop
			case 'Space': case 'UPSpace': 
			case 'RSpace': case 'RUPSpace': 
			case 'Enter': case 'UPEnter':
			case 'REnter': case 'RUPEnter':
				this.toggle();
				ev.preventDefault();
			    ev.stopPropagation();
				break;
            case 'ctrlKeyC': case 'ctrlUPKeyC':
            case 'ctrlRKeyC': case 'ctrlRUPKeyC':
            case 'KeyC': case 'UPKeyC': CONFIG.showConfig(ev); break;
				// following are not active when running
			case 'ctrlArrowUp': 
			case 'KeyU': case 'UPKeyU':
				this.setDown('up');
				chars = -2;
				break;
			case 'ctrlArrowDown':
			case 'KeyD': case 'UPKeyD':
				this.setDown('down');
				chars = -3;
				break;
			case 'ArrowRight': this.shift(true); break;
			case 'ArrowLeft': this.shift(false); break;
			case 'ArrowUp': chars = this.up(); break;
			case 'ArrowDown': chars = this.down(); break;
			case 'KeyP': this.pause(); break;
			case 'Digit0': case 'Digit1': case 'Digit2': case 'Digit3': case 'Digit4':
			case 'Digit5': case 'Digit6': case 'Digit7': case 'Digit8': case 'Digit9':
				this.digit(ev.code.slice(-1));
				break;
                CONFIG.showConfig(ev);
                break;
			case 'ctrlKeyH':
				modal('help', 0);
				ev.preventDefault();
				break;
			default: return;
		}
		
		if (chars && (chars != this.chars))
			this.update();
	}

	shift(right) {
		document.getElementById(Timer.TIMEFIELDS[this.setField]).classList.remove('setting');
		this.setField = (this.setField + ((right) ? 1 : 2))%3;
		document.getElementById(Timer.TIMEFIELDS[this.setField]).classList.add('setting');
	}

	digit(x) {
		let clock = document.getElementById('clock');
		let fields = [clock.children[0], clock.children[2], clock.children[4]];
		let num = (fields[this.setField].innerText + x).slice(-2);
		if ((num >= 60) && (this.setField > 0)) {
			num = '0' + x
		}
		fields[this.setField].innerText = num;
		return this.display(fields.map(x => Number(x.innerText)));
	}
	
	up() {
		let clock = document.getElementById('clock');
		let fields = [clock.children[0], clock.children[2], clock.children[4]];
		let num = Number(fields[this.setField].innerText) + 1;
		if ((num >= 60) && (this.setField > 0))
			num = 0;
		fields[this.setField].innerText = num;
		this.secs = secsFromText(clock.innerText);
		return this.display(fields.map(x => Number(x.innerText)));
	}

	down() {
		let clock = document.getElementById('clock');
		let fields = [clock.children[0], clock.children[2], clock.children[4]];
		let num = Number(fields[this.setField].innerText) - 1;
		if (num < 0)
			num = (this.setField == 0) ? 0 : 59;
		fields[this.setField].innerText = num;
		this.secs = secsFromText(clock.innerText);
		return this.display(fields.map(x => Number(x.innerText)));
	}
}

Timer.DEFAULT_DICT = {
	seconds: 'on',
	down: 'on',
	watchdog: '',
	contextMenu: 'on',
	
	Background: '#FFFFFF',
	Foreground: '#000000',
	WarningForeground: 'blue',
	WarningBackground: 'yellow',
	SecondsBackground: '#008000',
	Warning: 2,
	Bell: 'none',
	Font: 'Bebas Neue',
	Bold: 'normal',
	Italic: 0,
};

var Apps = {Config: Timer, ClockConfig: Clock};
var Configs = {Timer: Config, Clock: ClockConfig};
/*******************************************************
 *
 * Alarm class
 *    for use in Clock. When the trigger time for an alarm
 * 	  passes the screen flashes and beeps.The alarm then
 *    can either delete itself or reset for the next day.
 *
 *    Also look at alarmsets, which enable groups of alarms
 *
 *******************************************************/
class Alarm {
	static newAlarm(dict, setName) {
		dict = {...dict};
		setName && (dict.setName = setName);
		let time = dict.time || 'asd';   // if no time force failure in parseTimeStr()
		let pieces = parseTimeStr(time, true);
		if (!pieces) return null;
		dict.time = `${pad2(pieces[0])}:${pad2(pieces[1])}:${pad2(pieces[2])}`;
		let alarm = new Alarm(dict);
		alarm.register();
		return alarm;
	}

	constructor(dict={}, setName='', name='') {
		this._dict = {...Alarm.DEFAULT_DICT, ...dict};
		if (setName) this._dict.setName = setName;
		if (name) this.name = name;
		if (!this._dict.setName)
			this._dict.setName = AlarmSet.DEFAULT_NAME;
		if (!this.name)
			this.name = AlarmSet.all[this._dict.setName].defaultAlarmName();
		// the setter makes sure that if dict.time is good it is normalized, if it is not good
		// dict.time and timer.time are both empty
		this.timeArray = parseTimeStr(dict.time);
	}

	clone(newName) { return new Alarm(this._dict, newName, this.name); }
	
	// accessors: keep all persistent values in _dict, but make these accessible from the object
	get name() { return this._dict.name; }
	set name(newName) { this._dict.name = newName; }
	// this.time is a numeric array [hours, mins, secs], dict.time is a string 'HH:MM:SS'
	get time() { return this._dict.time; }
	set time(timeStr) { this._dict.time = timeStr; }
	get timeArray() { return this.time.split(':').map(x => Number(x)); }
	set timeArray(array) { this._dict.time = [0, 0, 0].concat(array).slice(-3).map(x => pad2(x)).join(':'); }
	
	get(key, checkInherit=false) {
		let ret = this._dict[key];
		return (!checkInherit || ((ret != 'inherit') && !this.get('Inherit' + key))) ? ret : false;
	}
	set(key, value) { this._dict[key] = value; }

	// methods have changed a few times. I may remove them later if they remain so simple
	dict() { return this._dict; }
	ding() { ding(this); }

	register() {
    	this.target = this.date();
		let alarmSet = AlarmSet.all[this._dict.setName];
		if (!alarmSet) return false;
		alarmSet.registerAlarm(this);
	}

    // finds the Date object for the next time this alarm will go off
	// today or tomorrow, at the given time
    date() {
		let date = new Date();
		let time = this.timeArray;
		date.setHours(time[0]);
		date.setMinutes(time[1]);
		date.setSeconds(time[2]);
		let now = Date.now();
		while (date < now) date.setDate(date.getDate() + 1);
        return date;
    }

	//
	// Config stuff: make and manipulate Alarm config screen
	//
	
	// make a row for this alarm  in the Alarm display
	makeRow() { return Alarm.newRow(this); }

	// make an empty row for a new alarm, or an existing one if alarm is passed
	// the elt ROW has the alarm and dict attached to it. ALARM is null if it
	// is a new row
	static newRow(alarm=null) {
		let models = document.getElementById('models').children[0];   // want tbody
		let seed = models.children[0];
		let row = seed.cloneNode(true);
		row.alarm = alarm;
		row.dict = (alarm) ? alarm._dict : {...Alarm.DEFAULT_DICT};
		if (!row.alarm)
			row.children[5].children[0].disabled = true;
		setValues(row, row.dict);
		row.classList.remove('hide');
		return row;
	}

	// read a row from the alarms table
	static readRow(rowElt) {
		let dict = rowElt.dict || Alarm.DEFAULT_DICT;
		dict = {...dict, ...getValues(rowElt)};
		if (!dict.time) return false;
		if (!/^\d?\d(:\d?\d?){0,2}$/.exec(dict.time)) return null;
		return dict;
	}

	//
	// Edit the alarm style
	//

	// the row of the alarm being edited is stored here. It has 2
	// instance variables attached to it: ALARM for the alarm (which
	// is null if it is a new row) and DICT, which is the values of
	// the row
	static  editingRow = null;

	// display the style edit modal for the 
	static editStyle(ev) {
		let row = Alarm.editingRow = ev.target.parentElement.parentElement;
		AlarmSet.editingAlarmStyleRow = ev.target.parentElement.parentElement;
		let titleElt = document.getElementById('alarm-being-styled');
		if (row.dict.setName) {
			titleElt.innerText = `Alarm ${row.dict.setName}.${row.dict.name || '(unnames)'}`;
		} else if (row.dict.name) {
			titleElt.innerText = `Alarm set ${row.dict.name}`;
		} else {
			titleElt.innerText = 'Default values';
		}
		setValues(document.getElementById('alarm-style'), row.dict);
		modal('alarm-style', 0);
	}

	static saveStyle(close=false) {
		let values = getValues(document.getElementById('alarm-style'));
		let row = Alarm.editingRow;
		row.dict = values;  //
		if (row.alarm) {
			// TRUE happens for new alarms where there is no object, NULL is an input error
			(row.alarm !== true) && (row.alarm._dict = {...row.alarm._dict, ...values});
		} else if (row.alarmSet) {
			row.alarmSet._dict = {...row.alarmSet._dict, ...values};
		}
		Clock.instance.restyle();
		if (close) {
			Alarm.editingRow = null;
			modal('config-popup');
		}
	}
}

Alarm.DEFAULT_DICT = {
	keep: 'checked',
	active: 'checked',
	name: '',
	setName: '',
	time: '',

    InheritForeground: 'inherit',
    Foreground: '#000000',
    InheritBackground: 'inherit',
    Background: '#FFFFFF',
	InheritSecondsBackground: 'inherit',
	SecondsBackground: '#008000',
    Warning: 'inherit',
    InheritWarningForeground: 'inherit',
    WarningForeground: '#00FFFF',
    InheritWarningBackground: 'inherit',
    WarningBackground: '#FFFF00',
    Bell:'inherit',
    Font: 'inherit',
    Italic: 'inherit',
    Bold: 'inherit',
};

// reads the display, returns an array [hours, mins, secs]
function parseTimeStr(text, lToR) {
	if (!text) text = document.getElementById('clock').innerText;
	if (text && /^\d*(:\d*){0,2}$/.exec(text)) {
		let pieces = ((lToR)
					? (text + ':00:00').split(':').slice(0, 3)
					: ('00:00:' + text).split(':').slice(-3)).map(x => Number(x));
		if (!pieces.some(x => isNaN(x)))
			return pieces;
	}
	return null;
}

function secsFromText(text, lToR) {
	let pieces = parseTimeStr(text, lToR);
	return (pieces) ? 3600*pieces[0] + 60*pieces[1] + pieces[2] : 0;
}

/*******************************************************
 *
 * AlarmSet class
 *    for use in Clock. Groups alarms into sets that can
 *    be enabled or disabled as a unit, and also hold default
 *    values for alarm parameters.
 *
 *******************************************************/
class AlarmSet {
	// load all stored sets and alarms. Also initializes the first one
	static init(desc='', initial=AlarmSet.DEFAULT_NAME) {
		if (!desc) {
			desc = {};
			desc[AlarmSet.DEFAULT_NAME] = {alarms: {}, dict: AlarmSet.DEFAULT_DICT};
		}
		if (queryArgs('curtis')) {
		    desc = {...CURTIS_ALARMS, ...desc};
		}

		AlarmSet.all = {};
		Object.keys(desc).forEach(key => AlarmSet.newSet(key, desc[key].desc, desc[key].alarms, true));
		// set initial alarmSet to default
		AlarmSet.makeSelect(initial);
		// override setting if passed in query string
		AlarmSet.activate(queryArgs('set', initial));
	}

	constructor(name, dict={}, alarmsDicts=[]) {
		this._dict = {...AlarmSet.DEFAULT_DICT, ...dict};    //
		this._dict.name = name;
		this.active = false;
		this.alarms = alarmsDicts.map(adict => Alarm.newAlarm(adict, name));
		if (this.alarms.some(x => !x.time))
			this.alarms = null;
	}
	get(key, checkInherit=false) {
		let ret = this._dict[key];
		return (!checkInherit || ((ret != 'inherit') && !this.get('Inherit' + key))) ? ret : false;
	}
	set(key, value) { this._dict[key] = value; }

	get name() { return this._dict.name; }
	set name(name) { this._dict.name = name; }

	registerAlarm(alarm) {
    	for (let i = 0; i < this.alarms.length; i++) {
		    if (alarm.target < this.alarms[i].target) {
			    this.alarms.splice(i, 0, alarm);
				if (!i) {
					// signal to update the "next alarm" display
					document.getElementById('next-alarm').classList.add('hide') 
					document.getElementById('next-alarm-top').classList.add('hide') 
				}
				return;
			}
		}
		this.alarms.push(alarm);
	}

	static check() { AlarmSet.active && AlarmSet.active.check(); }
	check() {
		// no alarms, just quit
		if (!this.alarms.length) {
			//nextAlarmElt.classList.add('hide');
			return;
		}
		let nextAlarmElt = document.getElementById('next-alarm');
		let nextAlarmTopElt = document.getElementById('next-alarm-top');
		// if not triggered then just make sure it is displayed and quit
		let now = new Date();
		if (CONFIG.get('fudge')) {
		    now.setTime(now.getTime() + CONFIG.get('fudge'));
		}
		if (this.alarms[0].target > now) {      // not yet triggered
			if (nextAlarmElt.classList.contains('hide')) {
				let next = this.alarms.find(x => x.get('active'));
				if (next) {
					let names = [this.name, next.get('name')].filter(x => x).join('.') + ' ';
					nextAlarmElt.innerText = 'next alarm: ' + names + next.get('time');
					nextAlarmElt.classList.remove('hide');
					nextAlarmTopElt.innerText = 'next alarm: ' + names + next.get('time');
					nextAlarmTopElt.classList.remove('hide');
				}
			}
			// warning time in MS
			let warningMS = Number(CONFIG.get('Warning', true) || 0)*60*1000;
			if (this.alarms[0].target <= now.getTime() + warningMS) {
				Clock.instance.restyle('Warning')
			} else if (AlarmSet.colors) {  // in case the value is changed
				AlarmSet.colors = '';
				Clock.instance.chars = 0;
			}
			return;
		}
		// triggered
		nextAlarmElt.classList.add('hide');  // will be set on next call to check
		let alarm = this.alarms.shift();
		// if the machine was sleeping don't set off the alarm when it opens
		if (alarm.get('active') && (now - alarm.target < 3000)) {
			alarm.ding();
		}
		// save alarm if it is in an AlarmSet or if it is marked save
		if ((this.name != AlarmSet.DEFAULT_NAME) || alarm.get('keep')) {
			alarm.target.setDate(alarm.target.getDate() + 1);
			this.alarms.push(alarm);
		}
		// either the list is empty, there is a single entry set for 24 hours
		// in the future, there is another timer with a later time, or there
		// or there is another timer with the same time. Only the last case will
		// do anything in the recursion
		this.check();
	}

	//
	// AlarmSet Config functions
	//
	static applyConfig() { return AlarmSet.active && AlarmSet.active.applyConfig(); }
	
	applyConfig() {
		let values = getValues('new-set-group');
		this.set('Warning', values.Warning);
		this.set('Bell', values.Bell);
		let rows = Array.from(document.getElementById('alarm-defs').children[0].children);   // want tbody
		rows.shift();    // bump off delete button
		let alarms = rows.map(row => Alarm.readRow(row));
		alarms = alarms.filter(x => x !== false);
		if (alarms.indexOf(null) >= 0) {
			return errorMsg('bad time format', () => (modal('config-popup') || 1));
		}
		this.alarms = [];
		alarms.forEach(dict => {dict.setName = this.get('name'); return Alarm.newAlarm(dict)});
		document.getElementById('next-alarm').classList.add('hide');  // will be set on next call to check
		document.getElementById('next-alarm-top').classList.add('hide');  // will be set on next call to check
		AlarmSet.makeSelect(this.get('name'));
		this.activate();
	}

	static deleteRow(ev) {
		ev.target.parentElement.parentElement.remove();
	}
	
	//
	// Alarm config functions
	//
	static makeAlarmConfig() {
		let table = document.getElementById('alarm-defs').children[0];   // want tbody
		while (table.children.length > 1) {    // clean out the old entries
			table.children[1].remove();
		}
		AlarmSet.active && AlarmSet.active.makeAlarmConfig();
	}

	makeAlarmConfig() {
		// copy from dict into visible elements
	    setValues('new-set-group', this._dict);
		let table = document.getElementById('alarm-defs').children[0];   // want tbody
		this.alarms.forEach(alarm => table.appendChild(alarm.makeRow()));
		// the RENEW and SAVE fields are only relevant for the default AlarmSet
		let action = (this.get('name') == AlarmSet.DEFAULT_NAME) ? 'remove' : 'add';
		Array.from(table.children).forEach(row => {
			row.children[4].classList[action]('hide');
		});
	}

	newRow(focus=false) {
		let table = document.getElementById('alarm-defs').children[0];   // want tbody
		let newRow = Alarm.newRow();
		newRow.children[4].classList[(this.name == AlarmSet.DEFAULT_NAME) ? 'remove' : 'add']('hide');
		table.appendChild(newRow);
		focus && newRow.children[1].children[0].focus();
	}

	//
	// style editing functions
	//
	saveAlarmStyle() {
		let row = AlarmSet.editingAlarmStyleRow;
		row.dict = {...getValues(document.getElementById('alarm-style'))};
		if (!row.alarm) {
			let desc = getValues(AlarmSet.editingAlarmStyleRow);
			row.alarm = Alarm.newAlarm(desc);
		}
		row.alarm._dict = {...row.alarm._dict, ...row.alarmDict};
		modal('config-popup');
	}
	
	static nextAlarm() {
		let next = AlarmSet.active && AlarmSet.active.alarms[0];
		return (next && next.get('active')) ? next : null;
	}

	static desc() {
		let desc = {};
		Object.values(AlarmSet.all).forEach(set => {
		    desc[set.name] = {dict: set._dict, alarms: set.alarms.map(alarm => alarm.dict())};
		});
		return desc;
	}
	
	static newSet(setName, dict='', alarmDicts=[], init=false) {
		let values = {...AlarmSet.DEFAULT_DICT, ...getValues('new-set-group'), ...(dict || {})};
		let elt = document.getElementById('new-set-name');
		if (!setName) 
			setName = elt.value;
		// check that name does not exist, unless this is the first-time initialization
		if (!init && AlarmSet.all[setName]) {
			elt.focus();
			return null;
		}
		elt.value = '';
		let newSet = new AlarmSet(setName, dict, alarmDicts);
		if (!newSet.alarms) {
			errorMsg('bad time format for alarm');
			return null;
		}
		AlarmSet.all[setName] = newSet;
		if (!init) {
			AlarmSet.makeSelect(setName);
			AlarmSet.activate(newSet);
		}
		return newSet;
	}

	static rename(newName='') {
		let elt = document.getElementById('new-set-name');
		if (!AlarmSet.active) return;
		if (!newName) {
			newName = elt.value;
			if (!newName)
				return elt.focus();
		}
		if (AlarmSet.all[newName]) {
			return errorMsg('alarm set ' + newName + ' already exists');
		}
		if (AlarmSet.all[newName])
			return errorMsg('Alarm set with name ' + newName + ' already exists');
		let oldName = AlarmSet.active.name;
		if (oldName == AlarmSet.DEFAULT_NAME)
			return errorMsg('cannot rename default set');
		if (AlarmSet.active.rename(newName)) {
			let set = AlarmSet.active;
			elt.value = '';
			delete AlarmSet.all[oldName];
			AlarmSet.all[newName] = set;
			AlarmSet.makeSelect();
			AlarmSet.activate(newName);
		}
	}

	defaultAlarmName() {
		let suffix = 0;
		let hyphen = '';
		while (this.alarms.find(x => x.name == 'unnamed' + hyphen + suffix) < 0) {
			suffix++;
			hyphen = '-';
		}
		return 'unnamed' + hyphen + suffix;
	}
	
	rename(setName) {
		// all checking has been done before here, this name is good
		this.name = setName;
		this.alarms.forEach(alarm => alarm.set('setName', setName));
		return true;
	}

	copy(newName) {
		if (!newName) {
			newName = document.getElementById('new-set-name').value;
			if (!newName)
				newName = this.name;
		}
		if (newName == AlarmSet.DEFAULT_NAME)
			newName = AlarmSet.DEFAULT_NAME.trim();
		if (AlarmSet.all[newName]) {
			let i = 0;
			newName += '-'
			while (AlarmSet.all[newName + i]) i++;
			newName = newName + i;
		}
		let newSet = AlarmSet.newSet(newName,
									 this._dict,
									 this.alarms.map(x => x._dict), true);
		if (!newSet)
			return errorMsg('failed creating new alarm set');
		AlarmSet.makeSelect(newName);
		AlarmSet.activate(newName);
	}

	static restoreAll() {
		let desc = {...Clock.DEFAULT_DICT, ...(JSON.parse(localStorage.getItem(Clock.LOCAL_STORAGE_NAME)) || {})}
		AlarmSet.init(desc.alarmSets, AlarmSet.active && AlarmSet.active.name);
		AlarmSet.all[AlarmSet.DEFAULT_NAME].makeAlarmConfig();
		errorMsg('restored all alarms from last saved version', 1);
	}
	
	restore() {
		let desc = {...Clock.DEFAULT_DICT, ...(JSON.parse(localStorage.getItem(Clock.LOCAL_STORAGE_NAME)) || {})}
				.alarmSets[this.name];
		if (!desc) {
			return errorMsg('Cannot restore a set with a changed name, restart the clock to recover former state');
		}
		// remove this so newSet() does not flag it as duplicate
		delete AlarmSet.all[this.name]
		AlarmSet.all[this.name] = AlarmSet.newSet(desc.dict.name, desc.dict, desc.alarms);
		if (!AlarmSet.all[this.name]) {
			AlarmSet.all[this.name] = this;
			return errorMsg('Problem restoring set ' + this.name, 1);
		}
		AlarmSet.all[this.name].makeAlarmConfig();
		errorMsg('restored set ' + this.name + ' from last saved version', 1);
	}
	
	static activate(set=null) {
		let name = '';
		if (typeof(set) == 'string') {
			set = AlarmSet.all[set];
		}
		AlarmSet.active && AlarmSet.active.activate(false);
		if (set) {
			name = set.get('name');
			set.activate();
		} else {
			AlarmSet.makeAlarmConfig();
			document.getElementById('alarm-set').children[1].classList.add('quick-choose-selected');
			document.getElementById('styled-set-name').innerText = '(none)';
			document.getElementById('update-set').disabled = true;
		}
		// update on alarm set config
		Array.from(document.getElementById('alarm-set').children).slice(2)
			 .forEach(div => div.classList
				 [(div.value == name) ? 'add' : 'remove']('quick-choose-selected'));
		// update on alarm config
		document.getElementById('alarm-set-2').value = name || '';
		Clock.instance.update(true);
	}
	
	activate(on=true) {
		// this will be set in check(), if appropriate
		document.getElementById('next-alarm').classList.add('hide');
		document.getElementById('next-alarm-top').classList.add('hide');
		if (on) {
			this.sortAlarms();
			AlarmSet.active = this;
			AlarmSet.makeAlarmConfig();
			setValues('new-set-group', this._dict);
			document.getElementById('alarm-set').children[1].classList.remove('quick-choose-selected');
			document.getElementById('styled-set-name').innerText = this.get('name');
			document.getElementById('update-set').disabled = false;
		} else {
			AlarmSet.active = null;
		}
	}

	
	static makeSelect(name='use old name') {
		let alarmSetElt = document.getElementById('alarm-set');
		let alarmSetElt2 = document.getElementById('alarm-set-2');
		
		if (name == 'use old name')
			name = alarmSetElt.value;
		// pop off all but "none" on both alarmset choosers
		while (alarmSetElt.children.length > 2) {
			alarmSetElt.children[2].remove();
			alarmSetElt2.children[2].remove();
		}
		let names = Object.keys(AlarmSet.all).toSorted();
		names.forEach(n => {
			// make AlarmSet menu
			alarmSetElt.appendChild(makeElt('DIV', {innerText: `${n} (${AlarmSet.all[n].alarms.length})`,
													classList: (n == name) ?
													'quick-choose quick-choose-selected' : 'quick-choose',
													value: n}));
			// make Alarm dropdown
			alarmSetElt2.appendChild(makeElt('OPTION', {innerText: `${n} (${AlarmSet.all[n].alarms.length})`,
														value: n}));});
		alarmSetElt2.value = name;
	}
	
	static selectKeyHandler(elt) {
	    if (elt.nextElementSibling) {
	        elt.nextElementSibling.focus();
	    } else {
	        elt.parentElement.children[1].focus();
	    }
	}

	// These are in time order, but in a moving 24-hour window. 
	sortAlarms() {
		this.alarms.forEach(alarm => alarm.target = alarm.date());
		this.alarms.sort((x, y) => (x.target < y.target) ? -1 : ((x.target == y.target) ? 0 : 1));
		let expired = 0;
		let day = new Date().getDate();
		for (; (expired < this.alarms.length) && (this.alarms[expired].target.getDate() != day); expired++);
		// rotate expired alarms to the back so that alarms[0] is active (if any are).
			// This is OK because sort is called whenever an alarm is activated
		if (expired && (expired < this.alarms.length)) {
		    this.alarms = this.alarms.concat(this.alarms.splice(0, expired));
		}
		// rotate out any inactive alarms
		let inactive = this.alarms.findIndex(x => x.get('active'));
		if (inactive > 0) {
		    this.alarms = this.alarms.concat(this.alarms.splice(0, inactive));
		}
	}
	

	delete() {
		if (this.name == AlarmSet.DEFAULT_NAME) {
			return errorMsg('Cannot delete default alarm set', 1);
		}
		let obj = this;
		yorn('really delete alarm set ' + this.name + ' and all its alarms?',
			 reply => (obj.reallyDelete(reply), 1));
	}

	reallyDelete(reply) {
		if (reply == 'yes') {
			AlarmSet.activate(AlarmSet.DEFAULT_NAME);
			delete AlarmSet.all[this.name];
			AlarmSet.makeSelect(AlarmSet.DEFAULT_NAME);
		}
	}


	static editStyle(type, ev) {
		editingRow = ev.target.parentElement.parentElement;
		let titleElt = document.getElementById(type + '-being-styled');
		if (editingRow.dict.setName) {
			titleElt.innerText = `Alarm ${editingRow.dict.setName}.${editingRow.dict.name || '(unnames)'}`;
		} else if (editingRow.dict.name) {
			titleElt.innerText = `Alarm set ${row.dict.name}`;
		} else {
			titleElt.innerText = 'Default values';
		}
		setValues(document.getElementById('alarm-style'), editingRow.dict);
		modal('alarm-style');
	}

	static saveStyle(close=false) {
		AlarmSet.active._dict = {...AlarmSet.active._dict, ...getValues('update-set')};
		Clock.instance.restyle();
		if (close) {
			modal('config-popup');
		}
	}
}

AlarmSet.all = {};
AlarmSet.DEFAULT_NAME = ' default';
AlarmSet.DEFAULT_DICT = {
	name: AlarmSet.DEFAULT_NAME,
	active: 'checked',

	InheritForeground: 'inherit',
	Foreground: '#000000',
	InheritBackground: 'inherit',
	Background: '#FFFFFF',
	InheritSecondsBackground: 'inherit',
	SecondsBackground: '#008000',
	Warning: 'inherit',
	InheritWarningForeground: 'inherit',
	WarningForeground: '#0000FF',
	InheritWarningBackground: 'inherit',
	WarningBackground: '#FFFF00',
	Bell:'inherit',
	Font: 'inherit',
	Italic: 'inherit',
	Bold: 'inherit'
};
AlarmSet.editingAlarmStyleRow = null;
// this is here so the Clock stuff can reference the AlarmSet stuff
Clock.DEFAULT_DICT.alarmSets[AlarmSet.DEFAULT_NAME] = {dict: AlarmSet.DEFAULT_DICT, alarms: []};
AlarmSet.DEFAULT_DICT;
/*******************************************************
 *
 * support functions for this app
 *
 *******************************************************/
// flashes the screen TIMES times, will stop if the STOPFLASH flag is set
// I looked into doing it with CSS animation, but this gives me more control
// of it  and according to stuff I saw online is more efficient
const FLASHCOLORS = ['#ff0000', '#00ff00', '#0000ff'];
var stopFlash = false;
function flash(times, ondone='') {
	stopFlash = false;
	AlarmSet.colors = '';
    let full = document.getElementById('full');
	let fg = full.style.color;
	let bg = full.style.background;
	let f = (t) => {
		if (!t || stopFlash) {
			full.style.color = fg;
			full.style.background = bg;
			document.getElementById('ding').classList.add('hide');
			document.getElementById('clock').classList.remove('hide');
			ondone && ondone();
			return;
		}
		let offset = t & 1;
		full.style.color = FLASHCOLORS[offset]
		full.style.background = FLASHCOLORS[offset + 1];
		setTimeout(() => f(t - 1), DINGMS);
	}
	f(times);
}

// signals when an alarm goes off: flashes the bell screen and rings
// the bell, if configured
function ding(obj) {
	let dingElt = document.getElementById('ding');
	dingElt.classList.remove('hide');
	fitFont(dingElt);
	document.getElementById('clock').classList.add('hide');
	let bell = CONFIG.get('Bell', true);
	let ding = AUDIOS[bell];
	if (ding) {
		if (!ding[1]) {
			ding.push(new Audio(ding[0]));
		}
		ding[1].play();
	}
	let ondone = () => {
		dingElt.classList.add('hide');
		document.getElementById('clock').classList.remove('hide');
		Clock.instance.chars = 0;
		Clock.instance.toggle()
	};
	Clock.instance.restyle('Flash');   // TODO
	flash(DINGCOUNT, ondone);
	return dingElt.innerText;
}

// 0-pads a number to 2 places
function pad2(num) {
	return (num >= 100) ? String(num) : `00${num}`.slice(-2);
}

/*******************************************************
 *
 * common functions
 *
 * These are library functions that can be used in other projects
 *
 * modal() : popup modal boxes; customizable, nesting
 *   errorMsg(): error message popup with OK button
 *   yorn(): yes or no popup
 * Array.merge(): overwrites 0 entries in an array with corresponding
 *        entries from another
 * menu(): context menu
 * getValues(): reads named subelement values from an element. More
 *        flexible than forms
 * setValues(): fills in named subelement values from a dict. More
 *        flexible than forms
 * queryArgs(): gets args from query string
 * makeElt(): makes an element, optionally with attributes and handlers
 * getTextSize(): dynamically gets the size of a displayed font
 *
 *******************************************************/
// opend or closes modal pages
function modal(name, pop=1, ev=null) {
	let len = modal.open.length;
	while (modal.open.length && pop--) {
		modal.open.pop().classList.add('hide');
	}
	if (name) {
		let newModal = document.getElementById(name);
		if (newModal) {
			modal.open.push(newModal);
			newModal.style.zIndex = modal.open.length*100;
			newModal.classList.remove('hide');
			newModal.focus();
		}
    }
    ev && (ev.stopPropagation(), ev.preventDefault());
}
modal.open = [];
function modalLevel() { return modal.open.length; }

// question is prompt to ask
// CALLBACK is a function called when a button is pressed that is passed the prompt as an arg.
// if it returns 0 it closes all modals, otherwise pops back to the previous open one
// REPLIED is an array of strings for button labels

function yorn(question, callback='', replies='') {
	if (!replies) replies = ['yes', 'no'];
	let cb = callback;
	if (typeof(callback) == 'number') cb = x => callback;
	else if (typeof(callback) != 'function') cb = x => 1;
	let handler = function(ev) {
		ev.stopPropagation();
		let pop = cb(ev.target.innerText);
		if (typeof(pop) != 'number') pop = -1;
		modal('', pop);
	}

	document.getElementById('question').innerHTML = question;
	let replyDiv = document.getElementById('replies');
	replyDiv.addEventListener('click', handler, {once: true});
	replyDiv.innerHTML = '';
	replies.forEach(label => replyDiv.appendChild(makeElt('button', {innerText: label}, handler)));
	modal('yorn', 0);
}

function errorMsg(message, callback) {
	yorn('<h4>Error</h4> ' + message, callback, ['ok']);
}

// show the requested page (currently ABOUT or HELP)
function page(ev, page) {
    modal(page);
	document.getElementById('menu').classList.add('hide');
}

// function to open different tabs (used on Clock config screen, for alarms)
function openTab(topTab, tab) {
	if (typeof(topTab) == 'string') topTab = document.getElementById(topTab);
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tab).style.display = "block";
	topTab.className += " active";
}

// Adding to standard types may not be the best practice but it works for me here
// merge arrays: overwrite zero entries with entry from default array.
// array length is the length of the longer array, can be chained.
Array.prototype.merge = function(other) {
	let ret = this.map((x, i) => x || other[i] || x);
	return ret.concat(other.slice(this.length));
}

// toggle the menu display
function menu(ev) {
    if (!CONFIG.get('contextMenu')) return;
    ev.stopPropagation();
    ev.preventDefault();
	let menu = document.getElementById('menu');
	// if currently showing...
	if (!menu.classList.contains('hide')) {
		menu.classList.add('hide');
		return;
	}
	// not showing, pop it up around the mouse position
	menu.style.top = (ev.layerY - 4) + 'px';
	menu.style.left = (ev.layerX - 4) + 'px';
	menu.classList.remove('hide');
}

// function that gets all named inputs from a subtree. Besides simple
// things like text it handles radio buttons and checkboxes - if
// multiple checkboxes are checked it returns an array for all with
// the same name. Returns a DICT of key: value, which can be used
// directly with setvalues() to restore the values
function getValues(root, array=false) {
	if (typeof(root) == 'string') root = document.getElementById(root);
	let values = {};
	let nameCounts = {}
	let inputs = Array.from(root.querySelectorAll('*[name]'));
	for (let elt of inputs) {
		let v = undefined;
		// keep track of whether this value is an array or a scalar
		if ((elt.type == 'checkbox') && nameCounts[elt.name]) {
		    if (nameCounts[elt.name]++ == 1) {
		        values[elt.name] = (values[elt.name] == undefined) ? [] : [values[elt.name]];
		    } 
		} else {
		    nameCounts[elt.name] = 1;
		}
		// handles the different input types supported
		switch (elt.type) {
			case 'checkbox':
				v = (elt.checked) ? elt.value || true : false;
				break;
			case 'radio':
				elt.checked && (v = elt.value);
				break;
			default:
				v = elt.value;
		}
		// store the value
		if (v !== undefined) {
    		if (typeof(values[elt.name]) == 'object') {
	    		values[elt.name].push(v);
		    } else {
			    values[elt.name] = v;
			}
		} 
	}
	if (array) {
		let ret = [];
		inputs.forEach(i => (ret.indexOf(i) < 0) && ret.push(values[i]));
		return ret;
	}
	return values;
}

// handles checkboxes like getValues(): multiple checkboxes with the same
// names have their values stored in a single array
function setValues(root, values) { 
	if (typeof(root) == 'string') 
	    root = document.getElementById(root);
	let keys = Object.keys(values);
	for (let elt of Array.from(root.querySelectorAll('*[name]'))) {
		let value = (values[elt.name] !== undefined) ? values[elt.name] : '';
		switch (elt.type) {
			case 'checkbox':
			    if (typeof(value) == 'object') {
			        elt.checked = (value.indexOf(elt.value) >= 0);
			        break;    // fall through if there is only a single elt with this name
			    }
			case 'radio':
				elt.checked = (elt.value == value);
				break;
			default:
				elt.value = value;
		}
	}
}

// library function to make an element. Arg 0 is type, arg 1 is
// dict of attributes, handlers are a bunch of args where the odd
// numbered ones are handler functions, and even numbers give the
// trigger event for the preceding handler. If it is missing the
// last event type it defaults to "click"
function makeElt(type, atts={}, ...handlers) {
	let elt = document.createElement(type);
	for (let i = 0; i < handlers.length; i += 2) {
		elt.addEventListener(handlers[i + 1] || 'click', handlers[i]);
	}
	//if (eventHandler)
	//	elt.addEventListener(eventType, eventHandler);
	for (let key of Object.keys(atts))
		elt[key] = atts[key];
	return elt;
}

function queryArgs(arg='', dflt=undefined) {
    if (!queryArgs.dict) {
	    queryArgs.dict = {};
	    window.location.search.slice(1).split('&').forEach(x => {
		    let pieces = x.split('=');
		    queryArgs.dict[pieces[0].toLowerCase()] = (pieces[1] === undefined) ? true : pieces[1];
	    });
    }
    let ret = queryArgs.dict[arg.toLowerCase()];
    return (ret === undefined) ? dflt : ret;
}

// adjusts the font size so the text just fits on the screem
function fitFont(elt, font=undefined, bold=undefined, italic=undefined) {
	if (typeof(elt) == 'string') elt = document.getElementById(elt);
	if (!elt) return;
	if (font === undefined) font = CONFIG.get('Font', true);
	if (bold === undefined) bold = CONFIG.get('Bold', true);
	if (italic === undefined) italic = CONFIG.get('Font', true);
	let [width, height] = getTextSize(elt.innerText, font, bold, italic);
	//console.log('resize ' + width + ' x ' + height);
	elt.style['fontWeight'] = bold || '';
	elt.style['fontFamily'] = font;
	elt.style['fontStyle'] = italic || '';
    let heightRatio = window.innerHeight/height;
	let widthRatio = (window.innerWidth - 50)/width;
	if ((widthRatio != fitFont.dims[0]) || (heightRatio != fitFont.dims[1])) {
		elt.style.fontSize = Math.min(heightRatio, widthRatio) + 'px';
		fitFont.dims = [widthRatio, heightRatio];
	}
	//console.log(`fitfont: ${font}, [${width}, ${height}]`);
}
fitFont.dims = [0, 0];

// finds the height and width of the given text in the given font at PIXELS font size
// used to set the right font size for the text to fit on the screen
const PIXELS = 300;
function getTextSize(text, font, weight='normal', italic='') {
	let getTextSize = document.getElementById('get-text-size');
	getTextSize.style.fontFamily = font;
	getTextSize.style.fontWeight = weight;
	getTextSize.style.fontStyle = italic;
	getTextSize.style.fontSize = PIXELS + 'px';
	getTextSize.textContent = text;
	return [getTextSize.offsetWidth/PIXELS, getTextSize.offsetHeight/PIXELS];
}
