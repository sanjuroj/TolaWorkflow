(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"4L+s":function(e,t,r){"use strict";r.d(t,"b",function(){return f}),r.d(t,"a",function(){return v});var n=r("q1tI"),i=r.n(n),o=r("i8i4"),l=r.n(o);function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function u(e,t){return!t||"object"!==a(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function d(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&m(e,t)}function m(e,t){return(m=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var f=function(e){function r(e){var t;return s(this,r),(t=u(this,p(r).call(this,e))).content=e.content,t.placement=e.placement||null,t}var t,n,o;return d(r,i.a.Component),t=r,(n=[{key:"render",value:function(){return i.a.createElement("a",{tabIndex:"0","data-toggle":"popover","data-trigger":"focus","data-html":"true","data-placement":this.placement,"data-content":this.content},i.a.createElement("i",{className:"far fa-question-circle"}))}}])&&c(t.prototype,n),o&&c(t,o),r}(),v=function(e){function a(){var e,r;s(this,a);for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];return(r=u(this,(e=p(a)).call.apply(e,[this].concat(n)))).popoverName="base",r.componentDidMount=function(){r.bodyClickHandler=function(e){0==$("#".concat(r.popoverName,"_popover_content")).parent().find($(e.target)).length&&$(r.refs.target).popover("hide")};var t=function(){$("body").on("click",r.bodyClickHandler),$(r.refs.target).popover("update").on("hide.bs.popover",function(){$("body").off("click",r.bodyClickHandler)})};$(r.refs.target).popover({content:'<div id="'.concat(r.popoverName,'_popover_content"></div>'),html:!0,placement:"bottom"}).on("shown.bs.popover",function(e){l.a.render(r.getPopoverContent(),document.querySelector("#".concat(r.popoverName,"_popover_content")),t)})},r.getPopoverContent=function(){throw new Error("not implemented")},r}return d(a,i.a.Component),a}()},Ez0T:function(e,t,r){"use strict";var n=r("q1tI"),a=r.n(n),i=r("y2Vs"),o=r("VCnP"),l=r.n(o),s=0;function c(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"id";return s++,"".concat(e).concat(s)}function u(){return(u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function p(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{},n=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),n.forEach(function(e){d(t,e,r[e])})}return t}function d(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}r.d(t,"c",function(){return m}),r.d(t,"a",function(){return f}),r.d(t,"d",function(){return v}),r.d(t,"b",function(){return b});var m=function(e){var t=c("react-select"),r=e.labelClasses||"col-form-label text-uppercase",n=e.formRowClasses||"form-row mb-3",o=e.selectClasses||"tola-react-select";return a.a.createElement("div",{className:n},a.a.createElement("label",{htmlFor:t,className:r},e.label),a.a.createElement(i.default,{onChange:e.update,value:e.value,id:t,className:o,isDisabled:e.disabled,options:e.options}))},f=function(e){var t=c("date-select"),r=e.options&&1==e.options.length&&void 0!==e.options[0].value?a.a.createElement("option",{value:e.options[0].value},e.options[0].label):e.options&&void 0!==e.options[0].options?e.options.map(function(e,t){return a.a.createElement("optgroup",{label:e.label,key:t},e.options.map(function(e){return a.a.createElement("option",{value:e.value,key:e.value},e.label)}))}):e.options.map(function(e,t){return a.a.createElement("option",{value:e.value,key:t},e.label)});return a.a.createElement("div",{className:"form-row mb-3"},a.a.createElement("label",{htmlFor:t,className:"col-form-label text-uppercase"},e.label),a.a.createElement("select",{className:"form-control",id:t,value:e.value,onChange:e.update,disabled:e.disabled},r))},v=function(e){var t=c("react-select");return a.a.createElement("div",{className:"form-row mb-3"},a.a.createElement("label",{htmlFor:t,className:"col-form-label text-uppercase"},e.label),a.a.createElement("select",{onChange:e.update,value:e.value,id:t,className:"form-control",disabled:e.disabled},e.options))},h=function(e){return""==e.children?a.a.createElement("div",null):a.a.createElement(a.a.Fragment,null,a.a.createElement("hr",{style:{margin:"3px 0px 0px 0px"}}),a.a.createElement("div",{style:{textTransform:"uppercase",paddingLeft:"4px",marginBottom:"2px"}},e.children))},b=function(t){var e=c("multiselect"),r=t.options&&0!=t.options.length?{isMulti:!0,options:t.options,getDropdownButtonLabel:function(e){return e.value?Array.isArray(e.value)?0==e.value.length?gettext("None selected"):1==e.value.length?e.value[0].label:"".concat(e.value.length,"  ").concat(gettext("selected")):e.value.label:gettext("None selected")}}:{getDropdownButtonLabel:function(){return gettext("None available")},isDisabled:!0,menuIsOpen:!1,options:[]},n={dropdownButton:function(e){return t.options&&0!=t.options.length?e:p({},e,{backgroundColor:"#E5E6E8",background:""})},option:function(e,t){return p({},e,{padding:"1px 12px",display:"inline-block"})},container:function(e,t){return p({},e,{backgroundColor:"#f5f5f5"})}};return a.a.createElement("div",{className:"form-row mb-2 tola-react-multiselect-row"},a.a.createElement("label",{htmlFor:e,className:"col-form-label text-uppercase"},t.label),a.a.createElement(l.a,u({id:e,styles:n,formatOptionLabel:function(e){return a.a.createElement("div",{style:{display:"inline-block",float:"right",width:"90%"}},e.label)},components:{GroupHeading:h},value:t.value,onChange:t.update},r)))}},QTZG:function(e,t,r){"use strict";r.r(t);var n,o,a,i=r("q1tI"),p=r.n(i),l=r("i8i4"),s=r.n(l),c=r("okNM"),d=(r("qtBC"),r("TSYQ"),r("2vnA")),u=r("7O5W"),m=r("IP2g"),f=r("wHSu"),v=r("Ez0T"),h=r("0zu5"),b=r("4L+s");function y(e){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function g(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function S(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function E(e,t,r){return t&&S(e.prototype,t),r&&S(e,r),e}function _(e,t){return!t||"object"!==y(t)&&"function"!=typeof t?w(e):t}function w(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function C(e){return(C=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function N(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&O(e,t)}function O(e,t){return(O=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}u.b.add(f.b,f.c,f.a);var T,k,x=function(e){function t(){return g(this,t),_(this,C(t).apply(this,arguments))}return N(t,p.a.Component),E(t,[{key:"render",value:function(){return p.a.createElement("h3",{className:"level-title "+this.props.classes},this.props.tierName,this.props.ontologyLabel?" "+this.props.ontologyLabel:null)}}]),t}(),P=Object(c.b)("rootStore")(n=Object(c.c)(n=function(e){function a(){var e,r;g(this,a);for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];return(r=_(this,(e=C(a)).call.apply(e,[this].concat(n)))).deleteLevel=function(){var e=r.props.levelProps.tierName+" "+r.props.levelProps.ontologyLabel;create_no_rationale_changeset_notice({message_text:"Are you sure you want to delete ".concat(e,"?"),on_submit:function(){return r.props.rootStore.levelStore.deleteLevelFromDB(r.props.level.id)}})},r.editLevel=function(){r.props.rootStore.uiStore.editCard(r.props.level.id)},r.buildIPTTUrl=function(e){var t="/indicators/iptt_report/".concat(r.props.rootStore.levelStore.program_id,"/timeperiods/?frequency=3&start=0&end=999");return e.forEach(function(e){return t+="&indicators="+e}),t},r}return N(a,p.a.Component),E(a,[{key:"componentDidMount",value:function(){$('*[data-toggle="popover"]').popover({html:!0})}},{key:"render",value:function(){var n=this;if(this.props.rootStore.uiStore.hasVisibleChildren.indexOf(this.props.level.parent)<0&&null!=this.props.level.parent)return null;var e=[],t=this.props.levelProps.indicators.map(function(e){return e.id});if(0<t.length){var r="All indicators linked to ".concat(this.props.levelProps.tierName," ").concat(this.props.levelProps.ontologyLabel);e.push("<a href=".concat(this.buildIPTTUrl(t),">").concat(r,"</a>"))}if(this.props.levelProps.tierName!=this.props.rootStore.levelStore.chosenTierSet.slice(-1)[0]){var o=this.props.levelProps.descendantIndicatorIds;if(0<(o=o.concat(t)).length){var a="All indicators linked to ".concat(this.props.levelProps.tierName," ").concat(this.props.levelProps.ontologyLabel," and sub-levels");e.unshift("<a href=".concat(this.buildIPTTUrl(o),">").concat(a,"</a>"))}}var i=this.props.levelProps.indicators.map(function(e,t){var r=n.props.levelProps.ontologyLabel+String.fromCharCode(97+t)+": ";return'<li class="nav-item"><a href='.concat(n.buildIPTTUrl([e.id]),">").concat(r).concat(e.name,"</a></li>")});e=e.concat(i);var l='<ul class="nav flex-column">'.concat(e.join("<br>"),"</ul>"),s=this.props.levelProps.indicators.length,c=interpolate(ngettext("%s indicator","%s indicators",s),[s]),u=null;return this.props.levelProps.tierName!=Object(d.q)(this.props.rootStore.levelStore.chosenTierSet.slice(-1)[0])&&0<this.props.rootStore.levelStore.levels.filter(function(e){return e.parent==n.props.level.id}).length&&(u=p.a.createElement(m.a,{className:"text-action",icon:0<=this.props.rootStore.uiStore.hasVisibleChildren.indexOf(this.props.level.id)?"caret-down":"caret-right"})),p.a.createElement("div",{className:"level-card level-card--collapsed",id:"level-card-".concat(this.props.level.id)},p.a.createElement("div",{className:u?"level-card__toggle":"",onClick:function(e){return n.props.rootStore.uiStore.updateVisibleChildren(n.props.level.id)}},u,p.a.createElement("span",{className:"level-card--collapsed__name"},p.a.createElement(x,{tierName:this.props.levelProps.tierName,ontologyLabel:this.props.levelProps.ontologyLabel,classes:"level-title--collapsed"})," ",this.props.level.name)),p.a.createElement("div",{className:"level-card--collapsed__actions"},p.a.createElement("div",{className:"actions__top btn-row"},this.props.levelProps.canDelete&&p.a.createElement("button",{className:"btn btn-sm btn-link btn-danger",onClick:this.deleteLevel},p.a.createElement("i",{className:"fas fa-trash-alt"}),gettext("Delete")),this.props.levelProps.canEdit&&p.a.createElement("button",{className:"btn btn-sm btn-link btn-text edit-button",onClick:this.editLevel},p.a.createElement("i",{className:"fas fa-edit"}),gettext("Edit"))),p.a.createElement("div",{className:"actions__bottom"},p.a.createElement("button",{className:"btn btn-sm btn-link no-bold","data-toggle":"popover","data-trigger":"focus","data-placement":"bottom","data-html":"true",title:"Track indicator performance","data-content":l,disabled:0==e.length},c))))}}]),a}())||n)||n,j=Object(c.b)("rootStore")(o=Object(c.c)(o=function(e){function t(e){var a;return g(this,t),(a=_(this,C(t).call(this,e))).onDragEnd=function(e){var t=e.oldIndex,r=e.newIndex;a.indicatorWasReordered=!0;var n=a.indicators[t].id,o={value:r+1,name:r+1};a.updateIndicatorOrder(o,n)},a.updateIndicatorOrder=function(e,t){a.indicatorWasReordered=!0;var r=a.indicators.find(function(e){return e.id==t}).level_order,n=e.value-1,o=a.indicators.slice();o.splice(n,0,o.splice(r,1)[0]),o.forEach(function(e,t){return e.level_order=t}),a.indicators.replace(o),a.props.rootStore.uiStore.activeCardNeedsConfirm=a.dataHasChanged},a.updateSubmitType=function(e){a.submitType=e},a.saveLevel=function(e){e.preventDefault(),a.props.rootStore.levelStore.saveLevelToDB(a.submitType,a.props.level.id,a.indicatorWasReordered,{name:a.name,assumptions:a.assumptions,indicators:Object(d.q)(a.indicators)})},a.cancelEdit=function(){a.dataHasChanged?create_no_rationale_changeset_notice({message_text:gettext("Are you sure you want to continue?"),preamble:gettext("Changes to this ".concat(a.props.levelProps.tierName," will not be saved")),on_submit:function(){return a.props.rootStore.levelStore.cancelEdit(a.props.level.id)}}):a.props.rootStore.levelStore.cancelEdit(a.props.level.id)},a.onFormChange=function(e){if(e.preventDefault(),a[e.target.name]=e.target.value,a.name)$("#level-name").removeClass("is-invalid"),$("#name-feedback-".concat(a.props.level.id)).remove();else{var t=$("#level-name-".concat(a.props.level.id));t.addClass("is-invalid");var r="Please provide a name for this ".concat(a.props.levelProps.tierName);t.after("<p id=name-feedback-".concat(a.props.level.id,' class="invalid-feedback">').concat(r,"</p>"))}a.props.rootStore.uiStore.activeCardNeedsConfirm=a.dataHasChanged},a.submitType="saveOnly",a.indicatorWasReordered=!1,a.origData=JSON.stringify([e.level.name,e.level.assumptions,e.levelProps.indicators]),Object(d.h)(w(w(a)),{name:e.level.name,assumptions:e.level.assumptions,indicators:e.levelProps.indicators.sort(function(e,t){return e.level_order-t.level_order}),get dataHasChanged(){return JSON.stringify([this.name,this.assumptions,this.indicators])!=this.origData}}),a}return N(t,p.a.Component),E(t,[{key:"componentDidMount",value:function(){$('*[data-toggle="popover"]').popover({html:!0})}},{key:"render",value:function(){Object(d.q)(this.indicators);return p.a.createElement("div",{className:"level-card level-card--expanded",id:"level-card-".concat(this.props.level.id)},p.a.createElement("div",null,p.a.createElement(x,{tierName:this.props.levelProps.tierName,ontologyLabel:this.props.levelProps.ontologyLabel,classes:"level-title--expanded"})),p.a.createElement("form",{className:"level-card--expanded__form",id:"level-card-form-".concat(this.props.level.id),onSubmit:this.saveLevel},p.a.createElement("div",{className:"form-group"},p.a.createElement("textarea",{className:"form-control",id:"level-name-".concat(this.props.level.id),name:"name",value:this.name||"",autoComplete:"off",onChange:this.onFormChange})),p.a.createElement("div",{className:"form-group"},p.a.createElement("label",{htmlFor:"assumptions"},"Assumptions"),p.a.createElement("textarea",{className:"form-control",id:"level-assumptions",disabled:this.name?"":"disabled",name:"assumptions",autoComplete:"off",value:this.assumptions||"",onChange:this.onFormChange})),p.a.createElement(D,{level:this.props.level,tierName:this.props.levelProps.tierName,indicators:this.indicators,disabled:!this.name,changeFunc:this.updateIndicatorOrder,dragEndFunc:this.onDragEnd}),p.a.createElement(L,{level:this.props.level,levelProps:this.props.levelProps,submitFunc:this.updateSubmitType,cancelFunc:this.cancelEdit,nameVal:this.name,tierCount:this.props.rootStore.levelStore.chosenTierSet.length})))}}]),t}())||o)||o,L=Object(c.b)("rootStore")(a=function(e){function t(){return g(this,t),_(this,C(t).apply(this,arguments))}return N(t,p.a.Component),E(t,[{key:"render",value:function(){var e=this.props.nameVal?"":"disabled",t=null;if(null!=this.props.level.parent&&"root"!=this.props.level.parent){var r=interpolate(gettext("Save and add another %s"),[this.props.levelProps.tierName]);t=p.a.createElement(F,{disabledText:e,classes:"btn-primary",icon:"plus-circle",text:r,submitType:"saveAndAddSibling",submitFunc:this.props.submitFunc})}var n=null,o=this.props.rootStore.levelStore.chosenTierSet.length;if(this.props.level.level_depth<o){var a=interpolate(gettext("Save and link %s"),[this.props.levelProps.childTierName]);n=p.a.createElement(F,{disabledText:e,classes:"btn btn-primary",icon:"stream",text:a,submitType:"saveAndAddChild",submitFunc:this.props.submitFunc})}return p.a.createElement("div",{className:"button-bar btn-row"},p.a.createElement(F,{disabledText:e,classes:"btn-primary",text:gettext("Save and close"),icon:"save",submitType:"saveOnly",submitFunc:this.props.submitFunc}),t,n,p.a.createElement(F,{classes:"btn btn-reset",text:gettext("Cancel"),submitType:"cancel",submitFunc:this.props.cancelFunc}))}}]),t}())||a,F=function(e){function t(){return g(this,t),_(this,C(t).apply(this,arguments))}return N(t,p.a.Component),E(t,[{key:"render",value:function(){var e=this,t="cancel"==this.props.submitType?"button":"submit";return p.a.createElement("button",{disabled:this.props.disabledText,type:t,className:this.props.classes+" level-button btn btn-sm",onClick:function(){return e.props.submitFunc(e.props.submitType)}},this.props.text)}}]),t}(),D=function(e){function t(){return g(this,t),_(this,C(t).apply(this,arguments))}return N(t,p.a.Component),E(t,[{key:"componentDidMount",value:function(){$('*[data-toggle="popover"]').popover({html:!0})}},{key:"render",value:function(){var r=this,e=this.props.indicators.map(function(e,t){return{value:t+1,label:t+1}}),t=this.props.indicators.map(function(t){return p.a.createElement(p.a.Fragment,null,p.a.createElement(v.c,{update:function(e){return r.props.changeFunc(e,t.id)},selectId:"ind"+t.id,labelClasses:" ",formRowClasses:"sortable-list__item__label",selectClasses:"sortable-list__item__select",value:{value:t.level_order,label:t.level_order+1},label:t.name,options:e,disabled:r.props.disabled}),p.a.createElement("div",{className:"sortable-list__item__actions"},p.a.createElement("a",{href:"#",className:"indicator-link"},p.a.createElement("i",{className:"fas fa-cog"})," ",gettext("Settings"))))}),n=null,o=null,a=gettext("To remove an indicator: Click “Settings”, where you can reassign the indicator to a different level or delete it.");return 0<this.props.indicators.length&&(n="Order",o=p.a.createElement(b.b,{content:a,placement:"bottom"})),p.a.createElement("div",{className:"level-card--indicator-links ".concat(this.props.disabled?"disabled":null)},p.a.createElement("div",{className:"indicator-links__header"},p.a.createElement("h4",null,gettext("Indicators linked to this ".concat(this.props.tierName))),p.a.createElement("div",null,o)),p.a.createElement("div",{className:"sortable-list-group"},0<this.props.indicators.length?p.a.createElement("div",{className:"sortable-list-header"},p.a.createElement("div",{className:"sortable-list-header__drag-handle"},p.a.createElement(m.a,{icon:f.a})),p.a.createElement("div",{className:"sortable-list-header__label"},n),p.a.createElement("div",{className:"sortable-list-header__actions"},p.a.createElement("i",{className:"fas fa-cog"})," ",gettext("Settings"))):p.a.createElement("div",{className:"sortable-list-header--empty"},gettext("No indicators")),p.a.createElement(A,{onSortEnd:this.props.dragEndFunc,useDragHandle:!0,lockAxis:"y",lockToContainerEdges:!0},t.map(function(e,t){return p.a.createElement(I,{key:"item-".concat(t),index:t,value:e,disabled:r.props.disabled})})),p.a.createElement("div",{className:"sortable-list-actions"},p.a.createElement("a",{href:"#",role:"button",className:"btn btn-link btn-add"},p.a.createElement("i",{className:"fas fa-plus-circle"}),gettext("Add Indicator")))))}}]),t}(),I=Object(h.sortableElement)(function(e){var t=e.value;return p.a.createElement("li",{className:"sortable-list__item"},p.a.createElement(z,null),t)}),A=Object(h.sortableContainer)(function(e){var t=e.children;return p.a.createElement("ul",{className:"sortable-list"},t)}),z=Object(h.sortableHandle)(function(){return p.a.createElement("div",{className:"sortable-list__item__drag-handle"},p.a.createElement(m.a,{icon:f.a}))});function q(e){return(q="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function V(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function K(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function R(e,t,r){return t&&K(e.prototype,t),r&&K(e,r),e}function B(e,t){return!t||"object"!==q(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function H(e){return(H=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function J(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&M(e,t)}function M(e,t){return(M=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}u.b.add(f.b,f.c);var U,W,G=Object(c.b)("rootStore")(T=Object(c.c)(T=function(e){function a(){return V(this,a),B(this,H(a).apply(this,arguments))}return J(a,p.a.Component),R(a,[{key:"render",value:function(){var o=this;return("initial"==this.props.renderList?this.props.rootStore.levelStore.sortedLevels.filter(function(e){return-1!=["root",null].indexOf(e.parent)}):this.props.renderList.sort(function(e,t){return e.customsort-t.customsort})).map(function(t){var e="";e=o.props.rootStore.uiStore.activeCard==t.id?p.a.createElement(j,{level:t,levelProps:o.props.rootStore.levelStore.levelProperties[t.id]}):p.a.createElement(P,{level:t,levelProps:o.props.rootStore.levelStore.levelProperties[t.id]});var r=o.props.rootStore.levelStore.sortedLevels.filter(function(e){return e.parent==t.id}),n=null;return 0<r.length&&(n=p.a.createElement(a,{rootStore:o.props.rootStore,renderList:r})),p.a.createElement("div",{key:t.id,className:"leveltier--new"},e,n)})}}]),a}())||T)||T,Q=Object(c.b)("rootStore")(k=Object(c.c)(k=function(e){function t(){return V(this,t),B(this,H(t).apply(this,arguments))}return J(t,p.a.Component),R(t,[{key:"render",value:function(){return 0==this.props.rootStore.levelStore.levels.length?p.a.createElement("div",{className:"level-list-panel"},p.a.createElement("div",{className:"level-list-panel__dingbat"},p.a.createElement("i",{className:"fas fa-sitemap"})),p.a.createElement("div",{className:"level-list-panel__text text-large"},p.a.createElement("strong",{className:"text-danger"},"Choose your results framework template carefully!")," Once you begin building your framework, it will not be possible to change templates without first deleting all saved levels.")):p.a.createElement("div",{id:"level-list",style:{flexGrow:"2"}},p.a.createElement(G,{renderList:"initial"}))}}]),t}())||k)||k,X=r("y2Vs");function Z(e){return(Z="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Y(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function ee(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function te(e,t,r){return t&&ee(e.prototype,t),r&&ee(e,r),e}function re(e,t){return!t||"object"!==Z(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function ne(e){return(ne=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function oe(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ae(e,t)}function ae(e,t){return(ae=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var ie,le,se,ce,ue,pe,de,me,fe,ve,he,be,ye,ge,Se,Ee,_e=Object(c.b)("rootStore")(U=Object(c.c)(U=function(e){function a(){var e,t;Y(this,a);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(t=re(this,(e=ne(a)).call.apply(e,[this].concat(n)))).handleChange=function(e){t.props.rootStore.levelStore.changeTierSet(e.value)},t}return oe(a,p.a.Component),te(a,[{key:"componentDidUpdate",value:function(){$('*[data-toggle="popover"]').popover({html:!0})}},{key:"render",value:function(){var e=null;"locked"==this.props.rootStore.uiStore.tierLockStatus?e=p.a.createElement("a",{href:"#",tabIndex:"0","data-toggle":"popover","data-trigger":"focus","data-html":"true","data-content":gettext('<span class="text-danger"><strong>The results framework template cannot be changed after levels are saved.</strong></span> To change templates, all saved levels first must be deleted.  A level can be deleted when it has no sub-levels and no linked indicators.')},p.a.createElement("i",{className:"far fa-question-circle"})):"primed"==this.props.rootStore.uiStore.tierLockStatus&&(e=p.a.createElement("a",{href:"#",tabIndex:"0","data-toggle":"popover","data-trigger":"focus","data-html":"true","data-content":gettext('<span class="text-danger"><strong>Choose your results framework template carefully!</strong></span> Once you begin building your framework, it will not be possible to change templates without first deleting all saved levels.')},p.a.createElement("i",{className:"far fa-question-circle"})));var t=this.props.rootStore.levelStore.tierTemplates,r=Object.keys(t).map(function(e){return{value:e,label:t[e].name}}),n={value:this.props.rootStore.levelStore.chosenTierSetKey,label:this.props.rootStore.levelStore.chosenTierSetName},o="leveltier-picker__selectbox ";return o+="locked"==this.props.rootStore.uiStore.tierLockStatus?"leveltier-picker__selectbox--disabled":"",p.a.createElement("div",{className:o},p.a.createElement("div",{className:"form-group"},p.a.createElement("label",null,gettext("Results framework template"))," ",p.a.createElement("small",null,e),p.a.createElement(X.default,{options:r,value:n,isDisabled:"locked"==this.props.rootStore.uiStore.tierLockStatus,onChange:this.handleChange})))}}]),a}())||U)||U,we=function(e){function t(){return Y(this,t),re(this,ne(t).apply(this,arguments))}return oe(t,p.a.Component),te(t,[{key:"render",value:function(){return p.a.createElement("div",{className:"leveltier leveltier--level-"+this.props.tierLevel},this.props.tierName," ")}}]),t}(),Ce=Object(c.b)("rootStore")(W=Object(c.c)(W=function(e){function t(){return Y(this,t),re(this,ne(t).apply(this,arguments))}return oe(t,p.a.Component),te(t,[{key:"render",value:function(){var e=null;return 0==this.props.rootStore.levelStore.levels.length&&(e=p.a.createElement("button",{className:"leveltier-button btn btn-primary btn-block",onClick:this.props.rootStore.levelStore.createFirstLevel},gettext("Apply"))),p.a.createElement(p.a.Fragment,null,p.a.createElement("div",{id:"leveltier-list",className:"leveltier-list"},0<this.props.rootStore.levelStore.chosenTierSet.length?this.props.rootStore.levelStore.chosenTierSet.map(function(e,t){return p.a.createElement(we,{key:t,tierLevel:t,tierName:e})}):null),e?p.a.createElement("div",{className:"leveltier-list__actions"},e):null)}}]),t}())||W)||W,Ne=Object(c.b)("rootStore")(Object(c.c)(function(e){return p.a.createElement("div",{id:"leveltier-picker",className:"leveltier-picker"},p.a.createElement(_e,null),p.a.createElement(Ce,null))})),Oe=r("XoI5");function Te(e,t,r,n){r&&Object.defineProperty(e,t,{enumerable:r.enumerable,configurable:r.configurable,writable:r.writable,value:r.initializer?r.initializer.call(n):void 0})}function ke(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function xe(e,t,r){return t&&ke(e.prototype,t),r&&ke(e,r),e}function Pe(r,n,e,t,o){var a={};return Object.keys(t).forEach(function(e){a[e]=t[e]}),a.enumerable=!!a.enumerable,a.configurable=!!a.configurable,("value"in a||a.initializer)&&(a.writable=!0),a=e.slice().reverse().reduce(function(e,t){return t(r,n,e)||e},a),o&&void 0!==a.initializer&&(a.value=a.initializer?a.initializer.call(o):void 0,a.initializer=void 0),void 0===a.initializer&&(Object.defineProperty(r,n,a),a=null),a}function je(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var Le=(le=Pe((ie=function(){function s(e,t,r,n,o,a,i){var l=this;je(this,s),Te(this,"levels",le,this),Te(this,"indicators",se,this),Te(this,"chosenTierSetKey",ce,this),Te(this,"chosenTierSet",ue,this),this.tierTemplates=void 0,this.defaultTemplateKey="",this.customTierSetKey="",this.program_id="",this.accessLevel=!1,Te(this,"cancelEdit",pe,this),Te(this,"createNewLevelFromSibling",de,this),Te(this,"createNewLevelFromParent",me,this),Te(this,"createFirstLevel",fe,this),this.saveLevelTiersToDB=function(){var e={program_id:l.program_id,tiers:l.chosenTierSet};Oe.a.post("/save_leveltiers/",e).then(function(e){}).catch(function(e){})},this.deleteLevelFromDB=function(e){var t="".concat(l.levelProperties[e].tierName," ").concat(l.levelProperties[e].ontologyLabel);Oe.a.delete("/level/".concat(e)).then(function(e){l.levels.replace(e.data),l.rootStore.uiStore.activeCard=null,0==l.levels.length&&l.createFirstLevel(),success_notice({message_text:gettext("".concat(t," was successfully deleted.")),addClass:"program-page__rationale-form",stack:{dir1:"up",dir2:"right",firstpos1:20,firstpos2:20}})}).catch(function(e){})},this.saveLevelToDB=function(r,t,e,n){e&&l.saveReorderedIndicatorsToDB(n.indicators),delete n.indicators;var o=l.levels.find(function(e){return e.id==t}),a=Object.assign(Object(d.q)(o),n);"new"==t?("root"==a.parent&&l.saveLevelTiersToDB(),delete a.id,Oe.a.post("/insert_new_level/",a).then(function(e){Object(d.o)(function(){l.levels.replace(e.data.all_data)});var t=e.data.new_level.id;l.rootStore.uiStore.activeCard=null,"saveAndAddSibling"==r?l.createNewLevelFromSibling(t):"saveAndAddChild"==r&&l.createNewLevelFromParent(t)}).catch(function(e){})):Oe.a.put("/level/".concat(t,"/"),a).then(function(e){Object(d.o)(function(){Object.assign(o,e.data)}),l.rootStore.uiStore.activeCard=null,"saveAndAddSibling"==r?l.createNewLevelFromSibling(t):"saveAndAddChild"==r&&l.createNewLevelFromParent(t)}).catch(function(e){})},this.saveReorderedIndicatorsToDB=function(e){Oe.a.post("/reorder_indicators/",e).then(function(e){}).catch(function(e){})},this.deriveTemplateKey=function(){var e=JSON.stringify(Object(d.q)(l.chosenTierSet));for(var t in l.tierTemplates){if(l.tierTemplates.hasOwnProperty(t)&&l.chosenTierSet.length==l.tierTemplates[t].tiers.length)if(e==JSON.stringify(l.tierTemplates[t].tiers))return t}return"custom"},this.buildOntology=function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[],r=Object(d.q)(l.levels.find(function(e){return e.id==t}));return r.parent&&"root"!=r.parent?(e.unshift(r.customsort),l.buildOntology(r.parent,e)):e.join(".")},this.getChildLevels=function(t){return l.levels.filter(function(e){return e.parent==t})},this.getLevelIndicators=function(t){return l.indicators.filter(function(e){return e.level==t})},this.getDescendantIndicatorIds=function(t){var e=l.levels.filter(function(e){return t.includes(e.id)}),r=[];return e.forEach(function(t){r=r.concat(l.indicators.filter(function(e){return e.level==t.id}).map(function(e){return e.id}));var e=l.levels.filter(function(e){return e.parent==t.id}).map(function(e){return e.id});r=r.concat(l.getDescendantIndicatorIds(e,r))}),r},this.rootStore=i,this.levels=t,this.indicators=r,this.tierTemplates=o,this.defaultTemplateKey="mc_standard",this.customTierSetKey="custom",this.program_id=e,this.accessLevel=a,0<n.length?(this.chosenTierSet=n.map(function(e){return e.name}),this.chosenTierSetKey=this.deriveTemplateKey(n)):(this.chosenTierSetKey=this.defaultTemplateKey,this.chosenTierSet=this.tierTemplates[this.chosenTierSetKey].tiers)}return xe(s,[{key:"changeTierSet",value:function(e){this.chosenTierSetKey=e,this.chosenTierSet=this.tierTemplates[e].tiers}},{key:"sortedLevels",get:function(){return this.levels.slice().sort(function(e,t){e.level_depth-t.level_depth||(e.customsort,t.customsort)})}},{key:"levelProperties",get:function(){var o=this,a={},e=!0,t=!1,r=void 0;try{for(var i,n=function(){var t=i.value,e={},r=o.getChildLevels(t.id).map(function(e){return e.id}),n=o.indicators.filter(function(e){return e.level==t.id});e.indicators=o.getLevelIndicators(t.id),e.descendantIndicatorIds=o.getDescendantIndicatorIds(r),e.ontologyLabel=o.buildOntology(t.id),e.tierName=o.chosenTierSet[t.level_depth-1],e.childTierName=null,o.chosenTierSet.length>t.level_depth&&(e.childTierName=o.chosenTierSet[t.level_depth]),e.canDelete=0==r.length&&0==n&&"high"==o.accessLevel,e.canEdit="high"==o.accessLevel,a[t.id]=e},l=this.levels[Symbol.iterator]();!(e=(i=l.next()).done);e=!0)n()}catch(e){t=!0,r=e}finally{try{e||null==l.return||l.return()}finally{if(t)throw r}}return a}},{key:"chosenTierSetName",get:function(){return this.chosenTierSetKey==this.customTierSetKey?"Custom":this.tierTemplates[this.chosenTierSetKey].name}}]),s}()).prototype,"levels",[d.m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),se=Pe(ie.prototype,"indicators",[d.m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),ce=Pe(ie.prototype,"chosenTierSetKey",[d.m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return""}}),ue=Pe(ie.prototype,"chosenTierSet",[d.m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),Pe(ie.prototype,"sortedLevels",[d.e],Object.getOwnPropertyDescriptor(ie.prototype,"sortedLevels"),ie.prototype),Pe(ie.prototype,"levelProperties",[d.e],Object.getOwnPropertyDescriptor(ie.prototype,"levelProperties"),ie.prototype),Pe(ie.prototype,"chosenTierSetName",[d.e],Object.getOwnPropertyDescriptor(ie.prototype,"chosenTierSetName"),ie.prototype),Pe(ie.prototype,"changeTierSet",[d.d],Object.getOwnPropertyDescriptor(ie.prototype,"changeTierSet"),ie.prototype),pe=Pe(ie.prototype,"cancelEdit",[d.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var e=this;return function(t){if("new"==t){var r=e.levels.find(function(e){return e.id==t});e.levels.filter(function(e){return e.customsort>r.customsort&&e.parent==r.parent}).forEach(function(e){return e.customsort-=1}),e.levels.replace(e.levels.filter(function(e){return"new"!=e.id}))}e.rootStore.uiStore.removeActiveCard()}}}),de=Pe(ie.prototype,"createNewLevelFromSibling",[d.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var n=this;return function(t){var r=Object(d.q)(n.levels.find(function(e){return e.id==t})),e=Object.assign({},r);e.customsort+=1,e.id="new",e.name="",e.assumptions="",n.levels.filter(function(e){return r&&e.customsort>r.customsort&&e.parent==r.parent}).forEach(function(e){return e.customsort+=1}),n.rootStore.uiStore.activeCard="new",n.levels.push(e)}}}),me=Pe(ie.prototype,"createNewLevelFromParent",[d.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var n=this;return function(t){var e=Object(d.q)(n.levels.find(function(e){return e.id==t})),r={id:"new",customsort:1,name:"",assumptions:"",parent:t,level_depth:e.level_depth+1,program:n.program_id};n.levels.filter(function(e){return e.parent==t}).forEach(function(e){return e.customsort+=1}),n.rootStore.uiStore.activeCard="new",n.levels.push(r),n.rootStore.uiStore.hasVisibleChildren.push(r.parent)}}}),fe=Pe(ie.prototype,"createFirstLevel",[d.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var t=this;return function(){var e={id:"new",program:t.program_id,name:"",assumptions:"",customsort:1,level_depth:1,parent:"root"};t.levels.push(e),t.rootStore.uiStore.activeCard="new"}}}),ie),Fe=(he=Pe((ve=function(){function t(e){je(this,t),Te(this,"activeCard",he,this),Te(this,"hasVisibleChildren",be,this),this.activeCardNeedsConfirm="",Te(this,"editCard",ye,this),Te(this,"onLeaveConfirm",ge,this),this.onLeaveCancel=function(){$(".edit-button").prop("disabled",!1)},Te(this,"removeActiveCard",Se,this),Te(this,"updateVisibleChildren",Ee,this),this.rootStore=e,this.hasVisibleChildren=this.rootStore.levelStore.levels.map(function(e){return e.id}),this.activeCardNeedsConfirm=!1}return xe(t,[{key:"tierLockStatus",get:function(){return 0<this.rootStore.levelStore.levels.filter(function(e){return"new"!=e.id}).length?"locked":1==this.rootStore.levelStore.levels.length?"primed":null}}]),t}()).prototype,"activeCard",[d.m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),be=Pe(ve.prototype,"hasVisibleChildren",[d.m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),Pe(ve.prototype,"tierLockStatus",[d.e],Object.getOwnPropertyDescriptor(ve.prototype,"tierLockStatus"),ve.prototype),ye=Pe(ve.prototype,"editCard",[d.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var r=this;return function(e){if(r.activeCardNeedsConfirm){var t=r.rootStore.levelStore.levelProperties[r.activeCard].tierName;$(".edit-button").prop("disabled",!0),create_no_rationale_changeset_notice({message_text:gettext("Are you sure you want to continue?"),preamble:gettext("Changes to this ".concat(t," will not be saved")),on_submit:function(){return r.onLeaveConfirm(e)},on_cancel:r.onLeaveCancel})}else r.activeCard=e}}}),ge=Pe(ve.prototype,"onLeaveConfirm",[d.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var t=this;return function(e){$(".edit-button").prop("disabled",!1),t.activeCard=e,t.activeCardNeedsConfirm=!1}}}),Se=Pe(ve.prototype,"removeActiveCard",[d.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var e=this;return function(){e.activeCard=null}}}),Ee=Pe(ve.prototype,"updateVisibleChildren",[d.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var r=this;return function(t){var e=1<arguments.length&&void 0!==arguments[1]&&arguments[1];2<arguments.length&&void 0!==arguments[2]&&arguments[2];0<=r.hasVisibleChildren.indexOf(t)||e?(r.hasVisibleChildren=r.hasVisibleChildren.filter(function(e){return e!=t}),r.rootStore.levelStore.levels.filter(function(e){return e.parent==t}).forEach(function(e){return r.updateVisibleChildren(e.id,!0)})):r.hasVisibleChildren.push(t)}}}),ve),De=jsContext,Ie=new function e(t,r,n,o,a,i){je(this,e),this.levelStore=new Le(t,r,n,o,a,i,this),this.uiStore=new Fe(this)}(De.program_id,De.levels,De.indicators,De.levelTiers,De.tierTemplates,De.accessLevel);s.a.render(p.a.createElement(c.a,{rootStore:Ie},p.a.createElement(p.a.Fragment,null,p.a.createElement(Ne,null),p.a.createElement(Q,null))),document.querySelector("#level-builder-react-component"))},XoI5:function(e,t,r){"use strict";r.d(t,"a",function(){return o});var n=r("vDqi"),o=r.n(n).a.create({withCredentials:!0,baseURL:"/api/",headers:{"X-CSRFToken":document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/,"$1")}})},qtBC:function(e,t,r){"use strict";var n=r("7+Rn"),o=r.n(n)()();t.a=o}},[["QTZG",0,1]]]);