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
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-select */ "y2Vs");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp, _class3, _temp2, _class5, _temp3, _class7, _temp4;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }






var BLANK_LABEL = '---------';
var TVA = 1;
var TIMEPERIODS = 2;
var IPTTQuickstartUIStore = (_class = (_temp =
/*#__PURE__*/
function () {
  function IPTTQuickstartUIStore(programs, labels) {
    var _this = this;

    _classCallCheck(this, IPTTQuickstartUIStore);

    _initializerDefineProperty(this, "selectedProgram", _descriptor, this);

    _initializerDefineProperty(this, "selectedFrequency", _descriptor2, this);

    _initializerDefineProperty(this, "showAll", _descriptor3, this);

    _initializerDefineProperty(this, "mostRecent", _descriptor4, this);

    this.getUrl = function (reportType) {
      var url = false;

      if (_this.selectedProgram[reportType] !== null) {
        url = _this.programs[_this.selectedProgram[reportType]].urls[reportType];
        url = url + '?frequency=';

        if (reportType == TIMEPERIODS) {
          url = url + '7&recents=2';
        } else {
          url = url + _this.selectedFrequency + '&';

          if (_this.showAll) {
            url = url + 'showall=1';
          } else {
            url = url + 'recents=' + _this.mostRecent;
          }
        }

        ;
      }

      return url;
    };

    this.getPrograms = function (reportType) {
      var programOptions = _this.programIds.map(function (pid) {
        return {
          value: pid,
          label: _this.programs[pid].name
        };
      });

      if (reportType == TIMEPERIODS) {
        return programOptions;
      } else {
        return programOptions.filter(function (program) {
          return _this.programs[program.value].frequencies.length > 0;
        });
      }
    };

    this.getSelectedProgram = function (reportType) {
      if (_this.selectedProgram[reportType]) {
        return {
          value: _this.selectedProgram[reportType],
          label: _this.programs[_this.selectedProgram[reportType]].name
        };
      }

      return {
        value: null,
        label: BLANK_LABEL
      };
    };

    this.getFrequencies = function () {
      if (!_this.selectedProgram[TVA]) {
        return false;
      }

      var selectedId = _this.selectedProgram[TVA];
      return _this.programs[selectedId].frequencies.map(function (frequency) {
        return {
          value: frequency,
          label: _this.labels.frequencies[frequency]
        };
      });
    };

    this.getSelectedFrequency = function () {
      if (_this.selectedFrequency) {
        return {
          value: _this.selectedFrequency,
          label: _this.labels.frequencies[_this.selectedFrequency]
        };
      }

      return {
        value: null,
        label: BLANK_LABEL
      };
    };

    this.programs = {};
    this.programIds = [];
    this.labels = labels;
    programs.forEach(function (program) {
      var _urls;

      _this.programs[program.id] = {
        name: program.name,
        urls: (_urls = {}, _defineProperty(_urls, TVA, program.tva_url), _defineProperty(_urls, TIMEPERIODS, program.timeperiods_url), _urls),
        frequencies: program.frequencies
      };

      _this.programIds.push(program.id);
    });
  }

  _createClass(IPTTQuickstartUIStore, [{
    key: "setSelectedProgram",
    value: function setSelectedProgram(value, reportType) {
      if (reportType == TVA) {
        this.selectedProgram[TIMEPERIODS] = null;
      } else if (reportType == TIMEPERIODS) {
        this.selectedProgram[TVA] = null;
        this.selectedFrequency = null;
      }

      if (value && this.programIds.includes(value)) {
        this.selectedProgram[reportType] = value;

        if (this.selectedFrequency && !this.programs[value].frequencies.includes(this.selectedFrequency)) {
          this.selectedFrequency = null;
          this.setShowAll(reportType);
        }
      }
    }
  }, {
    key: "setSelectedFrequency",
    value: function setSelectedFrequency(value, reportType) {
      this.selectedFrequency = value;

      if (reportType == TVA && [1, 2].includes(value)) {
        this.showAll = TVA;
        this.mostRecent = null;
      }
    }
  }, {
    key: "setShowAll",
    value: function setShowAll(reportType) {
      this.showAll = reportType;
      this.mostRecent = null;
    }
  }, {
    key: "setMostRecent",
    value: function setMostRecent(num, reportType) {
      this.showAll = null;
      this.mostRecent = true;
    }
  }, {
    key: "setMostRecentCount",
    value: function setMostRecentCount(num, reportType) {
      this.showAll = null;
      this.mostRecent = num;
    }
  }]);

  return IPTTQuickstartUIStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "selectedProgram", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _ref;

    return _ref = {}, _defineProperty(_ref, TVA, null), _defineProperty(_ref, TIMEPERIODS, null), _ref;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "selectedFrequency", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "showAll", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return TVA;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "mostRecent", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _applyDecoratedDescriptor(_class.prototype, "setSelectedProgram", [mobx__WEBPACK_IMPORTED_MODULE_3__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setSelectedProgram"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setSelectedFrequency", [mobx__WEBPACK_IMPORTED_MODULE_3__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setSelectedFrequency"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setShowAll", [mobx__WEBPACK_IMPORTED_MODULE_3__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setShowAll"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setMostRecent", [mobx__WEBPACK_IMPORTED_MODULE_3__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setMostRecent"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setMostRecentCount", [mobx__WEBPACK_IMPORTED_MODULE_3__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setMostRecentCount"), _class.prototype)), _class);
var thisUIStore = new IPTTQuickstartUIStore(jsContext.programs, jsContext.labels);

var ProgramSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class3 = (_temp2 =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ProgramSelect, _React$Component);

  function ProgramSelect() {
    var _getPrototypeOf2;

    var _this2;

    _classCallCheck(this, ProgramSelect);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ProgramSelect)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this2.onSelection = function (selected) {
      var selectedId = selected ? selected.value : null;

      _this2.props.uiStore.setSelectedProgram(selectedId, _this2.props.reportType);
    };

    return _this2;
  }

  _createClass(ProgramSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_4__["default"], {
        options: this.props.uiStore.getPrograms(this.props.reportType),
        value: this.props.uiStore.getSelectedProgram(this.props.reportType),
        onChange: this.onSelection
      });
    }
  }]);

  return ProgramSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp2)) || _class3;

var TargetPeriodSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class5 = (_temp3 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(TargetPeriodSelect, _React$Component2);

  function TargetPeriodSelect() {
    var _getPrototypeOf3;

    var _this3;

    _classCallCheck(this, TargetPeriodSelect);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this3 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(TargetPeriodSelect)).call.apply(_getPrototypeOf3, [this].concat(args)));

    _this3.onSelection = function (selected) {
      var selectedId = selected ? selected.value : null;

      _this3.props.uiStore.setSelectedFrequency(selectedId, _this3.props.reportType);
    };

    return _this3;
  }

  _createClass(TargetPeriodSelect, [{
    key: "render",
    value: function render() {
      var options = this.props.uiStore.getFrequencies();
      var isDisabled = false;

      if (!options) {
        options = [];
        isDisabled = true;
      }

      ;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_4__["default"], {
        options: options,
        isDisabled: isDisabled,
        value: this.props.uiStore.getSelectedFrequency(),
        onChange: this.onSelection
      });
    }
  }]);

  return TargetPeriodSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp3)) || _class5;

var ShowAllSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (_ref2) {
  var uiStore = _ref2.uiStore,
      reportType = _ref2.reportType;
  var disabled = uiStore.selectedProgram[reportType] === null || reportType == TVA && uiStore.selectedFrequency === null;
  var checked = uiStore.showAll == reportType;

  var handleChange = function handleChange(e) {
    uiStore.setShowAll(reportType);
  };

  var className = 'form-check form-check-inline py-1';

  if (disabled) {
    className += ' form-check-inline--is-disabled';
  }

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: className
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "form-check-input"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
    type: "radio",
    checked: checked,
    disabled: disabled,
    onChange: handleChange
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    className: "form-check-label"
  }, uiStore.labels.showAll));
});
var MostRecentSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (_ref3) {
  var uiStore = _ref3.uiStore,
      reportType = _ref3.reportType;
  var disabled = uiStore.selectedProgram[reportType] === null || reportType == TVA && [1, 2, null].includes(uiStore.selectedFrequency);
  var checked = uiStore.mostRecent !== null;

  var handleChange = function handleChange(e) {
    uiStore.setMostRecent(reportType);
  };

  var className = 'form-check form-check-inline py-1';

  if (disabled) {
    className += ' form-check-inline--is-disabled';
  }

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: className
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "form-check-input"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
    type: "radio",
    checked: checked,
    disabled: disabled,
    onChange: handleChange
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    className: "form-check-label"
  }, uiStore.labels.mostRecent));
});

var MostRecentCount = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class7 = (_temp4 =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(MostRecentCount, _React$Component3);

  function MostRecentCount() {
    var _getPrototypeOf4;

    var _this4;

    _classCallCheck(this, MostRecentCount);

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _this4 = _possibleConstructorReturn(this, (_getPrototypeOf4 = _getPrototypeOf(MostRecentCount)).call.apply(_getPrototypeOf4, [this].concat(args)));

    _this4.handleChange = function (e) {
      var value = e.target.value;

      if (value == '') {
        value = true;
      }

      ;

      _this4.props.uiStore.setMostRecentCount(value);
    };

    return _this4;
  }

  _createClass(MostRecentCount, [{
    key: "render",
    value: function render() {
      var disabled = this.props.uiStore.selectedProgram[this.props.reportType] === null || this.props.reportType == TVA && this.props.uiStore.selectedFrequency === null || this.props.reportType == TVA && [1, 2, null].includes(this.props.uiStore.selectedFrequency);
      var value = this.props.uiStore.mostRecent !== null && this.props.uiStore.mostRecent !== true ? this.props.uiStore.mostRecent : '';
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "number",
        placeholder: this.props.uiStore.labels.mostRecentCount,
        disabled: disabled,
        value: value,
        className: "form-control",
        onChange: this.handleChange
      });
    }
  }]);

  return MostRecentCount;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp4)) || _class7;

var IPTTSubmit = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (_ref4) {
  var uiStore = _ref4.uiStore,
      reportType = _ref4.reportType;

  var handleClick = function handleClick(e) {
    var url = uiStore.getUrl(reportType);
    console.log(url);
  };

  var disabled = uiStore.selectedProgram[reportType] === null || reportType == TVA && uiStore.selectedFrequency === null || reportType == TVA && uiStore.mostRecent === true;
  var inlineCSS = {
    width: '100%'
  };
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-primary",
    onClick: handleClick,
    disabled: disabled,
    style: inlineCSS
  }, uiStore.labels.submit);
});
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramSelect, {
  uiStore: thisUIStore,
  reportType: TVA
}), document.querySelector('#quickstart-tva-form-program-select-react'));
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TargetPeriodSelect, {
  uiStore: thisUIStore,
  reportType: TVA
}), document.querySelector('#quickstart-tva-form-period-select-react'));
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ShowAllSelect, {
  uiStore: thisUIStore,
  reportType: TVA
}), document.querySelector('#quickstart-tva-form-show-all-react'));
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(MostRecentSelect, {
  uiStore: thisUIStore,
  reportType: TVA
}), document.querySelector('#quickstart-tva-most-recent-check-react'));
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(MostRecentCount, {
  uiStore: thisUIStore,
  reportType: TVA
}), document.querySelector('#quickstart-tva-most-recent-count-react'));
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSubmit, {
  uiStore: thisUIStore,
  reportType: TVA
}), document.querySelector('#quickstart-tva-submit-button-react'));
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramSelect, {
  uiStore: thisUIStore,
  reportType: TIMEPERIODS
}), document.querySelector('#quickstart-timeperiods-form-program-select-react'));
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSubmit, {
  uiStore: thisUIStore,
  reportType: TIMEPERIODS
}), document.querySelector('#quickstart-timeperiods-submit-button-react'));

/***/ })

},[["+aul","runtime","vendors"]]]);
//# sourceMappingURL=iptt_quickstart-e00a8d543b68708e7c8a.js.map