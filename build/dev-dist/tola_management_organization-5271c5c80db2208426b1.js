(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["tola_management_organization"],{

/***/ "2BBp":
/*!***************************************************************!*\
  !*** ./js/pages/tola_management_pages/organization/models.js ***!
  \***************************************************************/
/*! exports provided: OrganizationStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrganizationStore", function() { return OrganizationStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ "zUdS");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _temp;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }



var default_organization = {
  id: null,
  is_active: false,
  mode_of_contact: "",
  name: "",
  organization_url: null,
  primary_address: "",
  primary_contact_email: "",
  primary_contact_name: "",
  primary_contact_phone: "",
  sectors: []
};
var OrganizationStore = (_class = (_temp =
/*#__PURE__*/
function () {
  function OrganizationStore(programs, organizations, sectors, countries, country_filter, program_filter) {
    var _this = this;

    _classCallCheck(this, OrganizationStore);

    _initializerDefineProperty(this, "organizations", _descriptor, this);

    _initializerDefineProperty(this, "organizations_listing", _descriptor2, this);

    _initializerDefineProperty(this, "organizations_count", _descriptor3, this);

    _initializerDefineProperty(this, "total_pagees", _descriptor4, this);

    _initializerDefineProperty(this, "fetching", _descriptor5, this);

    _initializerDefineProperty(this, "fetching_editing_target", _descriptor6, this);

    _initializerDefineProperty(this, "current_page", _descriptor7, this);

    _initializerDefineProperty(this, "saving", _descriptor8, this);

    _initializerDefineProperty(this, "bulk_targets", _descriptor9, this);

    _initializerDefineProperty(this, "bulk_targets_all", _descriptor10, this);

    this.available_programs = {};
    this.available_organizations = {};
    this.available_sectors = {};
    this.available_countries = {};
    this.program_selections = [];
    this.organization_selections = [];
    this.sector_selections = [];
    this.country_selections = [];

    _initializerDefineProperty(this, "editing_target", _descriptor11, this);

    _initializerDefineProperty(this, "editing_target_data", _descriptor12, this);

    _initializerDefineProperty(this, "editing_target_history", _descriptor13, this);

    _initializerDefineProperty(this, "editing_errors", _descriptor14, this);

    _initializerDefineProperty(this, "filters", _descriptor15, this);

    this.organization_status_options = [{
      value: 1,
      label: gettext('Active')
    }, {
      value: 0,
      label: gettext('Inactive')
    }];
    this.available_programs = programs;
    this.available_organizations = organizations;
    this.available_sectors = sectors;
    this.available_countries = countries;
    this.organization_selections = Object.entries(organizations).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          id = _ref2[0],
          org = _ref2[1];

      return {
        value: org.id,
        label: org.name
      };
    });
    this.program_selections = Object.entries(programs).map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          id = _ref4[0],
          program = _ref4[1];

      return {
        value: program.id,
        label: program.name
      };
    });
    this.sector_selections = Object.entries(sectors).map(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          id = _ref6[0],
          sector = _ref6[1];

      return {
        value: sector.id,
        label: sector.name
      };
    });
    this.country_selections = Object.entries(countries).map(function (_ref7) {
      var _ref8 = _slicedToArray(_ref7, 2),
          id = _ref8[0],
          country = _ref8[1];

      return {
        value: country.id,
        label: country.name
      };
    });
    this.filters.countries = country_filter.map(function (id) {
      return _this.available_countries[id];
    }).map(function (country) {
      return {
        label: country.name,
        value: country.id
      };
    });
    this.filters.programs = program_filter.filter(function (id) {
      return programs[id];
    }).map(function (id) {
      return {
        label: programs[id].name,
        value: id
      };
    });
    this.fetchOrganizations();
  }

  _createClass(OrganizationStore, [{
    key: "marshalFilters",
    value: function marshalFilters(filters) {
      return Object.entries(filters).reduce(function (xs, x) {
        if (Array.isArray(x[1])) {
          xs[x[0]] = x[1].map(function (x) {
            return x.value;
          });
        } else {
          xs[x[0]] = x[1].value;
        }

        return xs;
      }, {});
    }
  }, {
    key: "updateLocalOrganization",
    value: function updateLocalOrganization(id, applied_data, aggregates) {
      this.organizations[id] = {
        id: id,
        name: applied_data.name,
        program_count: aggregates.program_count,
        user_count: aggregates.user_count,
        is_active: applied_data.is_active
      };
    }
  }, {
    key: "onSaveErrorHandler",
    value: function onSaveErrorHandler() {
      PNotify.error({
        text: gettext('Saving Failed'),
        delay: 5000
      });
    }
  }, {
    key: "onSaveSuccessHandler",
    value: function onSaveSuccessHandler() {
      PNotify.success({
        text: gettext('Successfully Saved'),
        delay: 5000
      });
    }
  }, {
    key: "fetchOrganizations",
    value: function fetchOrganizations() {
      var _this2 = this;

      this.fetching = true;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchOrganizationsWithFilter(this.current_page + 1, this.marshalFilters(this.filters)).then(function (results) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this2.fetching = false;
          _this2.organizations = results.organizations.reduce(function (xs, x) {
            xs[x.id] = x;
            return xs;
          }, {});
          _this2.organizations_listing = results.organizations.map(function (o) {
            return o.id;
          });
          _this2.organizations_count = results.total_organizations;
          _this2.total_pages = results.total_pages;
          _this2.bulk_targets = new Map(Object.entries(_this2.organizations).map(function (_ref9) {
            var _ref10 = _slicedToArray(_ref9, 2),
                _ = _ref10[0],
                organization = _ref10[1];

            return [organization.id, false];
          }));
        });
      });
    }
  }, {
    key: "applyFilters",
    value: function applyFilters() {
      this.current_page = 0;
      this.fetchOrganizations();
    }
  }, {
    key: "createOrganization",
    value: function createOrganization() {
      var new_organization = {
        id: "new",
        name: "",
        program_count: 0,
        user_count: 0,
        is_active: false
      };

      if (this.editing_target !== "new") {
        this.organizations_listing.unshift("new");
      }

      this.editing_errors = {};
      this.organizations["new"] = new_organization;
      this.editing_target = new_organization.id;
      this.editing_target_data = _objectSpread({}, default_organization);
    }
  }, {
    key: "updateOrganizationProfile",
    value: function updateOrganizationProfile(id, new_data) {
      var _this3 = this;

      this.saving = true;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].updateOrganization(id, new_data).then(function (updated_data) {
        return _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchOrganizationAggregates(id).then(function (aggregates) {
          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this3.saving = false;

            _this3.updateLocalOrganization(id, updated_data, aggregates);

            _this3.editing_target = null;
            _this3.editing_target_data = _objectSpread({}, default_organization);
          });

          _this3.onSaveSuccessHandler();
        });
      }).catch(function (error) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this3.saving = false;
          _this3.editing_errors = error.response.data;
        });

        _this3.onSaveErrorHandler();
      });
    }
  }, {
    key: "saveNewOrganization",
    value: function saveNewOrganization(new_data) {
      var _this4 = this;

      this.saving = true;
      new_data.is_active = true;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].createOrganization(new_data).then(function (result) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this4.saving = false;

          _this4.updateLocalOrganization(result.id, result, {
            program_count: 0,
            user_count: 0
          });

          _this4.organizations_listing.shift();

          delete _this4.organizations["new"];

          _this4.organizations_listing.unshift(result.id);

          _this4.editing_target = null;
          _this4.editing_target_data = _objectSpread({}, default_organization);
          _this4.bulk_targets = new Map(Object.entries(_this4.organizations).map(function (_ref11) {
            var _ref12 = _slicedToArray(_ref11, 2),
                _ = _ref12[0],
                organization = _ref12[1];

            return [organization.id, false];
          }));
        });

        _this4.onSaveSuccessHandler();
      }).catch(function (error) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this4.saving = false;
          _this4.editing_errors = error.response.data;
        });

        _this4.onSaveErrorHandler();
      });
    }
  }, {
    key: "saveNewOrganizationAndAddAnother",
    value: function saveNewOrganizationAndAddAnother(new_data) {
      var _this5 = this;

      this.saving = true;
      new_data.is_active = true;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].createOrganization(new_data).then(function (result) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this5.saving = false;

          _this5.updateLocalOrganization(result.id, result, {
            program_count: 0,
            user_count: 0
          });

          _this5.organizations_listing.shift();

          delete _this5.organizations["new"];

          _this5.organizations_listing.unshift(result.id);

          _this5.editing_target = null;
          _this5.editing_target_data = _objectSpread({}, default_organization);
          _this5.bulk_targets = new Map(Object.entries(_this5.organizations).map(function (_ref13) {
            var _ref14 = _slicedToArray(_ref13, 2),
                _ = _ref14[0],
                organization = _ref14[1];

            return [organization.id, false];
          }));
        });

        _this5.onSaveSuccessHandler();
      }).catch(function (error) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this5.saving = false;
          _this5.editing_errors = error.response.data;
        });

        _this5.onSaveErrorHandler();
      });
    }
  }, {
    key: "changeSectorFilter",
    value: function changeSectorFilter(sectors) {
      this.filters.sectors = sectors;
    }
  }, {
    key: "changeCountryFilter",
    value: function changeCountryFilter(countries) {
      this.filters.countries = countries;
    }
  }, {
    key: "changeProgramFilter",
    value: function changeProgramFilter(programs) {
      this.filters.programs = programs;
    }
  }, {
    key: "changeOrganizationFilter",
    value: function changeOrganizationFilter(organizations) {
      this.filters.organizations = organizations;
    }
  }, {
    key: "changeOrganizationStatusFilter",
    value: function changeOrganizationStatusFilter(status) {
      this.filters.organization_status = status;
    }
  }, {
    key: "changePage",
    value: function changePage(page) {
      if (this.current_page != page.selected) {
        this.current_page = page.selected;
        this.fetchOrganizations();
      }
    }
  }, {
    key: "toggleBulkTargetsAll",
    value: function toggleBulkTargetsAll() {
      this.bulk_targets_all = !this.bulk_targets_all;

      if (this.bulk_targets_all) {
        this.bulk_targets.forEach(function (val, key, map) {
          map.set(key, true);
        });
      } else {
        this.bulk_targets.forEach(function (val, key, map) {
          map.set(key, false);
        });
      }
    }
  }, {
    key: "toggleEditingTarget",
    value: function toggleEditingTarget(organization_id) {
      var _this6 = this;

      this.editing_target_data = _objectSpread({}, default_organization);
      this.editing_errors = {};

      if (this.editing_target == "new") {
        this.organizations_listing.shift();
      }

      if (this.editing_target == organization_id) {
        this.editing_target = false;
      } else {
        this.editing_target = organization_id;
        this.fetching_editing_target = true;

        if (!(this.editing_target == 'new')) {
          Promise.all([_api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchOrganization(organization_id), _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchOrganizationHistory(organization_id)]).then(function (_ref15) {
            var _ref16 = _slicedToArray(_ref15, 2),
                organization = _ref16[0],
                history = _ref16[1];

            Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
              _this6.fetching_editing_target = false;
              _this6.editing_target_data = organization;
              _this6.editing_target_history = history;
            });
          });
        }
      }
    }
  }, {
    key: "toggleBulkTarget",
    value: function toggleBulkTarget(target_id) {
      this.bulk_targets.set(target_id, !this.bulk_targets.get(target_id));
    }
  }, {
    key: "clearFilters",
    value: function clearFilters() {
      this.filters = {
        countries: [],
        organizations: [],
        programs: [],
        sectors: [],
        organization_status: ''
      };
    }
  }]);

  return OrganizationStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "organizations", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "organizations_listing", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "organizations_count", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "total_pagees", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "fetching", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "fetching_editing_target", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "current_page", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "saving", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "bulk_targets", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Map();
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, "bulk_targets_all", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, "editing_target", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, "editing_target_data", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _objectSpread({}, default_organization);
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class.prototype, "editing_target_history", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class.prototype, "editing_errors", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class.prototype, "filters", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {
      countries: [],
      organizations: [],
      programs: [],
      sectors: [],
      organization_status: ''
    };
  }
}), _applyDecoratedDescriptor(_class.prototype, "fetchOrganizations", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "fetchOrganizations"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "applyFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "applyFilters"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "createOrganization", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "createOrganization"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateOrganizationProfile", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateOrganizationProfile"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "saveNewOrganization", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "saveNewOrganization"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "saveNewOrganizationAndAddAnother", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "saveNewOrganizationAndAddAnother"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeSectorFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeSectorFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeCountryFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeCountryFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeProgramFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeProgramFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeOrganizationFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeOrganizationFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeOrganizationStatusFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeOrganizationStatusFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changePage", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changePage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleBulkTargetsAll", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleBulkTargetsAll"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleEditingTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleEditingTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleBulkTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleBulkTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "clearFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "clearFilters"), _class.prototype)), _class);

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

/***/ "EdTt":
/*!**************************************************************!*\
  !*** ./js/pages/tola_management_pages/organization/views.js ***!
  \**************************************************************/
/*! exports provided: IndexView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndexView", function() { return IndexView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var components_management_table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! components/management-table */ "TGVD");
/* harmony import */ var components_pagination__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! components/pagination */ "RCjz");
/* harmony import */ var components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! components/checkboxed-multi-select */ "Z2Y6");
/* harmony import */ var _components_organization_editor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/organization_editor */ "SF2N");
/* harmony import */ var _components_edit_organization_profile__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/edit_organization_profile */ "yD2D");
/* harmony import */ var _components_edit_organization_history__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/edit_organization_history */ "SXQ9");
/* harmony import */ var components_loading_spinner__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! components/loading-spinner */ "DDFe");
/* harmony import */ var components_folding_sidebar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! components/folding-sidebar */ "tnXs");











var CountryFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var store = _ref.store,
      selections = _ref.selections;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "countries_permitted_filter"
  }, gettext("Countries")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
    value: store.filters.countries,
    options: selections,
    onChange: function onChange(e) {
      return store.changeCountryFilter(e);
    },
    placeholder: gettext("None Selected"),
    id: "countries_permitted_filter"
  }));
});
var ProgramFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var store = _ref2.store,
      selections = _ref2.selections;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "programs_filter"
  }, gettext("Programs")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
    value: store.filters.programs,
    options: selections,
    onChange: function onChange(e) {
      return store.changeProgramFilter(e);
    },
    placeholder: gettext("None Selected"),
    id: "programs_filter"
  }));
});
var OrganizationFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref3) {
  var store = _ref3.store,
      selections = _ref3.selections;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "organizations_filter"
  }, gettext("Organizations")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
    value: store.filters.organizations,
    options: selections,
    onChange: function onChange(e) {
      return store.changeOrganizationFilter(e);
    },
    placeholder: gettext("None Selected"),
    id: "organization_filter"
  }));
});
var SectorFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref4) {
  var store = _ref4.store,
      selections = _ref4.selections;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "sector_filter"
  }, gettext("Sectors")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
    value: store.filters.sectors,
    options: selections,
    onChange: function onChange(e) {
      return store.changeSectorFilter(e);
    },
    placeholder: gettext("None Selected"),
    id: "sector_filter"
  }));
});
var IndexView = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref5) {
  var store = _ref5.store;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "organization-management-index-view",
    className: "row"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_folding_sidebar__WEBPACK_IMPORTED_MODULE_10__["default"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "filter-section"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SectorFilter, {
    store: store,
    selections: store.sector_selections
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramFilter, {
    store: store,
    selections: store.program_selections
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(OrganizationFilter, {
    store: store,
    selections: store.organization_selections
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountryFilter, {
    store: store,
    selections: store.country_selections
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "status_filter"
  }, gettext("Status")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
    value: store.filters.organization_status,
    options: store.organization_status_options,
    onChange: function onChange(e) {
      return store.changeOrganizationStatusFilter(e);
    },
    placeholder: gettext("None Selected"),
    id: "status_filter"
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "filter-buttons"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-primary",
    onClick: function onClick() {
      return store.applyFilters();
    }
  }, gettext("Apply")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-inverse",
    onClick: function onClick() {
      return store.clearFilters();
    }
  }, gettext("Reset"))))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col admin-list"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__controls"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "controls__bulk-actions"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "controls__buttons"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "#",
    tabIndex: "0",
    className: "btn btn-link btn-add",
    onClick: function onClick() {
      return store.createOrganization();
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-plus-circle"
  }), gettext("Add Organization")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_9__["default"], {
    isLoading: store.fetching
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__table"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_management_table__WEBPACK_IMPORTED_MODULE_3__["default"], {
    data: store.organizations_listing.map(function (id) {
      return store.organizations[id];
    }),
    keyField: "id",
    HeaderRow: function HeaderRow(_ref6) {
      var Col = _ref6.Col,
          Row = _ref6.Row;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Row, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.15"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "2",
        className: "td--stretch"
      }, gettext("Organization")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, gettext("Programs")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "1"
      }, gettext("Users")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.25"
      }, gettext("Status")));
    },
    Row: function Row(_ref7) {
      var Col = _ref7.Col,
          Row = _ref7.Row,
          data = _ref7.data;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Row, {
        expanded: data.id == store.editing_target,
        Expando: function Expando(_ref8) {
          var Wrapper = _ref8.Wrapper;
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Wrapper, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_organization_editor__WEBPACK_IMPORTED_MODULE_6__["default"], {
            new: data.id == 'new',
            ProfileSection: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function () {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_9__["default"], {
                isLoading: store.fetching_editing_target || store.saving
              }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_organization_profile__WEBPACK_IMPORTED_MODULE_7__["default"], {
                new: data.id == 'new',
                sectorSelections: store.sector_selections,
                organizationData: store.editing_target_data,
                errors: store.editing_errors,
                key: store.editing_target_data.id,
                onSave: function onSave(new_organization_data) {
                  return store.updateOrganizationProfile(data.id, new_organization_data);
                },
                onSaveNew: function onSaveNew(new_organization_data) {
                  return store.saveNewOrganization(new_organization_data);
                },
                onSaveNewAndAddAnother: function onSaveNewAndAddAnother(new_organization_data) {
                  return store.saveNewOrganizationAndAddAnother(new_organization_data);
                }
              }));
            }),
            HistorySection: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function () {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_9__["default"], {
                isLoading: store.fetching_editing_target || store.saving
              }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_organization_history__WEBPACK_IMPORTED_MODULE_8__["default"], {
                organizationData: store.editing_target_data,
                organizationHistoryData: store.editing_target_history,
                onSave: function onSave(new_organization_data) {
                  return store.updateOrganizationProfile(data.id, new_organization_data);
                }
              }));
            })
          }));
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.15"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "2",
        className: "td--stretch"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "icon__clickable",
        onClick: function onClick() {
          return store.toggleEditingTarget(data.id);
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-building"
      }), "\xA0", data.name || "---")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "1",
        className: "text-nowrap"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "/tola_management/program/?organizations[]=".concat(data.id)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-cubes"
      }), "\xA0", data.program_count, " ", gettext("programs"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "1",
        className: "text-nowrap"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "/tola_management/user/?organizations[]=".concat(data.id)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-users"
      }), "\xA0", data.user_count, " ", gettext("users"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.25"
      }, data.is_active ? 'Active' : 'Inactive'));
    }
  }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__metadata"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__count text-small text-muted"
  }, store.organizations_count ? "".concat(store.organizations_count, " ").concat(gettext("organizations")) : "--"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__controls"
  }, store.total_pages && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_pagination__WEBPACK_IMPORTED_MODULE_4__["default"], {
    pageCount: store.total_pages,
    initialPage: store.current_page,
    onPageChange: function onPageChange(page) {
      return store.changePage(page);
    }
  })))));
});

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

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "changelog-entry"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        ref: this.ref,
        className: "changelog-entry__expanding",
        style: {
          height: !this.state.expanded && (this.props.height || 50)
        }
      }, this.props.children), this.state.overflowing && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "changelog-entry__expand-trigger"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
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

/***/ "KnAV":
/*!************************************!*\
  !*** ./js/components/changelog.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



var ChangeField = function ChangeField(_ref) {
  var name = _ref.name,
      data = _ref.data;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "change__field"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, name), ": ", data != undefined && data != null ? data.toString() : 'N/A');
};

var ChangeLogEntryHeader = function ChangeLogEntryHeader(_ref2) {
  var data = _ref2.data;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
    className: "changelog__entry__header is-expanded"
  }, " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "text-nowrap text-action"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-caret-down"
  }), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, data.date)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "text-nowrap"
  }, data.admin_user), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, data.change_type), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null));
};

var ChangeLogEntryRow = function ChangeLogEntryRow(_ref3) {
  var data = _ref3.data;

  if (data.change_type == 'user_programs_updated') {
    // Create multiple row for program/country changes:
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, Object.entries(data.diff_list.countries).length > 0 && Object.entries(data.diff_list.countries).map(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          id = _ref5[0],
          country = _ref5[1];

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
        key: id,
        className: "changelog__entry__row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "changelog__change--prev"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "country",
        data: country.prev.country
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "role",
        data: country.prev.role
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "changelog__change--new"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "country",
        data: country.new.country
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "role",
        data: country.new.role
      }))));
    }), Object.entries(data.diff_list.programs).length > 0 && Object.entries(data.diff_list.programs).map(function (_ref6) {
      var _ref7 = _slicedToArray(_ref6, 2),
          id = _ref7[0],
          program = _ref7[1];

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
        key: id,
        className: "changelog__entry__row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "changelog__change--prev"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "program",
        data: program.prev.program
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "country",
        data: program.prev.country
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "role",
        data: program.prev.role
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "changelog__change--new"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "program",
        data: program.new.program
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "country",
        data: program.new.country
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "role",
        data: program.new.role
      }))));
    }));
  } else {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      className: "changelog__entry__row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "text-nowrap"
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "changelog__change--prev"
    }, data.diff_list.map(function (changeset, id) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        key: id,
        name: changeset.name,
        data: changeset.prev
      });
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "changelog__change--new"
    }, data.diff_list.map(function (changeset, id) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        key: id,
        name: changeset.name,
        data: changeset.new
      });
    }))));
  }
};

var ChangeLogEntry = function ChangeLogEntry(_ref8) {
  var data = _ref8.data;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", {
    className: "changelog__entry",
    key: data.id
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogEntryHeader, {
    data: data
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogEntryRow, {
    data: data
  }));
};

var ChangeLog = function ChangeLog(_ref9) {
  var data = _ref9.data;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
    className: "table table-sm bg-white table-bordered text-small changelog"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Date")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Admin")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Change Type")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap td--half-stretch"
  }, gettext("Previous Entry")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap td--half-stretch"
  }, gettext("New Entry")))), data.map(function (entry, id) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogEntry, {
      key: id,
      data: entry
    });
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (ChangeLog);

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
    previousLabel: '‹',
    previousClassName: 'page-item previous',
    previousLinkClassName: 'page-link',
    nextLabel: '›',
    nextClassName: 'page-item next',
    nextLinkClassName: 'page-link',
    breakLabel: "...",
    disabledClassName: 'disabled',
    breakClassName: 'page-item disabled',
    breakLinkClassName: 'page-link',
    pageClassName: 'page-item',
    pageLinkClassName: 'page-link',
    marginPagesDisplayed: 2,
    pageRangeDisplayed: 5,
    containerClassName: "pagination",
    activeClassName: "active"
  }, props));
};

/* harmony default export */ __webpack_exports__["default"] = (Pagination);

/***/ }),

/***/ "SF2N":
/*!***************************************************************************************!*\
  !*** ./js/pages/tola_management_pages/organization/components/organization_editor.js ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return OrganizationEditor; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
var _class;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var OrganizationEditor = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(OrganizationEditor, _React$Component);

  function OrganizationEditor(props) {
    var _this;

    _classCallCheck(this, OrganizationEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OrganizationEditor).call(this, props));
    _this.state = {
      active_page: 'profile'
    };
    return _this;
  }

  _createClass(OrganizationEditor, [{
    key: "updateActivePage",
    value: function updateActivePage(new_page) {
      if (!this.props.new) {
        this.setState({
          active_page: new_page
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          ProfileSection = _this$props.ProfileSection,
          HistorySection = _this$props.HistorySection;
      var profile_active_class = this.state.active_page == 'profile' ? 'active' : '';
      var history_active_class = this.state.active_page == 'status_and_history' ? 'active' : '';
      var new_class = this.props.new ? 'disabled' : '';
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "user-editor tab-set--vertical"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "nav nav-tabs"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "nav-link ".concat(profile_active_class),
        onClick: function onClick(e) {
          e.preventDefault();

          _this2.updateActivePage('profile');
        }
      }, gettext("Profile")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "nav-link ".concat(history_active_class),
        onClick: function onClick(e) {
          e.preventDefault();

          _this2.updateActivePage('status_and_history');
        }
      }, gettext("Status and History")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-content"
      }, this.state.active_page == 'profile' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProfileSection, null), this.state.active_page == 'status_and_history' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(HistorySection, null)));
    }
  }]);

  return OrganizationEditor;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;



/***/ }),

/***/ "SXQ9":
/*!*********************************************************************************************!*\
  !*** ./js/pages/tola_management_pages/organization/components/edit_organization_history.js ***!
  \*********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EditOrganizationHistory; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var react_virtualized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-virtualized */ "c7k8");
/* harmony import */ var components_expander__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! components/expander */ "H4hL");
/* harmony import */ var components_changelog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! components/changelog */ "KnAV");
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







var status_options = [{
  value: true,
  label: gettext('Active')
}, {
  value: false,
  label: gettext('Inactive')
}];

var EditOrganizationHistory =
/*#__PURE__*/
function (_React$Component) {
  _inherits(EditOrganizationHistory, _React$Component);

  function EditOrganizationHistory(props) {
    var _this;

    _classCallCheck(this, EditOrganizationHistory);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EditOrganizationHistory).call(this, props));

    var data = _objectSpread({}, props.organizationData, {
      is_active: status_options.find(function (op) {
        return op.value == props.organizationData.is_active;
      })
    });

    _this.state = {
      initial_data: data,
      data: _objectSpread({}, data)
    };
    return _this;
  }

  _createClass(EditOrganizationHistory, [{
    key: "onChange",
    value: function onChange(new_value) {
      this.state.data.is_active = new_value;
      this.setState({
        data: this.state.data
      });
    }
  }, {
    key: "onReset",
    value: function onReset() {
      this.setState({
        data: this.state.initial_data
      });
    }
  }, {
    key: "save",
    value: function save(e) {
      e.preventDefault();
      this.props.onSave(_objectSpread({}, this.state.data, {
        is_active: this.state.data.is_active.value,
        sectors: this.state.data.sectors.map(function (sector) {
          return sector.id;
        })
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
        className: "no-bold"
      }, this.state.data.name ? this.state.data.name + ": " : "", gettext("Status and history")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        options: status_options,
        value: this.state.data.is_active,
        onChange: function onChange(new_value) {
          return _this2.onChange(new_value);
        }
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick(e) {
          return _this2.save(e);
        }
      }, gettext("Save Changes")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this2.onReset();
        }
      }, gettext("Reset"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_changelog__WEBPACK_IMPORTED_MODULE_5__["default"], {
        data: this.props.organizationHistoryData
      }));
    }
  }]);

  return EditOrganizationHistory;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);



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

/***/ "j6MH":
/*!**************************************************************!*\
  !*** ./js/pages/tola_management_pages/organization/index.js ***!
  \**************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models */ "2BBp");
/* harmony import */ var _views__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views */ "EdTt");




/*
 * Model/Store setup
 */

var store = new _models__WEBPACK_IMPORTED_MODULE_2__["OrganizationStore"](jsContext.programs, jsContext.organizations, jsContext.sectors, jsContext.countries, jsContext.country_filter, jsContext.program_filter);
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_views__WEBPACK_IMPORTED_MODULE_3__["IndexView"], {
  store: store
}), document.querySelector('#app_root'));

/***/ }),

/***/ "tnXs":
/*!******************************************!*\
  !*** ./js/components/folding-sidebar.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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
      folded: false
    };
    return _this;
  }

  _createClass(Expander, [{
    key: "toggleFolded",
    value: function toggleFolded() {
      this.setState({
        folded: !this.state.folded
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          className = _this$props.className,
          props = _objectWithoutProperties(_this$props, ["className"]);

      var icon = this.state.folded ? "fa-chevron-right" : "fa-chevron-left";
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", _extends({
        className: "folding-sidebar " + (className || '')
      }, props), !this.state.folded && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, this.props.children), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "folding-sidebar__trigger",
        onClick: function onClick() {
          return _this2.toggleFolded();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        key: icon
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "fa " + icon
      }))));
    }
  }]);

  return Expander;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (Expander);

/***/ }),

/***/ "yD2D":
/*!*********************************************************************************************!*\
  !*** ./js/pages/tola_management_pages/organization/components/edit_organization_profile.js ***!
  \*********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EditOrganizationProfile; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! components/checkboxed-multi-select */ "Z2Y6");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
var _class;

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





var EditOrganizationProfile = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(EditOrganizationProfile, _React$Component);

  function EditOrganizationProfile(props) {
    var _this;

    _classCallCheck(this, EditOrganizationProfile);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EditOrganizationProfile).call(this, props));
    var o = props.organizationData;

    var data = _objectSpread({}, o, {
      sectors: o.sectors.map(function (sector) {
        return {
          value: sector.id,
          label: sector.sector
        };
      })
    });

    _this.state = {
      initial_data: data,
      managed_data: _objectSpread({}, data)
    };
    return _this;
  }

  _createClass(EditOrganizationProfile, [{
    key: "save",
    value: function save(e) {
      e.preventDefault();
      this.props.onSave(_objectSpread({}, this.state.managed_data, {
        sectors: this.state.managed_data.sectors.map(function (sector) {
          return sector.value;
        })
      }));
    }
  }, {
    key: "saveNew",
    value: function saveNew(e) {
      e.preventDefault();
      this.props.onSaveNew(_objectSpread({}, this.state.managed_data, {
        sectors: this.state.managed_data.sectors.map(function (sector) {
          return sector.value;
        })
      }));
    }
  }, {
    key: "saveNewAndAddAnother",
    value: function saveNewAndAddAnother(e) {
      e.preventDefault();
      this.props.onSaveNewAndAddAnother(_objectSpread({}, this.state.managed_data, {
        sectors: this.state.managed_data.sectors.map(function (sector) {
          return sector.value;
        })
      }));
    }
  }, {
    key: "resetForm",
    value: function resetForm() {
      this.setState({
        managed_data: this.state.initial_data
      });
    }
  }, {
    key: "updateName",
    value: function updateName(new_name) {
      var new_data = this.state.managed_data;
      new_data.name = new_name;
      this.setState({
        managed_data: new_data
      });
    }
  }, {
    key: "updateSectors",
    value: function updateSectors(new_sectors) {
      var new_data = this.state.managed_data;
      new_data.sectors = new_sectors;
      this.setState({
        managed_data: new_data
      });
    }
  }, {
    key: "updatePrimaryAddress",
    value: function updatePrimaryAddress(new_address) {
      var new_data = this.state.managed_data;
      new_data.primary_address = new_address;
      this.setState({
        managed_data: new_data
      });
    }
  }, {
    key: "updatePrimaryContactName",
    value: function updatePrimaryContactName(new_name) {
      var new_data = this.state.managed_data;
      new_data.primary_contact_name = new_name;
      this.setState({
        managed_data: new_data
      });
    }
  }, {
    key: "updatePrimaryContactEmail",
    value: function updatePrimaryContactEmail(new_email) {
      var new_data = this.state.managed_data;
      new_data.primary_contact_email = new_email;
      this.setState({
        managed_data: new_data
      });
    }
  }, {
    key: "updatePrimaryContactPhone",
    value: function updatePrimaryContactPhone(new_phone) {
      var new_data = this.state.managed_data;
      new_data.primary_contact_phone = new_phone;
      this.setState({
        managed_data: new_data
      });
    }
  }, {
    key: "updateModeOfContact",
    value: function updateModeOfContact(new_mode_of_contact) {
      var new_data = this.state.managed_data;
      new_data.mode_of_contact = new_mode_of_contact;
      this.setState({
        managed_data: new_data
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var od = this.state.managed_data;
      var errors = this.props.errors;
      var error_classes = {
        name: errors.name ? 'is-invalid' : '',
        primary_address: errors.primary_address ? 'is-invalid' : '',
        primary_contact_name: errors.primary_contact_name ? 'is-invalid' : '',
        primary_contact_email: errors.primary_contact_email ? 'is-invalid' : '',
        primary_contact_phone: errors.primary_contact_phone ? 'is-invalid' : ''
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
        className: "no-bold"
      }, od.name ? od.name + ": " : "", gettext("Profile")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "form needs-validation",
        noValidate: true
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "organization-name-input"
      }, gettext("Organization name"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "required"
      }, "*")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        value: od.name,
        onChange: function onChange(e) {
          return _this2.updateName(e.target.value);
        },
        className: "form-control " + error_classes.name,
        id: "organization-name-input",
        required: true
      }), errors.name && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback"
      }, errors.name)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "sectors-input"
      }, "Sectors"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_1__["default"], {
        value: od.sectors,
        options: this.props.sectorSelections,
        onChange: function onChange(e) {
          return _this2.updateSectors(e);
        },
        placeholder: gettext("None Selected"),
        id: "sectors-input"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "primary-address-input"
      }, gettext("Primary Address"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "required"
      }, "*")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", {
        value: od.primary_address,
        onChange: function onChange(e) {
          return _this2.updatePrimaryAddress(e.target.value);
        },
        className: "form-control " + error_classes.primary_address,
        id: "primary-address-input",
        required: true
      }), errors.primary_address && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback"
      }, errors.primary_address)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "primary-contact-name-input"
      }, gettext("Primary Contact Name"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "required"
      }, "*")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        value: od.primary_contact_name,
        onChange: function onChange(e) {
          return _this2.updatePrimaryContactName(e.target.value);
        },
        className: "form-control " + error_classes.primary_contact_name,
        id: "primary-contact-name-input",
        required: true
      }), errors.primary_contact_name && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback"
      }, errors.primary_contact_name)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "primary-contact-email-input"
      }, gettext("Primary Contact Email"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "required"
      }, "*")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        value: od.primary_contact_email,
        onChange: function onChange(e) {
          return _this2.updatePrimaryContactEmail(e.target.value);
        },
        className: "form-control " + error_classes.primary_contact_email,
        id: "primary-contact-email-input",
        required: true
      }), errors.primary_contact_email && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback"
      }, errors.primary_contact_email)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "primary-contact-phone-input"
      }, gettext("Primary Contact Phone Number"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "required"
      }, "*")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        value: od.primary_contact_phone,
        onChange: function onChange(e) {
          return _this2.updatePrimaryContactPhone(e.target.value);
        },
        className: "form-control " + error_classes.primary_contact_phone,
        id: "primary-contact-phone-input",
        required: true
      }), errors.primary_contact_phone && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback"
      }, errors.primary_contact_phone)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "mode-of-contact-input"
      }, gettext("Preferred Mode of Contact")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        value: od.mode_of_contact,
        onChange: function onChange(e) {
          return _this2.updateModeOfContact(e.target.value);
        },
        className: "form-control",
        id: "mode-of-contact-input"
      })), this.props.new && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        onClick: function onClick(e) {
          return _this2.saveNew(e);
        }
      }, gettext("Save Changes")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-secondary",
        onClick: function onClick(e) {
          return _this2.saveNewAndAddAnother(e);
        }
      }, gettext("Save and Add Another")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this2.resetForm();
        }
      }, gettext("Reset"))), !this.props.new && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        onClick: function onClick(e) {
          return _this2.save(e);
        }
      }, gettext("Save Changes")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this2.resetForm();
        }
      }, gettext("Reset")))));
    }
  }]);

  return EditOrganizationProfile;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;



/***/ }),

/***/ "zUdS":
/*!************************************************************!*\
  !*** ./js/pages/tola_management_pages/organization/api.js ***!
  \************************************************************/
/*! exports provided: fetchOrganizationsWithFilter, fetchOrganization, updateOrganization, createOrganization, fetchOrganizationAggregates, fetchOrganizationHistory, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchOrganizationsWithFilter", function() { return fetchOrganizationsWithFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchOrganization", function() { return fetchOrganization; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateOrganization", function() { return updateOrganization; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createOrganization", function() { return createOrganization; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchOrganizationAggregates", function() { return fetchOrganizationAggregates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchOrganizationHistory", function() { return fetchOrganizationHistory; });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../api */ "XoI5");
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var fetchOrganizationsWithFilter = function fetchOrganizationsWithFilter(page, filters) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get('/tola_management/organization/', {
    params: _objectSpread({
      page: page
    }, filters)
  }).then(function (response) {
    var data = response.data;
    var total_results_count = data.count;
    var current_results_count = data.results.length;
    var total_pages = data.page_count;
    return {
      organizations: data.results,
      total_pages: total_pages,
      total_organizations: total_results_count,
      next_page: data.next,
      prev_page: data.previous
    };
  });
};
var fetchOrganization = function fetchOrganization(id) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get("/tola_management/organization/".concat(id, "/")).then(function (response) {
    return response.data;
  });
};
var updateOrganization = function updateOrganization(id, new_data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].put("/tola_management/organization/".concat(id, "/"), _objectSpread({}, new_data, {
    sectors: new_data.sectors.map(function (sector) {
      return {
        id: sector
      };
    })
  })).then(function (response) {
    return response.data;
  });
};
var createOrganization = function createOrganization(new_data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].post("/tola_management/organization/", _objectSpread({}, new_data, {
    sectors: new_data.sectors.map(function (sector) {
      return {
        id: sector
      };
    })
  })).then(function (response) {
    return response.data;
  });
};
var fetchOrganizationAggregates = function fetchOrganizationAggregates(id) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get("/tola_management/organization/".concat(id, "/aggregate_data/")).then(function (response) {
    return response.data;
  });
};
var fetchOrganizationHistory = function fetchOrganizationHistory(id) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get("/tola_management/organization/".concat(id, "/history/")).then(function (response) {
    return response.data;
  });
};
/* harmony default export */ __webpack_exports__["default"] = ({
  fetchOrganizationsWithFilter: fetchOrganizationsWithFilter,
  fetchOrganization: fetchOrganization,
  fetchOrganizationHistory: fetchOrganizationHistory,
  fetchOrganizationAggregates: fetchOrganizationAggregates,
  updateOrganization: updateOrganization,
  createOrganization: createOrganization
});

/***/ })

},[["j6MH","runtime","vendors"]]]);
//# sourceMappingURL=tola_management_organization-5271c5c80db2208426b1.js.map