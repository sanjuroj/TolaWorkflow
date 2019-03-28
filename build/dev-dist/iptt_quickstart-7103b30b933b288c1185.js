(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["iptt_quickstart"],{

/***/ "+aul":
/*!*******************************************!*\
  !*** ./js/pages/iptt_quickstart/index.js ***!
  \*******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models */ "a4Ke");
/* harmony import */ var _components_main__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/main */ "kvAA");





var labels = jsContext.labels;
var rootStore = new _models__WEBPACK_IMPORTED_MODULE_3__["QSRootStore"](jsContext);
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(mobx_react__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
  labels: labels,
  rootStore: rootStore
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_main__WEBPACK_IMPORTED_MODULE_4__["IPTTQuickstartForm"], null)), document.querySelector('#id_div_top_quickstart_iptt'));

/***/ }),

/***/ "I1cX":
/*!********************************************************!*\
  !*** ./js/pages/iptt_quickstart/components/buttons.js ***!
  \********************************************************/
/*! exports provided: IPTTSubmit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IPTTSubmit", function() { return IPTTSubmit; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");


var IPTTSubmit = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var url = _ref.url,
      labels = _ref.labels,
      rootStore = _ref.rootStore;

  var handleClick = function handleClick() {
    return window.location.href = rootStore[url];
  };

  var inlineCSS = {
    width: '100%'
  };
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "d-flex justify-content-center mb-1"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-primary",
    onClick: handleClick,
    disabled: !rootStore[url],
    style: inlineCSS
  }, labels.submitButton));
}));

/***/ }),

/***/ "NP74":
/*!********************************************************!*\
  !*** ./js/pages/iptt_quickstart/components/selects.js ***!
  \********************************************************/
/*! exports provided: QSTVAProgramSelect, QSTimeperiodsProgramSelect, QSTVAPeriodSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QSTVAProgramSelect", function() { return QSTVAProgramSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QSTimeperiodsProgramSelect", function() { return QSTimeperiodsProgramSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QSTVAPeriodSelect", function() { return QSTVAPeriodSelect; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "y2Vs");
var _dec, _class, _temp, _dec2, _class3, _temp2, _dec3, _class5, _temp3;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var IPTTSelectWrapper = function IPTTSelectWrapper(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-row mb-3"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    className: "col-form-label text-uppercase"
  }, props.label), props.children);
};

var QSTVAProgramSelect = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(QSTVAProgramSelect, _React$Component);

  function QSTVAProgramSelect() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, QSTVAProgramSelect);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(QSTVAProgramSelect)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.selectProgram = function (selected) {
      _this.props.rootStore.setTVAProgramId(selected.value);
    };

    return _this;
  }

  _createClass(QSTVAProgramSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSelectWrapper, {
        label: this.props.labels.programSelect
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        options: this.props.rootStore.tvaProgramOptions,
        value: this.props.rootStore.selectedTVAProgramOption,
        onChange: this.selectProgram,
        className: "iptt-react-select"
      }));
    }
  }]);

  return QSTVAProgramSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);
var QSTimeperiodsProgramSelect = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec2(_class3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class3 = (_temp2 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(QSTimeperiodsProgramSelect, _React$Component2);

  function QSTimeperiodsProgramSelect() {
    var _getPrototypeOf3;

    var _this2;

    _classCallCheck(this, QSTimeperiodsProgramSelect);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(QSTimeperiodsProgramSelect)).call.apply(_getPrototypeOf3, [this].concat(args)));

    _this2.selectProgram = function (selected) {
      _this2.props.rootStore.setTimeperiodsProgramId(selected.value);
    };

    return _this2;
  }

  _createClass(QSTimeperiodsProgramSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSelectWrapper, {
        label: this.props.labels.programSelect
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        options: this.props.rootStore.timeperiodsProgramOptions,
        value: this.props.rootStore.selectedTimeperiodsProgramOption,
        onChange: this.selectProgram,
        className: "iptt-react-select"
      }));
    }
  }]);

  return QSTimeperiodsProgramSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp2)) || _class3) || _class3);
var QSTVAPeriodSelect = (_dec3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec3(_class5 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class5 = (_temp3 =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(QSTVAPeriodSelect, _React$Component3);

  function QSTVAPeriodSelect() {
    var _getPrototypeOf4;

    var _this3;

    _classCallCheck(this, QSTVAPeriodSelect);

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _this3 = _possibleConstructorReturn(this, (_getPrototypeOf4 = _getPrototypeOf(QSTVAPeriodSelect)).call.apply(_getPrototypeOf4, [this].concat(args)));

    _this3.selectFrequency = function (selected) {
      _this3.props.rootStore.setTVAFrequencyId(selected.value);
    };

    return _this3;
  }

  _createClass(QSTVAPeriodSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSelectWrapper, {
        label: this.props.labels.periodSelect
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        options: this.props.rootStore.tvaFrequencyOptions,
        value: this.props.rootStore.tvaSelectedFrequencyOption,
        onChange: this.selectFrequency,
        className: "iptt-react-select"
      }));
    }
  }]);

  return QSTVAPeriodSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp3)) || _class5) || _class5);

/***/ }),

/***/ "UQOO":
/*!*******************************************************!*\
  !*** ./js/pages/iptt_quickstart/components/radios.js ***!
  \*******************************************************/
/*! exports provided: QSTVATimeFrameRadio */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QSTVATimeFrameRadio", function() { return QSTVATimeFrameRadio; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
var _dec, _class, _temp;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var QSTVATimeFrameRadio = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(QSTVATimeFrameRadio, _React$Component);

  function QSTVATimeFrameRadio() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, QSTVATimeFrameRadio);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(QSTVATimeFrameRadio)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.checkMostRecent = function () {
      //default value of 2 in case of clicking "most recent" radio box - default behavior
      _this.props.rootStore.setTVAMostRecent(null);
    };

    _this.updateMostRecentCount = function (e) {
      _this.props.rootStore.setTVAMostRecent(e.target.value);
    };

    return _this;
  }

  _createClass(QSTVATimeFrameRadio, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-row mb-3"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-4"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-check form-check-inline pt-1"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "form-check-input"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "radio",
        checked: this.props.rootStore.tvaShowAll,
        disabled: this.props.rootStore.tvaRadioDisabled,
        onChange: this.props.rootStore.setTVAShowAll
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "form-check-label"
      }, this.props.labels.showAll))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-4 p-0"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-check form-check-inline pt-1"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "form-check-input"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "radio",
        checked: this.props.rootStore.tvaMostRecent,
        disabled: this.props.rootStore.tvaRadioDisabled,
        onChange: this.checkMostRecent
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "form-check-label"
      }, this.props.labels.mostRecent))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-4"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "number",
        className: "form-control",
        value: this.props.rootStore.tvaMostRecentCountDisplay,
        disabled: this.props.rootStore.tvaRadioDisabled,
        placeholder: this.props.labels.mostRecentPlaceholder,
        onChange: this.updateMostRecentCount
      })));
    }
  }]);

  return QSTVATimeFrameRadio;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);

/***/ }),

/***/ "a4Ke":
/*!********************************************!*\
  !*** ./js/pages/iptt_quickstart/models.js ***!
  \********************************************/
/*! exports provided: QSRootStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QSRootStore", function() { return QSRootStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _temp;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * IPTT Quickstart React data models
 * @module: iptt_quickstart/models
 */

var BLANK_LABEL = '---------';
var TVA = 1;
var TIMEPERIODS = 2;

var QSProgram =
/*#__PURE__*/
function () {
  function QSProgram(rootStore, programJSON) {
    _classCallCheck(this, QSProgram);

    this.rootStore = rootStore;
    this.id = programJSON.id;
    this.name = programJSON.name;
    this.frequencies = programJSON.frequencies;
    this.periodDateRanges = programJSON.periodDateRanges;
  }

  _createClass(QSProgram, [{
    key: "periods",
    value: function periods(frequency) {
      return frequency in this.periodDateRanges ? this.periodDateRanges[frequency] : false;
    }
  }, {
    key: "periodCount",
    value: function periodCount(frequency) {
      return this.periods(frequency) ? this.periods(frequency).length : 0;
    }
  }]);

  return QSProgram;
}();

var QSProgramStore =
/*#__PURE__*/
function () {
  function QSProgramStore(rootStore, programsJSON) {
    var _this = this;

    _classCallCheck(this, QSProgramStore);

    this.rootStore = rootStore;
    this.programs = {};
    programsJSON.forEach(function (programJSON) {
      _this.programs[programJSON.id] = new QSProgram(_this.rootStore, programJSON);
    });
  }

  _createClass(QSProgramStore, [{
    key: "getProgram",
    value: function getProgram(id) {
      return this.programs[id];
    }
  }]);

  return QSProgramStore;
}();

var QSRootStore = (_class = (_temp =
/*#__PURE__*/
function () {
  function QSRootStore(contextData) {
    var _this2 = this;

    _classCallCheck(this, QSRootStore);

    _initializerDefineProperty(this, "reportType", _descriptor, this);

    _initializerDefineProperty(this, "tvaSelectedProgram", _descriptor2, this);

    _initializerDefineProperty(this, "timeperiodsSelectedProgram", _descriptor3, this);

    _initializerDefineProperty(this, "tvaSelectedFrequencyId", _descriptor4, this);

    _initializerDefineProperty(this, "tvaShowAll", _descriptor5, this);

    _initializerDefineProperty(this, "tvaMostRecent", _descriptor6, this);

    _initializerDefineProperty(this, "tvaMostRecentCount", _descriptor7, this);

    this.setTVAShowAll = function () {
      _this2.tvaShowAll = true;
      _this2.tvaMostRecent = false;
    };

    this.setTVAMostRecent = function (count) {
      _this2.tvaMostRecent = true;
      _this2.tvaShowAll = false;

      if (count !== undefined && count !== null) {
        _this2.tvaMostRecentCount = count;
      }
    };

    this.programStore = new QSProgramStore(this, contextData.programs);
    this.periodLabels = contextData.labels.targetperiods;
  }

  _createClass(QSRootStore, [{
    key: "setTVAProgramId",
    value: function setTVAProgramId(id) {
      if (id === null) {
        this.tvaSelectedProgram = null;
      } else if (this.tvaSelectedProgram == null || this.tvaSelectedProgram.id != id) {
        this.tvaSelectedProgram = this.programStore.getProgram(id);

        if (this.tvaSelectedFrequencyId && this.tvaSelectedProgram.frequencies.indexOf(parseInt(this.tvaSelectedFrequencyId)) == -1) {
          this.setTVAFrequencyId(null);
        }
      }

      this.reportType = TVA;
    }
  }, {
    key: "setTimeperiodsProgramId",
    value: function setTimeperiodsProgramId(id) {
      if (id === null) {
        this.timeperiodsSelectedProgram = null;
      } else if (this.timeperiodsSelectedProgram == null || this.timeperiodsSelectedProgram.id != id) {
        this.timeperiodsSelectedProgram = this.programStore.getProgram(id);
      }

      this.reportType = TIMEPERIODS;
    }
  }, {
    key: "setTVAFrequencyId",
    value: function setTVAFrequencyId(id) {
      if (id === null) {
        this.tvaSelectedFrequencyId = null;
      } else if (this.tvaSelectedFrequencyId != id) {
        this.tvaSelectedFrequencyId = id;
      }

      this.reportType = TVA;
    }
  }, {
    key: "selectedTVAProgramOption",
    get: function get() {
      if (this.tvaSelectedProgram === null || this.reportType == TIMEPERIODS) {
        return {
          value: null,
          label: BLANK_LABEL
        };
      }

      return {
        value: this.tvaSelectedProgram.id,
        label: this.tvaSelectedProgram.name
      };
    }
  }, {
    key: "selectedTimeperiodsProgramOption",
    get: function get() {
      if (this.timeperiodsSelectedProgram === null || this.reportType == TVA) {
        return {
          value: null,
          label: BLANK_LABEL
        };
      }

      return {
        value: this.timeperiodsSelectedProgram.id,
        label: this.timeperiodsSelectedProgram.name
      };
    }
  }, {
    key: "timeperiodsProgramOptions",
    get: function get() {
      return Object.entries(this.programStore.programs).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            id = _ref2[0],
            program = _ref2[1];

        return {
          value: id,
          label: program.name
        };
      });
    }
  }, {
    key: "tvaProgramOptions",
    get: function get() {
      return Object.entries(this.programStore.programs).filter(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            id = _ref4[0],
            program = _ref4[1];

        return program.frequencies.length > 0;
      }).map(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            id = _ref6[0],
            program = _ref6[1];

        return {
          value: id,
          label: program.name
        };
      });
    }
  }, {
    key: "tvaSelectedFrequencyOption",
    get: function get() {
      if (this.reportType == TIMEPERIODS || this.tvaSelectedProgram === null || this.tvaSelectedFrequencyId === null) {
        return {
          value: null,
          label: BLANK_LABEL
        };
      }

      return {
        value: this.tvaSelectedFrequencyId,
        label: this.periodLabels[this.tvaSelectedFrequencyId]
      };
    }
  }, {
    key: "tvaFrequencyOptions",
    get: function get() {
      var _this3 = this;

      if (this.tvaSelectedProgram === null || this.reportType == TIMEPERIODS) {
        return [{
          value: null,
          label: BLANK_LABEL
        }];
      } else {
        return this.tvaSelectedProgram.frequencies.map(function (id) {
          return {
            value: id,
            label: _this3.periodLabels[id]
          };
        });
      }
    }
  }, {
    key: "tvaRadioDisabled",
    get: function get() {
      return !(this.reportType == TVA && this.tvaSelectedProgram != null && this.tvaSelectedFrequencyId !== null);
    }
  }, {
    key: "tvaMostRecentCountDisplay",
    get: function get() {
      return this.tvaMostRecent ? this.tvaMostRecentCount : '';
    }
  }, {
    key: "tvaURL",
    get: function get() {
      if (this.reportType == TIMEPERIODS || this.tvaSelectedProgram == null || this.tvaSelectedFrequencyId == null) {
        return false;
      }

      var url = '/indicators/iptt_report/' + this.tvaSelectedProgram.id + '/targetperiods/?frequency=' + this.tvaSelectedFrequencyId;

      if (this.tvaShowAll) {
        return url + '&timeframe=1';
      } else if (this.tvaMostRecent) {
        return url + '&timeframe=2&numrecentcount=' + this.tvaMostRecentCount;
      }

      return url;
    }
  }, {
    key: "timeperiodsURL",
    get: function get() {
      if (this.reportType == TVA || this.timeperiodsSelectedProgram == null) {
        return false;
      }

      var url = '/indicators/iptt_report/' + this.timeperiodsSelectedProgram.id + '/timeperiods/?frequency=';
      return url + '7&timeframe=2&numrecentcount=2';
    }
  }]);

  return QSRootStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "reportType", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "tvaSelectedProgram", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "timeperiodsSelectedProgram", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "tvaSelectedFrequencyId", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "tvaShowAll", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "tvaMostRecent", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "tvaMostRecentCount", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 2;
  }
}), _applyDecoratedDescriptor(_class.prototype, "selectedTVAProgramOption", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "selectedTVAProgramOption"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "selectedTimeperiodsProgramOption", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "selectedTimeperiodsProgramOption"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "tvaSelectedFrequencyOption", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "tvaSelectedFrequencyOption"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "tvaFrequencyOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "tvaFrequencyOptions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "tvaRadioDisabled", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "tvaRadioDisabled"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "tvaMostRecentCountDisplay", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "tvaMostRecentCountDisplay"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "tvaURL", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "tvaURL"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "timeperiodsURL", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "timeperiodsURL"), _class.prototype)), _class);

/***/ }),

/***/ "kvAA":
/*!*****************************************************!*\
  !*** ./js/pages/iptt_quickstart/components/main.js ***!
  \*****************************************************/
/*! exports provided: IPTTQuickstartForm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IPTTQuickstartForm", function() { return IPTTQuickstartForm; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _selects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selects */ "NP74");
/* harmony import */ var _radios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./radios */ "UQOO");
/* harmony import */ var _buttons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./buttons */ "I1cX");






var QuickstartCard = function QuickstartCard(_ref) {
  var children = _ref.children;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col-sm-6"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "card"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "card-body"
  }, children)));
};

var TVAQuickstartForm = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var labels = _ref2.labels;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(QuickstartCard, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", {
    className: "card-title"
  }, labels.tvaFilterTitle), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    className: "card-subtitle text-muted mb-2"
  }, labels.tvaFilterSubtitle), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_selects__WEBPACK_IMPORTED_MODULE_2__["QSTVAProgramSelect"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_selects__WEBPACK_IMPORTED_MODULE_2__["QSTVAPeriodSelect"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_radios__WEBPACK_IMPORTED_MODULE_3__["QSTVATimeFrameRadio"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_4__["IPTTSubmit"], {
    url: 'tvaURL'
  }));
}));
var TimeperiodsQuickstartForm = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref3) {
  var labels = _ref3.labels;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(QuickstartCard, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", {
    className: "card-title"
  }, labels.timeperiodsFilterTitle), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    className: "card-subtitle text-muted mb-2"
  }, labels.timeperiodsFilterSubtitle), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_selects__WEBPACK_IMPORTED_MODULE_2__["QSTimeperiodsProgramSelect"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_4__["IPTTSubmit"], {
    url: 'timeperiodsURL'
  }));
}));
var IPTTQuickstartForm = function IPTTQuickstartForm() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "row"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TVAQuickstartForm, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TimeperiodsQuickstartForm, null));
};

/***/ })

},[["+aul","runtime","vendors"]]]);
//# sourceMappingURL=iptt_quickstart-7103b30b933b288c1185.js.map