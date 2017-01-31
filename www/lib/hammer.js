/*! Hammer.JS - v2.0.8 - 2016-09-30
 * http://hammerjs.github.io/
 *
 * Copyright (c)  Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
    "use strict";

    function ifUndefined(val1, val2) {
        return val1 === undefined ? val2 : val1 }
    var VENDOR_PREFIXES = ["", "webkit", "Moz", "MS", "ms", "o"];
    var TEST_ELEMENT = document.createElement("div");
    var TYPE_FUNCTION = "function";
    var round = Math.round;
    var abs = Math.abs;
    var now = Date.now;

    function prefixed(obj, property) {
        var prefix = void 0;
        var prop = void 0;
        var camelProp = property[0].toUpperCase() + property.slice(1);
        var i = 0;
        while (i < VENDOR_PREFIXES.length) { prefix = VENDOR_PREFIXES[i];
            prop = prefix ? prefix + camelProp : property;
            if (prop in obj) {
                return prop }
            i++ }
        return undefined }

    function getTouchActionProps() {
        if (!NATIVE_TOUCH_ACTION) {
            return false }
        var touchMap = {};
        var cssSupports = window.CSS && window.CSS.supports;
        ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function(val) {
            return touchMap[val] = cssSupports ? window.CSS.supports("touch-action", val) : true });
        return touchMap }
    var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, "touchAction");
    var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;
    var TOUCH_ACTION_COMPUTE = "compute";
    var TOUCH_ACTION_AUTO = "auto";
    var TOUCH_ACTION_MANIPULATION = "manipulation";
    var TOUCH_ACTION_NONE = "none";
    var TOUCH_ACTION_PAN_X = "pan-x";
    var TOUCH_ACTION_PAN_Y = "pan-y";
    var TOUCH_ACTION_MAP = getTouchActionProps();
    var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
    var SUPPORT_TOUCH = "ontouchstart" in window;
    var SUPPORT_POINTER_EVENTS = prefixed(window, "PointerEvent") !== undefined;
    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
    var INPUT_TYPE_TOUCH = "touch";
    var INPUT_TYPE_PEN = "pen";
    var INPUT_TYPE_MOUSE = "mouse";
    var INPUT_TYPE_KINECT = "kinect";
    var COMPUTE_INTERVAL = 25;
    var INPUT_START = 1;
    var INPUT_MOVE = 2;
    var INPUT_END = 4;
    var INPUT_CANCEL = 8;
    var DIRECTION_NONE = 1;
    var DIRECTION_LEFT = 2;
    var DIRECTION_RIGHT = 4;
    var DIRECTION_UP = 8;
    var DIRECTION_DOWN = 16;
    var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
    var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
    var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;
    var PROPS_XY = ["x", "y"];
    var PROPS_CLIENT_XY = ["clientX", "clientY"];
    var STATE_POSSIBLE = 1;
    var STATE_BEGAN = 2;
    var STATE_CHANGED = 4;
    var STATE_ENDED = 8;
    var STATE_RECOGNIZED = STATE_ENDED;
    var STATE_CANCELLED = 16;
    var STATE_FAILED = 32;
    var assign = void 0;
    if (typeof Object.assign !== "function") { assign = function assign(target) {
            if (target === undefined || target === null) {
                throw new TypeError("Cannot convert undefined or null to object") }
            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) { output[nextKey] = source[nextKey] } } } }
            return output } } else { assign = Object.assign }
    var assign$1 = assign;
    var _uniqueId = 1;

    function uniqueId() {
        return _uniqueId++ }

    function each(obj, iterator, context) {
        var i = void 0;
        if (!obj) {
            return }
        if (obj.forEach) { obj.forEach(iterator, context) } else if (obj.length !== undefined) { i = 0;
            while (i < obj.length) { iterator.call(context, obj[i], i, obj);
                i++ } } else {
            for (i in obj) { obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj) } } }

    function invokeArrayArg(arg, fn, context) {
        if (Array.isArray(arg)) { each(arg, context[fn], context);
            return true }
        return false }

    function inArray(src, find, findByKey) {
        if (src.indexOf && !findByKey) {
            return src.indexOf(find) } else {
            var i = 0;
            while (i < src.length) {
                if (findByKey && src[i][findByKey] == find || !findByKey && src[i] === find) {
                    return i }
                i++ }
            return -1 } }
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
        return typeof obj } : function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj };
    var asyncGenerator = function() {
        function AwaitValue(value) { this.value = value }

        function AsyncGenerator(gen) {
            var front, back;

            function send(key, arg) {
                return new Promise(function(resolve, reject) {
                    var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null };
                    if (back) { back = back.next = request } else { front = back = request;
                        resume(key, arg) } }) }

            function resume(key, arg) {
                try {
                    var result = gen[key](arg);
                    var value = result.value;
                    if (value instanceof AwaitValue) { Promise.resolve(value.value).then(function(arg) { resume("next", arg) }, function(arg) { resume("throw", arg) }) } else { settle(result.done ? "return" : "normal", result.value) } } catch (err) { settle("throw", err) } }

            function settle(type, value) {
                switch (type) {
                    case "return":
                        front.resolve({ value: value, done: true });
                        break;
                    case "throw":
                        front.reject(value);
                        break;
                    default:
                        front.resolve({ value: value, done: false });
                        break }
                front = front.next;
                if (front) { resume(front.key, front.arg) } else { back = null } }
            this._invoke = send;
            if (typeof gen.return !== "function") { this.return = undefined } }
        if (typeof Symbol === "function" && Symbol.asyncIterator) { AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
                return this } }
        AsyncGenerator.prototype.next = function(arg) {
            return this._invoke("next", arg) };
        AsyncGenerator.prototype.throw = function(arg) {
            return this._invoke("throw", arg) };
        AsyncGenerator.prototype.return = function(arg) {
            return this._invoke("return", arg) };
        return { wrap: function(fn) {
                return function() {
                    return new AsyncGenerator(fn.apply(this, arguments)) } }, await: function(value) {
                return new AwaitValue(value) } } }();
    var classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function") } };
    var createClass = function() {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor) } }
        return function(Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor } }();
    var get = function get(object, property, receiver) {
        if (object === null) object = Function.prototype;
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);
            if (parent === null) {
                return undefined } else {
                return get(parent, property, receiver) } } else if ("value" in desc) {
            return desc.value } else {
            var getter = desc.get;
            if (getter === undefined) {
                return undefined }
            return getter.call(receiver) } };
    var inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass) }
        subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass };
    var possibleConstructorReturn = function(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called") }
        return call && (typeof call === "object" || typeof call === "function") ? call : self };
    var slicedToArray = function() {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;
            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value);
                    if (i && _arr.length === i) break } } catch (err) { _d = true;
                _e = err } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]() } finally {
                    if (_d) throw _e } }
            return _arr }
        return function(arr, i) {
            if (Array.isArray(arr)) {
                return arr } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i) } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance") } } }();

    function boolOrFn(val, args) {
        if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === TYPE_FUNCTION) {
            return val.apply(args ? args[0] || undefined : undefined, args) }
        return val }

    function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
        var manager = recognizer.manager;
        if (manager) {
            return manager.get(otherRecognizer) }
        return otherRecognizer }

    function stateStr(state) {
        if (state & STATE_CANCELLED) {
            return "cancel" } else if (state & STATE_ENDED) {
            return "end" } else if (state & STATE_CHANGED) {
            return "move" } else if (state & STATE_BEGAN) {
            return "start" }
        return "" }
    var Recognizer = function() {
        function Recognizer(options) { classCallCheck(this, Recognizer);
            this.options = assign$1({}, this.defaults, options || {});
            this.id = uniqueId();
            this.manager = null;
            this.options.enable = ifUndefined(this.options.enable, true);
            this.state = STATE_POSSIBLE;
            this.simultaneous = {};
            this.requireFail = [] }
        createClass(Recognizer, [{ key: "set", value: function set(options) { assign$1(this.options, options);
                this.manager && this.manager.touchAction.update();
                return this } }, { key: "recognizeWith", value: function recognizeWith(otherRecognizer) {
                if (invokeArrayArg(otherRecognizer, "recognizeWith", this)) {
                    return this }
                var simultaneous = this.simultaneous;
                otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
                if (!simultaneous[otherRecognizer.id]) { simultaneous[otherRecognizer.id] = otherRecognizer;
                    otherRecognizer.recognizeWith(this) }
                return this } }, { key: "dropRecognizeWith", value: function dropRecognizeWith(otherRecognizer) {
                if (invokeArrayArg(otherRecognizer, "dropRecognizeWith", this)) {
                    return this }
                otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
                delete this.simultaneous[otherRecognizer.id];
                return this } }, { key: "requireFailure", value: function requireFailure(otherRecognizer) {
                if (invokeArrayArg(otherRecognizer, "requireFailure", this)) {
                    return this }
                var requireFail = this.requireFail;
                otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
                if (inArray(requireFail, otherRecognizer) === -1) { requireFail.push(otherRecognizer);
                    otherRecognizer.requireFailure(this) }
                return this } }, { key: "dropRequireFailure", value: function dropRequireFailure(otherRecognizer) {
                if (invokeArrayArg(otherRecognizer, "dropRequireFailure", this)) {
                    return this }
                otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
                var index = inArray(this.requireFail, otherRecognizer);
                if (index > -1) { this.requireFail.splice(index, 1) }
                return this } }, { key: "hasRequireFailures", value: function hasRequireFailures() {
                return this.requireFail.length > 0 } }, { key: "canRecognizeWith", value: function canRecognizeWith(otherRecognizer) {
                return !!this.simultaneous[otherRecognizer.id] } }, { key: "emit", value: function emit(input) {
                var self = this;
                var state = this.state;

                function emit(event) { self.manager.emit(event, input) }
                if (state < STATE_ENDED) { emit(self.options.event + stateStr(state)) }
                emit(self.options.event);
                if (input.additionalEvent) { emit(input.additionalEvent) }
                if (state >= STATE_ENDED) { emit(self.options.event + stateStr(state)) } } }, { key: "tryEmit", value: function tryEmit(input) {
                if (this.canEmit()) {
                    return this.emit(input) }
                this.state = STATE_FAILED } }, { key: "canEmit", value: function canEmit() {
                var i = 0;
                while (i < this.requireFail.length) {
                    if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                        return false }
                    i++ }
                return true } }, { key: "recognize", value: function recognize(inputData) {
                var inputDataClone = assign$1({}, inputData);
                if (!boolOrFn(this.options.enable, [this, inputDataClone])) { this.reset();
                    this.state = STATE_FAILED;
                    return }
                if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) { this.state = STATE_POSSIBLE }
                this.state = this.process(inputDataClone);
                if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) { this.tryEmit(inputDataClone) } } }, { key: "process", value: function process(inputData) {} }, { key: "getTouchAction", value: function getTouchAction() {} }, { key: "reset", value: function reset() {} }]);
        return Recognizer }();
    Recognizer.prototype.defaults = {};
    var AttrRecognizer = function(_Recognizer) { inherits(AttrRecognizer, _Recognizer);

        function AttrRecognizer() { classCallCheck(this, AttrRecognizer);
            return possibleConstructorReturn(this, (AttrRecognizer.__proto__ || Object.getPrototypeOf(AttrRecognizer)).apply(this, arguments)) }
        createClass(AttrRecognizer, [{ key: "attrTest", value: function attrTest(input) {
                var optionPointers = this.options.pointers;
                return optionPointers === 0 || input.pointers.length === optionPointers } }, { key: "process", value: function process(input) {
                var state = this.state;
                var eventType = input.eventType;
                var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
                var isValid = this.attrTest(input);
                if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
                    return state | STATE_CANCELLED } else if (isRecognized || isValid) {
                    if (eventType & INPUT_END) {
                        return state | STATE_ENDED } else if (!(state & STATE_BEGAN)) {
                        return STATE_BEGAN }
                    return state | STATE_CHANGED }
                return STATE_FAILED } }]);
        return AttrRecognizer }(Recognizer);
    AttrRecognizer.prototype.defaults = { pointers: 1 };
    var RotateRecognizer = function(_AttrRecognizer) { inherits(RotateRecognizer, _AttrRecognizer);

        function RotateRecognizer() { classCallCheck(this, RotateRecognizer);
            return possibleConstructorReturn(this, (RotateRecognizer.__proto__ || Object.getPrototypeOf(RotateRecognizer)).apply(this, arguments)) }
        createClass(RotateRecognizer, [{ key: "getTouchAction", value: function getTouchAction() {
                return [TOUCH_ACTION_NONE] } }, { key: "attrTest", value: function attrTest(input) {
                return get(RotateRecognizer.prototype.__proto__ || Object.getPrototypeOf(RotateRecognizer.prototype), "attrTest", this).call(this, input) && (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN) } }]);
        return RotateRecognizer }(AttrRecognizer);
    RotateRecognizer.prototype.defaults = { event: "rotate", threshold: 0, pointers: 2 };
    var PinchRecognizer = function(_AttrRecognizer) { inherits(PinchRecognizer, _AttrRecognizer);

        function PinchRecognizer() { classCallCheck(this, PinchRecognizer);
            return possibleConstructorReturn(this, (PinchRecognizer.__proto__ || Object.getPrototypeOf(PinchRecognizer)).apply(this, arguments)) }
        createClass(PinchRecognizer, [{ key: "getTouchAction", value: function getTouchAction() {
                return [TOUCH_ACTION_NONE] } }, { key: "attrTest", value: function attrTest(input) {
                return get(PinchRecognizer.prototype.__proto__ || Object.getPrototypeOf(PinchRecognizer.prototype), "attrTest", this).call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN) } }, { key: "emit", value: function emit(input) {
                if (input.scale !== 1) {
                    var inOut = input.scale < 1 ? "in" : "out";
                    input.additionalEvent = this.options.event + inOut }
                get(PinchRecognizer.prototype.__proto__ || Object.getPrototypeOf(PinchRecognizer.prototype), "emit", this).call(this, input) } }]);
        return PinchRecognizer }(AttrRecognizer);
    PinchRecognizer.prototype.defaults = { event: "pinch", threshold: 0, pointers: 2 };

    function directionStr(direction) {
        if (direction === DIRECTION_DOWN) {
            return "down" } else if (direction === DIRECTION_UP) {
            return "up" } else if (direction === DIRECTION_LEFT) {
            return "left" } else if (direction === DIRECTION_RIGHT) {
            return "right" }
        return "" }
    var PanRecognizer = function(_AttrRecognizer) { inherits(PanRecognizer, _AttrRecognizer);

        function PanRecognizer() { classCallCheck(this, PanRecognizer);
            var _this = possibleConstructorReturn(this, (PanRecognizer.__proto__ || Object.getPrototypeOf(PanRecognizer)).apply(this, arguments));
            _this.pX = null;
            _this.pY = null;
            return _this }
        createClass(PanRecognizer, [{ key: "getTouchAction", value: function getTouchAction() {
                var direction = this.options.direction;
                var actions = [];
                if (direction & DIRECTION_HORIZONTAL) { actions.push(TOUCH_ACTION_PAN_Y) }
                if (direction & DIRECTION_VERTICAL) { actions.push(TOUCH_ACTION_PAN_X) }
                return actions } }, { key: "directionTest", value: function directionTest(input) {
                var options = this.options;
                var hasMoved = true;
                var distance = input.distance;
                var direction = input.direction;
                var x = input.deltaX;
                var y = input.deltaY;
                if (!(direction & options.direction)) {
                    if (options.direction & DIRECTION_HORIZONTAL) { direction = x === 0 ? DIRECTION_NONE : x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
                        hasMoved = x !== this.pX;
                        distance = Math.abs(input.deltaX) } else { direction = y === 0 ? DIRECTION_NONE : y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
                        hasMoved = y !== this.pY;
                        distance = Math.abs(input.deltaY) } }
                input.direction = direction;
                return hasMoved && distance > options.threshold && direction & options.direction } }, { key: "attrTest", value: function attrTest(input) {
                return AttrRecognizer.prototype.attrTest.call(this, input) && (this.state & STATE_BEGAN || !(this.state & STATE_BEGAN) && this.directionTest(input)) } }, { key: "emit", value: function emit(input) { this.pX = input.deltaX;
                this.pY = input.deltaY;
                var direction = directionStr(input.direction);
                if (direction) { input.additionalEvent = this.options.event + direction }
                get(PanRecognizer.prototype.__proto__ || Object.getPrototypeOf(PanRecognizer.prototype), "emit", this).call(this, input) } }]);
        return PanRecognizer }(AttrRecognizer);
    PanRecognizer.prototype.defaults = { event: "pan", threshold: 10, pointers: 1, direction: DIRECTION_ALL };
    var SwipeRecognizer = function(_AttrRecognizer) { inherits(SwipeRecognizer, _AttrRecognizer);

        function SwipeRecognizer() { classCallCheck(this, SwipeRecognizer);
            return possibleConstructorReturn(this, (SwipeRecognizer.__proto__ || Object.getPrototypeOf(SwipeRecognizer)).apply(this, arguments)) }
        createClass(SwipeRecognizer, [{ key: "getTouchAction", value: function getTouchAction() {
                return PanRecognizer.prototype.getTouchAction.call(this) } }, { key: "attrTest", value: function attrTest(input) {
                var direction = this.options.direction;
                var velocity = void 0;
                if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) { velocity = input.overallVelocity } else if (direction & DIRECTION_HORIZONTAL) { velocity = input.overallVelocityX } else if (direction & DIRECTION_VERTICAL) { velocity = input.overallVelocityY }
                return get(SwipeRecognizer.prototype.__proto__ || Object.getPrototypeOf(SwipeRecognizer.prototype), "attrTest", this).call(this, input) && direction & input.offsetDirection && input.distance > this.options.threshold && input.maxPointers === this.options.pointers && abs(velocity) > this.options.velocity && input.eventType & INPUT_END } }, { key: "emit", value: function emit(input) {
                var direction = directionStr(input.offsetDirection);
                if (direction) { this.manager.emit(this.options.event + direction, input) }
                this.manager.emit(this.options.event, input) } }]);
        return SwipeRecognizer }(AttrRecognizer);
    SwipeRecognizer.prototype.defaults = { event: "swipe", threshold: 10, velocity: .3, direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL, pointers: 1 };

    function bindFn(fn, context) {
        return function boundFn() {
            return fn.apply(context, arguments) } }

    function setTimeoutContext(fn, timeout, context) {
        return setTimeout(bindFn(fn, context), timeout) }

    function getDistance(p1, p2, props) {
        if (!props) { props = PROPS_XY }
        var x = p2[props[0]] - p1[props[0]];
        var y = p2[props[1]] - p1[props[1]];
        return Math.sqrt(x * x + y * y) }
    var TapRecognizer = function(_Recognizer) { inherits(TapRecognizer, _Recognizer);

        function TapRecognizer() { classCallCheck(this, TapRecognizer);
            var _this = possibleConstructorReturn(this, (TapRecognizer.__proto__ || Object.getPrototypeOf(TapRecognizer)).apply(this, arguments));
            _this.pTime = false;
            _this.pCenter = false;
            _this._timer = null;
            _this._input = null;
            _this.count = 0;
            return _this }
        createClass(TapRecognizer, [{ key: "getTouchAction", value: function getTouchAction() {
                return [TOUCH_ACTION_MANIPULATION] } }, { key: "process", value: function process(input) {
                var _this2 = this;
                var options = this.options;
                var validPointers = input.pointers.length === options.pointers;
                var validMovement = input.distance < options.threshold;
                var validTouchTime = input.deltaTime < options.time;
                this.reset();
                if (input.eventType & INPUT_START && this.count === 0) {
                    return this.failTimeout() }
                if (validMovement && validTouchTime && validPointers) {
                    if (input.eventType !== INPUT_END) {
                        return this.failTimeout() }
                    var validInterval = this.pTime ? input.timeStamp - this.pTime < options.interval : true;
                    var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;
                    this.pTime = input.timeStamp;
                    this.pCenter = input.center;
                    if (!validMultiTap || !validInterval) { this.count = 1 } else { this.count += 1 }
                    this._input = input;
                    var tapCount = this.count % options.taps;
                    if (tapCount === 0) {
                        if (!this.hasRequireFailures()) {
                            return STATE_RECOGNIZED } else { this._timer = setTimeoutContext(function() { _this2.state = STATE_RECOGNIZED;
                                _this2.tryEmit() }, options.interval, this);
                            return STATE_BEGAN } } }
                return STATE_FAILED } }, { key: "failTimeout", value: function failTimeout() {
                var _this3 = this;
                this._timer = setTimeoutContext(function() { _this3.state = STATE_FAILED }, this.options.interval, this);
                return STATE_FAILED } }, { key: "reset", value: function reset() { clearTimeout(this._timer) } }, { key: "emit", value: function emit() {
                if (this.state === STATE_RECOGNIZED) { this._input.tapCount = this.count;
                    this.manager.emit(this.options.event, this._input) } } }]);
        return TapRecognizer }(Recognizer);
    TapRecognizer.prototype.defaults = { event: "tap", pointers: 1, taps: 1, interval: 300, time: 250, threshold: 9, posThreshold: 10 };
    var PressRecognizer = function(_Recognizer) { inherits(PressRecognizer, _Recognizer);

        function PressRecognizer() { classCallCheck(this, PressRecognizer);
            var _this = possibleConstructorReturn(this, (PressRecognizer.__proto__ || Object.getPrototypeOf(PressRecognizer)).apply(this, arguments));
            _this._timer = null;
            _this._input = null;
            return _this }
        createClass(PressRecognizer, [{ key: "getTouchAction", value: function getTouchAction() {
                return [TOUCH_ACTION_AUTO] } }, { key: "process", value: function process(input) {
                var _this2 = this;
                var options = this.options;
                var validPointers = input.pointers.length === options.pointers;
                var validMovement = input.distance < options.threshold;
                var validTime = input.deltaTime > options.time;
                this._input = input;
                if (!validMovement || !validPointers || input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime) { this.reset() } else if (input.eventType & INPUT_START) { this.reset();
                    this._timer = setTimeoutContext(function() { _this2.state = STATE_RECOGNIZED;
                        _this2.tryEmit() }, options.time, this) } else if (input.eventType & INPUT_END) {
                    return STATE_RECOGNIZED }
                return STATE_FAILED } }, { key: "reset", value: function reset() { clearTimeout(this._timer) } }, { key: "emit", value: function emit(input) {
                if (this.state !== STATE_RECOGNIZED) {
                    return }
                if (input && input.eventType & INPUT_END) { this.manager.emit(this.options.event + "up", input) } else { this._input.timeStamp = now();
                    this.manager.emit(this.options.event, this._input) } } }]);
        return PressRecognizer }(Recognizer);
    PressRecognizer.prototype.defaults = { event: "press", pointers: 1, time: 251, threshold: 9 };

    function inStr(str, find) {
        return str.indexOf(find) > -1 }

    function cleanTouchActions(actions) {
        if (inStr(actions, TOUCH_ACTION_NONE)) {
            return TOUCH_ACTION_NONE }
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
        if (hasPanX && hasPanY) {
            return TOUCH_ACTION_NONE }
        if (hasPanX || hasPanY) {
            return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y }
        if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
            return TOUCH_ACTION_MANIPULATION }
        return TOUCH_ACTION_AUTO }
    var TouchAction = function() {
        function TouchAction(manager, value) { classCallCheck(this, TouchAction);
            this.manager = manager;
            this.set(value) }
        createClass(TouchAction, [{ key: "set", value: function set(value) {
                if (value === TOUCH_ACTION_COMPUTE) { value = this.compute() }
                if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) { this.manager.element.style[PREFIXED_TOUCH_ACTION] = value }
                this.actions = value.toLowerCase().trim() } }, { key: "update", value: function update() { this.set(this.manager.options.touchAction) } }, { key: "compute", value: function compute() {
                var actions = [];
                each(this.manager.recognizers, function(recognizer) {
                    if (boolOrFn(recognizer.options.enable, [recognizer])) { actions = actions.concat(recognizer.getTouchAction()) } });
                return cleanTouchActions(actions.join(" ")) } }, { key: "preventDefaults", value: function preventDefaults(input) {
                var srcEvent = input.srcEvent;
                var direction = input.offsetDirection;
                if (this.manager.session.prevented) { srcEvent.preventDefault();
                    return }
                var actions = this.actions;
                var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
                var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
                var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];
                if (hasNone) {
                    var isTapPointer = input.pointers.length === 1;
                    var isTapMovement = input.distance < 2;
                    var isTapTouchTime = input.deltaTime < 250;
                    if (isTapPointer && isTapMovement && isTapTouchTime) {
                        return } }
                if (hasPanX && hasPanY) {
                    return }
                if (hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL) {
                    return this.preventSrc(srcEvent) } } }, { key: "preventSrc", value: function preventSrc(srcEvent) { this.manager.session.prevented = true;
                srcEvent.preventDefault() } }]);
        return TouchAction }();

    function hasParent(node, parent) {
        while (node) {
            if (node === parent) {
                return true }
            node = node.parentNode }
        return false }

    function getCenter(pointers) {
        var pointersLength = pointers.length;
        if (pointersLength === 1) {
            return { x: round(pointers[0].clientX), y: round(pointers[0].clientY) } }
        var x = 0;
        var y = 0;
        var i = 0;
        while (i < pointersLength) { x += pointers[i].clientX;
            y += pointers[i].clientY;
            i++ }
        return { x: round(x / pointersLength), y: round(y / pointersLength) } }

    function simpleCloneInputData(input) {
        var pointers = [];
        var i = 0;
        while (i < input.pointers.length) { pointers[i] = { clientX: round(input.pointers[i].clientX), clientY: round(input.pointers[i].clientY) };
            i++ }
        return { timeStamp: now(), pointers: pointers, center: getCenter(pointers), deltaX: input.deltaX, deltaY: input.deltaY } }

    function getAngle(p1, p2, props) {
        if (!props) { props = PROPS_XY }
        var x = p2[props[0]] - p1[props[0]];
        var y = p2[props[1]] - p1[props[1]];
        return Math.atan2(y, x) * 180 / Math.PI }

    function getDirection(x, y) {
        if (x === y) {
            return DIRECTION_NONE }
        if (abs(x) >= abs(y)) {
            return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT }
        return y < 0 ? DIRECTION_UP : DIRECTION_DOWN }

    function computeDeltaXY(session, input) {
        var center = input.center;
        var offset = session.offsetDelta || {};
        var prevDelta = session.prevDelta || {};
        var prevInput = session.prevInput || {};
        if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) { prevDelta = session.prevDelta = { x: prevInput.deltaX || 0, y: prevInput.deltaY || 0 };
            offset = session.offsetDelta = { x: center.x, y: center.y } }
        input.deltaX = prevDelta.x + (center.x - offset.x);
        input.deltaY = prevDelta.y + (center.y - offset.y) }

    function getVelocity(deltaTime, x, y) {
        return { x: x / deltaTime || 0, y: y / deltaTime || 0 } }

    function getScale(start, end) {
        return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY) }

    function getRotation(start, end) {
        return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY) }

    function computeIntervalInputData(session, input) {
        var last = session.lastInterval || input;
        var deltaTime = input.timeStamp - last.timeStamp;
        var velocity = void 0;
        var velocityX = void 0;
        var velocityY = void 0;
        var direction = void 0;
        if (input.eventType !== INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
            var deltaX = input.deltaX - last.deltaX;
            var deltaY = input.deltaY - last.deltaY;
            var v = getVelocity(deltaTime, deltaX, deltaY);
            velocityX = v.x;
            velocityY = v.y;
            velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
            direction = getDirection(deltaX, deltaY);
            session.lastInterval = input } else { velocity = last.velocity;
            velocityX = last.velocityX;
            velocityY = last.velocityY;
            direction = last.direction }
        input.velocity = velocity;
        input.velocityX = velocityX;
        input.velocityY = velocityY;
        input.direction = direction }

    function computeInputData(manager, input) {
        var session = manager.session;
        var pointers = input.pointers;
        var pointersLength = pointers.length;
        if (!session.firstInput) { session.firstInput = simpleCloneInputData(input) }
        if (pointersLength > 1 && !session.firstMultiple) { session.firstMultiple = simpleCloneInputData(input) } else if (pointersLength === 1) { session.firstMultiple = false }
        var firstInput = session.firstInput;
        var firstMultiple = session.firstMultiple;
        var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
        var center = input.center = getCenter(pointers);
        input.timeStamp = now();
        input.deltaTime = input.timeStamp - firstInput.timeStamp;
        input.angle = getAngle(offsetCenter, center);
        input.distance = getDistance(offsetCenter, center);
        computeDeltaXY(session, input);
        input.offsetDirection = getDirection(input.deltaX, input.deltaY);
        var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
        input.overallVelocityX = overallVelocity.x;
        input.overallVelocityY = overallVelocity.y;
        input.overallVelocity = abs(overallVelocity.x) > abs(overallVelocity.y) ? overallVelocity.x : overallVelocity.y;
        input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
        input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;
        input.maxPointers = !session.prevInput ? input.pointers.length : input.pointers.length > session.prevInput.maxPointers ? input.pointers.length : session.prevInput.maxPointers;
        computeIntervalInputData(session, input);
        var target = manager.element;
        if (hasParent(input.srcEvent.target, target)) { target = input.srcEvent.target }
        input.target = target }

    function inputHandler(manager, eventType, input) {
        var pointersLen = input.pointers.length;
        var changedPointersLen = input.changedPointers.length;
        var isFirst = eventType & INPUT_START && pointersLen - changedPointersLen === 0;
        var isFinal = eventType & (INPUT_END | INPUT_CANCEL) && pointersLen - changedPointersLen === 0;
        input.isFirst = !!isFirst;
        input.isFinal = !!isFinal;
        if (isFirst) { manager.session = {} }
        input.eventType = eventType;
        computeInputData(manager, input);
        manager.emit("hammer.input", input);
        manager.recognize(input);
        manager.session.prevInput = input }

    function splitStr(str) {
        return str.trim().split(/\s+/g) }

    function addEventListeners(target, types, handler) { each(splitStr(types), function(type) { target.addEventListener(type, handler, false) }) }

    function removeEventListeners(target, types, handler) { each(splitStr(types), function(type) { target.removeEventListener(type, handler, false) }) }

    function getWindowForElement(element) {
        var doc = element.ownerDocument || element;
        return doc.defaultView || doc.parentWindow || window }
    var Input = function() {
        function Input(manager, callback) { classCallCheck(this, Input);
            var self = this;
            this.manager = manager;
            this.callback = callback;
            this.element = manager.element;
            this.target = manager.options.inputTarget;
            this.domHandler = function(ev) {
                if (boolOrFn(manager.options.enable, [manager])) { self.handler(ev) } };
            this.init() }
        createClass(Input, [{ key: "handler", value: function handler() {} }, { key: "init", value: function init() { this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
                this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
                this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler) } }, { key: "destroy", value: function destroy() { this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
                this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
                this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler) } }]);
        return Input }();
    var POINTER_INPUT_MAP = { pointerdown: INPUT_START, pointermove: INPUT_MOVE, pointerup: INPUT_END, pointercancel: INPUT_CANCEL, pointerout: INPUT_CANCEL };
    var IE10_POINTER_TYPE_ENUM = { 2: INPUT_TYPE_TOUCH, 3: INPUT_TYPE_PEN, 4: INPUT_TYPE_MOUSE, 5: INPUT_TYPE_KINECT };
    var POINTER_ELEMENT_EVENTS = "pointerdown";
    var POINTER_WINDOW_EVENTS = "pointermove pointerup pointercancel";
    if (window.MSPointerEvent && !window.PointerEvent) { POINTER_ELEMENT_EVENTS = "MSPointerDown";
        POINTER_WINDOW_EVENTS = "MSPointerMove MSPointerUp MSPointerCancel" }
    var PointerEventInput = function(_Input) { inherits(PointerEventInput, _Input);

        function PointerEventInput() { classCallCheck(this, PointerEventInput);
            var _this = possibleConstructorReturn(this, (PointerEventInput.__proto__ || Object.getPrototypeOf(PointerEventInput)).apply(this, arguments));
            _this.evEl = POINTER_ELEMENT_EVENTS;
            _this.evWin = POINTER_WINDOW_EVENTS;
            _this.store = _this.manager.session.pointerEvents = [];
            return _this }
        createClass(PointerEventInput, [{ key: "handler", value: function handler(ev) {
                var store = this.store;
                var removePointer = false;
                var eventTypeNormalized = ev.type.toLowerCase().replace("ms", "");
                var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
                var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;
                var isTouch = pointerType === INPUT_TYPE_TOUCH;
                var storeIndex = inArray(store, ev.pointerId, "pointerId");
                if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
                    if (storeIndex < 0) { store.push(ev);
                        storeIndex = store.length - 1 } } else if (eventType & (INPUT_END | INPUT_CANCEL)) { removePointer = true }
                if (storeIndex < 0) {
                    return }
                store[storeIndex] = ev;
                this.callback(this.manager, eventType, { pointers: store, changedPointers: [ev], pointerType: pointerType, srcEvent: ev });
                if (removePointer) { store.splice(storeIndex, 1) } } }]);
        return PointerEventInput }(Input);

    function toArray$1(obj) {
        return Array.prototype.slice.call(obj, 0) }

    function uniqueArray(src, key, sort) {
        var results = [];
        var values = [];
        var i = 0;
        while (i < src.length) {
            var val = key ? src[i][key] : src[i];
            if (inArray(values, val) < 0) { results.push(src[i]) }
            values[i] = val;
            i++ }
        if (sort) {
            if (!key) { results = results.sort() } else { results = results.sort(function(a, b) {
                    return a[key] > b[key] }) } }
        return results }
    var TOUCH_INPUT_MAP = { touchstart: INPUT_START, touchmove: INPUT_MOVE, touchend: INPUT_END, touchcancel: INPUT_CANCEL };
    var TOUCH_TARGET_EVENTS = "touchstart touchmove touchend touchcancel";
    var TouchInput = function(_Input) {
        inherits(TouchInput, _Input);

        function TouchInput() {
            classCallCheck(this, TouchInput);
            TouchInput.prototype.evTarget = TOUCH_TARGET_EVENTS;
            TouchInput.prototype.targetIds = {};
            var _this = possibleConstructorReturn(this, (TouchInput.__proto__ || Object.getPrototypeOf(TouchInput)).apply(this, arguments));
            _this.evTarget = TOUCH_TARGET_EVENTS;
            _this.targetIds = {};
            return _this
        }
        createClass(TouchInput, [{ key: "handler", value: function handler(ev) {
                var type = TOUCH_INPUT_MAP[ev.type];
                var touches = getTouches.call(this, ev, type);
                if (!touches) {
                    return }
                this.callback(this.manager, type, { pointers: touches[0], changedPointers: touches[1], pointerType: INPUT_TYPE_TOUCH, srcEvent: ev }) } }]);
        return TouchInput
    }(Input);

    function getTouches(ev, type) {
        var allTouches = toArray$1(ev.touches);
        var targetIds = this.targetIds;
        if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) { targetIds[allTouches[0].identifier] = true;
            return [allTouches, allTouches] }
        var i = void 0;
        var targetTouches = void 0;
        var changedTouches = toArray$1(ev.changedTouches);
        var changedTargetTouches = [];
        var target = this.target;
        targetTouches = allTouches.filter(function(touch) {
            return hasParent(touch.target, target) });
        if (type === INPUT_START) { i = 0;
            while (i < targetTouches.length) { targetIds[targetTouches[i].identifier] = true;
                i++ } }
        i = 0;
        while (i < changedTouches.length) {
            if (targetIds[changedTouches[i].identifier]) { changedTargetTouches.push(changedTouches[i]) }
            if (type & (INPUT_END | INPUT_CANCEL)) { delete targetIds[changedTouches[i].identifier] }
            i++ }
        if (!changedTargetTouches.length) {
            return }
        return [uniqueArray(targetTouches.concat(changedTargetTouches), "identifier", true), changedTargetTouches] }
    var MOUSE_INPUT_MAP = { mousedown: INPUT_START, mousemove: INPUT_MOVE, mouseup: INPUT_END };
    var MOUSE_ELEMENT_EVENTS = "mousedown";
    var MOUSE_WINDOW_EVENTS = "mousemove mouseup";
    var MouseInput = function(_Input) { inherits(MouseInput, _Input);

        function MouseInput() { classCallCheck(this, MouseInput);
            var _this = possibleConstructorReturn(this, (MouseInput.__proto__ || Object.getPrototypeOf(MouseInput)).apply(this, arguments));
            _this.evEl = MOUSE_ELEMENT_EVENTS;
            _this.evWin = MOUSE_WINDOW_EVENTS;
            _this.pressed = false;
            return _this }
        createClass(MouseInput, [{ key: "handler", value: function handler(ev) {
                var eventType = MOUSE_INPUT_MAP[ev.type];
                if (eventType & INPUT_START && ev.button === 0) { this.pressed = true }
                if (eventType & INPUT_MOVE && ev.which !== 1) { eventType = INPUT_END }
                if (!this.pressed) {
                    return }
                if (eventType & INPUT_END) { this.pressed = false }
                this.callback(this.manager, eventType, { pointers: [ev], changedPointers: [ev], pointerType: INPUT_TYPE_MOUSE, srcEvent: ev }) } }]);
        return MouseInput }(Input);
    var DEDUP_TIMEOUT = 2500;
    var DEDUP_DISTANCE = 25;
    var TouchMouseInput = function(_Input) { inherits(TouchMouseInput, _Input);

        function TouchMouseInput() { classCallCheck(this, TouchMouseInput);
            var _this = possibleConstructorReturn(this, (TouchMouseInput.__proto__ || Object.getPrototypeOf(TouchMouseInput)).apply(this, arguments));
            var handler = bindFn(_this.handler, _this);
            _this.touch = new TouchInput(_this.manager, handler);
            _this.mouse = new MouseInput(_this.manager, handler);
            _this.primaryTouch = null;
            _this.lastTouches = [];
            return _this }
        createClass(TouchMouseInput, [{ key: "handler", value: function handler(manager, inputEvent, inputData) {
                var isTouch = inputData.pointerType === INPUT_TYPE_TOUCH;
                var isMouse = inputData.pointerType === INPUT_TYPE_MOUSE;
                if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
                    return }
                if (isTouch) { recordTouches.call(this, inputEvent, inputData) } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
                    return }
                this.callback(manager, inputEvent, inputData) } }, { key: "destroy", value: function destroy() { this.touch.destroy();
                this.mouse.destroy() } }]);
        return TouchMouseInput }(Input);

    function recordTouches(eventType, eventData) {
        if (eventType & INPUT_START) { this.primaryTouch = eventData.changedPointers[0].identifier;
            setLastTouch.call(this, eventData) } else if (eventType & (INPUT_END | INPUT_CANCEL)) { setLastTouch.call(this, eventData) } }

    function setLastTouch(eventData) {
        var _this2 = this;
        var _eventData$changedPoi = slicedToArray(eventData.changedPointers, 1);
        var touch = _eventData$changedPoi[0];
        if (touch.identifier === this.primaryTouch) {
            (function() {
                var lastTouch = { x: touch.clientX, y: touch.clientY };
                _this2.lastTouches.push(lastTouch);
                var lts = _this2.lastTouches;
                var removeLastTouch = function removeLastTouch() {
                    var i = lts.indexOf(lastTouch);
                    if (i > -1) { lts.splice(i, 1) } };
                setTimeout(removeLastTouch, DEDUP_TIMEOUT) })() } }

    function isSyntheticEvent(eventData) {
        var x = eventData.srcEvent.clientX;
        var y = eventData.srcEvent.clientY;
        for (var i = 0; i < this.lastTouches.length; i++) {
            var t = this.lastTouches[i];
            var dx = Math.abs(x - t.x);
            var dy = Math.abs(y - t.y);
            if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
                return true } }
        return false }

    function createInputInstance(manager) {
        var Type = void 0;
        var inputClass = manager.options.inputClass;
        if (inputClass) { Type = inputClass } else if (SUPPORT_POINTER_EVENTS) { Type = PointerEventInput } else if (SUPPORT_ONLY_TOUCH) { Type = TouchInput } else if (!SUPPORT_TOUCH) { Type = MouseInput } else { Type = TouchMouseInput }
        return new Type(manager, inputHandler) }
    var STOP = 1;
    var FORCED_STOP = 2;
    var Manager = function() {
        function Manager(element, options) {
            var _this = this;
            classCallCheck(this, Manager);
            this.options = assign$1({}, Hammer.defaults, options || {});
            this.options.inputTarget = this.options.inputTarget || element;
            this.handlers = {};
            this.session = {};
            this.recognizers = [];
            this.oldCssProps = {};
            this.element = element;
            this.input = createInputInstance(this);
            this.touchAction = new TouchAction(this, this.options.touchAction);
            toggleCssProps(this, true);
            each(this.options.recognizers, function(item) {
                var recognizer = _this.add(new item[0](item[1]));
                item[2] && recognizer.recognizeWith(item[2]);
                item[3] && recognizer.requireFailure(item[3]) }, this) }
        createClass(Manager, [{ key: "set", value: function set(options) { assign$1(this.options, options);
                if (options.touchAction) { this.touchAction.update() }
                if (options.inputTarget) { this.input.destroy();
                    this.input.target = options.inputTarget;
                    this.input.init() }
                return this } }, { key: "stop", value: function stop(force) { this.session.stopped = force ? FORCED_STOP : STOP } }, { key: "recognize", value: function recognize(inputData) {
                var session = this.session;
                if (session.stopped) {
                    return }
                this.touchAction.preventDefaults(inputData);
                var recognizer = void 0;
                var recognizers = this.recognizers;
                var curRecognizer = session.curRecognizer;
                if (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) { curRecognizer = session.curRecognizer = null }
                var i = 0;
                while (i < recognizers.length) { recognizer = recognizers[i];
                    if (session.stopped !== FORCED_STOP && (!curRecognizer || recognizer === curRecognizer || recognizer.canRecognizeWith(curRecognizer))) { recognizer.recognize(inputData) } else { recognizer.reset() }
                    if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) { curRecognizer = session.curRecognizer = recognizer }
                    i++ } } }, { key: "get", value: function get(recognizer) {
                if (recognizer instanceof Recognizer) {
                    return recognizer }
                var recognizers = this.recognizers;
                for (var i = 0; i < recognizers.length; i++) {
                    if (recognizers[i].options.event === recognizer) {
                        return recognizers[i] } }
                return null } }, { key: "add", value: function add(recognizer) {
                if (invokeArrayArg(recognizer, "add", this)) {
                    return this }
                var existing = this.get(recognizer.options.event);
                if (existing) { this.remove(existing) }
                this.recognizers.push(recognizer);
                recognizer.manager = this;
                this.touchAction.update();
                return recognizer } }, { key: "remove", value: function remove(recognizer) {
                if (invokeArrayArg(recognizer, "remove", this)) {
                    return this }
                recognizer = this.get(recognizer);
                if (recognizer) {
                    var recognizers = this.recognizers;
                    var index = inArray(recognizers, recognizer);
                    if (index !== -1) { recognizers.splice(index, 1);
                        this.touchAction.update() } }
                return this } }, { key: "on", value: function on(events, handler) {
                if (events === undefined) {
                    return }
                if (handler === undefined) {
                    return }
                var handlers = this.handlers;
                each(splitStr(events), function(event) { handlers[event] = handlers[event] || [];
                    handlers[event].push(handler) });
                return this } }, { key: "off", value: function off(events, handler) {
                if (events === undefined) {
                    return }
                var handlers = this.handlers;
                each(splitStr(events), function(event) {
                    if (!handler) { delete handlers[event] } else { handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1) } });
                return this } }, { key: "emit", value: function emit(event, data) {
                if (this.options.domEvents) { triggerDomEvent(event, data) }
                var handlers = this.handlers[event] && this.handlers[event].slice();
                if (!handlers || !handlers.length) {
                    return }
                data.type = event;
                data.preventDefault = function() { data.srcEvent.preventDefault() };
                var i = 0;
                while (i < handlers.length) { handlers[i](data);
                    i++ } } }, { key: "destroy", value: function destroy() { this.element && toggleCssProps(this, false);
                this.handlers = {};
                this.session = {};
                this.input.destroy();
                this.element = null } }]);
        return Manager }();

    function toggleCssProps(manager, add) {
        var element = manager.element;
        if (!element.style) {
            return }
        var prop = void 0;
        each(manager.options.cssProps, function(value, name) { prop = prefixed(element.style, name);
            if (add) { manager.oldCssProps[prop] = element.style[prop];
                element.style[prop] = value } else { element.style[prop] = manager.oldCssProps[prop] || "" } });
        if (!add) { manager.oldCssProps = {} } }

    function triggerDomEvent(event, data) {
        var gestureEvent = document.createEvent("Event");
        gestureEvent.initEvent(event, true, true);
        gestureEvent.gesture = data;
        data.target.dispatchEvent(gestureEvent) }
    var Hammer = function Hammer(element, options) { classCallCheck(this, Hammer);
        options = options || {};
        options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
        return new Manager(element, options) };
    Hammer.VERSION = "2.0.8";
    Hammer.defaults = { domEvents: false, touchAction: TOUCH_ACTION_COMPUTE, enable: true, inputTarget: null, inputClass: null, preset: [
            [RotateRecognizer, { enable: false }],
            [PinchRecognizer, { enable: false },
                ["rotate"]
            ],
            [SwipeRecognizer, { direction: DIRECTION_HORIZONTAL }],
            [PanRecognizer, { direction: DIRECTION_HORIZONTAL },
                ["swipe"]
            ],
            [TapRecognizer],
            [TapRecognizer, { event: "doubletap", taps: 2 },
                ["tap"]
            ],
            [PressRecognizer]
        ], cssProps: { userSelect: "none", touchSelect: "none", touchCallout: "none", contentZooming: "none", userDrag: "none", tapHighlightColor: "rgba(0,0,0,0)" } };
    var SINGLE_TOUCH_INPUT_MAP = { touchstart: INPUT_START, touchmove: INPUT_MOVE, touchend: INPUT_END, touchcancel: INPUT_CANCEL };
    var SINGLE_TOUCH_TARGET_EVENTS = "touchstart";
    var SINGLE_TOUCH_WINDOW_EVENTS = "touchstart touchmove touchend touchcancel";
    var SingleTouchInput = function(_Input) { inherits(SingleTouchInput, _Input);

        function SingleTouchInput() { classCallCheck(this, SingleTouchInput);
            var _this = possibleConstructorReturn(this, (SingleTouchInput.__proto__ || Object.getPrototypeOf(SingleTouchInput)).apply(this, arguments));
            _this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
            _this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
            _this.started = false;
            Input.apply(_this, arguments);
            return _this }
        createClass(SingleTouchInput, [{ key: "handler", value: function handler(ev) {
                var type = SINGLE_TOUCH_INPUT_MAP[ev.type];
                if (type === INPUT_START) { this.started = true }
                if (!this.started) {
                    return }
                var touches = normalizeSingleTouches.call(this, ev, type);
                if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) { this.started = false }
                this.callback(this.manager, type, { pointers: touches[0], changedPointers: touches[1], pointerType: INPUT_TYPE_TOUCH, srcEvent: ev }) } }]);
        return SingleTouchInput }(Input);

    function normalizeSingleTouches(ev, type) {
        var all = toArray$1(ev.touches);
        var changed = toArray$1(ev.changedTouches);
        if (type & (INPUT_END | INPUT_CANCEL)) { all = uniqueArray(all.concat(changed), "identifier", true) }
        return [all, changed] }

    function deprecate(method, name, message) {
        var deprecationMessage = "DEPRECATED METHOD: " + name + "\n" + message + " AT \n";
        return function() {
            var e = new Error("get-stack-trace");
            var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace";
            var log = window.console && (window.console.warn || window.console.log);
            if (log) { log.call(window.console, deprecationMessage, stack) }
            return method.apply(this, arguments) } }
    var extend = deprecate(function(dest, src, merge) {
        var keys = Object.keys(src);
        var i = 0;
        while (i < keys.length) {
            if (!merge || merge && dest[keys[i]] === undefined) { dest[keys[i]] = src[keys[i]] }
            i++ }
        return dest }, "extend", "Use `assign`.");
    var merge = deprecate(function(dest, src) {
        return extend(dest, src, true) }, "merge", "Use `assign`.");

    function inherit(child, base, properties) {
        var baseP = base.prototype;
        var childP = void 0;
        childP = child.prototype = Object.create(baseP);
        childP.constructor = child;
        childP._super = baseP;
        if (properties) { assign$1(childP, properties) } }
    assign$1(Hammer, { INPUT_START: INPUT_START, INPUT_MOVE: INPUT_MOVE, INPUT_END: INPUT_END, INPUT_CANCEL: INPUT_CANCEL, STATE_POSSIBLE: STATE_POSSIBLE, STATE_BEGAN: STATE_BEGAN, STATE_CHANGED: STATE_CHANGED, STATE_ENDED: STATE_ENDED, STATE_RECOGNIZED: STATE_RECOGNIZED, STATE_CANCELLED: STATE_CANCELLED, STATE_FAILED: STATE_FAILED, DIRECTION_NONE: DIRECTION_NONE, DIRECTION_LEFT: DIRECTION_LEFT, DIRECTION_RIGHT: DIRECTION_RIGHT, DIRECTION_UP: DIRECTION_UP, DIRECTION_DOWN: DIRECTION_DOWN, DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL, DIRECTION_VERTICAL: DIRECTION_VERTICAL, DIRECTION_ALL: DIRECTION_ALL, Manager: Manager, Input: Input, TouchAction: TouchAction, TouchInput: TouchInput, MouseInput: MouseInput, PointerEventInput: PointerEventInput, TouchMouseInput: TouchMouseInput, SingleTouchInput: SingleTouchInput, Recognizer: Recognizer, AttrRecognizer: AttrRecognizer, Tap: TapRecognizer, Pan: PanRecognizer, Swipe: SwipeRecognizer, Pinch: PinchRecognizer, Rotate: RotateRecognizer, Press: PressRecognizer, on: addEventListeners, off: removeEventListeners, each: each, merge: merge, extend: extend, assign: assign$1, inherit: inherit, bindFn: bindFn, prefixed: prefixed, toArray: toArray$1, inArray: inArray, uniqueArray: uniqueArray, splitStr: splitStr, boolOrFn: boolOrFn, hasParent: hasParent, addEventListeners: addEventListeners, removeEventListeners: removeEventListeners });
    if (typeof define === "function" && define.amd) { define(function() {
            return Hammer }) } else if (typeof module !== "undefined" && module.exports) { module.exports = Hammer } else { window[exportName] = Hammer }
})(window, document, "Hammer");
//# sourceMappingURL=hammer.min.js.map
