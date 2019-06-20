(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["logframe"],{

/***/ "+uhY":
/*!************************************!*\
  !*** ./js/pages/logframe/index.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _models_filterStore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models/filterStore */ "ctBi");
/* harmony import */ var _models_programStore__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models/programStore */ "4P38");
/* harmony import */ var _components_title__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/title */ "1C3R");
/* harmony import */ var _components_main__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/main */ "76cx");
/**
 * Entry point for the logframe webpack bundle
 */







var filterStore = new _models_filterStore__WEBPACK_IMPORTED_MODULE_3__["default"]();
var dataStore = new _models_programStore__WEBPACK_IMPORTED_MODULE_4__["default"](jsContext);
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(mobx_react__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
  filterStore: filterStore,
  dataStore: dataStore
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_title__WEBPACK_IMPORTED_MODULE_5__["default"], null)), document.querySelector('.region-header'));
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(mobx_react__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
  filterStore: filterStore,
  dataStore: dataStore
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_main__WEBPACK_IMPORTED_MODULE_6__["default"], null)), document.querySelector('#id_div_content'));

/***/ }),

/***/ "1C3R":
/*!***********************************************!*\
  !*** ./js/pages/logframe/components/title.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");


var ExcelButton = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(function (_ref) {
  var filterStore = _ref.filterStore;
  var clickHandler = filterStore.excelUrl ? function () {
    window.open(filterStore.excelUrl, '_blank');
  } : function (e) {
    e.preventDefault();
  };
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    type: "button",
    className: "btn btn-sm btn-secondary",
    onClick: clickHandler,
    disabled: !filterStore.excelUrl
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-download"
  }), " Excel");
});
var TitleBar = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('dataStore')(function (_ref2) {
  var dataStore = _ref2.dataStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "logframe--header"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, // # Translators: short for "Logistical Framework"
  gettext('Logframe')), dataStore.results_framework && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: dataStore.results_framework_url
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-sitemap"
  }), gettext('View results framework'))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ExcelButton, null));
});
/* harmony default export */ __webpack_exports__["default"] = (TitleBar);

/***/ }),

/***/ "1ka8":
/*!**************************************************!*\
  !*** ./js/pages/logframe/components/subtitle.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../components/selectWidgets */ "Ez0T");



var SubTitleRow = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('dataStore', 'filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var dataStore = _ref.dataStore,
      filterStore = _ref.filterStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "logframe--subheader"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: dataStore.program_page_url
  }, dataStore.name)), dataStore.results_framework && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["GroupBySelect"], {
    chainLabel: dataStore.rf_chain_sort_label,
    value: filterStore.groupBy,
    update: function update(e) {
      filterStore.setGroupBy(e.target.value);
    },
    labelClass: "col-form-label",
    formGroupClass: "form-row inline-select"
  }));
}));
/* harmony default export */ __webpack_exports__["default"] = (SubTitleRow);

/***/ }),

/***/ "4Bkq":
/*!*************************************************!*\
  !*** ./js/pages/logframe/components/headers.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var HeaderCell = function HeaderCell(_ref) {
  var label = _ref.label;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "table-cell"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "spacer-span"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "table-cell__text"
  }, label));
};

var HeaderRow = function HeaderRow(_ref2) {
  var headers = _ref2.headers;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "logframe--table--row logframe--table--row__header"
  }, headers.map(function (label, idx) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(HeaderCell, {
      label: label,
      key: idx
    });
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (HeaderRow);

/***/ }),

/***/ "4P38":
/*!**************************************************!*\
  !*** ./js/pages/logframe/models/programStore.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../constants */ "v38i");
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Program data for logframe view
 */


var Indicator = function Indicator(indicatorData) {
  _classCallCheck(this, Indicator);

  this.pk = indicatorData.pk;
  this.level_order = indicatorData.level_order;
  this.name = indicatorData.name;
  this.number_display = indicatorData.number_display;
  this.means_of_verification = indicatorData.means_of_verification;
};

var Level = function Level(levelData, indicators) {
  var _this = this;

  _classCallCheck(this, Level);

  this.pk = levelData.pk;
  this.name = levelData.name;
  this.display_name = levelData.display_name;
  this.indicators = [];

  if (levelData.indicators && Array.isArray(levelData.indicators)) {
    levelData.indicators.forEach(function (indicatorPk) {
      return _this.indicators.push(indicators[indicatorPk]);
    });
  }

  this.assumptions = levelData.assumptions;
  this.child_levels = levelData.child_levels || [];
};

var ProgramStore =
/*#__PURE__*/
function () {
  function ProgramStore(programData) {
    var _this2 = this;

    _classCallCheck(this, ProgramStore);

    this._levelsByPk = {};
    this._levelsByChain = [];
    this._levelsByTier = [];
    this._indicatorsByPk = {};

    this.getChildLevels = function (levelpk) {
      var levels = [levelpk];

      _this2._levelsByPk[levelpk].child_levels.forEach(function (child_pk) {
        levels += _this2.getChildLevels(child_pk);
      });

      return levels;
    };

    this.getLevelsGroupedBy = function (grouping) {
      if (grouping === _constants__WEBPACK_IMPORTED_MODULE_0__["GROUP_BY_CHAIN"]) {
        return _this2._levelsByChain.map(function (pk) {
          return _this2._levelsByPk[pk];
        });
      } else if (grouping === _constants__WEBPACK_IMPORTED_MODULE_0__["GROUP_BY_LEVEL"]) {
        return _this2._levelsByTier.map(function (pk) {
          return _this2._levelsByPk[pk];
        });
      }

      return Object.values(_this2._levelsByPk);
    };

    this.name = programData.name;
    this.results_framework = programData.results_framework;
    this.results_framework_url = this.results_framework ? programData.results_framework_url : false;
    this.program_page_url = programData.program_page_url;
    this.rf_chain_sort_label = this.results_framework ? programData.rf_chain_sort_label : false;

    if (programData.indicators && Array.isArray(programData.indicators)) {
      programData.indicators.forEach(function (indicatorData) {
        var indicator = new Indicator(indicatorData);
        _this2._indicatorsByPk[indicator.pk] = indicator;
      });
    }

    if (programData.levels && Array.isArray(programData.levels)) {
      programData.levels.forEach(function (level) {
        var levelObj = new Level(level, _this2._indicatorsByPk);
        _this2._levelsByPk[levelObj.pk] = levelObj;

        _this2._levelsByChain.push(levelObj.pk);

        _this2._levelsByTier.push(levelObj.pk);
      });

      this._levelsByTier.sort(function (level_a, level_b) {
        var level_a_depth = _this2._levelsByPk[level_a].get_level_depth;
        var level_b_depth = _this2._levelsByPk[level_b].get_level_depth;

        if (level_a_depth < level_b_depth) {
          return -1;
        } else if (level_b_depth < level_a_depth) {
          return 1;
        }

        var level_a_customsort = _this2._levelsByPk[level_a].customsort;
        var level_b_customsort = _this2._levelsByPk[level_b].customsort;

        if (level_a_customsort < level_b_customsort) {
          return -1;
        } else if (level_b_customsort < level_a_customsort) {
          return 1;
        }

        return 0;
      });

      var sortedByChain = [];

      this._levelsByChain.filter(function (levelpk) {
        return _this2._levelsByPk[levelpk].get_level_depth == 1;
      }).forEach(function (levelpk) {
        sortedByChain += _this2.getChildLevels(levelPk);
      });

      this._levelsByChain = sortedByChain;
    }
  }

  _createClass(ProgramStore, [{
    key: "oldLevels",
    get: function get() {
      return Object.values(this._levelsByPk);
    }
  }]);

  return ProgramStore;
}();

/* harmony default export */ __webpack_exports__["default"] = (ProgramStore);

/***/ }),

/***/ "76cx":
/*!**********************************************!*\
  !*** ./js/pages/logframe/components/main.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _subtitle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./subtitle */ "1ka8");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./table */ "vkjH");





var LogframeApp = function LogframeApp() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_subtitle__WEBPACK_IMPORTED_MODULE_2__["default"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "logframe--table--wrapper"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_table__WEBPACK_IMPORTED_MODULE_3__["default"], null)));
};

/* harmony default export */ __webpack_exports__["default"] = (LogframeApp);

/***/ }),

/***/ "Ez0T":
/*!****************************************!*\
  !*** ./js/components/selectWidgets.js ***!
  \****************************************/
/*! exports provided: SingleReactSelect, DateSelect, SingleSelect, MultiSelectCheckbox, GroupBySelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SingleReactSelect", function() { return SingleReactSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DateSelect", function() { return DateSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SingleSelect", function() { return SingleSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MultiSelectCheckbox", function() { return MultiSelectCheckbox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupBySelect", function() { return GroupBySelect; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-multiselect-checkboxes */ "VCnP");
/* harmony import */ var react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _formUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../formUtils */ "G56O");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants */ "v38i");
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var SingleReactSelect = function SingleReactSelect(props) {
  var selectId = Object(_formUtils__WEBPACK_IMPORTED_MODULE_3__["uniqueId"])('react-select');
  var labelClasses = props.labelClasses || "col-form-label text-uppercase";
  var formRowClasses = props.formRowClasses || "form-row mb-3";
  var selectClasses = props.selectClasses || "tola-react-select";
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: formRowClasses
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: selectId,
    className: labelClasses
  }, props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_1__["default"], {
    onChange: props.update,
    value: props.value,
    id: selectId,
    className: selectClasses,
    isDisabled: props.disabled,
    options: props.options
  }));
};
var DateSelect = function DateSelect(props) {
  var selectId = Object(_formUtils__WEBPACK_IMPORTED_MODULE_3__["uniqueId"])('date-select');
  var formattedOptions = props.options && props.options.length == 1 && props.options[0].value !== undefined ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
    value: props.options[0].value
  }, props.options[0].label) : props.options && props.options[0].options !== undefined ? props.options.map(function (optgroup, index) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("optgroup", {
      label: optgroup.label,
      key: index
    }, optgroup.options.map(function (option) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
        value: option.value,
        key: option.value
      }, option.label);
    }));
  }) : props.options.map(function (option, index) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: option.value,
      key: index
    }, option.label);
  });
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-row mb-3"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: selectId,
    className: "col-form-label text-uppercase"
  }, props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
    className: "form-control",
    id: selectId,
    value: props.value,
    onChange: props.update,
    disabled: props.disabled
  }, formattedOptions));
};
var SingleSelect = function SingleSelect(props) {
  var selectId = Object(_formUtils__WEBPACK_IMPORTED_MODULE_3__["uniqueId"])('react-select');
  var formGroupClass = props.formGroupClass || "form-row mb-3";
  var labelClass = props.labelClass || "col-form-label text-uppercase";
  var selectClass = props.selectClass || "form-control";
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: formGroupClass
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: selectId,
    className: labelClass
  }, props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
    onChange: props.update,
    value: props.value,
    id: selectId,
    className: selectClass,
    disabled: props.disabled
  }, props.options));
};
/**
 * styling element to replace OptGroup headings in react multiselect checkbox widgets - used for
 * MultiSelectCheckbox when optgroups are required
 */

var GroupHeading = function GroupHeading(props) {
  if (props.children == '') {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null);
  } else {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("hr", {
      style: {
        margin: '3px 0px 0px 0px'
      }
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "text-muted",
      style: {
        textTransform: 'uppercase',
        paddingLeft: '4px',
        marginBottom: '2px'
      }
    }, props.children));
  }
};
/**
 * Styles ReactMultiSelectCheckbox to fit Tola styles
 */


var MultiSelectCheckbox = function MultiSelectCheckbox(props) {
  var selectId = Object(_formUtils__WEBPACK_IMPORTED_MODULE_3__["uniqueId"])('multiselect');
  var multiSelectProps = !props.options || props.options.length == 0 ? {
    getDropdownButtonLabel: function getDropdownButtonLabel() {
      return gettext('None available');
    },
    isDisabled: true,
    menuIsOpen: false,
    options: []
  } : {
    isMulti: true,
    options: props.options,
    getDropdownButtonLabel: function getDropdownButtonLabel(_ref) {
      if (!_ref.value) {
        return gettext('None selected');
      }

      if (Array.isArray(_ref.value)) {
        if (_ref.value.length == 0) {
          return gettext('None selected');
        }

        if (_ref.value.length == 1) {
          return _ref.value[0].label;
        }

        return "".concat(_ref.value.length, "  ").concat(gettext('selected'));
      }

      return _ref.value.label;
    }
  };
  var baseStyles = {
    dropdownButton: function dropdownButton(base) {
      return !props.options || props.options.length == 0 ? _objectSpread({}, base, {
        backgroundColor: '#E5E6E8',
        background: ''
      }) : base;
    },
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

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-row mb-2 tola-react-multiselect-row"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: selectId,
    className: "col-form-label text-uppercase"
  }, props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2___default.a, _extends({
    id: selectId,
    styles: baseStyles,
    formatOptionLabel: formatOptionLabel,
    components: {
      GroupHeading: GroupHeading
    },
    value: props.value,
    onChange: props.update
  }, multiSelectProps)));
};
var GroupBySelect = function GroupBySelect(_ref2) {
  var chainLabel = _ref2.chainLabel,
      selectProps = _objectWithoutProperties(_ref2, ["chainLabel"]);

  var options = [react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
    value: _constants__WEBPACK_IMPORTED_MODULE_4__["GROUP_BY_CHAIN"],
    key: 1
  }, chainLabel), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
    value: _constants__WEBPACK_IMPORTED_MODULE_4__["GROUP_BY_LEVEL"],
    key: 2
  },
  /* # Translators: refers to grouping the report by the level of the indicator */
  gettext('by Level'))];
  ;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SingleSelect, _extends({
    label:
    /* # Translators: menu for selecting how rows are grouped in a report */
    gettext('Group indicators'),
    options: options
  }, selectProps));
};

/***/ }),

/***/ "G56O":
/*!*************************!*\
  !*** ./js/formUtils.js ***!
  \*************************/
/*! exports provided: uniqueId */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uniqueId", function() { return uniqueId; });
/*
 * ID generating code &c. for form inputs
 */
var lastId = 0;
function uniqueId() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'id';
  lastId++;
  return "".concat(prefix).concat(lastId);
}

/***/ }),

/***/ "ctBi":
/*!*************************************************!*\
  !*** ./js/pages/logframe/models/filterStore.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var router5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! router5 */ "wgi2");
/* harmony import */ var router5_plugin_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! router5-plugin-browser */ "0pHI");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../constants */ "v38i");
var _class, _descriptor, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }

/**
 * Filters for the logframe web view
 */




var FilterStore = (_class = (_temp =
/*#__PURE__*/
function () {
  function FilterStore() {
    var _this = this;

    _classCallCheck(this, FilterStore);

    _initializerDefineProperty(this, "groupBy", _descriptor, this);

    this.routes = [{
      name: 'logframe',
      path: '/:programId<\\d+>/logframe/?groupby'
    }];

    this.updateState = function (_ref) {
      var route = _ref.route,
          prevRoute = _ref.prevRoute;
      _this.groupBy = route.params.groupby;
    };

    this.router = Object(router5__WEBPACK_IMPORTED_MODULE_0__["default"])(this.routes, {
      trailingSlashMode: 'always'
    });
    this.router.usePlugin(Object(router5_plugin_browser__WEBPACK_IMPORTED_MODULE_1__["default"])({
      useHash: false,
      base: '/program'
    }));
    this.router.subscribe(this.updateState);
    this.router.start();
    this.headerColumns = [gettext('Result level'), gettext('Indicators'), gettext('Means of verification'), gettext('Assumptions')];
  }

  _createClass(FilterStore, [{
    key: "setGroupBy",
    value: function setGroupBy(groupBy) {
      groupBy = parseInt(groupBy);

      var _this$router$getState = this.router.getState(),
          name = _this$router$getState.name,
          params = _this$router$getState.params;

      if ([_constants__WEBPACK_IMPORTED_MODULE_3__["GROUP_BY_CHAIN"], _constants__WEBPACK_IMPORTED_MODULE_3__["GROUP_BY_LEVEL"]].includes(groupBy)) {
        params.groupby = groupBy;
      }

      this.router.navigate(name, params, {
        reload: true
      });
    }
  }, {
    key: "programId",
    get: function get() {
      var state = this.router.getState();
      return state.params.programId || null;
    }
  }, {
    key: "excelUrl",
    get: function get() {
      return false;
    }
  }]);

  return FilterStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "groupBy", [mobx__WEBPACK_IMPORTED_MODULE_2__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _applyDecoratedDescriptor(_class.prototype, "programId", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "programId"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "excelUrl", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "excelUrl"), _class.prototype)), _class);
/* harmony default export */ __webpack_exports__["default"] = (FilterStore);

/***/ }),

/***/ "v38i":
/*!*************************!*\
  !*** ./js/constants.js ***!
  \*************************/
/*! exports provided: BLANK_OPTION, BLANK_LABEL, BLANK_TABLE_CELL, TVA, TIMEPERIODS, TIME_AWARE_FREQUENCIES, GROUP_BY_CHAIN, GROUP_BY_LEVEL, getPeriodLabels, STATUS_CODES */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLANK_OPTION", function() { return BLANK_OPTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLANK_LABEL", function() { return BLANK_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLANK_TABLE_CELL", function() { return BLANK_TABLE_CELL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TVA", function() { return TVA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TIMEPERIODS", function() { return TIMEPERIODS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TIME_AWARE_FREQUENCIES", function() { return TIME_AWARE_FREQUENCIES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GROUP_BY_CHAIN", function() { return GROUP_BY_CHAIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GROUP_BY_LEVEL", function() { return GROUP_BY_LEVEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPeriodLabels", function() { return getPeriodLabels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STATUS_CODES", function() { return STATUS_CODES; });
/**
 * IPTT Constants:
 */
var BLANK_LABEL = '---------';
var BLANK_OPTION = {
  value: null,
  label: BLANK_LABEL
};
var BLANK_TABLE_CELL = '—';
var TVA = 1;
var TIMEPERIODS = 2;
var TIME_AWARE_FREQUENCIES = [3, 4, 5, 6, 7];

var GROUP_BY_CHAIN = 1;
var GROUP_BY_LEVEL = 2;


var _gettext = typeof gettext !== 'undefined' ? gettext : function (s) {
  return s;
};

function getPeriodLabels() {
  return {
    targetperiodLabels: {
      1: _gettext("Life of Program (LoP) only"),
      3: _gettext("Annual"),
      2: _gettext("Midline and endline"),
      5: _gettext("Tri-annual"),
      4: _gettext("Semi-annual"),
      7: _gettext("Monthly"),
      6: _gettext("Quarterly")
    },
    timeperiodLabels: {
      3: _gettext("Years"),
      5: _gettext("Tri-annual periods"),
      4: _gettext("Semi-annual periods"),
      7: _gettext("Months"),
      6: _gettext("Quarters")
    }
  };
}


var STATUS_CODES = {
  NO_INDICATOR_IN_UPDATE: 1
};

/***/ }),

/***/ "vkjH":
/*!***********************************************!*\
  !*** ./js/pages/logframe/components/table.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _headers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./headers */ "4Bkq");
var _dec, _class, _class2;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }






var LevelNameCell = function LevelNameCell(_ref) {
  var name = _ref.name;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "table-cell level-cell"
  }, name);
};

var IndicatorCell = function IndicatorCell(_ref2) {
  var indicator = _ref2.indicator;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "table-cell--text"
  }, gettext('Indicator'), " ", indicator.number_display, ": ", indicator.name);
};

var MeansCell = function MeansCell(_ref3) {
  var indicator = _ref3.indicator;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "table-cell--text"
  }, indicator.means_of_verification);
};

var IndicatorCells = function IndicatorCells(_ref4) {
  var indicators = _ref4.indicators;

  if (!indicators) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "table-cell-inner-row colspan-2 table-cell "
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "table-cell--text table-cell--empty"
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "table-cell--text table-cell--empty"
    }));
  }

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "table-cell-column colspan-2"
  }, indicators.map(function (indicator, idx) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "table-cell-inner-row",
      key: idx
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
      indicator: indicator,
      key: "ind".concat(idx)
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(MeansCell, {
      indicator: indicator,
      key: "means".concat(idx)
    }));
  }));
};

var AssumptionsCell = function AssumptionsCell(_ref5) {
  var assumptions = _ref5.assumptions;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "table-cell"
  }, assumptions);
};

var LevelRow = function LevelRow(_ref6) {
  var level = _ref6.level;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "logframe--table--row"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelNameCell, {
    name: level.display_name
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCells, {
    indicators: level.indicators
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(AssumptionsCell, {
    assumptions: level.assumptions
  }));
};

var LogframeTable = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('dataStore', 'filterStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = (_class2 =
/*#__PURE__*/
function (_React$Component) {
  _inherits(LogframeTable, _React$Component);

  function LogframeTable(props) {
    _classCallCheck(this, LogframeTable);

    return _possibleConstructorReturn(this, _getPrototypeOf(LogframeTable).call(this, props));
  }

  _createClass(LogframeTable, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headers__WEBPACK_IMPORTED_MODULE_3__["default"], {
        headers: this.props.filterStore.headerColumns
      }), this.levels.map(function (level, idx) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelRow, {
          level: level,
          key: idx
        });
      }));
    }
  }, {
    key: "levels",
    get: function get() {
      if (this.props.dataStore.results_framework) {
        return this.props.dataStore.getLevelsGroupedBy(this.props.filterStore.groupBy);
      }

      return this.props.dataStore.oldLevels;
    }
  }]);

  return LogframeTable;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), (_applyDecoratedDescriptor(_class2.prototype, "levels", [mobx__WEBPACK_IMPORTED_MODULE_1__["computed"]], Object.getOwnPropertyDescriptor(_class2.prototype, "levels"), _class2.prototype)), _class2)) || _class) || _class);
/* harmony default export */ __webpack_exports__["default"] = (LogframeTable);

/***/ })

},[["+uhY","runtime","vendors"]]]);
//# sourceMappingURL=logframe-cbf628a004a62ef0ef6b.js.map