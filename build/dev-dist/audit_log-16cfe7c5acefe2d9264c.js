(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["audit_log"],{

/***/ "49gj":
/*!***********************************************************!*\
  !*** ./js/pages/tola_management_pages/audit_log/views.js ***!
  \***********************************************************/
/*! exports provided: IndexView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndexView", function() { return IndexView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var components_management_table__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! components/management-table */ "TGVD");
/* harmony import */ var components_pagination__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! components/pagination */ "RCjz");
/* harmony import */ var components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! components/checkboxed-multi-select */ "Z2Y6");
/* harmony import */ var components_expander__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! components/expander */ "H4hL");
/* harmony import */ var components_loading_spinner__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! components/loading-spinner */ "DDFe");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }










var pretty_change_type = {
  indicator_changed: gettext('Indicator changed'),
  indicator_created: gettext('Indicator created'),
  indicator_deleted: gettext('Indicator deleted'),
  result_changed: gettext('Result changed'),
  result_created: gettext('Result created'),
  result_deleted: gettext('Result deleted'),
  program_dates_changed: gettext('Program Dates Changed')
};

var map_pretty_change_type = function map_pretty_change_type(change_type) {
  return pretty_change_type[change_type];
};

var units_of_measure_type = {
  1: gettext("Number"),
  2: gettext("Percentage")
};

var map_unit_of_measure_type = function map_unit_of_measure_type(id) {
  return units_of_measure_type[id];
};

var directions_of_change = {
  1: gettext("N/A"),
  2: gettext("Increase (+)"),
  3: gettext("Decrease (-)")
};

var map_direction_of_change = function map_direction_of_change(id) {
  return directions_of_change[id];
};

var result_changeset_name_map = {
  'evidence_url': gettext('Evidence Url'),
  'evidence_name': gettext('Evidence Name'),
  'date': gettext('Date'),
  'target': gettext('Target'),
  'value': gettext('Value')
};

var ResultChangeset = function ResultChangeset(_ref) {
  var data = _ref.data,
      name = _ref.name;

  if (name == 'evidence_url') {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, result_changeset_name_map[name], ": ", data != 'N/A' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
      href: data
    }, "Link") : data);
  } else {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, result_changeset_name_map[name], ": ", data);
  }
};

var program_dates_changset_name_map = {
  'start_date': gettext('Start Date'),
  'end_date': gettext('End Date')
};

var ProgramDatesChangeset = function ProgramDatesChangeset(_ref2) {
  var data = _ref2.data,
      name = _ref2.name;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, program_dates_changset_name_map[name], ": ", data);
};

var indicator_changeset_name_map = {
  name: gettext('Name'),
  unit_of_measure: gettext('Unit of Measure'),
  unit_of_measure_type: gettext('Unit of Measure Type'),
  is_cumulative: gettext('Is Cumulative'),
  lop_target: gettext('LOP Target'),
  direction_of_change: gettext('Direction of Change'),
  rationale_for_target: gettext('Rationale for Target'),
  baseline_value: gettext('Baseline Value'),
  baseline_na: gettext('Baseline N/A')
};

var IndicatorChangeset = function IndicatorChangeset(_ref3) {
  var data = _ref3.data,
      name = _ref3.name;

  var mapped_data = function () {
    if (data == 'N/A') return data;

    switch (name) {
      case 'unit_of_measure_type':
        return map_unit_of_measure_type(data);
        break;

      case 'direction_of_change':
        return map_direction_of_change(data);
        break;

      default:
        return data;
        break;
    }
  }();

  if (name == 'targets') {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "Targets"), Object.entries(data).map(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          id = _ref5[0],
          target = _ref5[1];

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
        key: id
      }, target.name, ": ", target.value);
    }));
  } else {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, indicator_changeset_name_map[name], ": ", mapped_data !== null && mapped_data !== undefined ? mapped_data.toString() : 'N/A');
  }
};

var ChangesetEntry =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ChangesetEntry, _React$Component);

  function ChangesetEntry() {
    _classCallCheck(this, ChangesetEntry);

    return _possibleConstructorReturn(this, _getPrototypeOf(ChangesetEntry).apply(this, arguments));
  }

  _createClass(ChangesetEntry, [{
    key: "renderType",
    value: function renderType(type, data, name) {
      switch (type) {
        case 'indicator_changed':
        case 'indicator_created':
        case 'indicator_deleted':
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorChangeset, {
            data: data,
            name: name
          });
          break;

        case 'result_changed':
        case 'result_created':
        case 'result_deleted':
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResultChangeset, {
            data: data,
            name: name
          });
          break;

        case 'program_dates_changed':
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramDatesChangeset, {
            data: data,
            name: name
          });
          break;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          data = _this$props.data,
          type = _this$props.type,
          name = _this$props.name;
      return this.renderType(type, data, name);
    }
  }]);

  return ChangesetEntry;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var IndexView = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref6) {
  var store = _ref6.store;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "audit-log-index-view",
    className: "container-fluid row"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "list-controls"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    className: "btn btn-link btn-secondary btn-sm",
    href: "/api/tola_management/program/".concat(store.program_id, "/export_audit_log")
  }, gettext("Export to Excel"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col col-sm-12 list-section"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_8__["default"], {
    isLoading: store.fetching
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
    className: "list-table"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, gettext("Date and Time")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, gettext("No.")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    width: "25%"
  }, gettext("Indicator")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, gettext("User")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, gettext("Organization")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, gettext("Change Type")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, gettext("Previous Entry")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, gettext("New Entry")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, gettext("Rationale")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, store.log_rows.map(function (data) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      key: data.id
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, data.date), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, data.indicator ? data.indicator.number : 'N/A'), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, data.indicator ? data.indicator.name : 'N/A'), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, data.user), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, data.organization), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, map_pretty_change_type(data.change_type)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "expand-section"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_expander__WEBPACK_IMPORTED_MODULE_7__["default"], null, data.diff_list.map(function (changeset) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangesetEntry, {
        key: changeset.name,
        name: changeset.name,
        type: data.change_type,
        data: changeset.prev
      });
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "expand-section"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_expander__WEBPACK_IMPORTED_MODULE_7__["default"], null, data.diff_list.map(function (changeset) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangesetEntry, {
        key: changeset.name,
        name: changeset.name,
        type: data.change_type,
        data: changeset.new
      });
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "expand-section"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_expander__WEBPACK_IMPORTED_MODULE_7__["default"], null, data.rationale)));
  })))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "list-metadata"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "entries-count"
  }, store.entries_count ? "".concat(store.entries_count, " ").concat(gettext("entries")) : "--"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "pagination-controls"
  }, store.total_pages && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_pagination__WEBPACK_IMPORTED_MODULE_5__["default"], {
    pageCount: store.total_pages,
    initialPage: store.current_page,
    onPageChange: function onPageChange(page) {
      return store.changePage(page);
    }
  })))));
});

/***/ }),

/***/ "5Xg7":
/*!***************************************************!*\
  !*** ./js/components/virtualized-react-select.js ***!
  \***************************************************/
/*! exports provided: VirtualizedMenuList, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VirtualizedMenuList", function() { return VirtualizedMenuList; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_virtualized__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-virtualized */ "c7k8");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "y2Vs");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var VirtualizedMenuList =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(VirtualizedMenuList, _React$PureComponent);

  function VirtualizedMenuList(props) {
    var _this;

    _classCallCheck(this, VirtualizedMenuList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VirtualizedMenuList).call(this, props));
    _this.cache = new react_virtualized__WEBPACK_IMPORTED_MODULE_1__["CellMeasurerCache"]({
      fixedWidth: true,
      defaultHeight: 35
    });
    _this.filter_val = "";
    return _this;
  }

  _createClass(VirtualizedMenuList, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          options = _this$props.options,
          children = _this$props.children,
          maxHeight = _this$props.maxHeight,
          getValue = _this$props.getValue,
          selectProps = _this$props.selectProps;
      var rowCount = children.length || 0; //gotta be a way to improve this. it's ok after the first couple of
      //characters search, but it's slow prior to that

      if (selectProps.inputValue !== this.filter_val) {
        this.filter_val = selectProps.inputValue;
        this.cache.clearAll();
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          display: "flex",
          height: "100vh",
          maxHeight: maxHeight + "px"
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          flex: "1 1 auto"
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_1__["AutoSizer"], null, function (_ref) {
        var width = _ref.width,
            height = _ref.height;
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_1__["List"], {
          height: height,
          width: width,
          deferredMeasurementCache: _this2.cache,
          rowCount: rowCount,
          rowHeight: _this2.cache.rowHeight,
          noRowsRenderer: function noRowsRenderer() {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "No selections available");
          },
          rowRenderer: function rowRenderer(_ref2) {
            var index = _ref2.index,
                parent = _ref2.parent,
                key = _ref2.key,
                style = _ref2.style;
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_1__["CellMeasurer"], {
              key: key,
              cache: _this2.cache,
              parent: parent,
              columnIndex: 0,
              rowIndex: index
            }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
              style: style
            }, children[index]));
          }
        });
      })));
    }
  }]);

  return VirtualizedMenuList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);

var VirtualizedSelect = function VirtualizedSelect(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({
    components: {
      VirtualizedMenuList: VirtualizedMenuList
    }
  }, props));
};

/* harmony default export */ __webpack_exports__["default"] = (VirtualizedSelect);

/***/ }),

/***/ "6bbB":
/*!***********************************************************!*\
  !*** ./js/pages/tola_management_pages/audit_log/index.js ***!
  \***********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models */ "qnQo");
/* harmony import */ var _views__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views */ "49gj");




/*
 * Model/Store setup
 */

var store = new _models__WEBPACK_IMPORTED_MODULE_2__["ProgramAuditLogStore"](jsContext.program_id);
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_views__WEBPACK_IMPORTED_MODULE_3__["IndexView"], {
  store: store
}), document.querySelector('#app_root'));

/***/ }),

/***/ "DDFe":
/*!******************************************!*\
  !*** ./js/components/loading-spinner.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }



var LoadingSpinner = function LoadingSpinner(_ref) {
  var children = _ref.children,
      isLoading = _ref.isLoading,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, ["children", "isLoading", "className"]);

  var loading = isLoading ? 'loading' : '';
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", _extends({
    className: 'loading-spinner__container ' + loading + ' ' + (className || '')
  }, props), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "loading-spinner__overlay"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "loading-spinner__spinner"
  })), children);
};

/* harmony default export */ __webpack_exports__["default"] = (LoadingSpinner);

/***/ }),

/***/ "H4hL":
/*!***********************************!*\
  !*** ./js/components/expander.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var Expander =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Expander, _React$Component);

  function Expander(props) {
    var _this;

    _classCallCheck(this, Expander);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Expander).call(this, props));
    _this.state = {
      expanded: false,
      overflowing: false
    };
    _this.ref = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    return _this;
  }

  _createClass(Expander, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.ref.current.scrollHeight > this.ref.current.clientHeight) {
        this.setState({
          overflowing: true
        });
      }
    }
  }, {
    key: "toggleExpanded",
    value: function toggleExpanded(e) {
      e.preventDefault();
      this.setState({
        expanded: !this.state.expanded
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        ref: this.ref,
        className: "expander",
        style: {
          height: !this.state.expanded && (this.props.height || 50)
        }
      }, this.props.children), this.state.overflowing && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "",
        onClick: function onClick(e) {
          return _this2.toggleExpanded(e);
        }
      }, this.state.expanded ? 'Show Less' : 'Show More')));
    }
  }]);

  return Expander;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (Expander);

/***/ }),

/***/ "RCjz":
/*!*************************************!*\
  !*** ./js/components/pagination.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_paginate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-paginate */ "werx");
/* harmony import */ var react_paginate__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_paginate__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }




/***
    Props:

    - pageCount: total number of pages
    - initialPage: which page should be highlighted as active initially
    - onPageChange: a function to receive the newly selected page
*/

var Pagination = function Pagination(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_paginate__WEBPACK_IMPORTED_MODULE_1___default.a, _extends({
    previousLabel: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
      className: "fa fa-angle-left"
    }),
    nextLabel: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
      className: "fa fa-angle-right"
    }),
    breakLabel: "...",
    breakClassName: "break-me",
    marginPagesDisplayed: 2,
    pageRangeDisplayed: 5,
    containerClassName: "pagination",
    subContainerClassName: "pages pagination",
    activeClassName: "active"
  }, props));
};

/* harmony default export */ __webpack_exports__["default"] = (Pagination);

/***/ }),

/***/ "TGVD":
/*!*******************************************!*\
  !*** ./js/components/management-table.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }



 // TODO: "size" is no longer used

var ColumnComponent = function ColumnComponent(_ref) {
  var className = _ref.className,
      size = _ref.size,
      props = _objectWithoutProperties(_ref, ["className", "size"]);

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("td", _extends({
    className: ["mgmt-table__col", className].join(' ')
  }, props), props.children);
}; // TODO: this is redundant with ColumnComponent


var HeaderColumnComponent = function HeaderColumnComponent(_ref2) {
  var className = _ref2.className,
      size = _ref2.size,
      props = _objectWithoutProperties(_ref2, ["className", "size"]);

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("th", _extends({
    className: ["mgmt-table__col", className].join(' ')
  }, props), props.children);
};

var InnerRowComponent = function InnerRowComponent(_ref3) {
  var className = _ref3.className,
      props = _objectWithoutProperties(_ref3, ["className"]);

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tr", _extends({
    className: ["mgmt-table__row", className].join(' ')
  }, props), props.children);
}; // TODO: this is redundant with InnerRowComponent


var HeaderRowComponent = function HeaderRowComponent(_ref4) {
  var className = _ref4.className,
      props = _objectWithoutProperties(_ref4, ["className"]);

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tr", _extends({
    className: ["mgmt-table__row table-header", className].join(' ')
  }, props), props.children);
};
/***
    A wrapper for the rendering of the given row renderer, it takes and expando
    renderer used to render expanded content

    Props:
    - expanded: whether the expando content is shown or not
    - Expando: The content to render when the expando is shown
*/


var RowComponent = Object(mobx_react__WEBPACK_IMPORTED_MODULE_0__["observer"])(function (_ref5) {
  var className = _ref5.className,
      expanded = _ref5.expanded,
      Expando = _ref5.Expando,
      props = _objectWithoutProperties(_ref5, ["className", "expanded", "Expando"]);

  if (Expando) {
    var ObservedExpando = Object(mobx_react__WEBPACK_IMPORTED_MODULE_0__["observer"])(Expando);
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tbody", _extends({
      className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(["mgmt-table__body", className].join(' '), {
        "is-expanded": expanded
      })
    }, props), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(InnerRowComponent, null, props.children), expanded && react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(ObservedExpando, {
      Wrapper: ExpandoWrapper
    }));
  } else {
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tbody", _extends({
      className: ["mgmt-table__body", className].join(' ')
    }, props), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(InnerRowComponent, null, props.children));
  }
});

var ExpandoWrapper = function ExpandoWrapper(_ref6) {
  var className = _ref6.className,
      props = _objectWithoutProperties(_ref6, ["className"]);

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tr", _extends({
    className: ["mgmt-table__row--expanded", className].join(' ')
  }, props), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("td", {
    colSpan: "6"
  }, props.children));
};

var RowList = Object(mobx_react__WEBPACK_IMPORTED_MODULE_0__["observer"])(function (_ref7) {
  var data = _ref7.data,
      Row = _ref7.Row,
      keyField = _ref7.keyField,
      props = _objectWithoutProperties(_ref7, ["data", "Row", "keyField"]);

  var ObservedRow = Object(mobx_react__WEBPACK_IMPORTED_MODULE_0__["observer"])(Row);
  return data.map(function (row_data) {
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(ObservedRow, {
      key: row_data[keyField],
      data: row_data,
      Col: ColumnComponent,
      Row: RowComponent
    });
  });
});
/*
   Props:

   - HeaderRow: a function to render the header row. it receives a component
   prop to render the header column and row

   - Row: a function used to render each row. it receives a component prop to
    render the row (see RowComponent), it receives the relevant data for that
    row as a prop: data

   - data: the dataset used to render the table, it must be an array

   - keyField: field to use for key on rows and expando checking

 */

var ManagementTable = Object(mobx_react__WEBPACK_IMPORTED_MODULE_0__["observer"])(function (_ref8) {
  var HeaderRow = _ref8.HeaderRow,
      className = _ref8.className,
      props = _objectWithoutProperties(_ref8, ["HeaderRow", "className"]);

  var ObservedHeaderRow = Object(mobx_react__WEBPACK_IMPORTED_MODULE_0__["observer"])(HeaderRow);
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("table", {
    className: ['table bg-white', className].join(' ')
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(ObservedHeaderRow, {
    Col: HeaderColumnComponent,
    Row: HeaderRowComponent
  })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(RowList, props));
});
/* harmony default export */ __webpack_exports__["default"] = (ManagementTable);

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

/***/ "Z2Y6":
/*!**************************************************!*\
  !*** ./js/components/checkboxed-multi-select.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var _virtualized_react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./virtualized-react-select */ "5Xg7");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mobx-react */ "okNM");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }






var Option = function Option(props) {
  return react_select__WEBPACK_IMPORTED_MODULE_1__["components"].Option && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_1__["components"].Option, props, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
    className: "checkboxed-multi-select-checkbox",
    type: "checkbox",
    checked: props.isSelected,
    onChange: function onChange(e) {//we can let the outer component manage state
    }
  }), "\xA0", props.data.label);
};

var CheckboxedMultiSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_3__["observer"])(function (props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_1__["default"], _extends({
    isMulti: true,
    closeMenuOnSelect: false,
    hideSelectedOptions: false,
    components: {
      MenuList: _virtualized_react_select__WEBPACK_IMPORTED_MODULE_2__["VirtualizedMenuList"],
      Option: Option
    }
  }, props));
});
/* harmony default export */ __webpack_exports__["default"] = (CheckboxedMultiSelect);

/***/ }),

/***/ "h6br":
/*!*********************************************************!*\
  !*** ./js/pages/tola_management_pages/audit_log/api.js ***!
  \*********************************************************/
/*! exports provided: fetchProgramAuditLogWithFilter, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchProgramAuditLogWithFilter", function() { return fetchProgramAuditLogWithFilter; });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../api */ "XoI5");

var fetchProgramAuditLogWithFilter = function fetchProgramAuditLogWithFilter(program_id, page) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get("/tola_management/program/".concat(program_id, "/audit_log/"), {
    params: {
      page: page
    }
  }).then(function (response) {
    var data = response.data;
    var total_results_count = data.count;
    var current_results_count = data.results.length;
    var total_pages = data.page_count;
    return {
      logs: data.results,
      total_pages: total_pages,
      total_entries: total_results_count,
      next_page: data.next,
      prev_page: data.previous
    };
  });
};
/* harmony default export */ __webpack_exports__["default"] = ({
  fetchProgramAuditLogWithFilter: fetchProgramAuditLogWithFilter
});

/***/ }),

/***/ "qnQo":
/*!************************************************************!*\
  !*** ./js/pages/tola_management_pages/audit_log/models.js ***!
  \************************************************************/
/*! exports provided: ProgramAuditLogStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramAuditLogStore", function() { return ProgramAuditLogStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ "h6br");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }



var ProgramAuditLogStore = (_class = (_temp =
/*#__PURE__*/
function () {
  function ProgramAuditLogStore(program_id) {
    _classCallCheck(this, ProgramAuditLogStore);

    _initializerDefineProperty(this, "program_id", _descriptor, this);

    _initializerDefineProperty(this, "log_rows", _descriptor2, this);

    _initializerDefineProperty(this, "fetching", _descriptor3, this);

    _initializerDefineProperty(this, "current_page", _descriptor4, this);

    _initializerDefineProperty(this, "details_target", _descriptor5, this);

    _initializerDefineProperty(this, "entries_count", _descriptor6, this);

    _initializerDefineProperty(this, "total_pages", _descriptor7, this);

    _initializerDefineProperty(this, "next_page", _descriptor8, this);

    _initializerDefineProperty(this, "previous_page", _descriptor9, this);

    _initializerDefineProperty(this, "current_page", _descriptor10, this);

    this.program_id = program_id;
    this.fetchProgramAuditLog();
  }

  _createClass(ProgramAuditLogStore, [{
    key: "fetchProgramAuditLog",
    value: function fetchProgramAuditLog() {
      var _this = this;

      this.fetching = true;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchProgramAuditLogWithFilter(this.program_id, this.current_page + 1).then(function (results) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this.fetching = false;
          _this.log_rows = results.logs;
          _this.entries_count = results.total_entries;
          _this.total_pages = results.total_pages;
          _this.next_page = results.next_page;
          _this.previous_page = results.previous_page;
        });
      });
    }
  }, {
    key: "toggleDetailsTarget",
    value: function toggleDetailsTarget(row_id) {
      if (this.details_target == row_id) {
        this.details_target = null;
      } else {
        this.details_target = row_id;
      }
    }
  }, {
    key: "changePage",
    value: function changePage(page) {
      if (page.selected != this.current_page) {
        this.current_page = page.selected;
        this.fetchProgramAuditLog();
      }
    }
  }]);

  return ProgramAuditLogStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "program_id", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "log_rows", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "fetching", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "current_page", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "details_target", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "entries_count", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "total_pages", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "next_page", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "previous_page", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, "current_page", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _applyDecoratedDescriptor(_class.prototype, "fetchProgramAuditLog", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "fetchProgramAuditLog"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleDetailsTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleDetailsTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changePage", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changePage"), _class.prototype)), _class);

/***/ })

},[["6bbB","runtime","vendors"]]]);
//# sourceMappingURL=audit_log-16cfe7c5acefe2d9264c.js.map