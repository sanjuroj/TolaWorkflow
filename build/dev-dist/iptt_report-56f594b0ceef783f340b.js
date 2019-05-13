(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["iptt_report"],{

/***/ "XGqG":
/*!****************************************!*\
  !*** ./js/pages/iptt_report/router.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ipttRouter; });
/* harmony import */ var router5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! router5 */ "wgi2");
/* harmony import */ var router5_plugin_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! router5-plugin-browser */ "0pHI");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../constants */ "v38i");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _temp;

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }





var mockProgramStore = {
  validPID: true,
  validFrequencies: [1, 4, 5],
  groupByOld: false,
  validateProgramId: function validateProgramId(id) {
    if (this.validPID) {
      return Promise.resolve(parseInt(id));
    } else {
      return Promise.reject("bad ID");
    }
  },
  validateFrequency: function validateFrequency(programId, frequency, reportType) {
    var frequencies = reportType === _constants__WEBPACK_IMPORTED_MODULE_3__["TIMEPERIODS"] ? [3, 4, 5, 6, 7] : this.validFrequencies;

    if (frequencies.includes(parseInt(frequency))) {
      return parseInt(frequency);
    }

    throw "bad freq";
  },
  currentPeriod: function currentPeriod(programId, frequency) {
    return 7;
  },
  lastPeriod: function lastPeriod(programId, frequency) {
    return 8;
  },
  startPeriodFromDate: function startPeriodFromDate(programId, frequency, date) {
    if (date instanceof Date && !isNaN(date)) {
      return 3;
    }

    throw "bad date";
  },
  endPeriodFromDate: function endPeriodFromDate(programId, frequency, date) {
    if (date instanceof Date && !isNaN(date)) {
      if (date.toISOString() == new Date('2017-01-31').toISOString()) {
        return 10;
      }

      return 6;
    }

    throw "bad date";
  },
  oldLevels: function oldLevels(programId) {
    return this.groupByOld;
  }
};
var ipttRouter = (_class = (_temp =
/*#__PURE__*/
function () {
  function ipttRouter() {
    var _this = this;

    _classCallCheck(this, ipttRouter);

    _initializerDefineProperty(this, "reportType", _descriptor, this);

    _initializerDefineProperty(this, "programId", _descriptor2, this);

    _initializerDefineProperty(this, "frequency", _descriptor3, this);

    _initializerDefineProperty(this, "startPeriod", _descriptor4, this);

    _initializerDefineProperty(this, "endPeriod", _descriptor5, this);

    _initializerDefineProperty(this, "groupBy", _descriptor6, this);

    _initializerDefineProperty(this, "levels", _descriptor7, this);

    _initializerDefineProperty(this, "tiers", _descriptor8, this);

    _initializerDefineProperty(this, "sites", _descriptor9, this);

    _initializerDefineProperty(this, "types", _descriptor10, this);

    _initializerDefineProperty(this, "indicators", _descriptor11, this);

    this.init = function () {
      _this.router = Object(router5__WEBPACK_IMPORTED_MODULE_0__["default"])(_this.routes, {
        trailingSlashMode: 'always'
      });

      _this.router.setRootPath(_this.queryParams);

      _this.router.usePlugin(Object(router5_plugin_browser__WEBPACK_IMPORTED_MODULE_1__["default"])({
        useHash: false,
        base: '/indicators'
      }));

      _this.router.subscribe(_this.updateRoute);

      _this.router.start();

      var _this$router$getState = _this.router.getState(),
          currentRouteName = _this$router$getState.name,
          currentRouteParams = _this$router$getState.params;

      _this.processParams(_objectSpread({
        name: currentRouteName
      }, currentRouteParams)).then(function () {
        if (_this.router.buildPath(currentRouteName, currentRouteParams) != _this.router.buildPath(_this.routeName, _this.routeParams)) {
          _this.router.navigate(_this.routeName, _this.routeParams, {
            replace: true
          });
        }

        var navReact = Object(mobx__WEBPACK_IMPORTED_MODULE_2__["reaction"])(function () {
          return [_this.routeName, _this.routeParams];
        }, function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              name = _ref2[0],
              params = _ref2[1];

          return _this.router.navigate(name, params);
        });
      });
    };

    this.updateRoute = function (_ref3) {//this.reportType = name == 'iptt.tva' ? TVA : (name == 'iptt.timeperiods' ? TIMEPERIODS : null);
      //console.log("route name", name);
      //console.log("route params", params);
      //console.log("updating route from", previousRoute, " to ", route);
      //console.log("router state", this.router.getState());

      var previousRoute = _ref3.previousRoute,
          _ref3$route = _ref3.route,
          name = _ref3$route.name,
          params = _ref3$route.params,
          route = _objectWithoutProperties(_ref3$route, ["name", "params"]);
    };

    this.processParams = function () {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$name = _ref4.name,
          name = _ref4$name === void 0 ? null : _ref4$name,
          _ref4$programId = _ref4.programId,
          programId = _ref4$programId === void 0 ? null : _ref4$programId,
          _ref4$frequency = _ref4.frequency,
          frequency = _ref4$frequency === void 0 ? null : _ref4$frequency,
          _ref4$start = _ref4.start,
          start = _ref4$start === void 0 ? null : _ref4$start,
          _ref4$end = _ref4.end,
          end = _ref4$end === void 0 ? null : _ref4$end,
          _ref4$timeperiods = _ref4.timeperiods,
          timeperiods = _ref4$timeperiods === void 0 ? null : _ref4$timeperiods,
          _ref4$targetperiods = _ref4.targetperiods,
          targetperiods = _ref4$targetperiods === void 0 ? null : _ref4$targetperiods,
          _ref4$timeframe = _ref4.timeframe,
          timeframe = _ref4$timeframe === void 0 ? null : _ref4$timeframe,
          _ref4$numrecentperiod = _ref4.numrecentperiods,
          numrecentperiods = _ref4$numrecentperiod === void 0 ? null : _ref4$numrecentperiod,
          _ref4$start_period = _ref4.start_period,
          start_period = _ref4$start_period === void 0 ? null : _ref4$start_period,
          _ref4$end_period = _ref4.end_period,
          end_period = _ref4$end_period === void 0 ? null : _ref4$end_period,
          _ref4$groupby = _ref4.groupby,
          groupby = _ref4$groupby === void 0 ? null : _ref4$groupby,
          _ref4$levels = _ref4.levels,
          levels = _ref4$levels === void 0 ? null : _ref4$levels,
          _ref4$tiers = _ref4.tiers,
          tiers = _ref4$tiers === void 0 ? null : _ref4$tiers,
          _ref4$sites = _ref4.sites,
          sites = _ref4$sites === void 0 ? null : _ref4$sites,
          _ref4$types = _ref4.types,
          types = _ref4$types === void 0 ? null : _ref4$types,
          _ref4$indicators = _ref4.indicators,
          indicators = _ref4$indicators === void 0 ? null : _ref4$indicators;

      _this.reportType = name == 'iptt.tva' ? _constants__WEBPACK_IMPORTED_MODULE_3__["TVA"] : name == 'iptt.timeperiods' ? _constants__WEBPACK_IMPORTED_MODULE_3__["TIMEPERIODS"] : null;

      if (frequency === null && _this.reportType === _constants__WEBPACK_IMPORTED_MODULE_3__["TVA"] && targetperiods !== null) {
        frequency = targetperiods;
      } else if (frequency === null && _this.reportType === _constants__WEBPACK_IMPORTED_MODULE_3__["TIMEPERIODS"] && timeperiods !== null) {
        frequency = timeperiods;
      }

      return _this.programStore.validateProgramId(programId).then(function (programId) {
        _this.programId = programId;
        _this.frequency = _this.programStore.validateFrequency(programId, frequency, _this.reportType);

        if (start === null && _this.frequency != 1 && _this.frequency != 2) {
          start = _this.getStartPeriod(timeframe, numrecentperiods, start_period);
        }

        _this.startPeriod = start;

        if (end === null && _this.frequency != 1 && _this.frequency != 2) {
          end = _this.getEndPeriod(timeframe, end_period);
        }

        _this.endPeriod = end;

        if (!_this.programStore.oldLevels(_this.programId)) {
          _this.groupBy = parseInt(groupby) || _constants__WEBPACK_IMPORTED_MODULE_3__["GROUP_BY_CHAIN"];
        }

        levels = _this.parseArrayParams(levels);

        if (levels !== null) {
          tiers = null;
          _this.levels = levels;
        }

        if (tiers !== null) {
          _this.tiers = _this.parseArrayParams(tiers);
        }

        _this.sites = _this.parseArrayParams(sites);
        _this.types = _this.parseArrayParams(types);
        _this.indicators = _this.parseArrayParams(indicators);
        return Promise.resolve(true);
      }, function (errorMessage) {
        throw errorMessage;
      }).catch(function (errorMessage) {
        return Promise.reject(errorMessage);
      });
    };

    this.getStartPeriod = function (timeframe, numrecentperiods, start_period) {
      if (timeframe == '1') {
        return 0;
      } else if (timeframe == '2') {
        return _this.programStore.currentPeriod(_this.programId, _this.frequency) - (parseInt(numrecentperiods) || 2) + 1;
      } else if (start_period !== null) {
        return _this.programStore.startPeriodFromDate(_this.programId, _this.frequency, new Date(start_period));
      }

      return Math.max(_this.programStore.currentPeriod(_this.programId, _this.frequency) - 2, 0);
    };

    this.getEndPeriod = function (timeframe, end_period) {
      var end;

      if (timeframe == '1') {
        return _this.programStore.lastPeriod(_this.programId, _this.frequency);
      } else if (timeframe == '2') {
        return _this.programStore.currentPeriod(_this.programId, _this.frequency);
      } else if (end_period !== null) {
        return Math.min(_this.programStore.endPeriodFromDate(_this.programId, _this.frequency, new Date(end_period)), _this.programStore.lastPeriod(_this.programId, _this.frequency));
      }

      return Math.max(Math.min(_this.programStore.currentPeriod(_this.programId, _this.frequency), _this.startPeriod + 2), _this.programStore.lastPeriod(_this.programId, _this.frequency));
    };

    this.parseArrayParams = function (param) {
      if (typeof param === 'string' || param instanceof String) {
        return [parseInt(param)];
      } else if (Array.isArray(param)) {
        return param.map(function (p) {
          return parseInt(p);
        });
      } else if (Number.isInteger(param)) {
        return param;
      } else if (!isNaN(parseInt(param))) {
        return [parseInt(param)];
      }

      return null;
    };

    this.parseToArrayParams = function (param) {
      if (Array.isArray(param)) {
        return param.map(_this.parseToArrayParams);
      } else if (typeof param === 'string' || param instanceof String) {
        return param;
      }

      return String(param);
    };

    this.routes = [{
      name: 'iptt',
      path: '/iptt_report/:programId<\\d+>',
      children: [{
        name: 'timeperiods',
        path: '/timeperiods?timeperiods'
      }, {
        name: 'tva',
        path: '/targetperiods?targetperiods'
      }]
    }, {
      name: 'ipttAPI',
      path: '/iptt_api?reportType&programId',
      children: [{
        name: 'ipttData',
        path: '/iptt_report_data/'
      }, {
        name: 'ipttExcel',
        path: '/iptt_excel/?fullTVA'
      }]
    }];
    this.goodQueryParams = ['frequency', 'start', 'end', 'levels', 'types', 'sectors', 'indicators', 'tiers', 'groupby'];
    this.oldQueryParams = ['timeframe', 'numrecentperiods', 'start_period', 'end_period'];
    this.queryParams = '?' + this.goodQueryParams.concat(this.oldQueryParams).join('&');
    this.programStore = mockProgramStore;
  }

  _createClass(ipttRouter, [{
    key: "routeName",
    get: function get() {
      return this.reportType === _constants__WEBPACK_IMPORTED_MODULE_3__["TVA"] ? 'iptt.tva' : this.reportType === _constants__WEBPACK_IMPORTED_MODULE_3__["TIMEPERIODS"] ? 'iptt.timeperiods' : 'iptt';
    }
  }, {
    key: "routeParams",
    get: function get() {
      var _this2 = this;

      var params = {};
      var keys = ['programId', 'frequency', 'levels', 'tiers', 'sites', 'types', 'indicators'];
      keys.forEach(function (k) {
        if (_this2[k] !== null) {
          params[k] = _this2.parseToArrayParams(_this2[k]);
        }
      });

      if (this.startPeriod !== null) {
        params.start = String(this.startPeriod);
      }

      if (this.endPeriod !== null) {
        params.end = String(this.endPeriod);
      }

      if (this.groupBy !== null) {
        params.groupby = String(this.groupBy);
      }

      return params;
    }
  }, {
    key: "dataUrl",
    get: function get() {
      return this.router.buildUrl('ipttAPI.ipttData', this.routeParams);
    }
  }, {
    key: "excelUrl",
    get: function get() {
      return this.router.buildUrl('ipttAPI.ipttExcel', _objectSpread({}, this.routeParams, {
        reportType: this.reportType,
        fullTVA: false
      }));
    }
  }, {
    key: "fullExcelUrl",
    get: function get() {
      return this.router.buildUrl('ipttAPI.ipttExcel', {
        programId: this.programId,
        fullTVA: true
      });
    }
  }]);

  return ipttRouter;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "reportType", [mobx__WEBPACK_IMPORTED_MODULE_2__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "programId", [mobx__WEBPACK_IMPORTED_MODULE_2__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "frequency", [mobx__WEBPACK_IMPORTED_MODULE_2__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "startPeriod", [mobx__WEBPACK_IMPORTED_MODULE_2__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "endPeriod", [mobx__WEBPACK_IMPORTED_MODULE_2__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "groupBy", [mobx__WEBPACK_IMPORTED_MODULE_2__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "levels", [mobx__WEBPACK_IMPORTED_MODULE_2__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "tiers", [mobx__WEBPACK_IMPORTED_MODULE_2__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "sites", [mobx__WEBPACK_IMPORTED_MODULE_2__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, "types", [mobx__WEBPACK_IMPORTED_MODULE_2__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, "indicators", [mobx__WEBPACK_IMPORTED_MODULE_2__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _applyDecoratedDescriptor(_class.prototype, "routeName", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "routeName"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "routeParams", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "routeParams"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "dataUrl", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "dataUrl"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "excelUrl", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "excelUrl"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "fullExcelUrl", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "fullExcelUrl"), _class.prototype)), _class);


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
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./router */ "XGqG");
var _dec, _class, _temp;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * entry point for the iptt_report webpack bundle
 */




var routeStore = new _router__WEBPACK_IMPORTED_MODULE_3__["default"]();
routeStore.init();

var FilterTest = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('routeStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(FilterTest, _React$Component);

  function FilterTest() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FilterTest);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FilterTest)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onclick = function () {
      _this.props.routeStore.programId = _this.props.routeStore.programId == 400 ? 350 : 400;
    };

    _this.onclicka = function () {
      _this.props.routeStore.reportType = _this.props.routeStore.reportType == 2 ? 1 : 2;
    };

    _this.render = function () {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Hello route = ", _this.props.routeStore.levels), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        onClick: _this.onclick
      }, "hiya"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        onClick: _this.onclicka
      }, "hiya"));
    };

    return _this;
  }

  return FilterTest;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(mobx_react__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
  routeStore: routeStore
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FilterTest, null)), document.querySelector('#id_div_content')); //import createRouter from 'router5';
//import browserPlugin from 'router5-plugin-browser';
//import { Provider } from 'mobx-react';
//import { RootStore, ReportAPI } from './models';
//import { IPTTReportApp } from './components/main';
//testing:
//import { contextFixture, reportData } from './fixtures';
//const labels = jsContext.labels;
//const reportAPI = new ReportAPI(jsContext.api_url);
//const rootStore = new RootStore(jsContext, reportAPI);
//const routes = [
//    {name: 'iptt', path: '/:programId<\\d+>/:reportType/?frequency&timeperiods&targetperiods&timeframe&numrecenteperiods&start&end&start_period&end_period&levels&sites&types&sectors&indicators&tiers&groupby'}
//];
//
//const router = createRouter(routes);
//
//router.usePlugin(browserPlugin({useHash: false, base: '/indicators/iptt_report'}));
//router.subscribe(rootStore.updateRoute);
//router.start();
//rootStore.init(router);
//ReactDOM.render(<Provider rootStore={ rootStore }
//                          labels={ labels } >
//                    <IPTTReportApp />    
//                </Provider>,
//                document.querySelector('#id_div_content'));

/***/ }),

/***/ "v38i":
/*!*************************!*\
  !*** ./js/constants.js ***!
  \*************************/
/*! exports provided: BLANK_LABEL, TVA, TIMEPERIODS, GROUP_BY_CHAIN, GROUP_BY_LEVEL */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLANK_LABEL", function() { return BLANK_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TVA", function() { return TVA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TIMEPERIODS", function() { return TIMEPERIODS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GROUP_BY_CHAIN", function() { return GROUP_BY_CHAIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GROUP_BY_LEVEL", function() { return GROUP_BY_LEVEL; });
/**
 * IPTT Constants:
 */
var BLANK_LABEL = '---------';
var TVA = 1;
var TIMEPERIODS = 2;

var GROUP_BY_CHAIN = 1;
var GROUP_BY_LEVEL = 2;


/***/ })

},[["mYfJ","runtime","vendors"]]]);
//# sourceMappingURL=iptt_report-56f594b0ceef783f340b.js.map