import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import { observable, computed, reaction } from 'mobx';

import { TVA, TIMEPERIODS, GROUP_BY_CHAIN, GROUP_BY_LEVEL } from '../../constants';


export default class ipttRouter {
    filterStore = null;

    constructor(filterStore, jsContext) {
        if (jsContext && jsContext.pin_url) {
            this.pinUrl = jsContext.pin_url;
        }
        this.routes = [
        {
            name: 'iptt',
            path: '/iptt_report/:programId<\\d+>',
            children: [
                {
                    name: 'timeperiods',
                    path: '/timeperiods?timeperiods'
                },
                {
                    name: 'tva',
                    path: '/targetperiods?targetperiods'
                }
            ]
        },
        {
            name: 'ipttAPI',
            path: '/iptt_api?reportType&programId',
            children: [
                {
                    name: 'ipttData',
                    path: '/iptt_report_data/'
                },
                {
                    name: 'ipttExcel',
                    path: '/iptt_excel/?fullTVA'
                }
            ]
        }
    ];
    this.goodQueryParams = ['frequency', 'start', 'end', 'levels', 'types', 'sites',    
                            'sectors', 'indicators', 'tiers', 'groupby'];
    this.oldQueryParams = ['timeframe', 'numrecentperiods', 'numrecentcount', 'start_period', 'end_period'];
    this.queryParams = '?' + (this.goodQueryParams.concat(this.oldQueryParams)).join('&');
    this.filterStore = filterStore;
    }
    
    init = () => {
        this.router = createRouter(this.routes, {trailingSlashMode: 'always'});
        this.router.setRootPath(this.queryParams);
        this.router.usePlugin(browserPlugin({useHash: false, base: '/indicators'}));
        this.router.subscribe(this.updateRoute);
        this.router.start();
        let { name: currentRouteName, params: currentRouteParams} = this.router.getState();
        this.processParams({name: currentRouteName, ...currentRouteParams}).then(
            () => {
                if (this.router.buildPath(currentRouteName, currentRouteParams) !=
                    this.router.buildPath(this.routeName, this.routeParams)) {
                    this.router.navigate(this.routeName, this.routeParams, {replace: true});
                }
                const navigateWhenRouteChanges = reaction(
                    () => [this.routeName, this.routeParams],
                    ([name, params]) => this.router.navigate(name, params)
                );
            });
        
    }
    
    updateRoute = ({ previousRoute, route: {name, params, ...route}}) => {
        //this.reportType = name == 'iptt.tva' ? TVA : (name == 'iptt.timeperiods' ? TIMEPERIODS : null);
        //console.log("route name", name);
        //console.log("route params", params);
        //console.log("updating route from", previousRoute, " to ", route);
        //console.log("router state", this.router.getState());
    }
    
    processParams = ({
        name = null,
        programId = null,
        frequency = null,
        start = null,
        end = null,
        timeperiods = null,
        targetperiods = null,
        timeframe = null,
        numrecentcount = null,
        numrecentperiods = null,
        start_period = null,
        end_period = null,
        groupby = null,
        levels = null,
        tiers = null,
        sites = null,
        sectors = null,
        types = null,
        indicators = null
        } = {}) => {
        if (this.filterStore === null) {
            throw "data not loaded";
        }
        this.filterStore.reportType = (name == 'iptt.tva') ? TVA
                                    : (name == 'iptt.timeperiods') ? TIMEPERIODS
                                    : null;
        this.filterStore.programId = parseInt(programId);
        if (frequency !== null) {
            this.filterStore.frequencyId = parseInt(frequency);
        } else if (this.reportType === TVA && targetperiods !== null) {
            this.filterStore.frequencyId = parseInt(targetperiods);
        } else if (this.reportType === TIMEPERIODS && timeperiods !== null) {
            this.filterStore.frequencyId = parseInt(timeperiods);
        }
        if (start !== null) {
            this.filterStore.startPeriod = parseInt(start);
        } else if (start_period !== null && !isNaN(Date.parse(start_period))) {
            this.filterStore.setStartPeriodFromDate(new Date(start_period));
        }
        if (end !== null) {
            this.filterStore.endPeriod = parseInt(end);
        } else if (end_period !== null && !isNaN(Date.parse(end_period))) {
            this.filterStore.setEndPeriodFromDate(new Date(end_period));
        }
        if (timeframe !== null && parseInt(timeframe) == 1) {
            this.filterStore.showAll = true;
        } else if (timeframe !== null && parseInt(timeframe) == 2) {
            this.filterStore.mostRecent = parseInt(numrecentperiods) || parseInt(numrecentcount) || 2;
        }
        if (groupby !== null && (parseInt(groupby) === GROUP_BY_CHAIN || parseInt(groupby) === GROUP_BY_LEVEL)) {
            this.filterStore.groupBy = parseInt(groupby);
        }
        return this.filterStore.getLoadedProgram().then(() => {
            if (levels !== null) {
                tiers = null;
                this.filterStore.levels = this.parseArrayParams(levels);
            }
            if (tiers !== null) {
                this.filterStore.tiers = this.parseArrayParams(tiers);
            }
            if (types !== null) {
                this.filterStore.types = this.parseArrayParams(types);
            }
            if (sites !== null) {
                this.filterStore.sites = this.parseArrayParams(sites);
            }
            if (sectors !== null) {
                this.filterStore.sectors = this.parseArrayParams(sectors);
            }
            if (indicators !== null) {
                this.filterStore.indicators = this.parseArrayParams(indicators);
            }
            return true;
        },
        () => false);
    }
    
    @computed get reportType() {
        return this.filterStore.reportType;
    }
    
    parseArrayParams = (param) => {
        if (typeof param === 'string' || param instanceof String) {
            return [parseInt(param)];
        } else if (Array.isArray(param)) {
            return param.map(p => parseInt(p));
        } else if (Number.isInteger(param)) {
            return param;
        } else if (!isNaN(parseInt(param))) {
            return [parseInt(param)];
        }
        return null;
    }
    
    parseToArrayParams = (param) => {
        if (Array.isArray(param)) {
            return param.map(this.parseToArrayParams);
        } else if (typeof param === 'string' || param instanceof String) {
            return param;
        }
        return String(param);
    }
    
    @computed get routeName() {
        return this.reportType === TVA
                    ? 'iptt.tva'
                    : (this.reportType === TIMEPERIODS)
                        ? 'iptt.timeperiods'
                        : 'iptt';
    }
    
    @computed get routeParams() {
        let params = {};
        let keys = [
            'programId',
            'levels',
            'tiers',
            'sectors',
            'sites',
            'types',
            'indicators'];
        keys.forEach((k) => {
            if (this.filterStore[k] !== null)
                {
                    params[k] = this.parseToArrayParams(this.filterStore[k]);
                }
            });
        if (this.filterStore.frequencyId !== null) {
            params.frequency = String(this.filterStore.frequencyId);
        }
        if (this.filterStore.startPeriod !== null) {
            params.start = String(this.filterStore.startPeriod);
        }
        if (this.filterStore.endPeriod !== null) {
            params.end = String(this.filterStore.endPeriod);
        }
        if (this.filterStore.groupBy !== null) {
            params.groupby = String(this.filterStore.groupBy);
        }
        return params;
    }
    
    @computed get pinData() {
        let {programId, ...params} = this.routeParams;
        let reportType = this.reportType === TVA ? 'targetperiods'
                : this.reportType === TIMEPERIODS ? 'timeperiods' : null;
        return {
            program: programId,
            report_type: reportType,
            query_string: Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
        };
    }
    
    @computed get dataUrl() {
        return this.router.buildUrl('ipttAPI.ipttData', this.routeParams);
    }
    
    @computed get excelUrl() {
        if (this.filterStore.frequencyId) {
            return this.router.buildUrl('ipttAPI.ipttExcel',
                                         {...this.routeParams,
                                         reportType: this.reportType,
                                         fullTVA: false});
        }
        return false;
    }

    
    @computed get fullExcelUrl() {
        if (this.filterStore.isTVA && this.filterStore.programId) {
            return this.router.buildUrl('ipttAPI.ipttExcel', {
                                            programId: this.filterStore.programId,
                                            fullTVA: true
                                        });
        }
        return false;
    }

}