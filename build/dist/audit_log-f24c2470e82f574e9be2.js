(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{"6bbB":function(e,t,a){"use strict";a.r(t);var n,r,o,l,i,c,s,u,p,m,f,d=a("q1tI"),g=a.n(d),b=a("i8i4"),h=a.n(b),y=a("2vnA"),_=a("XoI5"),v=function(e,t){return _.a.get("/tola_management/program/".concat(e,"/audit_log/"),{params:{page:t}}).then(function(e){var t=e.data,a=t.count,n=(t.results.length,t.page_count);return{logs:t.results,total_pages:n,total_entries:a,next_page:t.next,prev_page:t.previous}})};function E(e,t,a,n){a&&Object.defineProperty(e,t,{enumerable:a.enumerable,configurable:a.configurable,writable:a.writable,value:a.initializer?a.initializer.call(n):void 0})}function w(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function x(a,n,e,t,r){var o={};return Object.keys(t).forEach(function(e){o[e]=t[e]}),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=e.slice().reverse().reduce(function(e,t){return t(a,n,e)||e},o),r&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(r):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(a,n,o),o=null),o}var N=(r=x((n=function(){function a(e,t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),E(this,"program_id",r,this),E(this,"program_name",o,this),E(this,"log_rows",l,this),E(this,"fetching",i,this),E(this,"current_page",c,this),E(this,"entries_count",s,this),E(this,"total_pages",u,this),E(this,"next_page",p,this),E(this,"previous_page",m,this),E(this,"expando_rows",f,this),this.program_id=e,this.program_name=t,this.fetchProgramAuditLog()}var e,t,n;return e=a,(t=[{key:"fetchProgramAuditLog",value:function(){var t=this;this.fetching=!0,v(this.program_id,this.current_page+1).then(function(e){Object(y.m)(function(){t.fetching=!1,t.log_rows=e.logs,t.entries_count=e.total_entries,t.total_pages=e.total_pages,t.next_page=e.next_page,t.previous_page=e.previous_page})})}},{key:"changePage",value:function(e){e.selected!=this.current_page&&(this.current_page=e.selected,this.fetchProgramAuditLog())}},{key:"toggleRowExpando",value:function(e){this.expando_rows.has(e)?this.expando_rows.delete(e):this.expando_rows.add(e)}},{key:"expandAllExpandos",value:function(){var t=this;this.log_rows.forEach(function(e){return t.expando_rows.add(e.id)})}},{key:"collapsAllExpandos",value:function(){this.expando_rows.clear()}}])&&w(e.prototype,t),n&&w(e,n),a}()).prototype,"program_id",[y.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),o=x(n.prototype,"program_name",[y.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),l=x(n.prototype,"log_rows",[y.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),i=x(n.prototype,"fetching",[y.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return!1}}),c=x(n.prototype,"current_page",[y.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 0}}),s=x(n.prototype,"entries_count",[y.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 0}}),u=x(n.prototype,"total_pages",[y.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 0}}),p=x(n.prototype,"next_page",[y.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),m=x(n.prototype,"previous_page",[y.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),f=x(n.prototype,"expando_rows",[y.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return new Set}}),x(n.prototype,"fetchProgramAuditLog",[y.d],Object.getOwnPropertyDescriptor(n.prototype,"fetchProgramAuditLog"),n.prototype),x(n.prototype,"changePage",[y.d],Object.getOwnPropertyDescriptor(n.prototype,"changePage"),n.prototype),x(n.prototype,"toggleRowExpando",[y.d],Object.getOwnPropertyDescriptor(n.prototype,"toggleRowExpando"),n.prototype),x(n.prototype,"expandAllExpandos",[y.d],Object.getOwnPropertyDescriptor(n.prototype,"expandAllExpandos"),n.prototype),x(n.prototype,"collapsAllExpandos",[y.d],Object.getOwnPropertyDescriptor(n.prototype,"collapsAllExpandos"),n.prototype),n),O=a("okNM"),j=(a("TSYQ"),a("TGVD"),a("RCjz")),k=(a("Z2Y6"),a("H4hL"),a("IP2g")),P=a("DDFe");function C(e){return(C="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function S(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function z(e,t){return!t||"object"!==C(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function L(e){return(L=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function A(e,t){return(A=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function R(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var a=[],n=!0,r=!1,o=void 0;try{for(var l,i=e[Symbol.iterator]();!(n=(l=i.next()).done)&&(a.push(l.value),!t||a.length!==t);n=!0);}catch(e){r=!0,o=e}finally{try{n||null==i.return||i.return()}finally{if(r)throw o}}return a}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var T=function(e){var t=e.data,a=e.name,n=e.pretty_name;return"evidence_url"==a?g.a.createElement("div",{className:"change__field"},g.a.createElement("strong",null,n),": ","N/A"!=t?g.a.createElement("a",{href:t},"Link"):t):g.a.createElement("div",{className:"change__field"},g.a.createElement("strong",null,n),": ",t)},D=function(e){var t=e.data,a=(e.name,e.pretty_name);return g.a.createElement("p",null,a,": ",t)},I=function(e){var t=e.data,a=e.name,n=e.pretty_name;return"targets"==a?g.a.createElement("div",{className:"changelog__change__targets"},g.a.createElement("h4",{className:"text-small"},gettext("Targets changed")),Object.entries(t).map(function(e){var t=R(e,2),a=t[0],n=t[1];return g.a.createElement("div",{className:"change__field",key:a},g.a.createElement("strong",null,n.name,":")," ",n.value)})):g.a.createElement("div",{className:"change__field"},g.a.createElement("strong",null,n,":")," ",null!=t?t.toString():gettext("N/A"))},q=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),z(this,L(t).apply(this,arguments))}var a,n,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&A(e,t)}(t,g.a.Component),a=t,(n=[{key:"renderType",value:function(e,t,a,n){switch(e){case"indicator_changed":case"indicator_created":case"indicator_deleted":return g.a.createElement(I,{data:t,name:a,pretty_name:n});case"result_changed":case"result_created":case"result_deleted":return g.a.createElement(T,{data:t,name:a,pretty_name:n});case"program_dates_changed":return g.a.createElement(D,{data:t,name:a,pretty_name:n})}}},{key:"render",value:function(){var e=this.props,t=e.data,a=e.type,n=e.name,r=e.pretty_name;return this.renderType(a,t,n,r)}}])&&S(a.prototype,n),r&&S(a,r),t}(),H=Object(O.a)(function(e){var t=e.store;return g.a.createElement("button",{className:"btn btn-medium text-action btn-sm",onClick:function(){return t.expandAllExpandos()},disabled:t.log_rows.length===t.expando_rows.size},g.a.createElement("i",{className:"fas fa-plus-square"}),gettext("Expand all"))}),V=Object(O.a)(function(e){var t=e.store;return g.a.createElement("button",{className:"btn btn-medium text-action btn-sm",onClick:function(){return t.collapsAllExpandos()},disabled:0===t.expando_rows.size},g.a.createElement("i",{className:"fas fa-minus-square"}),gettext("Collapse all"))}),M=Object(O.a)(function(e){var a=e.store;return g.a.createElement("div",{id:"audit-log-index-view"},g.a.createElement("header",{className:"page-title"},g.a.createElement("h1",null,g.a.createElement("small",null,gettext("Indicator change log:"))," ",a.program_name)),g.a.createElement("div",{className:"admin-list__controls"},g.a.createElement("div",{className:"controls__bulk-actions"},g.a.createElement("div",{className:"btn-group"},g.a.createElement(H,{store:a}),g.a.createElement(V,{store:a}))),g.a.createElement("div",{className:"controls__buttons"},g.a.createElement("a",{className:"btn btn-secondary btn-sm",href:"/api/tola_management/program/".concat(a.program_id,"/export_audit_log")},g.a.createElement("i",{className:"fas fa-download"}),gettext("Excel")))),g.a.createElement("div",{className:"admin-list__table"},g.a.createElement(P.a,{isLoading:a.fetching},g.a.createElement("table",{className:"table table-sm table-bordered bg-white text-small changelog"},g.a.createElement("thead",null,g.a.createElement("tr",null,g.a.createElement("th",{className:"text-nowrap"},gettext("Date and Time")),g.a.createElement("th",{className:"text-nowrap"},gettext("No.")),g.a.createElement("th",{className:"text-nowrap"},gettext("Indicator")),g.a.createElement("th",{className:"text-nowrap"},gettext("User")),g.a.createElement("th",{className:"text-nowrap"},gettext("Organization")),g.a.createElement("th",{className:"text-nowrap"},gettext("Change Type")),g.a.createElement("th",{className:"text-nowrap"},gettext("Previous Entry")),g.a.createElement("th",{className:"text-nowrap"},gettext("New Entry")),g.a.createElement("th",{className:"text-nowrap"},gettext("Rationale")))),a.log_rows.map(function(t){var e=a.expando_rows.has(t.id);return g.a.createElement("tbody",{key:t.id},"`",g.a.createElement("tr",{className:e?"changelog__entry__header is-expanded":"changelog__entry__header",onClick:function(){return a.toggleRowExpando(t.id)}},g.a.createElement("td",{className:"text-action"},g.a.createElement(k.a,{icon:e?"caret-down":"caret-right"})," ",t.date),g.a.createElement("td",null,t.indicator?t.indicator.number:gettext("N/A")),g.a.createElement("td",null,t.indicator?t.indicator.name:gettext("N/A")),g.a.createElement("td",null,t.user),g.a.createElement("td",null,t.organization),g.a.createElement("td",{className:"text-nowrap"},t.pretty_change_type),g.a.createElement("td",null),g.a.createElement("td",null),g.a.createElement("td",null)),e&&g.a.createElement("tr",{className:"changelog__entry__row",key:t.id},g.a.createElement("td",null),g.a.createElement("td",null),g.a.createElement("td",null),g.a.createElement("td",null),g.a.createElement("td",null),g.a.createElement("td",null),g.a.createElement("td",{className:"changelog__change--prev"},t.diff_list.map(function(e){return g.a.createElement(q,{key:e.name,name:e.name,pretty_name:e.pretty_name,type:t.change_type,data:e.prev})})),g.a.createElement("td",{className:"changelog__change--new"},t.diff_list.map(function(e){return g.a.createElement(q,{key:e.name,name:e.name,pretty_name:e.pretty_name,type:t.change_type,data:e.new})})),g.a.createElement("td",{className:"changelog__change--rationale"},t.rationale)))}))),g.a.createElement("div",{className:"admin-list__metadata"},g.a.createElement("div",{className:"metadata__count text-muted text-small"},a.entries_count?"".concat(a.entries_count," ").concat(gettext("entries")):"--"),g.a.createElement("div",{className:"metadata__controls"},a.total_pages&&g.a.createElement(j.a,{pageCount:a.total_pages,initialPage:a.current_page,onPageChange:function(e){return a.changePage(e)}})))))}),B=new N(jsContext.program_id,jsContext.program_name);h.a.render(g.a.createElement(M,{store:B}),document.querySelector("#app_root"))},DDFe:function(e,t,a){"use strict";var n=a("q1tI"),l=a.n(n);function i(){return(i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}function c(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],0<=t.indexOf(a)||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],0<=t.indexOf(a)||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}t.a=function(e){var t=e.children,a=e.isLoading,n=e.className,r=c(e,["children","isLoading","className"]),o=a?"loading":"";return l.a.createElement("div",i({className:"loading-spinner__container "+o+" "+(n||"")},r),l.a.createElement("div",{className:"loading-spinner__overlay"},l.a.createElement("div",{className:"loading-spinner__spinner"})),t)}},H4hL:function(e,t,a){"use strict";a("q1tI")},RCjz:function(e,t,a){"use strict";var n=a("q1tI"),r=a.n(n),o=a("werx"),l=a.n(o);a("okNM");function i(){return(i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}t.a=function(e){return r.a.createElement(l.a,i({previousLabel:"‹",previousClassName:"page-item previous",previousLinkClassName:"page-link",nextLabel:"›",nextClassName:"page-item next",nextLinkClassName:"page-link",breakLabel:"...",disabledClassName:"disabled",breakClassName:"page-item disabled",breakLinkClassName:"page-link",pageClassName:"page-item",pageLinkClassName:"page-link",marginPagesDisplayed:2,pageRangeDisplayed:5,containerClassName:"pagination",activeClassName:"active"},e))}},TGVD:function(e,t,a){"use strict";var l=a("okNM"),n=a("q1tI"),i=a.n(n),r=a("TSYQ"),c=a.n(r);function s(){return(s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}function u(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],0<=t.indexOf(a)||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],0<=t.indexOf(a)||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var o=function(e){var t=e.className,a=(e.size,u(e,["className","size"]));return i.a.createElement("td",s({className:["mgmt-table__col",t].join(" ")},a),a.children)},p=function(e){var t=e.className,a=(e.size,u(e,["className","size"]));return i.a.createElement("th",s({className:["mgmt-table__col",t].join(" ")},a),a.children)},m=function(e){var t=e.className,a=u(e,["className"]);return i.a.createElement("tr",s({className:["mgmt-table__row",t].join(" ")},a),a.children)},f=function(e){var t=e.className,a=u(e,["className"]);return i.a.createElement("tr",s({className:["mgmt-table__row table-header",t].join(" ")},a),a.children)},d=Object(l.a)(function(e){var t=e.className,a=e.expanded,n=e.Expando,r=u(e,["className","expanded","Expando"]);if(n){var o=Object(l.a)(n);return i.a.createElement("tbody",s({className:c()(["mgmt-table__body",t].join(" "),{"is-expanded":a})},r),i.a.createElement(m,null,r.children),a&&i.a.createElement(o,{Wrapper:g}))}return i.a.createElement("tbody",s({className:["mgmt-table__body",t].join(" ")},r),i.a.createElement(m,null,r.children))}),g=function(e){var t=e.className,a=u(e,["className"]);return i.a.createElement("tr",s({className:["mgmt-table__row--expanded",t].join(" ")},a),i.a.createElement("td",{colSpan:"6"},a.children))},b=Object(l.a)(function(e){var t=e.data,a=e.Row,n=e.keyField,r=(u(e,["data","Row","keyField"]),Object(l.a)(a));return t.map(function(e){return i.a.createElement(r,{key:e[n],data:e,Col:o,Row:d})})}),h=Object(l.a)(function(e){var t=e.HeaderRow,a=e.className,n=u(e,["HeaderRow","className"]),r=Object(l.a)(t);return i.a.createElement("table",{className:["table bg-white",a].join(" ")},i.a.createElement("thead",null,i.a.createElement(r,{Col:p,Row:f})),i.a.createElement(b,n))});t.a=h},XoI5:function(e,t,a){"use strict";a.d(t,"a",function(){return r});var n=a("vDqi"),r=a.n(n).a.create({withCredentials:!0,baseURL:"/api/",headers:{"X-CSRFToken":document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/,"$1")}})},Z2Y6:function(e,t,a){"use strict";var n=a("q1tI"),i=a.n(n),c=a("c7k8");a("y2Vs");function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function l(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function s(e){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var p,m=function(e){function a(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(t=l(this,s(a).call(this,e))).cache=new c.c({fixedWidth:!0,defaultHeight:35}),t.filter_val="",t}var t,n,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)}(a,i.a.PureComponent),t=a,(n=[{key:"render",value:function(){var o=this,e=this.props,l=(e.options,e.children),t=e.maxHeight,a=(e.getValue,e.selectProps),n=l.length||0;return a.inputValue!==this.filter_val&&(this.filter_val=a.inputValue,this.cache.clearAll()),i.a.createElement("div",{style:{display:"flex",height:"100vh",maxHeight:t+"px"}},i.a.createElement("div",{style:{flex:"1 1 auto"}},i.a.createElement(c.a,null,function(e){var t=e.width,a=e.height;return i.a.createElement(c.e,{height:a,width:t,deferredMeasurementCache:o.cache,rowCount:n,rowHeight:o.cache.rowHeight,noRowsRenderer:function(){return i.a.createElement("div",null,"No selections available")},rowRenderer:function(e){var t=e.index,a=e.parent,n=e.key,r=e.style;return i.a.createElement(c.b,{key:n,cache:o.cache,parent:a,columnIndex:0,rowIndex:t},i.a.createElement("div",{style:r},l[t]))}})})))}}])&&o(t.prototype,n),r&&o(t,r),a}(),f=a("VCnP"),d=a.n(f),g=a("okNM");function b(e){return(b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(){return(h=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}function y(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _(e,t){return!t||"object"!==b(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function v(e){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function E(e,t){return(E=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var w=function(e){return i.a.createElement("div",{className:"count__label"},e.children,e.clearable&&i.a.createElement("div",{onClick:e.clearSelect},i.a.createElement("i",{className:"fa fa-times","aria-hidden":"true"})))},x=Object(g.a)(p=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=_(this,v(t).call(this,e))).clearSelect=function(e){e.stopPropagation(),n.props.onChange([])},n.makeLabel=function(e){var t=e.placeholderButtonLabel,a=e.value;return a?Array.isArray(a)?0===a.length?i.a.createElement(w,{clearable:!1},t):1===a.length?i.a.createElement(w,{clearable:!0,clearSelect:n.clearSelect},a[0].label):i.a.createElement(w,{clearable:!0,clearSelect:n.clearSelect},"".concat(a.length," ",gettext("selected"))):i.a.createElement(w,{clearable:!1},a.label):i.a.createElement(w,{clearable:!1},t)},n}var a,n,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&E(e,t)}(t,i.a.Component),a=t,(n=[{key:"render",value:function(){return i.a.createElement(d.a,h({},this.props,{placeholder:gettext("Search"),placeholderButtonLabel:this.props.placeholder,getDropdownButtonLabel:this.makeLabel,components:{MenuList:m}}))}}])&&y(a.prototype,n),r&&y(a,r),t}())||p;t.a=x}},[["6bbB",0,1]]]);