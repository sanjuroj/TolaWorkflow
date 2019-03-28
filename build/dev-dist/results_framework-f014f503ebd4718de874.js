(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["results_framework"],{

/***/ "/l02":
/*!*******************************************************************!*\
  !*** ./js/pages/results_framework/components/leveltier_picker.js ***!
  \*******************************************************************/
/*! exports provided: LevelTierPicker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelTierPicker", function() { return LevelTierPicker; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "y2Vs");
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




var Picker = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('uiStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Picker, _React$Component);

  function Picker() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Picker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Picker)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleChange = function (selectedPreset) {
      _this.props.uiStore.changePreset(selectedPreset.value);
    };

    return _this;
  }

  _createClass(Picker, [{
    key: "render",
    value: function render() {
      var options = Object.keys(this.props.uiStore.tierPresets).map(function (val) {
        return {
          value: val,
          label: val
        };
      });
      var selectedOption = {
        value: this.props.uiStore.selectedPreset,
        label: this.props.uiStore.selectedPreset
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        options: options,
        value: selectedOption,
        onChange: this.handleChange
      });
    }
  }]);

  return Picker;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);

var LevelTier =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(LevelTier, _React$Component2);

  function LevelTier() {
    _classCallCheck(this, LevelTier);

    return _possibleConstructorReturn(this, _getPrototypeOf(LevelTier).apply(this, arguments));
  }

  _createClass(LevelTier, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, " ", this.props.tierName, " ");
    }
  }]);

  return LevelTier;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var LevelTierList = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('uiStore'), _dec2(_class3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class3 =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(LevelTierList, _React$Component3);

  function LevelTierList() {
    _classCallCheck(this, LevelTierList);

    return _possibleConstructorReturn(this, _getPrototypeOf(LevelTierList).apply(this, arguments));
  }

  _createClass(LevelTierList, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "leveltier-list"
      }, this.props.uiStore.tierList.map(function (tier, index) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTier, {
          key: index,
          tierName: tier
        });
      }));
    }
  }]);

  return LevelTierList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class3) || _class3);
var LevelTierPicker = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "leveltier-picker",
    style: {
      marginRight: "3em"
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Picker, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTierList, null));
});

/***/ }),

/***/ "FtQq":
/*!**********************************************!*\
  !*** ./js/pages/results_framework/models.js ***!
  \**********************************************/
/*! exports provided: RFPageStore, RFPageUIStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RFPageStore", function() { return RFPageStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RFPageUIStore", function() { return RFPageUIStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
var _class, _descriptor, _descriptor2, _temp, _class3, _descriptor3, _descriptor4, _temp2;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }


var RFPageStore = (_class = (_temp = function RFPageStore(levels, levelTiers, tierPresets) {
  _classCallCheck(this, RFPageStore);

  _initializerDefineProperty(this, "levels", _descriptor, this);

  _initializerDefineProperty(this, "levelTiers", _descriptor2, this);

  this.tierPresets = {};
  this.levels = levels.sort(function (a, b) {
    if (a.ontology < b.ontology) {
      return -1;
    }

    if (b.ontology < a.ontology) {
      return 1;
    }

    return 0;
  });
  this.levelTiers = levelTiers;
  this.tierPresets = tierPresets;
}, _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "levels", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "levelTiers", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
})), _class);
var RFPageUIStore = (_class3 = (_temp2 =
/*#__PURE__*/
function () {
  function RFPageUIStore(levelTiers, tierPresets) {
    _classCallCheck(this, RFPageUIStore);

    _initializerDefineProperty(this, "selectedPreset", _descriptor3, this);

    _initializerDefineProperty(this, "levelTiers", _descriptor4, this);

    this.tierPresets = void 0;
    this.defaultPreset = 'Mercy Corps standard';

    if (levelTiers.length) {
      this.selectedPreset = this.derive_preset_name(levelTiers, tierPresets);
      this.levelTiers = levelTiers;
    } else {
      this.selectedPreset = this.defaultPreset;
      this.levelTiers = tierPresets[this.defaultPreset];
    }

    this.tierPresets = tierPresets;
    this.changePreset = this.changePreset.bind(this);
  }

  _createClass(RFPageUIStore, [{
    key: "changePreset",
    value: function changePreset(newPreset) {
      this.selectedPreset = newPreset;
    }
  }, {
    key: "derive_preset_name",
    value: function derive_preset_name(levelTiers, tierPresets) {
      if (!levelTiers) {
        return None;
      }

      for (var preset_name in tierPresets) {
        return preset_name;
      }
    }
  }, {
    key: "tierList",
    get: function get() {
      if (!this.selectedPreset && !this.levelTiers) {
        return null;
      } else if (this.selectedPreset in this.tierPresets) {
        return this.tierPresets[this.selectedPreset];
      } else {
        return this.levelTiers;
      }
    }
  }]);

  return RFPageUIStore;
}(), _temp2), (_descriptor3 = _applyDecoratedDescriptor(_class3.prototype, "selectedPreset", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class3.prototype, "levelTiers", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class3.prototype, "tierList", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class3.prototype, "tierList"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "changePreset", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "changePreset"), _class3.prototype)), _class3);

/***/ }),

/***/ "QTZG":
/*!*********************************************!*\
  !*** ./js/pages/results_framework/index.js ***!
  \*********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../eventbus */ "qtBC");
/* harmony import */ var router5__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! router5 */ "wgi2");
/* harmony import */ var router5_plugin_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! router5-plugin-browser */ "0pHI");
/* harmony import */ var _components_level_list__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/level_list */ "t8du");
/* harmony import */ var _components_leveltier_picker__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/leveltier_picker */ "/l02");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./models */ "FtQq");









/*
 * Model/Store setup
 */

var _jsContext = jsContext,
    levels = _jsContext.levels,
    levelTiers = _jsContext.levelTiers,
    tierPresets = _jsContext.tierPresets;
var rootStore = new _models__WEBPACK_IMPORTED_MODULE_8__["RFPageStore"](levels, levelTiers, tierPresets);
var uiStore = new _models__WEBPACK_IMPORTED_MODULE_8__["RFPageUIStore"](levelTiers, tierPresets);
/*
 * React components on page
 */

react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(mobx_react__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
  uiStore: uiStore,
  rootStore: rootStore
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
  style: {
    display: "flex"
  }
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_leveltier_picker__WEBPACK_IMPORTED_MODULE_7__["LevelTierPicker"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_level_list__WEBPACK_IMPORTED_MODULE_6__["LevelListing"], null))), document.querySelector('#level-builder-react-component')); // ReactDOM.render(<LevelList rootStore={rootStore}
//                                 uiStore={uiStore} />,
//     document.querySelector('#level-list-react-component'));

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

/***/ "t8du":
/*!*************************************************************!*\
  !*** ./js/pages/results_framework/components/level_list.js ***!
  \*************************************************************/
/*! exports provided: LevelListing */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelListing", function() { return LevelListing; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../eventbus */ "qtBC");
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "7O5W");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "wHSu");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../models */ "FtQq");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-select */ "y2Vs");
var _dec, _class;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }










_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_4__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faCaretDown"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faCaretRight"]);

var LevelCard =
/*#__PURE__*/
function (_React$Component) {
  _inherits(LevelCard, _React$Component);

  function LevelCard() {
    _classCallCheck(this, LevelCard);

    return _possibleConstructorReturn(this, _getPrototypeOf(LevelCard).apply(this, arguments));
  }

  _createClass(LevelCard, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, this.props.level.name);
    }
  }]);

  return LevelCard;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var LevelList = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(LevelList, _React$Component2);

  function LevelList() {
    _classCallCheck(this, LevelList);

    return _possibleConstructorReturn(this, _getPrototypeOf(LevelList).apply(this, arguments));
  }

  _createClass(LevelList, [{
    key: "render",
    value: function render() {
      return this.props.rootStore.levels.map(function (level, index) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelCard, {
          key: index,
          level: level
        });
      });
    }
  }]);

  return LevelList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class) || _class);
var LevelListing = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "level-list",
    style: {
      flexGrow: "2"
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelList, null));
});

/***/ })

},[["QTZG","runtime","vendors"]]]);
//# sourceMappingURL=results_framework-f014f503ebd4718de874.js.map