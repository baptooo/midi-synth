/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _ui = __webpack_require__(1);

	var _synth = __webpack_require__(2);

	var sustain = false;

	var onMidiMessage = function onMidiMessage(_ref) {
	  var data = _ref.data;

	  var _data = _slicedToArray(data, 3),
	      type = _data[0],
	      note = _data[1],
	      velocity = _data[2];

	  velocity *= 0.5;

	  switch (true) {
	    case type === 144:
	      (0, _synth.noteOn)(note, velocity, (0, _ui.getOscillatorType)());
	      (0, _ui.log)(note, velocity);
	      break;
	    case type === 128 && !sustain:
	      (0, _synth.noteOff)(note, velocity);
	      (0, _ui.log)(note, velocity);
	      break;
	    case type === 176:
	      velocity ? (0, _synth.sustainOn)() : (0, _synth.sustainOff)();
	      break;
	    case type === 224:
	      (0, _synth.pitchChange)(velocity);
	      (0, _ui.log)('pitch', velocity);
	      break;
	    default:
	      break;
	  }
	};

	navigator.requestMIDIAccess().then(function (midiAccess) {
	  var inputs = midiAccess.inputs;


	  inputs.forEach(function (midi) {
	    midi.onmidimessage = onMidiMessage;
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.log = log;
	exports.getOscillatorType = getOscillatorType;
	var list = document.getElementById('log');
	var oscillatorTypes = document.getElementById('oscillatorTypes');
	var total = document.getElementById('total');
	var midiMessages = 0;

	if (localStorage.oscillatorType) {
	  oscillatorTypes.value = localStorage.oscillatorType;
	}

	oscillatorTypes.addEventListener('change', function () {
	  localStorage.oscillatorType = oscillatorTypes.value;
	});

	function log(note, velocity) {
	  while (list.children.length > 25) {
	    list.firstChild.remove();
	  }

	  total.innerHTML = midiMessages++;
	  list.innerHTML += '\n    <div>\n      <span>Note: ' + note + '</span>\n      <span>Velocity: ' + velocity + '</span>\n    </div>\n  ';
	}

	function getOscillatorType() {
	  return oscillatorTypes.value;
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.noteOn = noteOn;
	exports.noteOff = noteOff;
	exports.sustainOn = sustainOn;
	exports.sustainOff = sustainOff;
	exports.pitchChange = pitchChange;
	var context = new AudioContext();
	var releaseDelay = 10;
	var oscillators = [];
	var sustain = false;

	var frequencyFromNoteNumber = function frequencyFromNoteNumber(note) {
	  return 440 * Math.pow(2, (note - 69) / 12);
	};

	function noteOn(note, velocity) {
	  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'triangle';

	  var oscillator = context.createOscillator();
	  var gain = context.createGain();

	  oscillator.type = type;
	  oscillator.frequency.value = frequencyFromNoteNumber(note);
	  gain.gain.value = velocity / 100;

	  gain.connect(context.destination);
	  oscillator.connect(gain);
	  oscillator.start(0);
	  oscillators.push({
	    oscillator: oscillator,
	    gain: gain,
	    frequency: frequencyFromNoteNumber(note)
	  });
	}

	var killOscillator = function killOscillator(_ref) {
	  var oscillator = _ref.oscillator,
	      gain = _ref.gain;

	  var delay = setInterval(function () {
	    var value = gain.gain.value * 0.9;

	    if (value <= 1 / 20) {
	      clearInterval(delay);

	      oscillator.stop();
	      oscillator.disconnect();
	      gain.disconnect();
	    } else {
	      gain.gain.value = value;
	    }
	  }, releaseDelay);

	  return false;
	};

	function noteOff(note, velocity) {
	  if (sustain) {
	    return false;
	  }

	  var offFrequency = frequencyFromNoteNumber(note);

	  oscillators = oscillators.filter(function (oscillator) {
	    var frequency = oscillator.frequency;


	    if (Math.round(frequency) === Math.round(offFrequency)) {
	      killOscillator(oscillator);
	      return false;
	    }
	    return true;
	  });
	}

	function sustainOn() {
	  sustain = true;
	}

	function sustainOff() {
	  sustain = false;

	  oscillators = oscillators.filter(killOscillator);
	}

	function pitchChange(value) {
	  // pitch = (value - 64)
	  var pitch = value - 64;
	  oscillators.forEach(function (_ref2) {
	    var oscillator = _ref2.oscillator,
	        frequency = _ref2.frequency;

	    oscillator.frequency.value = frequency + pitch;
	  });
	}

/***/ }
/******/ ]);