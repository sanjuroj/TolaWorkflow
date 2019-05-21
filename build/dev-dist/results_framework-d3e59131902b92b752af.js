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
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-select */ "y2Vs");
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





var Picker = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp =
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
      _this.props.rootStore.levelStore.changeTierSet(selectedPreset.value);
    };

    return _this;
  }

  _createClass(Picker, [{
    key: "render",
    value: function render() {
      var options = Object.keys(this.props.rootStore.levelStore.tierPresets).map(function (val) {
        return {
          value: val,
          label: val
        };
      });
      var selectedOption = {
        value: this.props.rootStore.levelStore.chosenTierSet,
        label: this.props.rootStore.levelStore.chosenTierSetName
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "leveltier-picker__selectbox"
      }, "Results framework template", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
        options: options,
        value: selectedOption,
        onChange: this.handleChange
      }));
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
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: 'leveltier leveltier--level-' + this.props.tierLevel
      }, this.props.tierName, " ");
    }
  }]);

  return LevelTier;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var LevelTierList = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec2(_class3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class3 =
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
      var apply_button = null;

      if (this.props.rootStore.levelStore.levels.length == 0) {
        apply_button = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
          className: "leveltier-button btn btn-primary btn-block",
          onClick: this.props.rootStore.levelStore.createFirstLevel
        }, gettext("Apply"));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "leveltier-list",
        className: "leveltier-list"
      }, this.props.rootStore.levelStore.chosenTierSet.length > 0 ? this.props.rootStore.levelStore.chosenTierSet.map(function (tier, index) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTier, {
          key: index,
          tierLevel: index,
          tierName: tier
        });
      }) : null), apply_button ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "leveltier-list__actions"
      }, apply_button) : null);
    }
  }]);

  return LevelTierList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class3) || _class3);
var LevelTierPicker = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "leveltier-picker",
    className: "leveltier-picker"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Picker, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTierList, null));
});

/***/ }),

/***/ "5Za8":
/*!**************************************************************!*\
  !*** ./js/pages/results_framework/components/level_cards.js ***!
  \**************************************************************/
/*! exports provided: LevelTitle, LevelCardCollapsed, LevelCardExpanded */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelTitle", function() { return LevelTitle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelCardCollapsed", function() { return LevelCardCollapsed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelCardExpanded", function() { return LevelCardExpanded; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "7O5W");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "wHSu");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-select */ "y2Vs");
var _dec, _class, _temp, _dec2, _class3, _temp2;

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
var LevelTitle =
/*#__PURE__*/
function (_React$Component) {
  _inherits(LevelTitle, _React$Component);

  function LevelTitle() {
    _classCallCheck(this, LevelTitle);

    return _possibleConstructorReturn(this, _getPrototypeOf(LevelTitle).apply(this, arguments));
  }

  _createClass(LevelTitle, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", {
        className: 'level-title ' + this.props.classes
      }, this.props.tierName, this.props.ontologyLabel ? " " + this.props.ontologyLabel : null);
    }
  }]);

  return LevelTitle;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);
var LevelCardCollapsed = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(LevelCardCollapsed, _React$Component2);

  function LevelCardCollapsed(props) {
    var _this;

    _classCallCheck(this, LevelCardCollapsed);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LevelCardCollapsed).call(this, props));

    _this.editLevel = function () {
      _this.props.rootStore.uiStore.addExpandedCard(_this.props.level.id);
    };

    _this.deleteLevel = _this.deleteLevel.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.editLevel = _this.editLevel.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(LevelCardCollapsed, [{
    key: "deleteLevel",
    value: function deleteLevel() {
      console.log("You clicked delete level");
    }
  }, {
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "level-card level-card--collapsed",
        id: this.props.level.id
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "level-card--collapsed__name"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTitle, {
        tierName: this.props.levelProps.tierName,
        ontologyLabel: this.props.levelProps.ontologyLabel,
        classes: "level-title--collapsed"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, "\xA0", this.props.level.name)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "level-card--collapsed__actions"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "actions__top",
        style: {
          display: "flex",
          justifyContent: "flex-end"
        }
      }, this.props.levelProps.canDelete && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-sm btn-link btn-danger",
        onClick: this.deleteLevel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-trash-alt"
      }), "\xA0", gettext("Delete")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-sm btn-link btn-text",
        onClick: this.editLevel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-edit"
      }), "\xA0", gettext("Edit"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "actions__bottom",
        style: {
          display: "flex",
          justifyContent: "flex-end"
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-sm btn-link no-bold"
      }, "[n] ", gettext("indicators")))));
    }
  }]);

  return LevelCardCollapsed;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);
var LevelCardExpanded = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec2(_class3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class3 = (_temp2 =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(LevelCardExpanded, _React$Component3);

  function LevelCardExpanded(props) {
    var _this2;

    _classCallCheck(this, LevelCardExpanded);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(LevelCardExpanded).call(this, props));

    _this2.updateSubmitType = function (newType) {
      _this2.submitType = newType;
    };

    _this2.saveLevel = function (e) {
      e.preventDefault();
      var formData = new FormData(e.target);

      _this2.props.rootStore.levelStore.saveLevelToDB(_this2.submitType, _this2.props.level.id, {
        name: _this2.name,
        assumptions: _this2.assumptions
      });
    };

    _this2.cancelEdit = function (e) {
      _this2.props.rootStore.levelStore.cancelEdit(_this2.props.level.id);
    };

    _this2.onFormChange = function (event) {
      event.preventDefault();
      _this2[event.target.name] = event.target.value;
    };

    _this2.submitType = "saveOnly";
    Object(mobx__WEBPACK_IMPORTED_MODULE_3__["extendObservable"])(_assertThisInitialized(_assertThisInitialized(_this2)), {
      name: props.level.name,
      assumptions: props.level.assumptions
    });
    return _this2;
  }
  /*
  Using this allows us to use the same submit function for all three buttons.  Shame the function has to
  be passed all the way down to the button to work.
   */


  _createClass(LevelCardExpanded, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "level-card level-card--expanded",
        id: this.props.level.id
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTitle, {
        tierName: this.props.levelProps.tierName,
        ontologyLabel: this.props.levelProps.ontologyLabel,
        classes: "level-title--expanded"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "level-card--expanded__form",
        onSubmit: this.saveLevel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", {
        className: "form-control",
        type: "text",
        id: "level-name",
        name: "name",
        value: this.name || "",
        onChange: this.onFormChange
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "assumptions"
      }, "Assumptions"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", {
        className: "form-control",
        type: "text",
        id: "level-assumptions",
        name: "assumptions",
        value: this.assumptions || "",
        onChange: this.onFormChange
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ButtonBar, {
        level: this.props.level,
        submitFunc: this.updateSubmitType,
        cancelFunc: this.cancelEdit,
        tierCount: this.props.rootStore.levelStore.chosenTierSet.length
      })));
    }
  }]);

  return LevelCardExpanded;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp2)) || _class3) || _class3);

var ButtonBar =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(ButtonBar, _React$Component4);

  function ButtonBar() {
    _classCallCheck(this, ButtonBar);

    return _possibleConstructorReturn(this, _getPrototypeOf(ButtonBar).apply(this, arguments));
  }

  _createClass(ButtonBar, [{
    key: "render",
    value: function render() {
      var addAnotherButton = null;

      if (this.props.level.parent != null && this.props.level.parent != "root") {
        addAnotherButton = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelButton, {
          classes: "btn-primary",
          text: gettext("Save and another"),
          submitType: "saveAndAddSibling",
          submitFunc: this.props.submitFunc
        });
      }

      var addAndLinkButton = null;

      if (this.props.level.level_depth < this.props.tierCount) {
        addAndLinkButton = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelButton, {
          classes: "btn-primary",
          text: gettext("Save and link"),
          submitType: "saveAndAddChild",
          submitFunc: this.props.submitFunc
        });
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "button-bar"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelButton, {
        classes: "btn-primary",
        text: gettext("Save and close"),
        submitType: "saveOnly",
        submitFunc: this.props.submitFunc
      }), addAnotherButton, addAndLinkButton, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelButton, {
        classes: "btn-reset",
        text: gettext("Cancel"),
        submitType: "cancel",
        submitFunc: this.props.cancelFunc
      }));
    }
  }]);

  return ButtonBar;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var LevelButton =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(LevelButton, _React$Component5);

  function LevelButton() {
    _classCallCheck(this, LevelButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(LevelButton).apply(this, arguments));
  }

  _createClass(LevelButton, [{
    key: "render",
    value: function render() {
      var _this3 = this;

      var buttonType = this.props.submitType == "cancel" ? "button" : "submit";
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: buttonType,
        className: this.props.classes + ' level-button btn btn-sm',
        onClick: function onClick() {
          return _this3.props.submitFunc(_this3.props.submitType);
        }
      }, this.props.text);
    }
  }]);

  return LevelButton;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

/***/ }),

/***/ "FtQq":
/*!**********************************************!*\
  !*** ./js/pages/results_framework/models.js ***!
  \**********************************************/
/*! exports provided: RootStore, LevelStore, UIStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RootStore", function() { return RootStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelStore", function() { return LevelStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UIStore", function() { return UIStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _level_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../level_utils */ "IzLX");
/* harmony import */ var _api_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../api.js */ "XoI5");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp, _class3, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _temp2;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var RootStore = function RootStore(program_id, levels, levelTiers, tierPresets) {
  _classCallCheck(this, RootStore);

  this.levelStore = new LevelStore(program_id, levels, levelTiers, tierPresets, this);
  this.uiStore = new UIStore(this);
};
var LevelStore = (_class = (_temp =
/*#__PURE__*/
function () {
  function LevelStore(program_id, levels, levelTiers, tierPresets, rootStore) {
    var _this = this;

    _classCallCheck(this, LevelStore);

    _initializerDefineProperty(this, "levels", _descriptor, this);

    _initializerDefineProperty(this, "chosenTierSet", _descriptor2, this);

    _initializerDefineProperty(this, "chosenTierSetName", _descriptor3, this);

    this.tierPresets = {};
    this.defaultPreset = "Mercy Corps standard";
    this.program_id = "";

    _initializerDefineProperty(this, "cancelEdit", _descriptor4, this);

    _initializerDefineProperty(this, "createNewLevelFromSibling", _descriptor5, this);

    _initializerDefineProperty(this, "createFirstLevel", _descriptor6, this);

    this.saveLevelTiersToDB = function () {
      var tier_data = {
        program_id: _this.program_id,
        tiers: _this.chosenTierSet
      };
      _api_js__WEBPACK_IMPORTED_MODULE_2__["api"].post("/save_leveltiers/", tier_data).then(function (response) {
        console.log("Level Tiers Saved!");
      }).catch(function (error) {
        return console.log('error', error);
      });
    };

    this.saveLevelToDB = function (submitType, levelId, formData) {
      var targetLevel = _this.levels.find(function (level) {
        return level.id == levelId;
      });

      var levelToSave = Object.assign(Object(mobx__WEBPACK_IMPORTED_MODULE_0__["toJS"])(targetLevel), formData);

      if (levelId == "new") {
        if (levelToSave.parent == "root") {
          _this.saveLevelTiersToDB();
        }

        delete levelToSave.id;
        _api_js__WEBPACK_IMPORTED_MODULE_2__["api"].post("/insert_new_level/", levelToSave).then(function (response) {
          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this.levels.replace(response.data);
          });
        }).catch(function (error) {
          return console.log('error', error);
        });
      } else {
        _api_js__WEBPACK_IMPORTED_MODULE_2__["api"].put("/level/".concat(levelId, "/"), levelToSave).then(function (response) {
          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            Object.assign(targetLevel, response.data);
          });

          _this.rootStore.uiStore.removeExpandedCard(levelId);

          if (submitType == "saveAndAddSibling") {
            _this.createNewLevelFromSibling(levelId);
          }
        }).catch(function (error) {
          console.log("There was an error:", error);
        });
      }
    };

    this.buildOntology = function (levelId) {
      var ontologyArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var level = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["toJS"])(_this.levels.find(function (l) {
        return l.id == levelId;
      }));
      /*  If there is no parent (saved top tier level) or the parent is "root" (unsaved top tier level)
          then we should return with adding to the ontology because there is no ontology entry for the top tier
       */

      if (level.parent && level.parent != "root") {
        ontologyArray.unshift(level.customsort);
        return _this.buildOntology(level.parent, ontologyArray);
      } else {
        return ontologyArray.join(".");
      }
    };

    this.rootStore = rootStore;
    this.levels = levels;
    this.tierPresets = tierPresets;
    this.program_id = program_id; // Set the stored tierset and its name, if they exist.  Use the default if they don't.

    if (levelTiers.length > 0) {
      this.chosenTierSet = levelTiers.map(function (t) {
        return t.name;
      });
      this.chosenTierSetName = this.derive_preset_name(levelTiers, tierPresets);
    } else {
      this.chosenTierSetName = this.defaultPreset;
      this.chosenTierSet = this.tierPresets[this.defaultPreset];
    }
  }

  _createClass(LevelStore, [{
    key: "changeTierSet",
    value: function changeTierSet(newTierSetName) {
      this.chosenTierSetName = newTierSetName;
      this.chosenTierSet = this.tierPresets[newTierSetName];
    }
  }, {
    key: "derive_preset_name",
    value: function derive_preset_name(levelTiers, tierPresets) {
      if (!levelTiers) {
        return None;
      }

      var levelTiersArray = levelTiers.sort(function (t) {
        return t.tier_depth;
      }).map(function (t) {
        return t.name;
      });
      var levelTierStr = JSON.stringify(levelTiersArray);

      for (var presetName in tierPresets) {
        if (levelTiers.length != tierPresets[presetName].length) {
          continue;
        }

        var presetValues = JSON.stringify(tierPresets[presetName]);

        if (levelTierStr == presetValues) {
          return presetName;
        }
      }

      return "Custom";
    }
  }, {
    key: "sortedLevels",
    get: function get() {
      return this.levels.slice().sort(function (a, b) {
        a.level_depth - b.level_depth || a.customsort - b.customsort;
      });
    }
  }, {
    key: "levelProperties",
    get: function get() {
      var _this2 = this;

      var levelProperties = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var level = _step.value;
          var properties = {};
          properties['ontologyLabel'] = _this2.buildOntology(level.id);
          properties['tierName'] = _this2.chosenTierSet[level.level_depth - 1];

          var childCount = _this2.levels.filter(function (l) {
            return l.parent == level.id;
          }).length;

          properties['canDelete'] = childCount == 0;
          levelProperties[level.id] = properties;
        };

        for (var _iterator = this.levels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return levelProperties;
    }
  }]);

  return LevelStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "levels", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "chosenTierSet", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "chosenTierSetName", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return "";
  }
}), _applyDecoratedDescriptor(_class.prototype, "sortedLevels", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "sortedLevels"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "levelProperties", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "levelProperties"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeTierSet", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeTierSet"), _class.prototype), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "cancelEdit", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this3 = this;

    return function (levelId) {
      _this3.rootStore.uiStore.removeExpandedCard(levelId);

      _this3.levels.replace(_this3.levels.filter(function (element) {
        return element.id != "new";
      }));
    };
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "createNewLevelFromSibling", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this4 = this;

    return function (siblingId) {
      // Copy sibling data for the new level and then clear some of it out
      var sibling = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["toJS"])(_this4.levels.find(function (l) {
        return l.id == siblingId;
      }));
      var newLevel = Object.assign({}, sibling);
      newLevel.customsort += 1;
      newLevel.id = "new";
      newLevel.name = "";
      newLevel.assumptions = ""; // bump the customsort field for siblings that come after the inserted Level

      var siblingsToReorder = _this4.levels.filter(function (l) {
        return l.customsort > sibling.customsort && l.parent == sibling.parent;
      });

      siblingsToReorder.forEach(function (sib) {
        return sib.customsort += 1;
      }); // add new Level to the various Store components

      _this4.rootStore.uiStore.expandedCards.push("new");

      _this4.rootStore.uiStore.activeCard = "new";

      _this4.levels.push(newLevel);
    };
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "createFirstLevel", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this5 = this;

    return function () {
      // Using "root" for parent id so the Django view can distinguish between top tier level and 2nd tier level
      var newLevel = {
        id: "new",
        program: _this5.program_id,
        name: "",
        assumptions: "",
        customsort: 1,
        level_depth: 1,
        parent: "root"
      };

      _this5.levels.push(newLevel);

      _this5.rootStore.uiStore.expandedCards.push("new");
    };
  }
})), _class);
var UIStore = (_class3 = (_temp2 = function UIStore(rootStore) {
  _classCallCheck(this, UIStore);

  _initializerDefineProperty(this, "expandedCards", _descriptor7, this);

  _initializerDefineProperty(this, "activeLevel", _descriptor8, this);

  _initializerDefineProperty(this, "addExpandedCard", _descriptor9, this);

  _initializerDefineProperty(this, "removeExpandedCard", _descriptor10, this);

  this.rootStore = rootStore;
}, _temp2), (_descriptor7 = _applyDecoratedDescriptor(_class3.prototype, "expandedCards", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class3.prototype, "activeLevel", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return "";
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class3.prototype, "addExpandedCard", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this6 = this;

    return function (levelId) {
      if (!_this6.expandedCards.includes(levelId)) {
        _this6.expandedCards.push(levelId);
      }
    };
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class3.prototype, "removeExpandedCard", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this7 = this;

    return function (levelId) {
      _this7.expandedCards = _this7.expandedCards.filter(function (level_id) {
        return level_id != levelId;
      });
    };
  }
})), _class3);

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
// Returns a trimmed level ontology for display purposes
function trimOntology(ontologyStr) {
  var ontologyArray = ontologyStr.split(".");
  return ontologyArray.slice(1).filter(function (i) {
    return i > 0;
  }).join(".");
}

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
    program_id = _jsContext.program_id,
    levels = _jsContext.levels,
    levelTiers = _jsContext.levelTiers,
    tierPresets = _jsContext.tierPresets;
var rootStore = new _models__WEBPACK_IMPORTED_MODULE_8__["RootStore"](program_id, levels, levelTiers, tierPresets);
/*
 * React components on page
 */

react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(mobx_react__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
  rootStore: rootStore
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_leveltier_picker__WEBPACK_IMPORTED_MODULE_7__["LevelTierPicker"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_level_list__WEBPACK_IMPORTED_MODULE_6__["LevelListPanel"], null))), document.querySelector('#level-builder-react-component'));

/***/ }),

/***/ "XoI5":
/*!*******************!*\
  !*** ./js/api.js ***!
  \*******************/
/*! exports provided: api */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "api", function() { return api; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "vDqi");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

var api = axios__WEBPACK_IMPORTED_MODULE_0___default.a.create({
  withCredentials: true,
  baseURL: '/api/',
  headers: {
    "X-CSRFToken": document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
  }
});

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
/*! exports provided: LevelListPanel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelListPanel", function() { return LevelListPanel; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "7O5W");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "wHSu");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var _level_cards__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./level_cards */ "5Za8");
var _dec, _class, _dec2, _class2;

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
var LevelList = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(LevelList, _React$Component);

  function LevelList() {
    _classCallCheck(this, LevelList);

    return _possibleConstructorReturn(this, _getPrototypeOf(LevelList).apply(this, arguments));
  }

  _createClass(LevelList, [{
    key: "render",
    value: function render() {
      var _this = this;

      var renderList = [];

      if (this.props.renderList == 'initial') {
        renderList = this.props.rootStore.levelStore.sortedLevels.filter(function (level) {
          return ['root', null].indexOf(level.parent) != -1;
        });
      } else {
        renderList = this.props.renderList.sort(function (a, b) {
          return a.customsort - b.customsort;
        });
      }

      return renderList.map(function (elem) {
        var card = '';

        if (_this.props.rootStore.uiStore.expandedCards.indexOf(elem.id) !== -1) {
          card = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_level_cards__WEBPACK_IMPORTED_MODULE_8__["LevelCardExpanded"], {
            level: elem,
            levelProps: _this.props.rootStore.levelStore.levelProperties[elem.id]
          });
        } else {
          card = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_level_cards__WEBPACK_IMPORTED_MODULE_8__["LevelCardCollapsed"], {
            level: elem,
            levelProps: _this.props.rootStore.levelStore.levelProperties[elem.id]
          });
        }

        var children = _this.props.rootStore.levelStore.sortedLevels.filter(function (level) {
          return level.parent == elem.id;
        });

        var childLevels = null;

        if (children.length > 0) {
          childLevels = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelList, {
            rootStore: _this.props.rootStore,
            renderList: children
          });
        }

        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: elem.id,
          className: "leveltier--new"
        }, card, childLevels);
      });
    }
  }]);

  return LevelList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class) || _class);
var LevelListPanel = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec2(_class2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class2 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(LevelListPanel, _React$Component2);

  function LevelListPanel() {
    _classCallCheck(this, LevelListPanel);

    return _possibleConstructorReturn(this, _getPrototypeOf(LevelListPanel).apply(this, arguments));
  }

  _createClass(LevelListPanel, [{
    key: "render",
    value: function render() {
      if (this.props.rootStore.levelStore.levels.length == 0) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "level-list-panel"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "level-list-panel__dingbat"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-sitemap"
        })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "level-list-panel__text text-large"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", {
          className: "text-danger"
        }, "Choose your results framework template carefully!"), " Once you begin building your framework, it will not be possible to change templates without first deleting all saved levels."));
      } else {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "level-list",
          style: {
            flexGrow: "2"
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelList, {
          renderList: "initial"
        }));
      }
    }
  }]);

  return LevelListPanel;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class2) || _class2);

/***/ })

},[["QTZG","runtime","vendors"]]]);
//# sourceMappingURL=results_framework-d3e59131902b92b752af.js.map