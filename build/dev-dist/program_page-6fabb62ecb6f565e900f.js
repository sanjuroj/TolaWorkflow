(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["program_page"],{

/***/ "DaGC":
/*!*************************************************!*\
  !*** ./js/pages/program_page/pinned_reports.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// On pinned report delete btn click
$('[data-delete-pinned-report]').click(function (e) {
  e.preventDefault();
  var prId = $(this).data('deletePinnedReport');
  var pinnedReport = $(this).closest('.pinned-report');

  if (window.confirm(gettext('Warning: This action cannot be undone. Are you sure you want to delete this pinned report?'))) {
    $.ajax({
      type: "POST",
      url: jsContext.delete_pinned_report_url,
      data: {
        pinned_report_id: prId
      },
      success: function success() {
        pinnedReport.remove();
      }
    });
  }
});

/***/ }),

/***/ "KPAS":
/*!************************************************************!*\
  !*** ./js/pages/program_page/components/indicator_list.js ***!
  \************************************************************/
/*! exports provided: IndicatorList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndicatorList", function() { return IndicatorList; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../eventbus */ "qtBC");
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "7O5W");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "wHSu");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../models */ "YVM2");
/* harmony import */ var _components_bootstrap_multiselect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../components/bootstrap_multiselect */ "lYLt");
var _class, _class2, _class3;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }










_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_4__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faCaretDown"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faCaretRight"]);

function getStatusIndicatorString(filterType, indicatorCount) {
  var fmts;

  switch (filterType) {
    case _models__WEBPACK_IMPORTED_MODULE_7__["IndicatorFilterType"].missingTarget:
      // # Translators: The number of indicators that do not have targets defined on them
      fmts = ngettext("%s indicator has missing targets", "%s indicators have missing targets", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _models__WEBPACK_IMPORTED_MODULE_7__["IndicatorFilterType"].missingResults:
      // # Translators: The number of indicators that no one has entered in any results for
      fmts = ngettext("%s indicator has missing results", "%s indicators have missing results", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _models__WEBPACK_IMPORTED_MODULE_7__["IndicatorFilterType"].missingEvidence:
      // # Translators: The number of indicators that contain results that are not backed up with evidence
      fmts = ngettext("%s indicator has missing evidence", "%s indicators have missing evidence", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _models__WEBPACK_IMPORTED_MODULE_7__["IndicatorFilterType"].aboveTarget:
      // # Translators: shows what number of indicators are a certain percentage above target. Example: 3 indicators are >15% above target
      fmts = ngettext("%s indicator is >15% above target", "%s indicators are >15% above target", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _models__WEBPACK_IMPORTED_MODULE_7__["IndicatorFilterType"].belowTarget:
      // # Translators: shows what number of indicators are a certain percentage below target. Example: 3 indicators are >15% below target
      fmts = ngettext("%s indicator is >15% below target", "%s indicators are >15% below target", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _models__WEBPACK_IMPORTED_MODULE_7__["IndicatorFilterType"].onTarget:
      // # Translators: shows what number of indicators are within a set range of target. Example: 3 indicators are on track
      fmts = ngettext("%s indicator is on track", "%s indicators are on track", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    default:
      // # Translators: the number of indicators in a list. Example: 3 indicators
      fmts = ngettext("%s indicator", "%s indicators", indicatorCount);
      return interpolate(fmts, [indicatorCount]);
  }
}

var StatusHeader = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(StatusHeader, _React$Component);

  function StatusHeader(props) {
    var _this;

    _classCallCheck(this, StatusHeader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StatusHeader).call(this, props));
    _this.onShowAllClick = _this.onShowAllClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(StatusHeader, [{
    key: "onShowAllClick",
    value: function onShowAllClick(e) {
      e.preventDefault();
      _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('clear-all-indicator-filters');
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          indicatorCount = _this$props.indicatorCount,
          programId = _this$props.programId,
          currentIndicatorFilter = _this$props.currentIndicatorFilter,
          filterApplied = _this$props.filterApplied;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "indicators-list__header"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", {
        className: "no-bold"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        id: "indicators-list-title"
      }, getStatusIndicatorString(currentIndicatorFilter, indicatorCount), " "), filterApplied && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        id: "show-all-indicators",
        onClick: this.onShowAllClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, "Show all"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "/indicators/indicator_create/".concat(programId),
        role: "button",
        className: "btn-link btn-add"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-plus-circle"
      }), " ", gettext("Add indicator"))));
    }
  }]);

  return StatusHeader;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;

var IndicatorFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class2 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(IndicatorFilter, _React$Component2);

  function IndicatorFilter() {
    _classCallCheck(this, IndicatorFilter);

    return _possibleConstructorReturn(this, _getPrototypeOf(IndicatorFilter).apply(this, arguments));
  }

  _createClass(IndicatorFilter, [{
    key: "render",
    value: function render() {
      var indicators = this.props.rootStore.indicatorStore.indicators;
      var selectedIndicatorIds = this.props.uiStore.selectedIndicatorIds;
      var indicatorSelectOptions = indicators.map(function (i) {
        return {
          value: i.id,
          label: i.name
        };
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("nav", {
        className: "list__filters list__filters--inline-label",
        id: "id_div_indicators"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "filters__label"
      }, gettext("Find an indicator:")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "filters__control"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_bootstrap_multiselect__WEBPACK_IMPORTED_MODULE_8__["Select"], {
        forceEmptySelect: true,
        options: indicatorSelectOptions,
        selected: selectedIndicatorIds,
        onSelectCb: function onSelectCb(selectedIndicatorIds) {
          return _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('select-indicators-to-filter', selectedIndicatorIds);
        }
      })));
    }
  }]);

  return IndicatorFilter;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class2;

var IndicatorListTable = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class3 =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(IndicatorListTable, _React$Component3);

  function IndicatorListTable(props) {
    var _this2;

    _classCallCheck(this, IndicatorListTable);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(IndicatorListTable).call(this, props));
    _this2.onIndicatorUpdateClick = _this2.onIndicatorUpdateClick.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    _this2.onIndicatorResultsToggleClick = _this2.onIndicatorResultsToggleClick.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    return _this2;
  }

  _createClass(IndicatorListTable, [{
    key: "onIndicatorUpdateClick",
    value: function onIndicatorUpdateClick(e, indicatorId) {
      e.preventDefault();
      _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('open-indicator-update-modal', indicatorId);
    }
  }, {
    key: "onIndicatorResultsToggleClick",
    value: function onIndicatorResultsToggleClick(e, indicatorId) {
      e.preventDefault();
      var resultsMap = this.props.resultsMap;

      if (resultsMap.has(indicatorId)) {
        _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('delete-indicator-results', indicatorId);
      } else {
        _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('load-indicator-results', indicatorId);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var indicators = this.props.indicators;
      var program = this.props.program;
      var programReportingPeriodEndDate = new Date(program.reporting_period_end);
      var resultsMap = this.props.resultsMap;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
        className: "table indicators-list"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
        className: "table-header"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "",
        id: "id_indicator_name_col_header"
      }, gettext("Indicator")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "",
        id: "id_indicator_buttons_col_header"
      }, "\xA0"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "",
        id: "id_indicator_level_col_header"
      }, gettext("Level")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "",
        id: "id_indicator_unit_col_header"
      }, gettext("Unit of measure")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "text-right",
        id: "id_indicator_baseline_col_header"
      }, gettext("Baseline")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "text-right",
        id: "id_indicator_target_col_header"
      }, gettext("Target")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, indicators.map(function (indicator) {
        var resultsExist = resultsMap.has(indicator.id);
        var resultsStr = resultsMap.get(indicator.id);
        var targetPeriodLastEndDate = indicator.target_period_last_end_date ? new Date(indicator.target_period_last_end_date) : null; // ^^^ Because calling Date() on null returns the current date, and we actually need null!

        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
          key: indicator.id
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
          className: classnames__WEBPACK_IMPORTED_MODULE_1___default()("indicators-list__row", "indicators-list__indicator-header", {
            "is-highlighted": indicator.just_created,
            "is-expanded": resultsExist
          })
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          className: "indicator_results_toggle",
          onClick: function onClick(e) {
            return _this3.onIndicatorResultsToggleClick(e, indicator.id);
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__["FontAwesomeIcon"], {
          icon: resultsExist ? 'caret-down' : 'caret-right'
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, indicator.number), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "indicator_name"
        }, indicator.name)), indicator.key_performance_indicator && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "badge"
        }, "KPI"), targetPeriodLastEndDate && programReportingPeriodEndDate > targetPeriodLastEndDate && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "/indicators/indicator_update/".concat(indicator.id, "/"),
          className: "indicator-link color-red missing_targets",
          "data-toggle": "modal",
          "data-target": "#indicator_modal_div",
          "data-tab": "targets"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-bullseye"
        }), " Missing targets")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          className: "indicator-link",
          onClick: function onClick(e) {
            return _this3.onIndicatorUpdateClick(e, indicator.id);
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-cog"
        }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, indicator.level ? indicator.level.name : ''), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, indicator.unit_of_measure), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          className: "text-right"
        }, indicator.baseline_display), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          className: "text-right"
        }, indicator.lop_target_display)), resultsExist && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
          className: "indicators-list__row indicators-list__indicator-body"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          colSpan: "6",
          ref: function ref(el) {
            return $(el).find('[data-toggle="popover"]').popover({
              html: true
            });
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          dangerouslySetInnerHTML: {
            __html: resultsStr
          }
        }))));
      })));
    }
  }]);

  return IndicatorListTable;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class3;

var IndicatorList = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (props) {
  var program = props.rootStore.program;
  var indicatorStore = props.rootStore.indicatorStore; // const indicators = props.rootStore.indicatorStore.indicators;

  var resultsMap = props.rootStore.resultsMap;
  var currentIndicatorFilter = props.uiStore.currentIndicatorFilter;
  var selectedIndicatorIds = props.uiStore.selectedIndicatorIds; // Either a gas gauge filter is applied, or an indicator has been selected, but not both
  // apply gas gauge filter

  var filteredIndicators = indicatorStore.filterIndicators(currentIndicatorFilter);

  if (selectedIndicatorIds.length > 0) {
    filteredIndicators = filteredIndicators.filter(function (i) {
      return selectedIndicatorIds.indexOf(i.id) > -1;
    });
  }

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(StatusHeader, {
    indicatorCount: filteredIndicators.length,
    programId: program.id,
    currentIndicatorFilter: currentIndicatorFilter,
    filterApplied: currentIndicatorFilter || selectedIndicatorIds.length > 0
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorFilter, {
    uiStore: props.uiStore,
    rootStore: props.rootStore
  }), program.does_it_need_additional_target_periods && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "id_missing_targets_msg",
    className: "color-red"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-bullseye"
  }), "\xA0", gettext('Some indicators have missing targets. To enter these values, click the target icon near the indicator name.')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorListTable, {
    indicators: filteredIndicators,
    resultsMap: resultsMap,
    program: program
  }));
});

/***/ }),

/***/ "YVM2":
/*!*****************************************!*\
  !*** ./js/pages/program_page/models.js ***!
  \*****************************************/
/*! exports provided: IndicatorFilterType, IndicatorStore, ProgramPageStore, ProgramPageUIStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndicatorFilterType", function() { return IndicatorFilterType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndicatorStore", function() { return IndicatorStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramPageStore", function() { return ProgramPageStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramPageUIStore", function() { return ProgramPageUIStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
var _class, _descriptor, _temp, _class3, _descriptor2, _descriptor3, _temp2, _class5, _descriptor4, _descriptor5, _temp3;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }

 // Types of filters available on the program page

var IndicatorFilterType = Object.freeze({
  missingTarget: 1,
  missingResults: 2,
  missingEvidence: 3,
  aboveTarget: 5,
  belowTarget: 6,
  onTarget: 7
});
var IndicatorStore = (_class = (_temp =
/*#__PURE__*/
function () {
  function IndicatorStore(indicators) {
    _classCallCheck(this, IndicatorStore);

    _initializerDefineProperty(this, "indicators", _descriptor, this);

    this.indicators = indicators;
    this.updateIndicator = this.updateIndicator.bind(this);
    this.filterIndicators = this.filterIndicators.bind(this);
  }

  _createClass(IndicatorStore, [{
    key: "updateIndicator",
    value: function updateIndicator(indicator) {
      var i = this.indicators.findIndex(function (e) {
        return e.id === indicator.id;
      });

      if (i > 0) {
        this.indicators[i] = indicator;
      }
    }
  }, {
    key: "filterIndicators",
    value: function filterIndicators(filterType) {
      var indicators;

      switch (filterType) {
        case IndicatorFilterType.missingTarget:
          indicators = this.getIndicatorsNeedingTargets;
          break;

        case IndicatorFilterType.missingResults:
          indicators = this.getIndicatorsNeedingResults;
          break;

        case IndicatorFilterType.missingEvidence:
          indicators = this.getIndicatorsNeedingEvidence;
          break;

        case IndicatorFilterType.aboveTarget:
          indicators = this.getIndicatorsAboveTarget;
          break;

        case IndicatorFilterType.belowTarget:
          indicators = this.getIndicatorsBelowTarget;
          break;

        case IndicatorFilterType.onTarget:
          indicators = this.getIndicatorsOnTarget;
          break;

        default:
          indicators = this.indicators;
      }

      return indicators;
    }
  }, {
    key: "getIndicatorsNeedingTargets",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.all_targets_defined === 0;
      });
    }
  }, {
    key: "getIndicatorsNeedingResults",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.results_count === 0;
      });
    }
  }, {
    key: "getIndicatorsNeedingEvidence",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.results_count !== i.results_with_evidence_count;
      });
    }
  }, {
    key: "getIndicatorsNotReporting",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.over_under === null;
      });
    }
  }, {
    key: "getIndicatorsAboveTarget",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.over_under > 0;
      });
    }
  }, {
    key: "getIndicatorsBelowTarget",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.over_under < 0;
      });
    }
  }, {
    key: "getIndicatorsOnTarget",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.over_under === 0;
      });
    }
  }, {
    key: "getIndicatorsReporting",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.reporting === true;
      });
    }
  }, {
    key: "getTotalResultsCount",
    get: function get() {
      return this.indicators.reduce(function (acc, i) {
        return acc + i.results_count;
      }, 0);
    }
  }, {
    key: "getTotalResultsWithEvidenceCount",
    get: function get() {
      return this.indicators.reduce(function (acc, i) {
        return acc + i.results_with_evidence_count;
      }, 0);
    }
  }]);

  return IndicatorStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "indicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class.prototype, "updateIndicator", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateIndicator"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsNeedingTargets", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsNeedingTargets"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsNeedingResults", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsNeedingResults"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsNeedingEvidence", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsNeedingEvidence"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsNotReporting", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsNotReporting"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsAboveTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsAboveTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsBelowTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsBelowTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsOnTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsOnTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsReporting", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsReporting"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getTotalResultsCount", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getTotalResultsCount"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getTotalResultsWithEvidenceCount", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getTotalResultsWithEvidenceCount"), _class.prototype)), _class);
var ProgramPageStore = (_class3 = (_temp2 =
/*#__PURE__*/
function () {
  // indicator id -> results HTML str
  function ProgramPageStore(indicators, program) {
    _classCallCheck(this, ProgramPageStore);

    this.indicatorStore = void 0;

    _initializerDefineProperty(this, "program", _descriptor2, this);

    _initializerDefineProperty(this, "resultsMap", _descriptor3, this);

    this.indicatorStore = new IndicatorStore(indicators);
    this.program = program;
    this.addResultsHTML = this.addResultsHTML.bind(this);
    this.deleteResultsHTML = this.deleteResultsHTML.bind(this);
  }

  _createClass(ProgramPageStore, [{
    key: "addResultsHTML",
    value: function addResultsHTML(indicatorId, htmlStr) {
      this.resultsMap.set(parseInt(indicatorId), htmlStr);
    }
  }, {
    key: "deleteResultsHTML",
    value: function deleteResultsHTML(indicatorId) {
      this.resultsMap.delete(indicatorId);
    }
  }, {
    key: "deleteAllResultsHTML",
    value: function deleteAllResultsHTML() {
      this.resultsMap.clear();
    }
  }]);

  return ProgramPageStore;
}(), _temp2), (_descriptor2 = _applyDecoratedDescriptor(_class3.prototype, "program", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class3.prototype, "resultsMap", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Map();
  }
}), _applyDecoratedDescriptor(_class3.prototype, "addResultsHTML", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "addResultsHTML"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "deleteResultsHTML", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "deleteResultsHTML"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "deleteAllResultsHTML", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "deleteAllResultsHTML"), _class3.prototype)), _class3);
var ProgramPageUIStore = (_class5 = (_temp3 =
/*#__PURE__*/
function () {
  // selected gas gauge filter
  // indicators filter
  function ProgramPageUIStore() {
    _classCallCheck(this, ProgramPageUIStore);

    _initializerDefineProperty(this, "currentIndicatorFilter", _descriptor4, this);

    _initializerDefineProperty(this, "selectedIndicatorIds", _descriptor5, this);

    this.setIndicatorFilter = this.setIndicatorFilter.bind(this);
    this.clearIndicatorFilter = this.clearIndicatorFilter.bind(this);
    this.setSelectedIndicatorIds = this.setSelectedIndicatorIds.bind(this);
  }

  _createClass(ProgramPageUIStore, [{
    key: "setIndicatorFilter",
    value: function setIndicatorFilter(indicatorFilter) {
      this.currentIndicatorFilter = indicatorFilter;
    }
  }, {
    key: "clearIndicatorFilter",
    value: function clearIndicatorFilter() {
      this.currentIndicatorFilter = null;
    }
  }, {
    key: "setSelectedIndicatorIds",
    value: function setSelectedIndicatorIds(selectedIndicatorIds) {
      this.selectedIndicatorIds = selectedIndicatorIds;
    }
  }]);

  return ProgramPageUIStore;
}(), _temp3), (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "currentIndicatorFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "selectedIndicatorIds", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class5.prototype, "setIndicatorFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class5.prototype, "setIndicatorFilter"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "clearIndicatorFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class5.prototype, "clearIndicatorFilter"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "setSelectedIndicatorIds", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class5.prototype, "setSelectedIndicatorIds"), _class5.prototype)), _class5);

/***/ }),

/***/ "aJgA":
/*!****************************************!*\
  !*** ./js/pages/program_page/index.js ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../eventbus */ "qtBC");
/* harmony import */ var _components_indicator_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/indicator_list */ "KPAS");
/* harmony import */ var _components_program_metrics__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/program_metrics */ "rE5y");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./models */ "YVM2");
/* harmony import */ var _pinned_reports__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pinned_reports */ "DaGC");
/* harmony import */ var _pinned_reports__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_pinned_reports__WEBPACK_IMPORTED_MODULE_6__);






 // console.log(jsContext);

/*
 * Model/Store setup
 */

var rootStore = new _models__WEBPACK_IMPORTED_MODULE_5__["ProgramPageStore"](jsContext.indicators, jsContext.program);
var uiStore = new _models__WEBPACK_IMPORTED_MODULE_5__["ProgramPageUIStore"]();
/*
 * Event Handlers
 */
// open indicator update modal with form loaded from server

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('open-indicator-update-modal', function (indicatorId) {
  // Note: depends on indicator_list_modals.html
  var url = "/indicators/indicator_update/".concat(indicatorId, "/?modal=1");
  $("#indicator_modal_content").empty();
  $("#modalmessages").empty();
  $("#indicator_modal_content").load(url);
  $("#indicator_modal_div").modal('show');
}); // get results html blob for indicator

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('load-indicator-results', function (indicatorId) {
  var url = "/indicators/result_table/".concat(indicatorId, "/").concat(rootStore.program.id, "/");
  $.get(url, function (data) {
    rootStore.addResultsHTML(indicatorId, data);
  });
}); // delete (hide) results html blob for indicator

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('delete-indicator-results', function (indicatorId) {
  rootStore.deleteResultsHTML(indicatorId);
}); // reload singular indicator json obj

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('reload-indicator', function (indicatorId) {
  $.get("/indicators/api/indicator/".concat(indicatorId), rootStore.indicatorStore.updateIndicator);
}); // apply a gas gauge filter. Takes in IndicatorFilterType enum value

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('apply-gauge-tank-filter', function (indicatorFilter) {
  // reset all filters
  _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('clear-all-indicator-filters');
  _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('close-all-indicators');
  uiStore.setIndicatorFilter(indicatorFilter);
}); // clear all gas tank and indicator select filters

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('clear-all-indicator-filters', function () {
  uiStore.clearIndicatorFilter();
  _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('select-indicators-to-filter', []);
  _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('close-all-indicators');
}); // filter down by selecting individual indicator

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('select-indicators-to-filter', function (selectedIndicatorIds) {
  // clear gauge tank filters
  uiStore.clearIndicatorFilter();
  uiStore.setSelectedIndicatorIds(selectedIndicatorIds); // Open up results pane as well

  selectedIndicatorIds.forEach(function (id) {
    return _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('load-indicator-results', id);
  });
}); // close all expanded indicators in the table

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('close-all-indicators', function () {
  rootStore.deleteAllResultsHTML();
});
/*
 * React components on page
 */

react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_indicator_list__WEBPACK_IMPORTED_MODULE_3__["IndicatorList"], {
  rootStore: rootStore,
  uiStore: uiStore
}), document.querySelector('#indicator-list-react-component'));
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_program_metrics__WEBPACK_IMPORTED_MODULE_4__["ProgramMetrics"], {
  rootStore: rootStore,
  uiStore: uiStore,
  indicatorOnScopeMargin: jsContext.indicator_on_scope_margin
}), document.querySelector('#program-metrics-react-component'));
/*
 * Copied and modified JS from indicator_list_modals.js to allow modals to work
 * without being completely converted to React
 */
// Open the CollectDataUpdate (update results) form in a modal

$("#indicator-list-react-component").on("click", ".collected-data__link", function (e) {
  e.preventDefault();
  var url = $(this).attr("href");
  url += "?modal=1";
  $("#indicator_modal_content").empty();
  $("#modalmessages").empty();
  $("#indicator_collected_data_modal_content").load(url);
  $("#indicator_collecteddata_div").modal('show');
}); // Open the IndicatorUpdate (Add targets btn in results section (HTML)) Form in a modal

$("#indicator-list-react-component").on("click", ".indicator-link[data-tab]", function (e) {
  e.preventDefault();
  var url = $(this).attr("href");
  url += "?modal=1";
  var tab = $(this).data("tab");

  if (tab && tab != '' && tab != undefined && tab != 'undefined') {
    url += "&targetsactive=true";
  }

  $("#indicator_modal_content").empty();
  $("#modalmessages").empty();
  $("#indicator_modal_content").load(url);
  $("#indicator_modal_div").modal('show');
}); // when indicator update modal is closed, update targets

$('#indicator_modal_div').on('hide.bs.modal', function (e) {
  var form = $(this).find('form');
  var form_action = form.attr('action').split('/');
  var indicator_id = parseInt(form_action[form_action.length - 2]);
  _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('reload-indicator', indicator_id);

  if (rootStore.resultsMap.has(indicator_id)) {
    _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('load-indicator-results', indicator_id);
  }
}); // When "add results" modal is closed, the targets data needs refreshing
// the indicator itself also needs refreshing for the gas tank gauge

$('#indicator_collecteddata_div').on('hide.bs.modal', function (e) {
  var recordchanged = $(this).find('form').data('recordchanged');

  if (recordchanged === true) {
    var indicator_id = $(this).find('form #id_indicator').val();
    _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('load-indicator-results', indicator_id);
    _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('reload-indicator', indicator_id);
  }
});

/***/ }),

/***/ "lYLt":
/*!************************************************!*\
  !*** ./js/components/bootstrap_multiselect.js ***!
  \************************************************/
/*! exports provided: Select */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Select", function() { return Select; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ "xeH2");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_fast_compare__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-fast-compare */ "bmMU");
/* harmony import */ var react_fast_compare__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_fast_compare__WEBPACK_IMPORTED_MODULE_2__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

/* React wrappers to bootstrap-multiselect widgets */

/* Note: bootstrap-multiselect exists in the global JS context (imported in base.html) */



/*
  Props:

    - options: list of objects with 'value' and 'label' (assumes values are ints!)
    - selected: single value, or array of values of selected options
    - onSelectCb: a callback function that takes a list of selected values
    - isMultiSelect: boolean - is a multi-select?
    - forceEmptySelect: boolean - in single select, force "None selected" even if empty option is not provided
    - nonSelectText: string - the text to display on an empty selection
 */

var Select =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Select, _React$Component);

  function Select(props) {
    var _this;

    _classCallCheck(this, Select);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Select).call(this, props));
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.clearInternalSelection = _this.clearInternalSelection.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Select, [{
    key: "onChange",
    value: function onChange() {
      var selectedValues = this.$el.find('option:selected').map(function () {
        return parseInt(jquery__WEBPACK_IMPORTED_MODULE_1___default()(this).val());
      }).get();

      if (this.props.onSelectCb) {
        this.props.onSelectCb(selectedValues);
      }
    }
  }, {
    key: "clearInternalSelection",
    value: function clearInternalSelection() {
      // Set "none" selected in single select mode, with no empty option
      // these do not trigger any bs-multiselect callbacks
      if (this.props.forceEmptySelect) {
        this.$el.val('');
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var nonSelectText = this.props.nonSelectText;
      var multiSelectOptions = {
        nonSelectedText: nonSelectText,
        includeSelectAllOption: true,
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 1,
        maxHeight: 320,
        buttonClass: 'btn form-control',
        templates: {
          filter: '<li class="multiselect-item filter"><div class="input-group"><input class="form-control multiselect-search" type="text"></div></li>',
          filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="fas fa-times-circle"></i></button></span>'
        },
        onChange: this.onChange,
        onSelectAll: this.onChange,
        onDeselectAll: this.onChange
      }; // jquery ref to select element

      this.$el = jquery__WEBPACK_IMPORTED_MODULE_1___default()(this.el); // initial setup of BS multiselect

      this.$el.multiselect(multiSelectOptions); // set the selection and options

      this.componentDidUpdate();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props = this.props,
          options = _this$props.options,
          selected = _this$props.selected; // Setting the options clears the filter search field which is not desired behavior
      // As such, limit setting the options unless they really have changed
      // Hopefully this deep check isn't too slow for a large number of options

      if (!prevProps || !react_fast_compare__WEBPACK_IMPORTED_MODULE_2___default()(prevProps.options, options)) {
        this.$el.multiselect('dataprovider', options);
      }

      this.$el.multiselect('select', selected);

      if (selected.length === 0) {
        this.clearInternalSelection();
      }

      this.$el.multiselect('refresh');
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.$el.multiselect('destroy');
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var isMultiSelect = this.props.isMultiSelect ? "multiple" : null;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
        className: "form-control",
        ref: function ref(el) {
          return _this2.el = el;
        },
        multiple: isMultiSelect
      });
    }
  }]);

  return Select;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

/***/ }),

/***/ "qtBC":
/*!************************!*\
  !*** ./js/eventbus.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var nanobus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nanobus */ "7+Rn");
/* harmony import */ var nanobus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nanobus__WEBPACK_IMPORTED_MODULE_0__);
// A global instance of an event bus

var globalEventBus = nanobus__WEBPACK_IMPORTED_MODULE_0___default()();
/* harmony default export */ __webpack_exports__["default"] = (globalEventBus);

/***/ }),

/***/ "rE5y":
/*!*************************************************************!*\
  !*** ./js/pages/program_page/components/program_metrics.js ***!
  \*************************************************************/
/*! exports provided: ProgramMetrics */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramMetrics", function() { return ProgramMetrics; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../eventbus */ "qtBC");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models */ "YVM2");
var _class, _class2;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }







var GaugeTank = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(GaugeTank, _React$Component);

  function GaugeTank(props) {
    var _this;

    _classCallCheck(this, GaugeTank);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GaugeTank).call(this, props));
    _this.onGuageClick = _this.onGuageClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(GaugeTank, [{
    key: "onGuageClick",
    value: function onGuageClick() {
      _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('apply-gauge-tank-filter', this.props.filterType);
    }
  }, {
    key: "render",
    value: function render() {
      var tickCount = 10;
      var _this$props = this.props,
          allIndicatorsLength = _this$props.allIndicatorsLength,
          filteredIndicatorsLength = _this$props.filteredIndicatorsLength,
          title = _this$props.title,
          filledLabel = _this$props.filledLabel,
          unfilledLabel = _this$props.unfilledLabel,
          cta = _this$props.cta,
          emptyLabel = _this$props.emptyLabel;
      var filterType = this.props.filterType;
      var currentIndicatorFilter = this.props.currentIndicatorFilter;
      var isHighlighted = filterType === currentIndicatorFilter; // Gauge should only show 100%/0% if filtered == all/0 (absolute 100%, not rounding to 100%)
      // to accomplish this, added a Math.max and Math.min to prevent rounding to absolute values:

      var unfilledPercent = allIndicatorsLength <= 0 || allIndicatorsLength == filteredIndicatorsLength ? 100 : filteredIndicatorsLength == 0 ? 0 : Math.max(1, Math.min(Math.round(filteredIndicatorsLength / allIndicatorsLength * 100), 99));
      var filledPercent = 100 - unfilledPercent;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('gauge', 'filter-trigger', {
          'is-highlighted': isHighlighted
        }),
        onClick: this.onGuageClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", {
        className: "gauge__title"
      }, title), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__overview"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__graphic gauge__graphic--tank{% if filled_percent == 0 %} gauge__graphic--empty{% endif %}"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__tick-marks"
      }, _toConsumableArray(Array(tickCount)).map(function (e, i) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: i,
          className: "graphic__tick"
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__tank--unfilled",
        style: {
          'flexBasis': "".concat(unfilledPercent, "%")
        }
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__tank--filled",
        style: {
          'flexBasis': "".concat(filledPercent, "%")
        }
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__labels"
      }, filledPercent > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label text-muted"
      }, unfilledPercent, "% ", unfilledLabel), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "gauge__value"
      }, filledPercent, "% ", filledLabel))) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "text-danger"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, emptyLabel))))), unfilledPercent > 0 && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__cta"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "btn-link btn-inline"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-exclamation-triangle text-warning"
      }), " ", cta), "\xA0"));
    }
  }]);

  return GaugeTank;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;

var GaugeBand = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class2 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(GaugeBand, _React$Component2);

  function GaugeBand(props) {
    var _this2;

    _classCallCheck(this, GaugeBand);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(GaugeBand).call(this, props));
    _this2.handledFilterTypes = new Set([_models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].aboveTarget, _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].belowTarget, _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].onTarget]);
    _this2.onFilterLinkClick = _this2.onFilterLinkClick.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    return _this2;
  }

  _createClass(GaugeBand, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      // Enable popovers after update (they break otherwise)
      $(this.el).find('[data-toggle="popover"]').popover({
        html: true
      });
    }
  }, {
    key: "onFilterLinkClick",
    value: function onFilterLinkClick(e, filterType) {
      e.preventDefault();
      _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('apply-gauge-tank-filter', filterType);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var tickCount = 10;
      var indicatorStore = this.props.indicatorStore;
      var currentIndicatorFilter = this.props.currentIndicatorFilter;
      var isHighlighted = this.handledFilterTypes.has(currentIndicatorFilter);
      var totalIndicatorCount = indicatorStore.indicators.length;
      var nonReportingCount = indicatorStore.getIndicatorsNotReporting.length;
      var highCount = indicatorStore.getIndicatorsAboveTarget.length;
      var lowCount = indicatorStore.getIndicatorsBelowTarget.length;
      var onTargetCount = indicatorStore.getIndicatorsOnTarget.length; //100 and 0 should only represent absolute "all" and "none" values respectively (no round to 100 or to 0)

      var makePercent = totalIndicatorCount > 0 ? function (x) {
        return x == totalIndicatorCount ? 100 : x == 0 ? 0 : Math.max(1, Math.min(Math.round(x / totalIndicatorCount * 100), 99));
      } : function (x) {
        return 0;
      };
      var percentHigh = makePercent(highCount);
      var percentOnTarget = makePercent(onTargetCount);
      var percentBelow = makePercent(lowCount);
      var percentNonReporting = makePercent(nonReportingCount);
      var marginPercent = this.props.indicatorOnScopeMargin * 100; // Top level wrapper of component

      var Gauge = function Gauge(props) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('gauge', {
            'is-highlighted': isHighlighted
          }),
          ref: function ref(el) {
            return _this3.el = el;
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", {
          className: "gauge__title"
        }, gettext('Indicators on track')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__overview"
        }, props.children));
      };

      if (indicatorStore.getTotalResultsCount === 0) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Gauge, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
          className: "text-muted"
        }, gettext("Unavailable until results are reported")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "gauge__icon gauge__icon--error fas fa-frown"
        }))));
      }

      if (indicatorStore.getIndicatorsReporting.length === 0) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Gauge, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__graphic gauge__graphic--empty gauge__graphic--performance-band"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "graphic__tick-marks"
        }, _toConsumableArray(Array(tickCount)).map(function (e, i) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
            key: i,
            className: "graphic__tick"
          });
        }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__labels"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__label"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
          className: "text-muted"
        }, gettext("Unavailable until the first target period ends with results reported")))));
      } // Handle strings containing HTML markup


      var aboveTargetMarkup = function aboveTargetMarkup() {
        /* # Translators: variable %(percentHigh)s shows what percentage of indicators are a certain percentage above target percent %(marginPercent)s. Example: 31% are >15% above target */
        var s = gettext('<strong>%(percentHigh)s%</strong> are >%(marginPercent)s% above target');
        return {
          __html: interpolate(s, {
            percentHigh: percentHigh,
            marginPercent: marginPercent
          }, true)
        };
      };

      var onTargetMarkup = function onTargetMarkup() {
        /* # Translators: variable %s shows what percentage of indicators are within a set range of target. Example: 31%  are on track */
        var s = gettext('<strong>%s%</strong> are on track');
        return {
          __html: interpolate(s, [percentOnTarget])
        };
      };

      var belowTargetMarkup = function belowTargetMarkup() {
        /* # Translators: variable %(percentBelow)s shows what percentage of indicators are a certain percentage below target. The variable %(marginPercent)s is that percentage. Example: 31% are >15% below target */
        var s = gettext('<strong>%(percentBelow)s%</strong> are >%(marginPercent)s% below target');
        return {
          __html: interpolate(s, {
            percentBelow: percentBelow,
            marginPercent: marginPercent
          }, true)
        };
      };

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Gauge, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__graphic gauge__graphic--performance-band"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__tick-marks"
      }, _toConsumableArray(Array(tickCount)).map(function (e, i) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: i,
          className: "graphic__tick"
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__performance-band--above-target",
        style: {
          'flexBasis': "".concat(percentHigh, "%")
        }
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__performance-band--on-target",
        style: {
          'flexBasis': "".concat(percentOnTarget, "%")
        }
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__performance-band--below-target",
        style: {
          'flexBasis': "".concat(percentBelow, "%")
        }
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__labels"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "text-muted"
      },
      /* # Translators: variable %s shows what percentage of indicators have no targets reporting data. Example: 31% unavailable */
      interpolate(gettext('%s%% unavailable'), [percentNonReporting])), ' ', react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        tabIndex: "0",
        "data-toggle": "popover",
        "data-placement": "right",
        "data-trigger": "focus",
        "data-content":
        /* # Translators: help text for the percentage of indicators with no targets reporting data. */
        gettext("The indicator has no targets, no completed target periods, or no results reported."),
        onClick: function onClick(e) {
          return e.preventDefault();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "far fa-question-circle"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "gauge__value--above filter-trigger--band",
        onClick: function onClick(e) {
          return _this3.onFilterLinkClick(e, _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].aboveTarget);
        },
        dangerouslySetInnerHTML: aboveTargetMarkup()
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "gauge__value filter-trigger--band",
        onClick: function onClick(e) {
          return _this3.onFilterLinkClick(e, _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].onTarget);
        },
        dangerouslySetInnerHTML: onTargetMarkup()
      }), ' ', react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        tabIndex: "0",
        "data-toggle": "popover",
        "data-placement": "right",
        "data-trigger": "focus",
        "data-content":
        /* # Translators: Help text explaining what an "on track" indicator is. */
        gettext("The actual value matches the target value, plus or minus 15%. So if your target is 100 and your result is 110, the indicator is 10% above target and on track.  <br><br>Please note that if your indicator has a decreasing direction of change, then “above” and “below” are switched. In that case, if your target is 100 and your result is 200, your indicator is 50% below target and not on track.<br><br><a href='https://docs.google.com/document/d/1Gl9bxJJ6hdhCXeoOCoR1mnVKZa2FlEOhaJcjexiHzY0' target='_blank'>See our documentation for more information.</a>"),
        onClick: function onClick(e) {
          return e.preventDefault();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "far fa-question-circle"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "gauge__value--below filter-trigger--band",
        onClick: function onClick(e) {
          return _this3.onFilterLinkClick(e, _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].belowTarget);
        },
        dangerouslySetInnerHTML: belowTargetMarkup()
      }))));
    }
  }]);

  return GaugeBand;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class2;

var ProgramMetrics = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (props) {
  // const program = props.rootStore.program;
  var indicatorStore = props.rootStore.indicatorStore;
  var indicators = indicatorStore.indicators;
  var currentIndicatorFilter = props.uiStore.currentIndicatorFilter;
  var indicatorOnScopeMargin = this.props.indicatorOnScopeMargin; // Use objs for labels below to allow for translator notes to be added

  var targetLabels = {
    /* # Translators: title of a graphic showing indicators with targets */
    title: gettext("Indicators with targets"),

    /* # Translators: a label in a graphic. Example: 31% have targets */
    filledLabel: gettext("have targets"),

    /* # Translators: a label in a graphic. Example: 31% no targets */
    unfilledLabel: gettext("no targets"),
    cta: gettext("Add missing targets"),
    emptyLabel: gettext("No targets")
  };
  var resultsLabels = {
    /* # Translators: title of a graphic showing indicators with results */
    title: gettext("Indicators with results"),

    /* # Translators: a label in a graphic. Example: 31% have results */
    filledLabel: gettext("have results"),

    /* # Translators: a label in a graphic. Example: 31% no results */
    unfilledLabel: gettext("no results"),
    cta: gettext("Add missing results"),
    emptyLabel: gettext("No results")
  };
  var evidenceLabels = {
    /* # Translators: title of a graphic showing results with evidence */
    title: gettext("Results with evidence"),

    /* # Translators: a label in a graphic. Example: 31% have evidence */
    filledLabel: gettext("have evidence"),

    /* # Translators: a label in a graphic. Example: 31% no evidence */
    unfilledLabel: gettext("no evidence"),
    cta: gettext("Add missing evidence"),
    emptyLabel: gettext("No evidence")
  }; // Do not display on pages with no indicators

  if (indicators.length === 0) return null;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "status__gauges"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GaugeBand, {
    currentIndicatorFilter: currentIndicatorFilter,
    indicatorOnScopeMargin: indicatorOnScopeMargin,
    indicatorStore: indicatorStore
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GaugeTank, _extends({
    filterType: _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].missingTarget,
    currentIndicatorFilter: currentIndicatorFilter,
    allIndicatorsLength: indicators.length,
    filteredIndicatorsLength: indicatorStore.getIndicatorsNeedingTargets.length
  }, targetLabels)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GaugeTank, _extends({
    filterType: _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].missingResults,
    currentIndicatorFilter: currentIndicatorFilter,
    allIndicatorsLength: indicators.length,
    filteredIndicatorsLength: indicatorStore.getIndicatorsNeedingResults.length
  }, resultsLabels)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GaugeTank, _extends({
    filterType: _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].missingEvidence,
    currentIndicatorFilter: currentIndicatorFilter // The names below are misleading as this gauge is measuring *results*, not indicators
    ,
    allIndicatorsLength: indicatorStore.getTotalResultsCount,
    filteredIndicatorsLength: indicatorStore.getTotalResultsCount - indicatorStore.getTotalResultsWithEvidenceCount
  }, evidenceLabels)));
});

/***/ }),

/***/ "xeH2":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ })

},[["aJgA","runtime","vendors"]]]);
//# sourceMappingURL=program_page-6fabb62ecb6f565e900f.js.map