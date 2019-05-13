import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import { observable, computed, reaction } from 'mobx';

import { TVA, TIMEPERIODS, GROUP_BY_CHAIN, GROUP_BY_LEVEL } from '../../constants';



var mockProgramStore = {
    validPID: true,
    validFrequencies: [1, 4, 5],
    groupByOld: false,
    validateProgramId( id ) {
        if (this.validPID) {
            return Promise.resolve(parseInt(id));
        } else {
            return Promise.reject("bad ID");
        }
    },
    validateFrequency( programId, frequency, reportType ) {
        var frequencies = reportType === TIMEPERIODS ? [3, 4, 5, 6, 7] : this.validFrequencies;
        if (frequencies.includes(parseInt(frequency))) {
            return parseInt(frequency);
        }
        throw "bad freq";
    },
    currentPeriod( programId, frequency) {
        return 7;
    },
    lastPeriod( programId, frequency ) {
        return 8;
    },
    startPeriodFromDate( programId, frequency, date ) {
        if (date instanceof Date && !isNaN(date)) {
            return 3;
        }
        throw "bad date";
    },
    endPeriodFromDate( programId, frequency, date ) {
        if (date instanceof Date && !isNaN(date)) {
            if (date.toISOString() == new Date('2017-01-31').toISOString()) {
                return 10;
            }
            return 6;
        }
        throw "bad date";
    },
    oldLevels( programId ) {
        return this.groupByOld;
    }
}

export default class ipttRouter {
    @observable reportType = null;
    @observable programId = null;
    @observable frequency = null;
    @observable startPeriod = null;
    @observable endPeriod = null;
    @observable groupBy = null;
    @observable levels = null;
    @observable tiers = null;
    @observable sites = null;
    @observable types = null;
    @observable indicators = null;

    constructor() {
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
    this.goodQueryParams = ['frequency', 'start', 'end', 'levels', 'types',
                            'sectors', 'indicators', 'tiers', 'groupby'];
    this.oldQueryParams = ['timeframe', 'numrecentperiods', 'start_period', 'end_period'];
    this.queryParams = '?' + (this.goodQueryParams.concat(this.oldQueryParams)).join('&');
    this.programStore = mockProgramStore;
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
                const navReact = reaction(
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
        numrecentperiods = null,
        start_period = null,
        end_period = null,
        groupby = null,
        levels = null,
        tiers = null,
        sites = null,
        types = null,
        indicators = null
        } = {}) => {
        this.reportType = name == 'iptt.tva' ? TVA
                        : name == 'iptt.timeperiods' ? TIMEPERIODS
                        : null;
        if (frequency === null && this.reportType === TVA && targetperiods !== null) {
            frequency = targetperiods;
        } else if (frequency === null && this.reportType === TIMEPERIODS && timeperiods !== null) {
            frequency = timeperiods;
        }
        return this.programStore.validateProgramId(programId)
            .then((programId) => {
                this.programId = programId;
                this.frequency = this.programStore.validateFrequency(programId, frequency, this.reportType);
                if (start === null && this.frequency != 1 && this.frequency != 2) {
                    start = this.getStartPeriod(timeframe, numrecentperiods, start_period);
                }
                this.startPeriod = start;
                if (end === null && this.frequency != 1 && this.frequency != 2) {
                    end = this.getEndPeriod(timeframe, end_period);
                }
                this.endPeriod = end;
                if (!this.programStore.oldLevels( this.programId )) {
                    this.groupBy = parseInt(groupby) || GROUP_BY_CHAIN;
                }
                levels = this.parseArrayParams(levels);
                if (levels !== null) {
                    tiers = null;
                    this.levels = levels;
                }
                if (tiers !== null) {
                    this.tiers = this.parseArrayParams(tiers);
                }
                this.sites = this.parseArrayParams(sites);
                this.types = this.parseArrayParams(types);
                this.indicators = this.parseArrayParams(indicators);
                return Promise.resolve(true);
            }, (errorMessage) => {throw errorMessage;}
            ).catch((errorMessage) => {
                return Promise.reject(errorMessage);
            });
        
    }
    
    getStartPeriod = (timeframe, numrecentperiods, start_period) => {
        if (timeframe == '1') {
            return 0;
        } else if (timeframe == '2') {
            return this.programStore.currentPeriod( this.programId, this.frequency ) -
                        (parseInt(numrecentperiods) || 2) + 1;
        } else if (start_period !== null) {
            return this.programStore.startPeriodFromDate(
                this.programId, this.frequency, new Date(start_period)
            );
        }
        return Math.max(
                this.programStore.currentPeriod( this.programId, this.frequency ) - 2,
                0
            );
    }
    
    getEndPeriod = (timeframe, end_period) => {
        var end;
        if (timeframe == '1') {
            return this.programStore.lastPeriod( this.programId, this.frequency );
        } else if (timeframe == '2') {
            return this.programStore.currentPeriod( this.programId, this.frequency );
        } else if (end_period !== null) {
            return Math.min(
                    this.programStore.endPeriodFromDate(
                        this.programId, this.frequency, new Date(end_period)
                        ),
                    this.programStore.lastPeriod( this.programId, this.frequency )
                    );
        }
        return Math.max(
                Math.min(
                    this.programStore.currentPeriod( this.programId, this.frequency ),
                    this.startPeriod + 2
                ),
                this.programStore.lastPeriod( this.programId, this.frequency )
            );
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
            'frequency',
            'levels',
            'tiers',
            'sites',
            'types',
            'indicators'];
        keys.forEach((k) => {
            if (this[k] !== null)
                {
                    params[k] = this.parseToArrayParams(this[k]);
                }
            });
        if (this.startPeriod !== null) {
            params.start = String(this.startPeriod);
        }
        if (this.endPeriod !== null) {
            params.end = String(this.endPeriod);
        }
        if (this.groupBy !== null) {
            params.groupby = String(this.groupBy);
        }
        return params;
    }
    
    @computed get dataUrl() {
        return this.router.buildUrl('ipttAPI.ipttData', this.routeParams);
    }
    
    @computed get excelUrl() {
        return this.router.buildUrl('ipttAPI.ipttExcel',
                                     {...this.routeParams,
                                     reportType: this.reportType,
                                     fullTVA: false});
    }

    
    @computed get fullExcelUrl() {
        return this.router.buildUrl('ipttAPI.ipttExcel', {
                                        programId: this.programId,
                                        fullTVA: true
                                    });
    }

}