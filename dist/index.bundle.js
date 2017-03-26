/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noteOn = noteOn;
exports.noteOff = noteOff;
exports.sustainOn = sustainOn;
exports.sustainOff = sustainOff;
exports.pitchChange = pitchChange;

var _waves = __webpack_require__(3);

var waves = _interopRequireWildcard(_waves);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var context = new AudioContext();
var reverb = 5;
var oscillators = [];
var sustain = false;

var frequencyFromNoteNumber = function frequencyFromNoteNumber(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
};

function noteOn(note, velocity) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'triangle';

  var oscillator = context.createOscillator();
  var gain = context.createGain();
  var frequency = frequencyFromNoteNumber(note);

  switch (true) {
    case type in waves:
      oscillator.setPeriodicWave(waves.getPeriodicWave(waves[type], context));
      break;
    default:
      oscillator.type = type;
      break;
  }

  oscillator.frequency.value = frequency;
  gain.gain.value = 0.3; // velocity / 100

  gain.connect(context.destination);
  oscillator.connect(gain);
  oscillator.start(1);
  oscillators.push({
    oscillator: oscillator,
    gain: gain,
    frequency: frequency
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
  }, reverb);

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
  var pitch = value - 32;
  oscillators.forEach(function (_ref2) {
    var oscillator = _ref2.oscillator,
        frequency = _ref2.frequency;

    oscillator.frequency.value = frequency + pitch;
  });
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
  list.innerHTML += '\n    <li>\n      <span>Note: ' + note + '</span>\n      <span>Velocity: ' + velocity + '</span>\n    </li>\n  ';
}

function getOscillatorType() {
  return oscillatorTypes.value;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ui = __webpack_require__(1);

var _synth = __webpack_require__(0);

var sustain = false;

var onMidiMessage = function onMidiMessage(_ref) {
  var data = _ref.data;

  var _data = _slicedToArray(data, 3),
      type = _data[0],
      note = _data[1],
      velocity = _data[2];

  if (false) {
    (0, _ui.log)(note, velocity);
    return false;
  }

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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// Helper to generate periodic wave from data wave
var getPeriodicWave = exports.getPeriodicWave = function getPeriodicWave(wave, context) {
  var real = new Float32Array(wave);
  var imag = new Float32Array(real.length);
  return context.createPeriodicWave(real, imag);
};

var random = exports.random = [];
var rhodes = exports.rhodes = ['0.4', '0.8', '0.6', '0.6', '0.6', '0.6', '0.0', '0.8', '0.3', '1.0'];
var organ = exports.organ = ['0.2', '0.4', '0.0', '0.0', '0.9', '0.1', '0.1', '0.1', '0.2', '0.9'];
var organ2 = exports.organ2 = [0.5608259910131279, 0.18323919333961336, 0.9449980314543962, 0.07358557583464687, 0.8841613825722621, 0.7048631759361661, 0.025339326184752098, 0.6519546142566628];

var size = Math.random() * 40 << 0;
for (var i = 0; i < size; i++) {
  random.push(Math.random());
  // random.push(i / size)
}

/***/ })
/******/ ]);