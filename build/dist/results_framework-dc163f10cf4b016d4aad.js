(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{QTZG:function(e,t,r){"use strict";r.r(t);var n,o,i,l=r("q1tI"),a=r.n(l),s=r("i8i4"),c=r.n(s),u=r("okNM"),p=(r("qtBC"),r("TSYQ"),r("2vnA")),d=r("7O5W"),f=r("IP2g"),v=r("wHSu");function h(e){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function b(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function y(e,t,r){return t&&b(e.prototype,t),r&&b(e,r),e}function S(e,t){return!t||"object"!==h(t)&&"function"!=typeof t?g(e):t}function g(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function w(e){return(w=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function E(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&O(e,t)}function O(e,t){return(O=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}d.b.add(v.a,v.b);var C,_,x=function(e){function t(){return m(this,t),S(this,w(t).apply(this,arguments))}return E(t,a.a.Component),y(t,[{key:"render",value:function(){return a.a.createElement("h3",{className:"level-title "+this.props.classes},this.props.tierName,this.props.ontologyLabel?" "+this.props.ontologyLabel:null)}}]),t}(),T=Object(u.b)("rootStore")(n=Object(u.c)(n=function(e){function i(){var e,t;m(this,i);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(t=S(this,(e=w(i)).call.apply(e,[this].concat(n)))).deleteLevel=function(){var e=t.props.levelProps.tierName+" "+t.props.levelProps.ontologyLabel;create_no_rationale_changeset_notice({message_text:"Are you sure you want to delete ".concat(e,"?"),on_submit:function(){return t.props.rootStore.levelStore.deleteLevelFromDB(t.props.level.id)}})},t.editLevel=function(){t.props.rootStore.uiStore.addExpandedCard(t.props.level.id)},t}return E(i,a.a.Component),y(i,[{key:"render",value:function(){var t=this;if(this.props.rootStore.uiStore.hasVisibleChildren.indexOf(this.props.level.parent)<0&&null!=this.props.level.parent)return null;var e=this.props.levelProps.indicators.length,r=interpolate(ngettext("%s indicator","%s indicators",e),[e]),n=null;return this.props.levelProps.tierName!=Object(p.q)(this.props.rootStore.levelStore.chosenTierSet.slice(-1)[0])&&0<this.props.rootStore.levelStore.levels.filter(function(e){return e.parent==t.props.level.id}).length&&(n=a.a.createElement(f.a,{icon:0<=this.props.rootStore.uiStore.hasVisibleChildren.indexOf(this.props.level.id)?"caret-down":"caret-right"})),a.a.createElement("div",{className:"level-card level-card--collapsed",id:this.props.level.id},a.a.createElement("div",{onClick:function(e){return t.props.rootStore.uiStore.updateVisibleChildren(t.props.level.id)}},n,a.a.createElement("div",{className:"level-card--collapsed__name"},a.a.createElement("strong",null,a.a.createElement(x,{tierName:this.props.levelProps.tierName,ontologyLabel:this.props.levelProps.ontologyLabel,classes:"level-title--collapsed"})),a.a.createElement("span",null," ",this.props.level.name))),a.a.createElement("div",{className:"level-card--collapsed__actions"},a.a.createElement("div",{className:"actions__top",style:{display:"flex",justifyContent:"flex-end"}},this.props.levelProps.canDelete&&a.a.createElement("button",{className:"btn btn-sm btn-link btn-danger",onClick:this.deleteLevel},a.a.createElement("i",{className:"fas fa-trash-alt"})," ",gettext("Delete")),a.a.createElement("button",{className:"btn btn-sm btn-link btn-text",onClick:this.editLevel},a.a.createElement("i",{className:"fas fa-edit"})," ",gettext("Edit"))),a.a.createElement("div",{className:"actions__bottom",style:{display:"flex",justifyContent:"flex-end"}},a.a.createElement("button",{className:"btn btn-sm btn-link no-bold"},r))))}}]),i}())||n)||n,N=Object(u.b)("rootStore")(o=Object(u.c)(o=function(e){function r(e){var t;return m(this,r),(t=S(this,w(r).call(this,e))).updateSubmitType=function(e){t.submitType=e},t.saveLevel=function(e){e.preventDefault();new FormData(e.target);t.props.rootStore.levelStore.saveLevelToDB(t.submitType,t.props.level.id,{name:t.name,assumptions:t.assumptions})},t.cancelEdit=function(){t.props.rootStore.levelStore.cancelEdit(t.props.level.id)},t.onFormChange=function(e){e.preventDefault(),t[e.target.name]=e.target.value},t.submitType="saveOnly",Object(p.h)(g(g(t)),{name:e.level.name,assumptions:e.level.assumptions}),t}return E(r,a.a.Component),y(r,[{key:"render",value:function(){return a.a.createElement("div",{className:"level-card level-card--expanded",id:this.props.level.id},a.a.createElement("div",null,a.a.createElement(x,{tierName:this.props.levelProps.tierName,ontologyLabel:this.props.levelProps.ontologyLabel,classes:"level-title--expanded"})),a.a.createElement("form",{className:"level-card--expanded__form",onSubmit:this.saveLevel},a.a.createElement("textarea",{className:"form-control",type:"text",id:"level-name",name:"name",value:this.name||"",autoComplete:"off",onChange:this.onFormChange}),a.a.createElement("label",{htmlFor:"assumptions"},"Assumptions"),a.a.createElement("textarea",{className:"form-control",type:"text",id:"level-assumptions",name:"assumptions",autoComplete:"off",value:this.assumptions||"",onChange:this.onFormChange}),a.a.createElement(k,{level:this.props.level,levelProps:this.props.levelProps,isActive:this.props.rootStore.uiStore.expandedCards[0]==this.props.level.id,submitFunc:this.updateSubmitType,cancelFunc:this.cancelEdit,tierCount:this.props.rootStore.levelStore.chosenTierSet.length})))}}]),r}())||o)||o,k=Object(u.b)("rootStore")(i=function(e){function t(){return m(this,t),S(this,w(t).apply(this,arguments))}return E(t,a.a.Component),y(t,[{key:"render",value:function(){var e=this.props.isActive?"":"disabled",t=null;if(null!=this.props.level.parent&&"root"!=this.props.level.parent){var r=interpolate(gettext("Save and add another %s"),[this.props.levelProps.tierName]);t=a.a.createElement(j,{disabledText:e,classes:"btn-primary",text:r,submitType:"saveAndAddSibling",submitFunc:this.props.submitFunc})}var n=null,o=this.props.rootStore.levelStore.chosenTierSet.length;if(this.props.level.level_depth<o){var i=interpolate(gettext("Save and link %s"),[this.props.levelProps.childTierName]);n=a.a.createElement(j,{disabledText:e,classes:"btn btn-primary",text:i,submitType:"saveAndAddChild",submitFunc:this.props.submitFunc})}return a.a.createElement("div",{className:"button-bar"},a.a.createElement(j,{disabledText:e,classes:"btn btn-primary",text:gettext("Save and close"),submitType:"saveOnly",submitFunc:this.props.submitFunc}),t,n,a.a.createElement(j,{classes:"btn btn-reset",text:gettext("Cancel"),submitType:"cancel",submitFunc:this.props.cancelFunc}))}}]),t}())||i,j=function(e){function t(){return m(this,t),S(this,w(t).apply(this,arguments))}return E(t,a.a.Component),y(t,[{key:"render",value:function(){var e=this,t="cancel"==this.props.submitType?"button":"submit";return a.a.createElement("button",{disabled:this.props.disabledText,type:t,className:this.props.classes+" level-button btn btn-sm",onClick:function(){return e.props.submitFunc(e.props.submitType)}},this.props.text)}}]),t}();function P(e){return(P="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function L(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function F(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function A(e,t,r){return t&&F(e.prototype,t),r&&F(e,r),e}function z(e,t){return!t||"object"!==P(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function D(e){return(D=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function V(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&q(e,t)}function q(e,t){return(q=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}d.b.add(v.a,v.b);var B,I,R=Object(u.b)("rootStore")(C=Object(u.c)(C=function(e){function i(){return L(this,i),z(this,D(i).apply(this,arguments))}return V(i,a.a.Component),A(i,[{key:"render",value:function(){var o=this;return("initial"==this.props.renderList?this.props.rootStore.levelStore.sortedLevels.filter(function(e){return-1!=["root",null].indexOf(e.parent)}):this.props.renderList.sort(function(e,t){return e.customsort-t.customsort})).map(function(t){var e="";e=-1!==o.props.rootStore.uiStore.expandedCards.indexOf(t.id)?a.a.createElement(N,{level:t,levelProps:o.props.rootStore.levelStore.levelProperties[t.id]}):a.a.createElement(T,{level:t,levelProps:o.props.rootStore.levelStore.levelProperties[t.id]});var r=o.props.rootStore.levelStore.sortedLevels.filter(function(e){return e.parent==t.id}),n=null;return 0<r.length&&(n=a.a.createElement(i,{rootStore:o.props.rootStore,renderList:r})),a.a.createElement("div",{key:t.id,className:"leveltier--new"},e,n)})}}]),i}())||C)||C,J=Object(u.b)("rootStore")(_=Object(u.c)(_=function(e){function t(){return L(this,t),z(this,D(t).apply(this,arguments))}return V(t,a.a.Component),A(t,[{key:"render",value:function(){return 0==this.props.rootStore.levelStore.levels.length?a.a.createElement("div",{className:"level-list-panel"},a.a.createElement("div",{className:"level-list-panel__dingbat"},a.a.createElement("i",{className:"fas fa-sitemap"})),a.a.createElement("div",{className:"level-list-panel__text text-large"},a.a.createElement("strong",{className:"text-danger"},"Choose your results framework template carefully!")," Once you begin building your framework, it will not be possible to change templates without first deleting all saved levels.")):a.a.createElement("div",{id:"level-list",style:{flexGrow:"2"}},a.a.createElement(R,{renderList:"initial"}))}}]),t}())||_)||_,G=r("y2Vs");function M(e){return(M="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Q(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function X(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function U(e,t,r){return t&&X(e.prototype,t),r&&X(e,r),e}function Z(e,t){return!t||"object"!==M(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function H(e){return(H=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function W(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Y(e,t)}function Y(e,t){return(Y=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var K=Object(u.b)("rootStore")(B=Object(u.c)(B=function(e){function i(){var e,t;Q(this,i);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(t=Z(this,(e=H(i)).call.apply(e,[this].concat(n)))).handleChange=function(e){t.props.rootStore.levelStore.changeTierSet(e.value)},t}return W(i,a.a.Component),U(i,[{key:"componentDidUpdate",value:function(){$('*[data-toggle="popover"]').popover({html:!0})}},{key:"render",value:function(){var e=null;"locked"==this.props.rootStore.uiStore.tierLockStatus?e=a.a.createElement("a",{href:"#",tabIndex:"0","data-toggle":"popover","data-trigger":"focus","data-html":"true","data-content":gettext('<span class="text-danger"><strong>The results framework template cannot be changed after levels are saved.</strong></span> To change templates, all saved levels first must be deleted.  A level can be deleted when it has no sub-levels and no linked indicators.')},a.a.createElement("i",{className:"far fa-question-circle"})):"primed"==this.props.rootStore.uiStore.tierLockStatus&&(e=a.a.createElement("a",{href:"#",tabIndex:"0","data-toggle":"popover","data-trigger":"focus","data-html":"true","data-content":gettext('<span class="text-danger"><strong>Choose your results framework template carefully!</strong></span> Once you begin building your framework, it will not be possible to change templates without first deleting all saved levels.')},a.a.createElement("i",{className:"far fa-question-circle"})));var t=Object.keys(this.props.rootStore.levelStore.tierPresets).map(function(e){return{value:e,label:e}}),r={value:this.props.rootStore.levelStore.chosenTierSet,label:this.props.rootStore.levelStore.chosenTierSetName},n="leveltier-picker__selectbox ";return n+="locked"==this.props.rootStore.uiStore.tierLockStatus?"leveltier-picker__selectbox--disabled":"",a.a.createElement("div",{className:n},a.a.createElement("label",null,"TEMPLATE"),a.a.createElement("span",null,e),a.a.createElement(G.default,{options:t,value:r,isDisabled:"locked"==this.props.rootStore.uiStore.tierLockStatus,onChange:this.handleChange}))}}]),i}())||B)||B,ee=function(e){function t(){return Q(this,t),Z(this,H(t).apply(this,arguments))}return W(t,a.a.Component),U(t,[{key:"render",value:function(){return a.a.createElement("div",{className:"leveltier leveltier--level-"+this.props.tierLevel},this.props.tierName," ")}}]),t}(),te=Object(u.b)("rootStore")(I=Object(u.c)(I=function(e){function t(){return Q(this,t),Z(this,H(t).apply(this,arguments))}return W(t,a.a.Component),U(t,[{key:"render",value:function(){var e=null;return 0==this.props.rootStore.levelStore.levels.length&&(e=a.a.createElement("button",{className:"leveltier-button btn btn-primary btn-block",onClick:this.props.rootStore.levelStore.createFirstLevel},gettext("Apply"))),a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{id:"leveltier-list",className:"leveltier-list"},0<this.props.rootStore.levelStore.chosenTierSet.length?this.props.rootStore.levelStore.chosenTierSet.map(function(e,t){return a.a.createElement(ee,{key:t,tierLevel:t,tierName:e})}):null),e?a.a.createElement("div",{className:"leveltier-list__actions"},e):null)}}]),t}())||I)||I,re=Object(u.b)("rootStore")(Object(u.c)(function(e){return a.a.createElement("div",{id:"leveltier-picker",className:"leveltier-picker"},a.a.createElement(K,null),a.a.createElement(te,null))}));var ne,oe,ie,le,ae,se,ce,ue,pe,de,fe,ve,he,me,be,ye=r("XoI5");function Se(e,t,r,n){r&&Object.defineProperty(e,t,{enumerable:r.enumerable,configurable:r.configurable,writable:r.writable,value:r.initializer?r.initializer.call(n):void 0})}function ge(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function we(e,t,r){return t&&ge(e.prototype,t),r&&ge(e,r),e}function Ee(r,n,e,t,o){var i={};return Object.keys(t).forEach(function(e){i[e]=t[e]}),i.enumerable=!!i.enumerable,i.configurable=!!i.configurable,("value"in i||i.initializer)&&(i.writable=!0),i=e.slice().reverse().reduce(function(e,t){return t(r,n,e)||e},i),o&&void 0!==i.initializer&&(i.value=i.initializer?i.initializer.call(o):void 0,i.initializer=void 0),void 0===i.initializer&&(Object.defineProperty(r,n,i),i=null),i}function Oe(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var Ce=(oe=Ee((ne=function(){function a(e,t,r,n,o,i){var l=this;Oe(this,a),Se(this,"levels",oe,this),Se(this,"indicators",ie,this),Se(this,"chosenTierSet",le,this),Se(this,"chosenTierSetName",ae,this),this.tierPresets={},this.defaultPreset="Mercy Corps standard",this.program_id="",Se(this,"cancelEdit",se,this),Se(this,"createNewLevelFromSibling",ce,this),Se(this,"createNewLevelFromParent",ue,this),Se(this,"createFirstLevel",pe,this),this.saveLevelTiersToDB=function(){var e={program_id:l.program_id,tiers:l.chosenTierSet};ye.a.post("/save_leveltiers/",e).then(function(e){}).catch(function(e){})},this.deleteLevelFromDB=function(t){ye.a.delete("/level/".concat(t)).then(function(e){l.levels.replace(e.data),l.rootStore.uiStore.removeExpandedCard(t),0==l.levels.length&&l.createFirstLevel()}).catch(function(e){})},this.saveLevelToDB=function(r,n,e){var t=l.levels.find(function(e){return e.id==n}),o=Object.assign(Object(p.q)(t),e);"new"==n?("root"==o.parent&&l.saveLevelTiersToDB(),delete o.id,ye.a.post("/insert_new_level/",o).then(function(e){Object(p.o)(function(){l.levels.replace(e.data.all_data)});var t=e.data.new_level.id;l.rootStore.uiStore.removeExpandedCard(n),"saveAndAddSibling"==r?l.createNewLevelFromSibling(t):"saveAndAddChild"==r&&l.createNewLevelFromParent(t)}).catch(function(e){})):ye.a.put("/level/".concat(n,"/"),o).then(function(e){Object(p.o)(function(){Object.assign(t,e.data)}),l.rootStore.uiStore.removeExpandedCard(n),"saveAndAddSibling"==r?l.createNewLevelFromSibling(n):"saveAndAddChild"==r&&l.createNewLevelFromParent(n)}).catch(function(e){})},this.buildOntology=function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[],r=Object(p.q)(l.levels.find(function(e){return e.id==t}));return r.parent&&"root"!=r.parent?(e.unshift(r.customsort),l.buildOntology(r.parent,e)):e.join(".")},this.getLevelIndicators=function(t){return l.indicators.filter(function(e){return e.level==t})},this.rootStore=i,this.levels=t,this.indicators=r,this.tierPresets=o,this.program_id=e,0<n.length?(this.chosenTierSet=n.map(function(e){return e.name}),this.chosenTierSetName=this.derive_preset_name(n,o)):(this.chosenTierSetName=this.defaultPreset,this.chosenTierSet=this.tierPresets[this.defaultPreset])}return we(a,[{key:"changeTierSet",value:function(e){this.chosenTierSetName=e,this.chosenTierSet=this.tierPresets[e]}},{key:"derive_preset_name",value:function(e,t){if(!e)return null;var r=e.sort(function(e){return e.tier_depth}).map(function(e){return e.name}),n=JSON.stringify(r);for(var o in t){if(e.length==t[o].length)if(n==JSON.stringify(t[o]))return o}return"Custom"}},{key:"sortedLevels",get:function(){return this.levels.slice().sort(function(e,t){e.level_depth-t.level_depth||(e.customsort,t.customsort)})}},{key:"levelProperties",get:function(){var o=this,i={},e=!0,t=!1,r=void 0;try{for(var l,n=function(){var t=l.value,e={};e.indicators=o.getLevelIndicators(t.id),e.ontologyLabel=o.buildOntology(t.id),e.tierName=o.chosenTierSet[t.level_depth-1],e.childTierName=null,o.chosenTierSet.length>t.level_depth&&(e.childTierName=o.chosenTierSet[t.level_depth]);var r=o.levels.filter(function(e){return e.parent==t.id}).length,n=o.indicators.filter(function(e){return e.level==t.id});e.canDelete=0==r&&0==n,i[t.id]=e},a=this.levels[Symbol.iterator]();!(e=(l=a.next()).done);e=!0)n()}catch(e){t=!0,r=e}finally{try{e||null==a.return||a.return()}finally{if(t)throw r}}return i}}]),a}()).prototype,"levels",[p.m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),ie=Ee(ne.prototype,"indicators",[p.m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),le=Ee(ne.prototype,"chosenTierSet",[p.m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),ae=Ee(ne.prototype,"chosenTierSetName",[p.m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return""}}),Ee(ne.prototype,"sortedLevels",[p.e],Object.getOwnPropertyDescriptor(ne.prototype,"sortedLevels"),ne.prototype),Ee(ne.prototype,"levelProperties",[p.e],Object.getOwnPropertyDescriptor(ne.prototype,"levelProperties"),ne.prototype),Ee(ne.prototype,"changeTierSet",[p.d],Object.getOwnPropertyDescriptor(ne.prototype,"changeTierSet"),ne.prototype),se=Ee(ne.prototype,"cancelEdit",[p.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var e=this;return function(t){if("new"==t){var r=e.levels.find(function(e){return e.id==t});e.levels.filter(function(e){return e.customsort>r.customsort&&e.parent==r.parent}).forEach(function(e){return e.customsort-=1}),e.levels.replace(e.levels.filter(function(e){return"new"!=e.id}))}e.rootStore.uiStore.removeExpandedCard(t)}}}),ce=Ee(ne.prototype,"createNewLevelFromSibling",[p.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var n=this;return function(t){var r=Object(p.q)(n.levels.find(function(e){return e.id==t})),e=Object.assign({},r);e.customsort+=1,e.id="new",e.name="",e.assumptions="",n.levels.filter(function(e){return r&&e.customsort>r.customsort&&e.parent==r.parent}).forEach(function(e){return e.customsort+=1}),n.rootStore.uiStore.expandedCards.push("new"),n.rootStore.uiStore.activeCard="new",n.levels.push(e)}}}),ue=Ee(ne.prototype,"createNewLevelFromParent",[p.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var n=this;return function(t){var e=Object(p.q)(n.levels.find(function(e){return e.id==t})),r={id:"new",customsort:1,name:"",assumptions:"",parent:t,level_depth:e.level_depth+1,program:n.program_id};n.levels.filter(function(e){return e.parent==t}).forEach(function(e){return e.customsort+=1}),n.rootStore.uiStore.expandedCards.push("new"),n.rootStore.uiStore.activeCard="new",n.levels.push(r),n.rootStore.uiStore.hasVisibleChildren.push(r.parent)}}}),pe=Ee(ne.prototype,"createFirstLevel",[p.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var t=this;return function(){var e={id:"new",program:t.program_id,name:"",assumptions:"",customsort:1,level_depth:1,parent:"root"};t.levels.push(e),t.rootStore.uiStore.expandedCards.push("new")}}}),ne),_e=(fe=Ee((de=function(){function t(e){Oe(this,t),Se(this,"expandedCards",fe,this),Se(this,"hasVisibleChildren",ve,this),Se(this,"addExpandedCard",he,this),Se(this,"removeExpandedCard",me,this),Se(this,"updateVisibleChildren",be,this),this.rootStore=e}return we(t,[{key:"tierLockStatus",get:function(){return 0<this.rootStore.levelStore.levels.filter(function(e){return"new"!=e.id}).length?"locked":1==this.rootStore.levelStore.levels.length?"primed":null}}]),t}()).prototype,"expandedCards",[p.m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),ve=Ee(de.prototype,"hasVisibleChildren",[p.m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),Ee(de.prototype,"tierLockStatus",[p.e],Object.getOwnPropertyDescriptor(de.prototype,"tierLockStatus"),de.prototype),he=Ee(de.prototype,"addExpandedCard",[p.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var t=this;return function(e){t.expandedCards.includes(e)||t.expandedCards.push(e)}}}),me=Ee(de.prototype,"removeExpandedCard",[p.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var e=this;return function(t){e.expandedCards=e.expandedCards.filter(function(e){return e!=t})}}}),be=Ee(de.prototype,"updateVisibleChildren",[p.d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var r=this;return function(t){0<=r.hasVisibleChildren.indexOf(t)?(r.hasVisibleChildren=r.hasVisibleChildren.filter(function(e){return e!=t}),r.rootStore.levelStore.levels.filter(function(e){return e.parent==t}).forEach(function(e){return r.updateVisibleChildren(e.id)})):r.hasVisibleChildren.push(t)}}}),de),xe=jsContext,Te=new function e(t,r,n,o,i){Oe(this,e),this.levelStore=new Ce(t,r,n,o,i,this),this.uiStore=new _e(this)}(xe.program_id,xe.levels,xe.indicators,xe.levelTiers,xe.tierPresets);c.a.render(a.a.createElement(u.a,{rootStore:Te},a.a.createElement(a.a.Fragment,null,a.a.createElement(re,null),a.a.createElement(J,null))),document.querySelector("#level-builder-react-component"))},XoI5:function(e,t,r){"use strict";r.d(t,"a",function(){return o});var n=r("vDqi"),o=r.n(n).a.create({withCredentials:!0,baseURL:"/api/",headers:{"X-CSRFToken":document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/,"$1")}})},qtBC:function(e,t,r){"use strict";var n=r("7+Rn"),o=r.n(n)()();t.a=o}},[["QTZG",0,1]]]);