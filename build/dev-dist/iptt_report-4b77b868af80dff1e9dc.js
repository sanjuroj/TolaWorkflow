(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["iptt_report"],{

/***/ "2et8":
/*!*************************************************!*\
  !*** ./js/pages/iptt_report/components/main.js ***!
  \*************************************************/
/*! exports provided: IPTTReportApp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IPTTReportApp", function() { return IPTTReportApp; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _reportComponents__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reportComponents */ "31hj");
/* harmony import */ var _filterForm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./filterForm */ "31tc");
/* harmony import */ var _buttons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./buttons */ "qaCi");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var IPTTHeader = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var labels = _ref.labels,
      rootStore = _ref.rootStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "page-subheader"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "id_span_iptt_date_range",
    className: "subheader__title"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
    className: "pt-3 text-title-case"
  }, labels.reportTitle), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", {
    className: "pb-3"
  }, rootStore.startPeriodLabel && rootStore.endPeriodLabel ? rootStore.startPeriodLabel + " - " + rootStore.endPeriodLabel : "")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "subheader__actions"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_4__["PinButton"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_4__["ExcelButton"], null)));
}));
var IPTTSidebar = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels')(function (_ref2) {
  var labels = _ref2.labels;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "sidebar_wrapper"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "collapse width show",
    id: "sidebar"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_filterForm__WEBPACK_IMPORTED_MODULE_3__["IPTTFilterForm"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "filter-bottom",
    className: "d-flex justify-content-between no-gutters p-3"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_4__["ClearButton"], null))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "sidebar-toggle"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "#",
    "data-target": "#sidebar",
    "data-toggle": "collapse",
    title: labels.sidebarToggle
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fa fa-chevron-left"
  }))));
});

var IPTTReport = function IPTTReport() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("main", {
    className: "iptt_table_wrapper"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "id_div_top_iptt_report"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTHeader, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportComponents__WEBPACK_IMPORTED_MODULE_2__["IPTTTable"], null)));
};

var IPTTReportApp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(IPTTReportApp, _React$Component);

  function IPTTReportApp() {
    _classCallCheck(this, IPTTReportApp);

    return _possibleConstructorReturn(this, _getPrototypeOf(IPTTReportApp).apply(this, arguments));
  }

  _createClass(IPTTReportApp, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSidebar, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTReport, null));
    }
  }]);

  return IPTTReportApp;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

/***/ }),

/***/ "31hj":
/*!*************************************************************!*\
  !*** ./js/pages/iptt_report/components/reportComponents.js ***!
  \*************************************************************/
/*! exports provided: IPTTTable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IPTTTable", function() { return IPTTTable; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _headerComponents__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./headerComponents */ "Zs+a");
var _dec, _class, _temp, _dec2, _class3;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }




var EMPTY_CELL = '—';
var IndicatorTD = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", _extends({
    className: "td-no-side-borders"
  }, props), props.children);
});
var TVAValue = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var target = _ref.target,
      value = _ref.value,
      isPercent = _ref.isPercent;
  var percentText = value && target && target != 0 ? String(Math.round(value / target * 1000) / 10) + '%' : EMPTY_CELL;
  var valueText = value ? String(Math.round(value)) + (isPercent ? '%' : '') : EMPTY_CELL;
  var targetText = target ? String(Math.round(target)) + (isPercent ? '%' : '') : EMPTY_CELL;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    align: "right"
  }, targetText), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    align: "right"
  }, valueText), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    align: "right"
  }, percentText));
});
var IndicatorRow = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(IndicatorRow, _React$Component);

  function IndicatorRow() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, IndicatorRow);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(IndicatorRow)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.getPeriodValues = function () {
      if (!_this.props.indicator.indicatorData) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          key: _this.props.index
        }, "Loading");
      } else if (_this.props.rootStore.isTVA) {
        return _this.props.indicator.indicatorData.map(function (values, index) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TVAValue, _extends({
            key: index,
            isPercent: _this.props.indicator.isPercent
          }, values));
        });
      } else {
        return _this.props.indicator.indicatorData.map(function (value, index) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
            key: index,
            align: "right"
          }, value ? String(Math.round(value)) + (_this.props.indicator.isPercent ? '%' : '') : EMPTY_CELL);
        });
      }
    };

    return _this;
  }

  _createClass(IndicatorRow, [{
    key: "render",
    value: function render() {
      var indicator = this.props.indicator;

      if (indicator.id === null) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Loading, null);
      }

      var resultsButton = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-link p-1 indicator-ajax-popup indicator-data",
        "data-indicatorid": indicator.id,
        "data-container": "body",
        "data-trigger": "focus",
        "data-toggle": "popover",
        "data-placement": "bottom"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-table"
      }));
      var updateButton = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "indicator-link float-right"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-cog"
      }));
      var baseline = indicator.baseline ? String(indicator.baseline) + (indicator.isPercent ? '%' : '') : EMPTY_CELL;
      var lopTarget = indicator.lopTarget ? String(Math.round(indicator.lopTarget)) + (indicator.isPercent ? '%' : '') : EMPTY_CELL;
      var lopActual = indicator.lopActual ? indicator.isPercent ? String(Math.round(indicator.lopActual * 10) / 10) + '%' : String(Math.round(indicator.lopActual)) : EMPTY_CELL;
      var lopMet = indicator.lopMet ? String(Math.round(indicator.lopMet * 1000) / 10) + '%' : EMPTY_CELL;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorTD, null, indicator.number), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorTD, null, resultsButton, "  ", indicator.name), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorTD, null, updateButton), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorTD, null, indicator.unitOfMeasure), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorTD, {
        align: "center"
      }, indicator.directionOfChange), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorTD, null, indicator.cumulative), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorTD, null, indicator.unitType), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorTD, {
        align: "right"
      }, baseline), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorTD, {
        align: "right"
      }, lopTarget), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorTD, {
        align: "right"
      }, lopActual), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorTD, {
        align: "right"
      }, lopMet), this.getPeriodValues());
    }
  }]);

  return IndicatorRow;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);

var Loading = function Loading() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, "Loading"));
};

var NoIndicatorsForFrequency = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels')(function (_ref2) {
  var labels = _ref2.labels;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    colSpan: "8"
  }, labels.noIndicatorsForFrequency));
});
var LevelRow = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref3) {
  var level = _ref3.level,
      rootStore = _ref3.rootStore;
  var indicators = level.indicators ? level.indicators.map(function (indicator, count) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorRow, {
      indicator: indicator,
      key: count
    });
  }) : null;
  var width = rootStore.headerCols + rootStore.lopCols + rootStore.selectedPeriods.length * (rootStore.isTva ? 3 : 1);
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
    className: "row__level"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    colSpan: width
  }, level.tier, " ", level.displayOntology, ": ", level.name)), indicators);
}));
var IPTTTableBody = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec2(_class3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class3 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(IPTTTableBody, _React$Component2);

  function IPTTTableBody() {
    _classCallCheck(this, IPTTTableBody);

    return _possibleConstructorReturn(this, _getPrototypeOf(IPTTTableBody).apply(this, arguments));
  }

  _createClass(IPTTTableBody, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, this.tableContent);
    }
  }, {
    key: "noIndicatorsForFrequency",
    get: function get() {
      return false;
    }
  }, {
    key: "tableContent",
    get: function get() {
      if (this.props.rootStore.loading || !this.props.rootStore.initialized) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Loading, null);
      } else if (this.noIndicatorsForFrequency) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NoIndicatorsForFrequency, null);
      } else {
        return this.props.rootStore.report.map(function (level, count) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelRow, {
            level: level,
            key: count
          });
        });
      }
    }
  }]);

  return IPTTTableBody;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class3) || _class3);
var IPTTTable = function IPTTTable() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
    className: "table table-sm table-bordered table-hover table__iptt",
    id: "iptt_table"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerComponents__WEBPACK_IMPORTED_MODULE_2__["IPTTTableHead"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTTableBody, null));
};

/***/ }),

/***/ "31tc":
/*!*******************************************************!*\
  !*** ./js/pages/iptt_report/components/filterForm.js ***!
  \*******************************************************/
/*! exports provided: IPTTFilterForm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IPTTFilterForm", function() { return IPTTFilterForm; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var react_multiselect_checkboxes_lib_CheckboxGroup__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-multiselect-checkboxes/lib/CheckboxGroup */ "oary");
/* harmony import */ var react_multiselect_checkboxes_lib_CheckboxGroup__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_multiselect_checkboxes_lib_CheckboxGroup__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-multiselect-checkboxes */ "VCnP");
/* harmony import */ var react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_5__);
var _dec, _class, _temp, _dec2, _class3, _temp2, _dec3, _class5, _class6, _dec4, _class7, _temp3, _dec5, _class9, _temp4, _dec6, _class11, _temp5, _dec7, _class13, _temp6, _dec8, _class15, _temp7, _dec9, _class17, _temp8, _dec10, _class19, _temp9;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var programOptions = [{
  value: 1,
  label: 'program 1'
}, {
  value: 2,
  label: 'program 2'
}];
var selectedProgram = {
  value: 1,
  label: 'program 1'
};

var IPTTSelectWrapper = function IPTTSelectWrapper(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-row mb-3"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    className: "col-form-label text-uppercase"
  }, props.label), props.children);
};

var ProgramSelect = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ProgramSelect, _React$Component);

  function ProgramSelect() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ProgramSelect);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ProgramSelect)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.selectProgram = function (selected) {
      _this.props.rootStore.setProgramId(selected.value);
    };

    return _this;
  }

  _createClass(ProgramSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSelectWrapper, {
        label: this.props.labels.programSelect
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
        options: this.props.rootStore.programOptions,
        value: this.props.rootStore.selectedProgramOption,
        onChange: this.selectProgram,
        className: "iptt-react-select"
      }));
    }
  }]);

  return ProgramSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);
var PeriodSelect = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec2(_class3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class3 = (_temp2 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(PeriodSelect, _React$Component2);

  function PeriodSelect() {
    var _getPrototypeOf3;

    var _this2;

    _classCallCheck(this, PeriodSelect);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(PeriodSelect)).call.apply(_getPrototypeOf3, [this].concat(args)));

    _this2.selectFrequency = function (selected) {
      _this2.props.rootStore.setFrequencyId(selected.value);
    };

    return _this2;
  }

  _createClass(PeriodSelect, [{
    key: "render",
    value: function render() {
      var label = this.props.rootStore.isTVA ? this.props.labels.periodSelect.tva : this.props.labels.periodSelect.timeperiods;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSelectWrapper, {
        label: label
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
        options: this.props.rootStore.frequencyOptions,
        value: this.props.rootStore.selectedFrequencyOption,
        onChange: this.selectFrequency,
        className: "iptt-react-select"
      }));
    }
  }]);

  return PeriodSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp2)) || _class3) || _class3);
var DateSelect = (_dec3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec3(_class5 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class5 = (_class6 =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(DateSelect, _React$Component3);

  function DateSelect() {
    _classCallCheck(this, DateSelect);

    return _possibleConstructorReturn(this, _getPrototypeOf(DateSelect).apply(this, arguments));
  }

  _createClass(DateSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSelectWrapper, {
        label: this.props.label
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
        className: "form-control",
        value: this.props.value,
        onChange: this.props.onChange,
        disabled: this.props.rootStore.selectedFrequencyId == 2 || this.props.rootStore.selectedFrequencyId == 1
      }, this.options));
    }
  }, {
    key: "options",
    get: function get() {
      if (this.props.rootStore.selectedFrequencyId == 7) {
        return Object.entries(this.props.rootStore.periodOptions).map(function (_ref, index) {
          var _ref2 = _slicedToArray(_ref, 2),
              optgroupLabel = _ref2[0],
              options = _ref2[1];

          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("optgroup", {
            label: optgroupLabel,
            key: index
          }, options.map(function (option) {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
              value: option.value,
              key: option.value
            }, option.label);
          }));
        });
      } else {
        return this.props.rootStore.periodOptions.map(function (option) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
            value: option.value,
            key: option.value
          }, option.label);
        });
      }
    }
  }]);

  return DateSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), (_applyDecoratedDescriptor(_class6.prototype, "options", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "options"), _class6.prototype)), _class6)) || _class5) || _class5);
var StartDateSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref3) {
  var labels = _ref3.labels,
      rootStore = _ref3.rootStore;

  var selectHandler = function selectHandler(e) {
    rootStore.setStartPeriod(e.target.value);
  };

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DateSelect, {
    label: labels.startPeriod,
    value: rootStore.startPeriod,
    onChange: selectHandler
  });
}));
var EndDateSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref4) {
  var labels = _ref4.labels,
      rootStore = _ref4.rootStore;

  var selectHandler = function selectHandler(e) {
    rootStore.setEndPeriod(e.target.value);
  };

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DateSelect, {
    label: labels.endPeriod,
    value: rootStore.endPeriod,
    onChange: selectHandler
  });
}));
var TimeFrameRadio = (_dec4 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec4(_class7 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class7 = (_temp3 =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(TimeFrameRadio, _React$Component4);

  function TimeFrameRadio() {
    var _getPrototypeOf4;

    var _this3;

    _classCallCheck(this, TimeFrameRadio);

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _this3 = _possibleConstructorReturn(this, (_getPrototypeOf4 = _getPrototypeOf(TimeFrameRadio)).call.apply(_getPrototypeOf4, [this].concat(args)));

    _this3.checkMostRecent = function () {
      //default value of 2 in case of clicking "most recent" radio box - default behavior
      _this3.props.rootStore.setMostRecent(2);
    };

    _this3.updateMostRecentCount = function (e) {
      _this3.props.rootStore.setMostRecent(e.target.value);
    };

    return _this3;
  }

  _createClass(TimeFrameRadio, [{
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
        checked: this.props.rootStore.showAll,
        disabled: !this.props.rootStore.timeframeEnabled,
        onChange: this.props.rootStore.setShowAll
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
        checked: this.props.rootStore.mostRecent !== null,
        disabled: !this.props.rootStore.timeframeEnabled,
        onChange: this.checkMostRecent
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "form-check-label"
      }, this.props.labels.mostRecent))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-4"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "number",
        className: "form-control",
        value: this.props.rootStore.mostRecent || '',
        disabled: !this.props.rootStore.timeframeEnabled,
        onChange: this.updateMostRecentCount
      })));
    }
  }]);

  return TimeFrameRadio;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp3)) || _class7) || _class7);
var GroupingSelect = (_dec5 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec5(_class9 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class9 = (_temp4 =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(GroupingSelect, _React$Component5);

  function GroupingSelect() {
    var _getPrototypeOf5;

    var _this4;

    _classCallCheck(this, GroupingSelect);

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    _this4 = _possibleConstructorReturn(this, (_getPrototypeOf5 = _getPrototypeOf(GroupingSelect)).call.apply(_getPrototypeOf5, [this].concat(args)));

    _this4.onChange = function (e) {
      _this4.props.rootStore.levelGrouping = e.target.value == 1;
    };

    return _this4;
  }

  _createClass(GroupingSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSelectWrapper, {
        label: this.props.labels.levelGrouping.label
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
        className: "form-control",
        value: this.props.rootStore.levelGrouping ? 1 : 0,
        onChange: this.onChange
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
        value: "0"
      }, this.props.rootStore.selectedProgram.resultChainFilter), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
        value: "1"
      }, this.props.labels.levelGrouping.group)));
    }
  }]);

  return GroupingSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp4)) || _class9) || _class9);

var IPTTMultiSelectWrapper = function IPTTMultiSelectWrapper(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-row mb-2 iptt-react-select-row"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    className: "col-form-label text-uppercase"
  }, props.label), props.children);
};

var GroupHeading = function GroupHeading(props) {
  if (props.children == '') {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null);
  } else {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("hr", {
      style: {
        margin: '3px 0px 0px 0px'
      }
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      style: {
        textTransform: 'uppercase',
        paddingLeft: '4px',
        marginBottom: '2px'
      }
    }, props.children));
  }
};

var LevelSelect = (_dec6 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec6(_class11 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class11 = (_temp5 =
/*#__PURE__*/
function (_React$Component6) {
  _inherits(LevelSelect, _React$Component6);

  function LevelSelect() {
    var _getPrototypeOf6;

    var _this5;

    _classCallCheck(this, LevelSelect);

    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    _this5 = _possibleConstructorReturn(this, (_getPrototypeOf6 = _getPrototypeOf(LevelSelect)).call.apply(_getPrototypeOf6, [this].concat(args)));

    _this5.getOptions = function () {
      var tiers = _this5.props.rootStore.selectedProgram.reportLevelTiers;
      var chains = _this5.props.rootStore.selectedProgram.reportLevelChains;
      return [{
        label: '',
        options: tiers
      }, {
        label: 'Outcome chains',
        options: chains
      }];
    };

    _this5.getValue = function () {
      if (_this5.props.rootStore.levelFilters && _this5.props.rootStore.levelFilters.length > 0) {
        return _this5.props.rootStore.levelFilters;
      } else if (_this5.props.rootStore.tierFilters && _this5.props.rootStore.tierFilters.length > 0) {
        return _this5.props.rootStore.tierFilters;
      } else {
        return [];
      }
    };

    _this5.updateLevelFilters = function (selected) {
      var levelSelects = selected.filter(function (option) {
        return option.filterType == 'level';
      });
      var tierSelects = selected.filter(function (option) {
        return option.filterType == 'tier';
      });

      if (levelSelects.length > 0 && tierSelects.length > 0) {
        if (_this5.props.rootStore.tierFilters && _this5.props.rootStore.tierFilters.length > 0) {
          _this5.props.rootStore.setLevelFilters(levelSelects);
        } else {
          _this5.props.rootStore.setTierFilters(tierSelects);
        }
      } else if (levelSelects.length > 0) {
        _this5.props.rootStore.setLevelFilters(levelSelects);
      } else {
        _this5.props.rootStore.setTierFilters(tierSelects);
      }
    };

    return _this5;
  }

  _createClass(LevelSelect, [{
    key: "render",
    value: function render() {
      var customStyles = {
        option: function option(provided, state) {
          return _objectSpread({}, provided, {
            padding: '1px 12px',
            display: 'inline-block'
          });
        },
        container: function container(provided, state) {
          return _objectSpread({}, provided, {
            backgroundColor: '#f5f5f5'
          });
        }
      };

      var formatOptionLabel = function formatOptionLabel(props) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          style: {
            display: "inline-block",
            float: "right",
            width: "90%"
          }
        }, props.label);
      };

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTMultiSelectWrapper, {
        label: this.props.labels.levelSelect
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_5___default.a, {
        options: this.getOptions(),
        isMulti: true,
        styles: customStyles,
        formatOptionLabel: formatOptionLabel,
        components: {
          GroupHeading: GroupHeading
        },
        value: this.getValue(),
        onChange: this.updateLevelFilters
      }));
    }
  }]);

  return LevelSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp5)) || _class11) || _class11);
var SiteSelect = (_dec7 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec7(_class13 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class13 = (_temp6 =
/*#__PURE__*/
function (_React$Component7) {
  _inherits(SiteSelect, _React$Component7);

  function SiteSelect() {
    var _getPrototypeOf7;

    var _this6;

    _classCallCheck(this, SiteSelect);

    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    _this6 = _possibleConstructorReturn(this, (_getPrototypeOf7 = _getPrototypeOf(SiteSelect)).call.apply(_getPrototypeOf7, [this].concat(args)));

    _this6.updateSiteFilters = function (selected) {
      _this6.props.rootStore.setSiteFilters(selected);
    };

    return _this6;
  }

  _createClass(SiteSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTMultiSelectWrapper, {
        label: this.props.labels.siteSelect
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_5___default.a, {
        options: this.props.rootStore.selectedProgram.reportSites,
        isMulti: true,
        value: this.props.rootStore.siteFilters,
        onChange: this.updateSiteFilters
      }));
    }
  }]);

  return SiteSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp6)) || _class13) || _class13);
var TypeSelect = (_dec8 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec8(_class15 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class15 = (_temp7 =
/*#__PURE__*/
function (_React$Component8) {
  _inherits(TypeSelect, _React$Component8);

  function TypeSelect() {
    var _getPrototypeOf8;

    var _this7;

    _classCallCheck(this, TypeSelect);

    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    _this7 = _possibleConstructorReturn(this, (_getPrototypeOf8 = _getPrototypeOf(TypeSelect)).call.apply(_getPrototypeOf8, [this].concat(args)));

    _this7.updateTypeFilters = function (selected) {
      _this7.props.rootStore.setTypeFilters(selected);
    };

    return _this7;
  }

  _createClass(TypeSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTMultiSelectWrapper, {
        label: this.props.labels.typeSelect
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_5___default.a, {
        options: this.props.rootStore.selectedProgram.reportTypes,
        isMulti: true,
        value: this.props.rootStore.typeFilters,
        onChange: this.updateTypeFilters
      }));
    }
  }]);

  return TypeSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp7)) || _class15) || _class15);
var SectorSelect = (_dec9 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec9(_class17 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class17 = (_temp8 =
/*#__PURE__*/
function (_React$Component9) {
  _inherits(SectorSelect, _React$Component9);

  function SectorSelect() {
    var _getPrototypeOf9;

    var _this8;

    _classCallCheck(this, SectorSelect);

    for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    _this8 = _possibleConstructorReturn(this, (_getPrototypeOf9 = _getPrototypeOf(SectorSelect)).call.apply(_getPrototypeOf9, [this].concat(args)));

    _this8.updateSectorFilters = function (selected) {
      _this8.props.rootStore.setSectorFilters(selected);
    };

    return _this8;
  }

  _createClass(SectorSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTMultiSelectWrapper, {
        label: this.props.labels.sectorSelect
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_5___default.a, {
        options: this.props.rootStore.selectedProgram.reportSectors,
        isMulti: true,
        value: this.props.rootStore.sectorFilters,
        onChange: this.updateSectorFilters
      }));
    }
  }]);

  return SectorSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp8)) || _class17) || _class17);
var IndicatorSelect = (_dec10 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec10(_class19 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class19 = (_temp9 =
/*#__PURE__*/
function (_React$Component10) {
  _inherits(IndicatorSelect, _React$Component10);

  function IndicatorSelect() {
    var _getPrototypeOf10;

    var _this9;

    _classCallCheck(this, IndicatorSelect);

    for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    _this9 = _possibleConstructorReturn(this, (_getPrototypeOf10 = _getPrototypeOf(IndicatorSelect)).call.apply(_getPrototypeOf10, [this].concat(args)));

    _this9.updateIndicatorFilters = function (selected) {
      _this9.props.rootStore.setIndicatorFilters(selected);
    };

    return _this9;
  }

  _createClass(IndicatorSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTMultiSelectWrapper, {
        label: this.props.labels.indicatorSelect
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_5___default.a, {
        options: this.props.rootStore.selectedProgram.reportIndicatorsOptions,
        isMulti: true,
        components: {
          GroupHeading: GroupHeading
        },
        value: this.props.rootStore.indicatorFilters,
        onChange: this.updateIndicatorFilters
      }));
    }
  }]);

  return IndicatorSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp9)) || _class19) || _class19);
var IPTTFilterForm = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref5) {
  var labels = _ref5.labels;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("nav", {
    id: "id_iptt_report_filter"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "p-3",
    id: "filter-top"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", {
    className: "filter-title text-title-case"
  }, labels.filterTitle), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramSelect, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PeriodSelect, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TimeFrameRadio, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(StartDateSelect, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(EndDateSelect, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GroupingSelect, null)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "filter-middle",
    className: "p-3"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelSelect, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SiteSelect, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TypeSelect, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SectorSelect, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorSelect, null)));
}));

/***/ }),

/***/ "CrpI":
/*!******************************************!*\
  !*** ./js/pages/iptt_report/fixtures.js ***!
  \******************************************/
/*! exports provided: contextFixture, reportData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "contextFixture", function() { return contextFixture; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reportData", function() { return reportData; });
// fixtures for building/testing
var contextFixture = {
  labels: {
    filterTitle: "Report options",
    reportTitle: "Indicator performance tracking table",
    sidebarToggle: "Show/hide filters",
    pin: 'Pin',
    excel: 'Excel',
    programSelect: 'Program',
    periodSelect: {
      tva: 'Target periods',
      timeperiods: 'Time periods'
    },
    showAll: 'Show all',
    mostRecent: 'Most recent',
    startPeriod: 'Start',
    endPeriod: 'End',
    timeperiods: {
      3: 'Years',
      4: 'Semi-annual periods',
      5: 'Tri-annual periods',
      6: 'Quarters',
      7: 'Months'
    },
    targetperiods: {
      2: 'Midline and endline',
      3: 'Annual',
      4: 'Semi-annual',
      5: 'Tri-annual',
      6: 'Quarterly',
      7: 'Monthly'
    },
    periodNames: {
      3: 'Year',
      4: 'Semi-annual period',
      5: 'Tri-annual period',
      6: 'Quarter'
    },
    columnHeaders: {
      lop: 'Life of Program',
      number: 'No.',
      indicator: 'Indicator',
      level: 'Level',
      uom: 'Unit of measure',
      change: 'Change',
      cumulative: 'C / NC',
      numType: '# / %',
      baseline: 'Baseline',
      target: 'Target',
      actual: 'Actual',
      met: '% Met'
    }
  },
  programs: [{
    name: "TolaData Demo",
    id: 542,
    frequencies: [3, 5, 6],
    periodDateRanges: {
      1: [['Apr 1, 2018', 'Jun 30, 2019']],
      2: [['Apr 1, 2018', 'Jun 30, 2019']],
      3: [['Apr 1, 2018', 'Jun 30, 2019']],
      4: [['Apr 1, 2018', 'Sept 30, 2018'], ['Oct 1, 2018', 'Mar 31, 2019'], ['Apr 1, 2019', 'Sept 30, 2019', true]],
      5: [['Apr 1, 2018', 'Jul 31, 2018'], ['Aug 1, 2018', 'Nov 30, 2018'], ['Dec 1, 2018', 'Apr 30, 2018'], ['May 1, 2018', 'Aug 31, 2018', true]],
      6: [['Apr 1, 2018', 'Jun 30, 2018'], ['Jul 1, 2018', 'Sept 30, 2018'], ['Oct 1, 2018', 'Dec 31, 2018'], ['Jan 1, 2019', 'Mar 31, 2019'], ['Apr 1, 2019', 'Jun 30, 2019', true]],
      7: [['Apr 1, 2018', 'Apr 30, 2018', 'April', '2018'], ['May 1, 2018', 'May 31, 2018', 'May', '2018'], ['June 1, 2018', 'June 30, 2018', 'June', '2018'], ['July 1, 2018', 'July 31, 2018', 'July', '2018'], ['Aug 1, 2018', 'Aug 31, 2018', 'August', '2018'], ['Sept 1, 2018', 'Sept 30, 2018', 'September', '2018'], ['Oct 1, 2018', 'Oct 31, 2018', 'October', '2018'], ['Nov 1, 2018', 'Nov 30, 2018', 'November', '2018'], ['Dec 1, 2018', 'Dec 31, 2018', 'December', '2018'], ['Jan 1, 2019', 'Jan 31, 2019', 'January', '2019'], ['Feb 1, 2019', 'Feb 28, 2019', 'February', '2019'], ['Mar 1, 2019', 'Mar 31, 2019', 'March', '2019'], ['Apr 1, 2019', 'Apr 30, 2019', 'April', '2019', true], ['May 1, 2019', 'May 31, 2019', 'May', '2019', true], ['Jun 1, 2019', 'Jun 30, 2019', 'June', '2019', true]]
    }
  }, {
    name: "TolaData Test",
    id: 442,
    frequencies: [2, 3, 4],
    periodDateRanges: {
      1: [['Apr 1, 2016', 'Mar 31, 2017']],
      2: [['Apr 1, 2016', 'Mar 31, 2017']],
      3: [['Apr 1, 2016', 'Mar 31, 2017']],
      4: [['Apr 1, 2016', 'Sept 30, 2016'], ['Oct 1, 2016', 'Mar 31, 2017']],
      5: [['Apr 1, 2016', 'Jul 31, 2016'], ['Aug 1, 2016', 'Nov 30, 2016'], ['Dec 1, 2016', 'Mar 31, 2017']],
      6: [['Apr 1, 2016', 'Jun 30, 2016'], ['Jul 1, 2016', 'Sept 30, 2016'], ['Oct 1, 2016', 'Dec 31, 2016'], ['Jan 1, 2017', 'Mar 31, 2017']],
      7: [['Apr 1, 2016', 'Apr 30, 2016', 'April', '2016'], ['May 1, 2016', 'May 31, 2016', 'May', '2016'], ['June 1, 2016', 'June 30, 2016', 'June', '2016'], ['July 1, 2016', 'July 31, 2016', 'July', '2016'], ['Aug 1, 2016', 'Aug 31, 2016', 'August', '2016'], ['Sept 1, 2016', 'Sept 30, 2016', 'September', '2016'], ['Oct 1, 2016', 'Oct 31, 2016', 'October', '2016'], ['Nov 1, 2016', 'Nov 30, 2016', 'November', '2016'], ['Dec 1, 2016', 'Dec 31, 2016', 'December', '2016'], ['Jan 1, 2017', 'Jan 31, 2017', 'January', '2017'], ['Feb 1, 2017', 'Feb 28, 2017', 'February', '2017'], ['Mar 1, 2017', 'Mar 31, 2017', 'March', '2017']]
    }
  }]
};
var reportData = {
  542: {
    programId: 542,
    indicators: [{
      id: 5145,
      number: '1.1',
      name: 'Number of reported incidents of violence',
      level: 'Outcome',
      unitOfMeasure: 'Reported Incidents of Violence',
      directionOfChange: '-',
      cumulative: 'Non-cumulative',
      unitType: '#',
      baseline: '600',
      lopTarget: '200',
      lopActual: '1333',
      lopMet: '666.5%'
    }, {
      id: 5147,
      number: '2.1',
      name: 'Number of individuals receiving emergency relief services showing change in assessed conditions.',
      level: 'Output',
      unitOfMeasure: 'Individuals',
      directionOfChange: '+',
      cumulative: 'Non-cumulative',
      unitType: '%',
      baseline: '0',
      lopTarget: '20000',
      lopActual: '11925',
      lopMet: '59.6%'
    }]
  }
};

/***/ }),

/***/ "IzLX":
/*!***************************!*\
  !*** ./js/level_utils.js ***!
  \***************************/
/*! exports provided: trimOntology */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trimOntology", function() { return trimOntology; });
/*
  Some nice helper functions to help with date parsing and localization

  In the future it may make sense to use moment.js, luxon, or date-fns,
  but for now, just get by with the native browser APIs and save some bytes.

  Confusingly, native Date() objects are actually date/time objects.

  Surprisingly, the Django i18n/l10n JS tools do not provide access to the language code
  of the current language in use.
 */
// Returns a trimmed level ontology for display purposes
function trimOntology(ontologyStr) {
  var ontologyArray = ontologyStr.split(".");
  return ontologyArray.slice(1).filter(function (i) {
    return i > 0;
  }).join(".");
}

/***/ }),

/***/ "MH3R":
/*!****************************************!*\
  !*** ./js/pages/iptt_report/models.js ***!
  \****************************************/
/*! exports provided: ReportAPI, RootStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportAPI", function() { return ReportAPI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RootStore", function() { return RootStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _level_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../level_utils */ "IzLX");
var _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, _class4, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _temp2, _class6, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _temp3;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Data models for the IPTT report reqct page
 * @module iptt_report/models
 */


/**
 * models list:
 * ReportStore (observable - all data for report)
 * ProgramStore (observable - all program options)
 */

var BLANK_LABEL = '---------';
var TVA = 1;
var TIMEPERIODS = 2;
var ReportAPI =
/*#__PURE__*/
function () {
  function ReportAPI(ajaxUrl) {
    _classCallCheck(this, ReportAPI);

    this.url = ajaxUrl;
  }

  _createClass(ReportAPI, [{
    key: "callForData",
    value: function callForData(programId, frequency, tva) {
      var params = {
        programId: programId,
        frequency: frequency,
        reportType: tva ? 'tva' : 'timeperiods'
      };
      return $.get(this.url, params);
    }
  }]);

  return ReportAPI;
}();
var Level = (_class =
/*#__PURE__*/
function () {
  function Level(program, levelJSON) {
    _classCallCheck(this, Level);

    this.program = program;
    this.id = levelJSON.id;
    this.name = levelJSON.name;
    this.tier = levelJSON.tier;
    this.tierPk = levelJSON.tierPk;
    this.ontology = levelJSON.ontology;
    this.parentPk = levelJSON.parent;
    this.displayOntology = Object(_level_utils__WEBPACK_IMPORTED_MODULE_1__["trimOntology"])(this.ontology);
    this.depth = levelJSON.depth;
    this.level2parent = levelJSON.level2parent;
    this.sortIndex = levelJSON.sort;
  }

  _createClass(Level, [{
    key: "indicators",
    get: function get() {
      var _this = this;

      return this.program.filteredIndicators ? this.program.filteredIndicators.filter(function (indicator) {
        return indicator.levelId == _this.id;
      }) : [];
    }
  }, {
    key: "allIndicators",
    get: function get() {
      var _this2 = this;

      return this.program.allIndicators ? this.program.allIndicators.filter(function (indicator) {
        return indicator.levelId == _this2.id;
      }) : [];
    }
  }, {
    key: "optionName",
    get: function get() {
      return this.tier + ' ' + this.sortIndex + ' and sub-levels: ' + this.name;
    }
  }]);

  return Level;
}(), (_applyDecoratedDescriptor(_class.prototype, "indicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "indicators"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "allIndicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "allIndicators"), _class.prototype)), _class);
var Indicator = (_class2 = (_temp =
/*#__PURE__*/
function () {
  function Indicator(program) {
    _classCallCheck(this, Indicator);

    _initializerDefineProperty(this, "timeperiodsData", _descriptor, this);

    _initializerDefineProperty(this, "tvaData", _descriptor2, this);

    _initializerDefineProperty(this, "id", _descriptor3, this);

    this.program = program;
  }

  _createClass(Indicator, [{
    key: "loadData",
    value: function loadData(data) {
      this.id = data.id;
      this.pk = data.id;
      this.sortIndex = data.sortIndex;
      this.number = data.number;
      this.name = data.name;
      this.level = data.level;
      this.tierDepth = data.tierDepth;
      this.levelId = data.levelpk;
      this.sites = data.sites;
      this.types = data.indicatorTypes;
      this.sector = data.sector;
      this.frequency = data.frequency;
      this.directionOfChange = data.directionOfChange;
      this.unitOfMeasure = data.unitOfMeasure;
      this.cumulative = data.cumulative;
      this.unitType = data.unitType;
      this.baseline = data.baseline;
      this.lopTarget = data.lopTarget;
      this.lopActual = data.lopActual;
      this.lopMet = data.lopMet;

      if (data.reportData) {
        this.loadReportData(data.reportData);
      }
    }
  }, {
    key: "loadReportData",
    value: function loadReportData(reportData) {
      var _this3 = this;

      if (reportData.timeperiods) {
        Object.entries(reportData.timeperiods).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              frequency = _ref2[0],
              values = _ref2[1];

          _this3.timeperiodsData[frequency] = values;
        });
      }

      if (reportData.tva) {
        Object.entries(reportData.tva).forEach(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              frequency = _ref4[0],
              values = _ref4[1];

          _this3.tvaData[frequency] = values;
        });
      }
    }
  }, {
    key: "indicatorData",
    get: function get() {
      var frequency = String(this.program.rootStore.selectedFrequencyId);
      var reportData = this.program.rootStore.isTVA ? this.tvaData : this.timeperiodsData;

      if (reportData[frequency]) {
        return reportData[frequency].slice(this.program.rootStore.startPeriod, parseInt(this.program.rootStore.endPeriod) + 1);
      }

      return false;
    }
  }, {
    key: "isPercent",
    get: function get() {
      return this.unitType == '%';
    }
  }]);

  return Indicator;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "timeperiodsData", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "tvaData", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "id", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "indicatorData", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class2.prototype, "indicatorData"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isPercent", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class2.prototype, "isPercent"), _class2.prototype)), _class2);
var Program = (_class4 = (_temp2 =
/*#__PURE__*/
function () {
  function Program(rootStore, programJSON) {
    _classCallCheck(this, Program);

    _initializerDefineProperty(this, "indicators", _descriptor4, this);

    _initializerDefineProperty(this, "levels", _descriptor5, this);

    _initializerDefineProperty(this, "resultChainFilter", _descriptor6, this);

    _initializerDefineProperty(this, "reportsLoaded", _descriptor7, this);

    this.rootStore = rootStore;
    this.id = programJSON.id;
    this.name = programJSON.name;
    this.frequencies = programJSON.frequencies;
    this.periodDateRanges = programJSON.periodDateRanges;
  }

  _createClass(Program, [{
    key: "periods",
    value: function periods(frequency) {
      return frequency in this.periodDateRanges ? this.periodDateRanges[frequency] : false;
    }
  }, {
    key: "periodCount",
    value: function periodCount(frequency) {
      return this.periods(frequency) ? this.periods(frequency).length : 0;
    }
  }, {
    key: "currentPeriod",
    value: function currentPeriod(frequency) {
      var periods = this.periods(frequency);

      if (!periods) {
        return null;
      } else if (frequency == 7) {
        return periods.filter(function (period) {
          return !period[4];
        }).length - 1;
      } else {
        return periods.filter(function (period) {
          return !period[2];
        }).length - 1;
      }
    }
  }, {
    key: "loadData",
    value: function loadData(data) {
      var _this4 = this;

      if (!(data.programId == this.id)) {
        //something went wrong
        console.log("what happened?  data", data);
      }

      if (this.levels === null) {
        this.levels = {};
      }

      data.levels.forEach(function (levelJSON) {
        if (_this4.levels[levelJSON.id] == undefined) {
          _this4.levels[levelJSON.id] = new Level(_this4, levelJSON);
        }
      });

      if (this.indicators === null) {
        this.indicators = {};
      }

      data.indicators.forEach(function (indicatorJSON) {
        if (_this4.indicators[indicatorJSON.id] == undefined) {
          _this4.indicators[indicatorJSON.id] = new Indicator(_this4);
        }

        _this4.indicators[indicatorJSON.id].loadData(indicatorJSON);
      });

      if (data.resultChainFilter) {
        this.resultChainFilter = data.resultChainFilter;
      }

      this.reportsLoaded[data.reportType].push(String(data.reportFrequency));
    }
  }, {
    key: "levelsChain",
    get: function get() {
      if (!this.levels || this.levels.length == 0) {
        return false;
      }

      return Object.values(this.levels).sort(function (levelA, levelB) {
        return levelA.ontology < levelB.ontology ? -1 : 1;
      });
    }
  }, {
    key: "levelsGrouped",
    get: function get() {
      if (!this.levels || this.levels.length == 0) {
        return false;
      }

      function groupCompare(a, b) {
        if (a.depth < b.depth) {
          return -1;
        } else if (a.depth > b.depth) {
          return 1;
        } else if (a.ontology < b.ontology) {
          return -1;
        } else if (b.ontology < a.ontology) {
          return 1;
        }

        return 0;
      }

      return Object.values(this.levels).sort(groupCompare);
    }
  }, {
    key: "thisReportNotLoaded",
    get: function get() {
      return this.rootStore.isTVA && this.reportsLoaded.tva.indexOf(String(this.rootStore.selectedFrequencyId)) == -1 || !this.rootStore.isTVA && this.reportsLoaded.timeperiods.indexOf(String(this.rootStore.selectedFrequencyId)) == -1;
    }
  }, {
    key: "allIndicators",
    get: function get() {
      if (!this.indicators || this.indicators.length == 0) {
        return false;
      } else {
        return Object.values(this.indicators).sort(function (a, b) {
          return a.sortIndex - b.sortIndex;
        });
      }
    }
  }, {
    key: "filteredIndicators",
    get: function get() {
      var indicators = this.allIndicators;

      if (!indicators) {
        return false;
      }

      indicators = this.rootStore.filterOnTiers(indicators);
      indicators = this.rootStore.filterOnLevelChains(indicators);
      indicators = this.rootStore.filterOnSites(indicators);
      indicators = this.rootStore.filterOnTypes(indicators);
      indicators = this.rootStore.filterOnSectors(indicators);
      indicators = this.rootStore.filterOnIndicatorIds(indicators);
      return indicators;
    }
  }, {
    key: "reportLevelTiers",
    get: function get() {
      if (!this.levelsChain) {
        return [];
      }

      return _toConsumableArray(new Set(this.levelsChain.filter(function (level) {
        return level.allIndicators && level.allIndicators.length > 0;
      }).map(function (level) {
        return {
          label: level.tier,
          value: level.tierPk,
          sortIndex: level.depth,
          filterType: 'tier'
        };
      }).map(JSON.stringify))).map(JSON.parse);
    }
  }, {
    key: "reportLevelChains",
    get: function get() {
      var _this5 = this;

      if (!this.levelsChain) {
        return [];
      }

      var level2s = this.levelsChain.filter(function (level) {
        return level.depth == _this5.rootStore.levelFilterDepth;
      });
      var indicatorCounts = {};
      level2s.forEach(function (level2) {
        return indicatorCounts[level2.id] = level2.allIndicators.length;
      });
      this.levelsChain.filter(function (level) {
        return level.level2parent;
      }).forEach(function (level) {
        return indicatorCounts[level.level2parent] += level.allIndicators.length;
      });
      level2s = level2s.filter(function (level2) {
        return indicatorCounts[level2.id];
      });
      return _toConsumableArray(new Set(level2s.map(function (level) {
        return {
          label: level.optionName,
          value: level.id,
          sortIndex: level.sort,
          filterType: 'level'
        };
      }).map(JSON.stringify))).map(JSON.parse);
    }
  }, {
    key: "reportSites",
    get: function get() {
      var indicators = this.allIndicators;

      if (!indicators || indicators.length == 0) {
        return [];
      }

      var sites = indicators.map(function (indicator) {
        return indicator.sites;
      }).reduce(function (pre, cur) {
        return pre.concat(cur);
      }).map(function (elem) {
        return {
          value: elem.pk,
          label: elem.name
        };
      });
      return _toConsumableArray(new Set(sites.map(JSON.stringify))).map(JSON.parse);
    }
  }, {
    key: "reportTypes",
    get: function get() {
      var indicators = this.allIndicators;

      if (!indicators || indicators.length == 0) {
        return [];
      }

      return _toConsumableArray(new Set(indicators.map(function (indicator) {
        return indicator.types;
      }).reduce(function (pre, cur) {
        return pre.concat(cur);
      }).map(function (elem) {
        return {
          value: elem.pk,
          label: elem.name
        };
      }).map(JSON.stringify))).map(JSON.parse);
    }
  }, {
    key: "reportSectors",
    get: function get() {
      var indicators = this.allIndicators;

      if (!indicators || indicators.length == 0) {
        return [];
      }

      return _toConsumableArray(new Set(indicators.map(function (indicator) {
        return JSON.stringify({
          value: indicator.sector.pk,
          label: indicator.sector.name
        });
      }))).map(JSON.parse);
    }
  }, {
    key: "reportIndicatorsOptions",
    get: function get() {
      var levels = this.rootStore.levelGrouping ? this.levelsGrouped : this.levelsChain;

      if (!levels || levels.length == 0) {
        return [];
      }

      var indicators = levels.map(function (level) {
        return {
          label: level.tier + ' ' + level.displayOntology,
          options: level.allIndicators.map(function (indicator) {
            return {
              value: indicator.pk,
              label: indicator.name
            };
          })
        };
      });
      return indicators;
    }
  }]);

  return Program;
}(), _temp2), (_descriptor4 = _applyDecoratedDescriptor(_class4.prototype, "indicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class4.prototype, "levels", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class4.prototype, "resultChainFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 'loading';
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class4.prototype, "reportsLoaded", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {
      tva: [],
      timeperiods: []
    };
  }
}), _applyDecoratedDescriptor(_class4.prototype, "loadData", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class4.prototype, "loadData"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "levelsChain", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class4.prototype, "levelsChain"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "levelsGrouped", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class4.prototype, "levelsGrouped"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "thisReportNotLoaded", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class4.prototype, "thisReportNotLoaded"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "allIndicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class4.prototype, "allIndicators"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "filteredIndicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class4.prototype, "filteredIndicators"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "reportLevelTiers", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class4.prototype, "reportLevelTiers"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "reportLevelChains", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class4.prototype, "reportLevelChains"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "reportSites", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class4.prototype, "reportSites"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "reportTypes", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class4.prototype, "reportTypes"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "reportSectors", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class4.prototype, "reportSectors"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "reportIndicatorsOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class4.prototype, "reportIndicatorsOptions"), _class4.prototype)), _class4);

var ProgramStore =
/*#__PURE__*/
function () {
  function ProgramStore(rootStore, programsJSON) {
    var _this6 = this;

    _classCallCheck(this, ProgramStore);

    this.rootStore = rootStore;
    this.programs = {};
    programsJSON.forEach(function (programJSON) {
      _this6.programs[programJSON.id] = new Program(_this6.rootStore, programJSON);
    });
  }

  _createClass(ProgramStore, [{
    key: "getProgram",
    value: function getProgram(id) {
      return this.programs[id];
    }
  }]);

  return ProgramStore;
}();

var RootStore = (_class6 = (_temp3 =
/*#__PURE__*/
function () {
  function RootStore(contextData, reportAPI) {
    var _this7 = this,
        _this$_periodLabels;

    _classCallCheck(this, RootStore);

    _initializerDefineProperty(this, "selectedProgram", _descriptor8, this);

    _initializerDefineProperty(this, "selectedFrequencyId", _descriptor9, this);

    _initializerDefineProperty(this, "startPeriod", _descriptor10, this);

    _initializerDefineProperty(this, "endPeriod", _descriptor11, this);

    _initializerDefineProperty(this, "nullRecent", _descriptor12, this);

    _initializerDefineProperty(this, "levelGrouping", _descriptor13, this);

    _initializerDefineProperty(this, "levelFilters", _descriptor14, this);

    _initializerDefineProperty(this, "tierFilters", _descriptor15, this);

    _initializerDefineProperty(this, "siteFilters", _descriptor16, this);

    _initializerDefineProperty(this, "typeFilters", _descriptor17, this);

    _initializerDefineProperty(this, "sectorFilters", _descriptor18, this);

    _initializerDefineProperty(this, "indicatorFilters", _descriptor19, this);

    _initializerDefineProperty(this, "noIndicatorsForFrequency", _descriptor20, this);

    _initializerDefineProperty(this, "loading", _descriptor21, this);

    _initializerDefineProperty(this, "initialized", _descriptor22, this);

    this.reportType = null;
    this.router = null;
    this.currentPeriod = null;
    this.headerCols = 8;
    this.lopCols = 3;
    this.levelFilterDepth = 2;

    this.init = function (router) {
      _this7.router = router;
      _this7.loading = true;
      var params = router.getState().params;
      var reload = false;

      _this7.setProgramId(params.programId);

      _this7.setReportType(params.reportType);

      if (params.timeperiods || params.targetperiods) {
        params.frequency = params.timeperiods || params.targetperiods;
        delete params['timeperiods'];
        delete params['targetperiods'];
        reload = true;
      }

      _this7.setFrequencyId(params.frequency);

      if (params.timeframe == 1) {
        params.start = 0;
        params.end = _this7.selectedProgram.periodDateRanges[params.frequency].length - 1;
        delete params['timeframe'];
        reload = true;
      } else if (params.timeframe == 2) {
        var numrecent = params.numrecentperiods || 2;
        params.end = _this7.selectedProgram.currentPeriod(params.frequency);
        params.start = params.end - numrecent + 1;
        delete params['timeframe'];
        delete params['numrecentperiods'];
        reload = true;
      } else if (params.start === undefined || params.end === undefined) {
        params.start = 0;
        params.end = _this7.selectedProgram.periodDateRanges[params.frequency].length - 1;
        delete params['timeframe'];
        delete params['numrecentperiods'];
        delete params['start_period'];
        delete params['end_period'];
        reload = true;
      }

      _this7.setStartPeriod(params.start);

      _this7.setEndPeriod(params.end);

      if (reload) {
        router.navigate(router.getState().name, params, {
          reload: true
        });
      }

      _this7.loading = false;

      _this7.callForData();
    };

    this.updateUrl = function (param, newValue) {
      var oldParams = _this7.router.getState().params;

      if (newValue !== null && oldParams[param] != newValue) {
        var newParams = _objectSpread({}, oldParams, _defineProperty({}, param, newValue));

        _this7.router.navigate(_this7.router.getState().name, newParams, {
          replace: true
        });
      }
    };

    this.updateRoute = function (_ref5) {
      var previousRoute = _ref5.previousRoute,
          route = _ref5.route;
    } //console.log("updating route from", previousRoute, "  to ", route);
    // REPORT TYPE:
    ;

    this.callForData = function () {
      if (!_this7.loading) {
        _this7.loading = true;

        _this7.reportAPI.callForData(_this7.selectedProgram.id, _this7.selectedFrequencyId, _this7.isTVA).then(function (data) {
          _this7.selectedProgram.loadData(data);

          _this7.updateFilters();

          _this7.loading = false;
          _this7.initialized = true;
        });
      }
    };

    this.updateFilters = function () {
      var params = _this7.router.getState().params;

      if (params.frequency && _this7.isTVA && _this7.selectedProgram.frequencies.indexOf(parseInt(params.frequency)) == -1) {
        _this7.noIndicatorsForFrequency = true;

        _this7.setFrequencyId(null);
      }

      if (params.levels) {
        var levels = params.levels instanceof Array ? params.levels.map(Number) : [params.levels].map(Number);
        _this7.levelFilters = _this7.selectedProgram.reportLevelChains.filter(function (levelOption) {
          return levels.indexOf(levelOption.value) != -1;
        });

        _this7.updateUrl('levels', _this7.levelFilters.map(function (levelOption) {
          return levelOption.value;
        }));

        if (params.tiers) {
          _this7.updateUrl('params', []);
        }
      }

      if (params.tiers) {
        var tiers = params.tiers instanceof Array ? params.tiers.map(Number) : [params.tiers].map(Number);
        _this7.tierFilters = _this7.selectedProgram.reportLevelTiers.filter(function (tierOption) {
          return tiers.indexOf(tierOption.value) != -1;
        });

        _this7.updateUrl('tiers', _this7.tierFilters.map(function (tierOption) {
          return tierOption.value;
        }));
      }

      if (params.sites) {
        var sites = params.sites instanceof Array ? params.sites.map(Number) : [params.sites].map(Number);
        _this7.siteFilters = _this7.selectedProgram.reportSites.filter(function (siteOption) {
          return sites.indexOf(siteOption.value) != -1;
        });

        _this7.updateUrl('sites', _this7.siteFilters.map(function (siteOption) {
          return siteOption.value;
        }));
      }

      if (params.types) {
        var theseTypes = params.types instanceof Array ? params.types.map(Number) : [params.types].map(Number);
        _this7.typeFilters = _this7.selectedProgram.reportTypes.filter(function (typeOption) {
          return theseTypes.indexOf(typeOption.value) != -1;
        });

        _this7.updateUrl('types', _this7.typeFilters.map(function (typeOption) {
          return typeOption.value;
        }));
      }

      if (params.sectors) {
        var sectors = params.sectors instanceof Array ? params.sectors.map(Number) : [params.sectors].map(Number);
        _this7.sectorFilters = _this7.selectedProgram.reportSectors.filter(function (sectorOption) {
          return sectors.indexOf(sectorOption.value) != -1;
        });

        _this7.updateUrl('sectors', _this7.sectorFilters.map(function (sectorOption) {
          return sectorOption.value;
        }));
      }

      if (params.indicators) {
        var indicators = params.indicators instanceof Array ? params.indicators.map(Number) : [params.indicators].map(Number);
        _this7.indicatorFilters = _this7.selectedProgram.reportIndicatorsOptions.filter(function (indicatorOption) {
          return indicators.indexOf(indicatorOption.value) != -1;
        });

        _this7.updateUrl('indicators', _this7.indicatorFilters.map(function (indicatorOption) {
          return indicatorOption.value;
        }));
      }
    };

    this.getPeriodLabel = function (period, index) {
      if (_this7.selectedFrequencyId == 7) {
        var _period = _slicedToArray(period, 4),
            monthLabel = _period[2],
            year = _period[3];

        return {
          title: monthLabel + ' ' + year,
          subtitle: ''
        };
      } else if (_this7.selectedFrequencyId == 2) {
        return {
          title: period[2].toUpperCase(),
          subtitle: ''
        };
      } else {
        var _period2 = _slicedToArray(period, 2),
            startLabel = _period2[0],
            endLabel = _period2[1];

        return {
          title: _this7._periodLabels.names[_this7.selectedFrequencyId] + " " + (index + 1),
          subtitle: startLabel + ' - ' + endLabel
        };
      }
    };

    this.setShowAll = function () {
      _this7.setStartPeriod(0);

      _this7.setEndPeriod(_this7.selectedProgram.periodCount(_this7.selectedFrequencyId) - 1);
    };

    this.setMostRecent = function (numrecent) {
      if (numrecent === '') {
        _this7.nullRecent = true;
      } else if (numrecent !== null) {
        var startPeriod = Math.max(_this7.currentPeriod - numrecent + 1, 0);

        _this7.setEndPeriod(_this7.currentPeriod);

        _this7.setStartPeriod(startPeriod);
      }
    };

    this.setLevelFilters = function (selected) {
      _this7.levelFilters = selected;
      _this7.tierFilters = [];

      _this7.updateUrl('levels', selected.map(function (item) {
        return item.value;
      }));

      _this7.updateUrl('tiers', []);
    };

    this.setTierFilters = function (selected) {
      _this7.levelFilters = [];
      _this7.tierFilters = selected;

      _this7.updateUrl('tiers', selected.map(function (item) {
        return item.value;
      }));

      _this7.updateUrl('levels', []);
    };

    this.setSiteFilters = function (selected) {
      _this7.siteFilters = selected;

      _this7.updateUrl('sites', selected.map(function (item) {
        return item.value;
      }));
    };

    this.setTypeFilters = function (selected) {
      _this7.typeFilters = selected;

      _this7.updateUrl('types', selected.map(function (item) {
        return item.value;
      }));
    };

    this.setSectorFilters = function (selected) {
      _this7.sectorFilters = selected;

      _this7.updateUrl('sectors', selected.map(function (item) {
        return item.value;
      }));
    };

    this.setIndicatorFilters = function (selected) {
      _this7.indicatorFilters = selected;

      _this7.updateUrl('indicators', selected.map(function (item) {
        return item.value;
      }));
    };

    this.clearFilters = function () {
      _this7.levelFilters = _this7.siteFilters = _this7.typeFilters = _this7.sectorFilters = _this7.tierFilters = _this7.indicatorFilters = [];

      _this7.updateUrl('levels', []);

      _this7.updateUrl('tiers', []);

      _this7.updateUrl('sites', []);

      _this7.updateUrl('types', []);

      _this7.updateUrl('sectors', []);

      _this7.updateUrl('indicators', []);
    };

    this.programStore = new ProgramStore(this, contextData.programs);
    this.reportAPI = reportAPI;
    this._periodLabels = (_this$_periodLabels = {}, _defineProperty(_this$_periodLabels, TIMEPERIODS, contextData.labels.timeperiods), _defineProperty(_this$_periodLabels, TVA, contextData.labels.targetperiods), _defineProperty(_this$_periodLabels, "names", contextData.labels.periodNames), _this$_periodLabels);
  }

  _createClass(RootStore, [{
    key: "setReportType",
    value: function setReportType(reportType) {
      if (reportType == 'timeperiods') {
        this.reportType = TIMEPERIODS;
      } else {
        this.reportType = TVA;
      }
    }
  }, {
    key: "filterOnTiers",
    value: function filterOnTiers(indicators) {
      if (this.tierFilters && this.tierFilters.length > 0) {
        var tierDepths = this.tierFilters.map(function (tierOption) {
          return tierOption.sortIndex;
        });
        indicators = indicators.filter(function (indicator) {
          return tierDepths.indexOf(indicator.tierDepth) != -1;
        });
      }

      return indicators;
    }
  }, {
    key: "filterOnLevelChains",
    value: function filterOnLevelChains(indicators) {
      if (this.levelFilters && this.levelFilters.length > 0) {
        var level2Pks = this.levelFilters.map(function (levelOption) {
          return levelOption.value;
        });
        var levelIds = this.selectedProgram.levelsGrouped.filter(function (level) {
          return level2Pks.indexOf(level.level2parent) != -1;
        }).map(function (level) {
          return level.id;
        });
        indicators = indicators.filter(function (indicator) {
          return levelIds.indexOf(indicator.levelId) != -1;
        });
      }

      return indicators;
    }
  }, {
    key: "filterOnTypes",
    value: function filterOnTypes(indicators) {
      if (this.typeFilters && this.typeFilters.length > 0) {
        var typePks = this.typeFilters.map(function (typeOption) {
          return typeOption.value;
        });
        indicators = indicators.filter(function (indicator) {
          return indicator.types.map(function (iType) {
            return iType.pk;
          }).filter(function (pk) {
            return typePks.includes(pk);
          }).length > 0;
        });
      }

      return indicators;
    }
  }, {
    key: "filterOnSectors",
    value: function filterOnSectors(indicators) {
      var _this8 = this;

      if (this.sectorFilters && this.sectorFilters.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return _this8.sectorFilters.map(function (sectorOption) {
            return sectorOption.value;
          }).indexOf(indicator.sector.pk) != -1;
        });
      }

      return indicators;
    }
  }, {
    key: "filterOnSites",
    value: function filterOnSites(indicators) {
      if (this.siteFilters && this.siteFilters.length > 0) {
        var sitePks = this.siteFilters.map(function (siteOption) {
          return siteOption.value;
        });
        indicators = indicators.filter(function (indicator) {
          return indicator.sites.map(function (site) {
            return site.pk;
          }).filter(function (pk) {
            return sitePks.includes(pk);
          }).length > 0;
        });
      }

      return indicators;
    }
  }, {
    key: "filterOnIndicatorIds",
    value: function filterOnIndicatorIds(indicators) {
      var _this9 = this;

      if (this.indicatorFilters && this.indicatorFilters.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return _this9.indicatorFilters.map(function (indicatorOption) {
            return indicatorOption.value;
          }).indexOf(indicator.pk) != -1;
        });
      }

      return indicators;
    }
  }, {
    key: "setProgramId",
    // FILTER SECTION:
    //SELECTING PROGRAMS:
    value: function setProgramId(id) {
      if (id === null) {
        this.selectedProgram = null;
      } else if (this.selectedProgram == null || this.selectedProgram.id != id) {
        this.noIndicatorsForFrequency = false;
        this.updateUrl('programId', id);
        this.selectedProgram = this.programStore.getProgram(id);

        if (this.isTVA && this.selectedFrequencyId && this.selectedProgram.frequencies.indexOf(parseInt(this.selectedFrequencyId)) == -1) {
          this.noIndicatorsForFrequency = true;
          this.setFrequencyId(null);
        } else if (this.selectedFrequencyId !== null) {
          this.setFrequencyId(this.selectedFrequencyId);
          this.updatePeriods();
        }
      }
    }
  }, {
    key: "setFrequencyId",
    //SELECTING FREQUENCY:
    value: function setFrequencyId(id) {
      if (id === null) {
        this.selectedFrequencyId = null;
      } else if (this.selectedFrequencyId != id) {
        this.selectedFrequencyId = id;
        this.updateUrl('frequency', id);

        if (this.isTVA && this.selectedFrequencyId && this.selectedProgram.frequencies.indexOf(parseInt(this.selectedFrequencyId)) != -1) {
          this.noIndicatorsForFrequency = false;
        } // refresh periods to make sure they're in range:


        this.updatePeriods();
        this.updateCurrentPeriod(); // call for data if not loaded:

        if (this.selectedProgram.thisReportNotLoaded) {
          this.callForData();
        }
      }
    }
  }, {
    key: "updateCurrentPeriod",
    value: function updateCurrentPeriod() {
      this.currentPeriod = this.selectedProgram.currentPeriod(this.selectedFrequencyId);
    }
  }, {
    key: "updatePeriods",
    value: function updatePeriods() {
      if (this.selectedFrequencyId == 2) {
        this.setStartPeriod(0);
        this.setEndPeriod(1);
      } else {
        if (this.startPeriod != '') {
          this.setStartPeriod(this.startPeriod);
        }

        if (this.endPeriod != '') {
          this.setEndPeriod(this.endPeriod);
        }
      }
    }
  }, {
    key: "setStartPeriod",
    //PERIODS:
    value: function setStartPeriod(period) {
      //use '' for null values as React does badly with null value for select
      if (this.selectedFrequencyId == 2) {
        this.startPeriod = 0;
        this.updateUrl('start', this.startPeriod);
      } else if (this.selectedFrequencyId && this.selectedProgram) {
        period = period !== null ? period < this.selectedProgram.periodCount(this.selectedFrequencyId) ? period : 0 : '';
        this.startPeriod = period;
        this.updateUrl('start', this.startPeriod);
      }
    }
  }, {
    key: "setEndPeriod",
    value: function setEndPeriod(period) {
      if (this.selectedFrequencyId == 2) {
        this.endPeriod = 1;
        this.updateUrl('end', this.endPeriod);
      } else if (this.selectedFrequencyId && this.selectedProgram) {
        this.nullRecent = false;
        period = period !== null ? period < this.selectedProgram.periodCount(this.selectedFrequencyId) ? period : this.selectedProgram.periodCount(this.selectedFrequencyId) - 1 : '';
        this.endPeriod = period;
        this.updateUrl('end', this.endPeriod);
      }
    }
  }, {
    key: "pinData",
    get: function get() {
      if (!this.selectedProgram) {
        return false;
      }

      var queryString = window.location.search;
      queryString = queryString && queryString.length > 0 && queryString[0] == '?' ? queryString.slice(1) : queryString;
      return !this.selectedProgram ? false : {
        program: this.selectedProgram.id,
        report_type: this.router.getState().params.reportType,
        query_string: queryString
      };
    }
  }, {
    key: "programPageUrl",
    get: function get() {
      return this.selectedProgram ? '/program/' + this.selectedProgram.id + '/' : false;
    }
  }, {
    key: "currentExcelURL",
    get: function get() {
      var params = this.router.getState().params;
      var url = '/indicators/iptt_excel/' + window.location.search;
      url += '&programId=' + this.selectedProgram.id;
      url += '&reportType=' + (this.isTVA ? 'tva' : 'timeperiods');
      return url;
    }
  }, {
    key: "allExcelURL",
    get: function get() {
      var params = this.router.getState().params;
      var url = '/indicators/iptt_excel/?frequency=all';
      url += '&programId=' + this.selectedProgram.id;
      url += '&reportType=' + (this.isTVA ? 'tva' : 'timeperiods');
      return url;
    }
  }, {
    key: "isTVA",
    get: function get() {
      return this.reportType === TVA;
    }
  }, {
    key: "report",
    get: function get() {
      var levels;

      if (this.selectedProgram === null || !this.selectedFrequencyId) {
        return [];
      } else if (this.levelGrouping) {
        levels = this.selectedProgram.levelsGrouped;
      } else {
        levels = this.selectedProgram.levelsChain;
      }

      if (levels) {
        return levels;
      } else {
        this.callForData();
        return false;
      }
    }
  }, {
    key: "selectedProgramOption",
    get: function get() {
      if (this.selectedProgram === null) {
        return {
          value: null,
          label: BLANK_LABEL
        };
      }

      return {
        value: this.selectedProgram.id,
        label: this.selectedProgram.name
      };
    }
  }, {
    key: "programOptions",
    get: function get() {
      // all available options for Programs dropdown:
      return Object.entries(this.programStore.programs).map(function (_ref6) {
        var _ref7 = _slicedToArray(_ref6, 2),
            id = _ref7[0],
            program = _ref7[1];

        return {
          value: id,
          label: program.name
        };
      });
    }
  }, {
    key: "selectedFrequencyOption",
    get: function get() {
      if (this.selectedProgram === null || this.selectedFrequencyId === null) {
        return {
          value: null,
          label: BLANK_LABEL
        };
      }

      return {
        value: this.selectedFrequencyId,
        label: this._periodLabels[this.reportType][this.selectedFrequencyId]
      };
    }
  }, {
    key: "frequencyOptions",
    get: function get() {
      var _this10 = this;

      if (this.selectedProgram === null) {
        return [{
          value: null,
          label: BLANK_LABEL
        }];
      } else if (this.reportType == TIMEPERIODS) {
        return Object.entries(this._periodLabels[TIMEPERIODS]).map(function (_ref8) {
          var _ref9 = _slicedToArray(_ref8, 2),
              id = _ref9[0],
              label = _ref9[1];

          return {
            value: id,
            label: label
          };
        });
      } else {
        return this.selectedProgram.frequencies.map(function (id) {
          return {
            value: id,
            label: _this10._periodLabels[TVA][id]
          };
        });
      }
    }
  }, {
    key: "startPeriodLabel",
    get: function get() {
      if (this.selectedProgram && this.selectedFrequencyId && this.startPeriod !== null && this.startPeriod !== '' && this.startPeriod <= this.selectedProgram.periodCount(this.selectedFrequencyId)) {
        return this.selectedProgram.periods(this.selectedFrequencyId)[this.startPeriod][0];
      }

      return '';
    }
  }, {
    key: "endPeriodLabel",
    get: function get() {
      if (this.selectedProgram && this.selectedFrequencyId && this.endPeriod !== null && this.endPeriod !== '' && this.endPeriod < this.selectedProgram.periodCount(this.selectedFrequencyId)) {
        return this.selectedProgram.periods(this.selectedFrequencyId)[this.endPeriod][1];
      }

      return '';
    }
  }, {
    key: "selectedPeriods",
    get: function get() {
      if (!this.selectedProgram || !this.selectedFrequencyId || this.selectedFrequencyId === 1 || this.startPeriod === null || this.endPeriod === null) {
        return [];
      }

      return this.selectedProgram.periods(this.selectedFrequencyId).slice(this.startPeriod, parseInt(this.endPeriod) + 1);
    }
  }, {
    key: "periodOptions",
    get: function get() {
      var _this11 = this;

      if (this.selectedProgram === null || this.selectedFrequencyId === null) {
        return [{
          value: null,
          label: BLANK_LABEL
        }];
      } else if (this.selectedFrequencyId == 7) {
        var years = {};
        this.selectedProgram.periodDateRanges[7].forEach(function (period, index) {
          var label = _this11.getPeriodLabel(period, index);

          var year = period[3];

          if (!(year in years)) {
            years[year] = [];
          }

          years[year].push({
            value: index,
            label: label.title
          });
        });
        return years;
      } else if (this.selectedFrequencyId == 2 || this.selectedFrequencyId == 1) {
        return this.selectedProgram.periods(this.selectedFrequencyId).map(function (labels, index) {
          return {
            value: index,
            label: labels[index]
          };
        });
      }

      return this.selectedProgram.periods(this.selectedFrequencyId).map(function (labels, index) {
        var label = _this11.getPeriodLabel(labels, index);

        return {
          value: index,
          label: label.title + ' ' + '(' + label.subtitle + ')'
        };
      });
    }
  }, {
    key: "timeframeEnabled",
    get: function get() {
      //showAll and Most Recent don't make sense for non time-aware frequencies:
      return this.selectedProgram && this.selectedFrequencyId != 2 && this.selectedFrequencyId != 1;
    }
  }, {
    key: "showAll",
    get: function get() {
      return this.timeframeEnabled && this.startPeriod == 0 && this.endPeriod == this.selectedProgram.periodCount(this.selectedFrequencyId) - 1;
    }
  }, {
    key: "mostRecent",
    get: function get() {
      if (this.nullRecent) {
        return '';
      } else if (this.timeframeEnabled && !this.showAll && this.currentPeriod !== null && this.endPeriod == this.currentPeriod) {
        return this.endPeriod - this.startPeriod + 1;
      }

      return null;
    }
  }]);

  return RootStore;
}(), _temp3), (_descriptor8 = _applyDecoratedDescriptor(_class6.prototype, "selectedProgram", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class6.prototype, "selectedFrequencyId", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class6.prototype, "startPeriod", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class6.prototype, "endPeriod", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class6.prototype, "nullRecent", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class6.prototype, "levelGrouping", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class6.prototype, "levelFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class6.prototype, "tierFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class6.prototype, "siteFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class6.prototype, "typeFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class6.prototype, "sectorFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class6.prototype, "indicatorFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor20 = _applyDecoratedDescriptor(_class6.prototype, "noIndicatorsForFrequency", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor21 = _applyDecoratedDescriptor(_class6.prototype, "loading", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor22 = _applyDecoratedDescriptor(_class6.prototype, "initialized", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class6.prototype, "pinData", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "pinData"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "programPageUrl", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "programPageUrl"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "currentExcelURL", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "currentExcelURL"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "allExcelURL", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "allExcelURL"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "report", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "report"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "selectedProgramOption", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "selectedProgramOption"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "selectedFrequencyOption", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "selectedFrequencyOption"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "frequencyOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "frequencyOptions"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "startPeriodLabel", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "startPeriodLabel"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "endPeriodLabel", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "endPeriodLabel"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "selectedPeriods", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "selectedPeriods"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "periodOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "periodOptions"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "timeframeEnabled", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "timeframeEnabled"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "showAll", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "showAll"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "mostRecent", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class6.prototype, "mostRecent"), _class6.prototype)), _class6);

/***/ }),

/***/ "Zs+a":
/*!*************************************************************!*\
  !*** ./js/pages/iptt_report/components/headerComponents.js ***!
  \*************************************************************/
/*! exports provided: IPTTTableHead */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IPTTTableHead", function() { return IPTTTableHead; });
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




var SubheadCell = function SubheadCell(props) {
  var tdStyle = {};

  if (props.minWidth) {
    tdStyle.minWidth = props.minWidth;
  }

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    className: "align-bottom text-uppercase " + (props.classes || ''),
    style: tdStyle
  }, props.cellText);
};

var IPTTSubheadRow = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(IPTTSubheadRow, _React$Component);

  function IPTTSubheadRow() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, IPTTSubheadRow);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(IPTTSubheadRow)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.getDateRangeHeaders = function () {
      var headers = [];
      var periods = _this.props.rootStore.selectedPeriods;

      if (!periods) {
        return headers;
      } else if (_this.props.rootStore.isTVA) {
        periods.forEach(function (period, index) {
          headers.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
            classes: "text-right",
            minWidth: "110px",
            key: index + 'a',
            cellText: _this.props.labels.columnHeaders.target
          }));
          headers.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
            classes: "text-right",
            minWidth: "110px",
            key: index + 'b',
            cellText: _this.props.labels.columnHeaders.actual
          }));
          headers.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
            classes: "text-right",
            minWidth: "110px",
            key: index + 'c',
            cellText: _this.props.labels.columnHeaders.met
          }));
        });
      } else {
        periods.forEach(function (period, index) {
          headers.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
            classes: "text-right",
            key: index,
            cellText: _this.props.labels.columnHeaders.actual
          }));
        });
      }

      return headers;
    };

    return _this;
  }

  _createClass(IPTTSubheadRow, [{
    key: "render",
    value: function render() {
      var colLabels = this.props.labels.columnHeaders;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
        minWidth: "80px",
        cellText: colLabels.number
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
        minWidth: "600px",
        classes: "td-no-side-borders",
        cellText: colLabels.indicator
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
        classes: "td-no-side-borders"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
        minWidth: "250px",
        cellText: colLabels.uom
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
        cellText: colLabels.change
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
        minWidth: "130px",
        cellText: colLabels.cumulative
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
        minWidth: "50px",
        cellText: colLabels.numType
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
        cellText: colLabels.baseline
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
        minWidth: "110px",
        classes: "text-right td-no-side-borders",
        cellText: colLabels.target
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
        minWidth: "110px",
        classes: "text-right td-no-side-borders",
        cellText: colLabels.actual
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SubheadCell, {
        minWidth: "110px",
        classes: "text-right td-no-side-borders",
        cellText: colLabels.met
      }), this.getDateRangeHeaders());
    }
  }]);

  return IPTTSubheadRow;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);
var IPTTTableHead = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var labels = _ref.labels,
      rootStore = _ref.rootStore;

  var getDateHeaders = function getDateHeaders() {
    return !rootStore.selectedPeriods ? [] : rootStore.selectedPeriods.map(function (period, count) {
      var label = rootStore.getPeriodLabel(period, count);
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
        scope: "col",
        colSpan: rootStore.isTVA ? '3' : '1',
        className: "text-center lopCols text-nowrap align-bottom" + (rootStore.selectedFrequencyId == 7 ? " text-uppercase" : ""),
        key: count + parseInt(rootStore.startPeriod)
      }, label.title, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, label.subtitle));
    });
  };

  var periodsLength = rootStore.selectedPeriods.length * (rootStore.isTva ? 3 : 1);
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("colgroup", {
    scope: "col",
    span: rootStore.headerCols
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("colgroup", {
    scope: "col",
    span: rootStore.lopCols,
    className: "lopCols"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("colgroup", {
    scope: "col",
    span: periodsLength
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", {
    className: "thead-light"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    colSpan: rootStore.headerCols,
    id: "id_td_iptt_program_name",
    className: "lopCols align-bottom pt-2"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", {
    className: "m-0"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, rootStore.selectedProgram.name))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    scope: "colgroup",
    colSpan: rootStore.lopCols,
    className: "text-center align-bottom text-uppercase"
  }, labels.columnHeaders.lop), getDateHeaders()), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSubheadRow, null)));
}));

/***/ }),

/***/ "mYfJ":
/*!***************************************!*\
  !*** ./js/pages/iptt_report/index.js ***!
  \***************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var router5__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! router5 */ "wgi2");
/* harmony import */ var router5_plugin_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! router5-plugin-browser */ "0pHI");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./models */ "MH3R");
/* harmony import */ var _components_main__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/main */ "2et8");
/* harmony import */ var _fixtures__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./fixtures */ "CrpI");
/**
 * entry point for the iptt_report webpack bundle
 */






 //testing:


var labels = jsContext.labels;
var reportAPI = new _models__WEBPACK_IMPORTED_MODULE_5__["ReportAPI"]('/indicators/iptt_report_data/');
var rootStore = new _models__WEBPACK_IMPORTED_MODULE_5__["RootStore"](jsContext, reportAPI);
var routes = [{
  name: 'iptt',
  path: '/:programId<\\d+>/:reportType/?frequency&timeperiods&targetperiods&timeframe&numrecenteperiods&start&end&start_period&end_period&levels&sites&types&sectors&indicators&tiers'
}];
var router = Object(router5__WEBPACK_IMPORTED_MODULE_2__["default"])(routes);
router.usePlugin(Object(router5_plugin_browser__WEBPACK_IMPORTED_MODULE_3__["default"])({
  useHash: false,
  base: '/indicators/iptt_report'
}));
router.subscribe(rootStore.updateRoute);
router.start();
rootStore.init(router);
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(mobx_react__WEBPACK_IMPORTED_MODULE_4__["Provider"], {
  rootStore: rootStore,
  labels: labels
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_main__WEBPACK_IMPORTED_MODULE_6__["IPTTReportApp"], null)), document.querySelector('#id_div_content'));

/***/ }),

/***/ "qaCi":
/*!****************************************************!*\
  !*** ./js/pages/iptt_report/components/buttons.js ***!
  \****************************************************/
/*! exports provided: PinButton, ExcelButton, ClearButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PinButton", function() { return PinButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExcelButton", function() { return ExcelButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClearButton", function() { return ClearButton; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_simple_popover__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-simple-popover */ "MWn0");
/* harmony import */ var react_simple_popover__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_simple_popover__WEBPACK_IMPORTED_MODULE_2__);
var _dec, _class, _temp, _dec2, _class3, _dec3, _class4, _temp2, _dec4, _class6, _temp3;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var PinPopover = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(PinPopover, _React$Component);

  function PinPopover(props) {
    var _this;

    _classCallCheck(this, PinPopover);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PinPopover).call(this, props));

    _this.handleChange = function (e) {
      _this.setState({
        reportName: e.target.value
      });
    };

    _this.isDisabled = function () {
      return !_this.props.rootStore.pinData || !_this.state.reportName;
    };

    _this.handleClick = function () {
      //send this.props.rootStore.pinUrl as data to this.props.labels.pin.creatUrl
      //with data "name" as this.state.reportName
      _this.setState({
        sending: true
      });

      $.ajax({
        type: "POST",
        url: _this.props.labels.pin.createUrl,
        data: _objectSpread({
          name: _this.state.reportName
        }, _this.props.rootStore.pinData),
        success: function success() {
          _this.setState({
            sending: false,
            sent: true
          });
        },
        error: function error() {
          console.log("AJAX ERROR");
        }
      });
    };

    _this.state = {
      reportName: '',
      sending: false,
      sent: false
    };
    return _this;
  }

  _createClass(PinPopover, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, this.state.sent ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, this.props.labels.pin.successMsg)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: this.props.rootStore.programPageUrl
      }, this.props.labels.pin.successLink))) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "text-uppercase"
      }, this.props.labels.pin.reportName), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        className: "form-control",
        value: this.state.reportName,
        onChange: this.handleChange,
        disabled: this.state.sending
      })), this.state.sending ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "btn btn-outline-primary",
        disabled: true
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        src: "/static/img/ajax-loader.gif"
      }), "\xA0", this.props.labels.loading) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        onClick: this.handleClick,
        disabled: this.isDisabled(),
        className: "btn btn-primary"
      }, this.props.labels.pin.submitButton)));
    }
  }]);

  return PinPopover;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class);
var PinButton = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels'), _dec2(_class3 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(PinButton, _React$Component2);

  function PinButton(props) {
    var _this2;

    _classCallCheck(this, PinButton);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(PinButton).call(this, props));
    _this2.state = {
      open: false
    };
    return _this2;
  }

  _createClass(PinButton, [{
    key: "handleClick",
    value: function handleClick(e) {
      this.setState({
        open: !this.state.open
      });
    }
  }, {
    key: "handleClose",
    value: function handleClose(e) {
      this.setState({
        open: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "btn btn-sm btn-secondary",
        ref: "target",
        onClick: this.handleClick.bind(this)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-thumbtack"
      }), " ", this.props.labels.pin.buttonLabel), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_simple_popover__WEBPACK_IMPORTED_MODULE_2___default.a, {
        placement: "bottom",
        style: {
          width: 'auto'
        },
        target: this.refs.target,
        show: this.state.open,
        onHide: this.handleClose.bind(this)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PinPopover, null)));
    }
  }]);

  return PinButton;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class3);
var ExcelPopover = (_dec3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec3(_class4 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class4 = (_temp2 =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(ExcelPopover, _React$Component3);

  function ExcelPopover() {
    var _getPrototypeOf2;

    var _this3;

    _classCallCheck(this, ExcelPopover);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this3 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ExcelPopover)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this3.getCurrent = function () {
      if (_this3.props.rootStore.currentExcelURL) {
        window.location = _this3.props.rootStore.currentExcelURL;
      }
    };

    _this3.getAll = function () {
      if (_this3.props.rootStore.allExcelURL) {
        window.location = _this3.props.rootStore.allExcelURL;
      }
    };

    return _this3;
  }

  _createClass(ExcelPopover, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "container-fluid"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row mt-1 mb-2"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "btn btn-primary btn-block",
        onClick: this.getCurrent
      }, this.props.labels.excel.buttonCurrent)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row mt-2 mb-1"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "btn btn-primary btn-block",
        onClick: this.getAll
      }, this.props.labels.excel.buttonAll)));
    }
  }]);

  return ExcelPopover;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp2)) || _class4) || _class4);
var ExcelButton = (_dec4 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore'), _dec4(_class6 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class6 = (_temp3 =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(ExcelButton, _React$Component4);

  function ExcelButton(props) {
    var _this4;

    _classCallCheck(this, ExcelButton);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(ExcelButton).call(this, props));

    _this4.handleClick = function () {
      if (_this4.props.rootStore.isTVA) {
        _this4.setState({
          open: !_this4.state.open
        });
      } else if (_this4.props.rootStore.currentExcelURL) {
        window.location = _this4.props.rootStore.currentExcelURL;
      }
    };

    _this4.state = {
      open: false
    };
    return _this4;
  }

  _createClass(ExcelButton, [{
    key: "handleClose",
    value: function handleClose(e) {
      this.setState({
        open: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "btn btn-sm btn-secondary",
        ref: "target",
        onClick: this.handleClick.bind(this)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-download"
      }), " ", this.props.labels.excel.buttonMain), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_simple_popover__WEBPACK_IMPORTED_MODULE_2___default.a, {
        placement: "bottom",
        containerStyle: {
          paddingRight: '10px'
        },
        style: {
          width: 'auto'
        },
        target: this.refs.target,
        show: this.state.open,
        onHide: this.handleClose.bind(this)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ExcelPopover, null)));
    }
  }]);

  return ExcelButton;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp3)) || _class6) || _class6);
var ClearButton = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('labels', 'rootStore')(function (_ref) {
  var labels = _ref.labels,
      rootStore = _ref.rootStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "btn btn-primary btn-block",
    onClick: rootStore.clearFilters
  }, labels.resetButton);
});

/***/ })

},[["mYfJ","runtime","vendors"]]]);
//# sourceMappingURL=iptt_report-4b77b868af80dff1e9dc.js.map