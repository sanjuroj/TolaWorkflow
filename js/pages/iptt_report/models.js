/**
 * Data models for the IPTT report reqct page
 * @module iptt_report/models
 */

import {observable, action, reaction, when, computed} from "mobx";

/**
 * models list:
 * ReportStore (observable - all data for report)
 * ProgramStore (observable - all program options)
 */

const BLANK_LABEL = '---------';
const TVA = 1;
const TIMEPERIODS = 2;

class ReportAPI {
    constructor(ajaxUrl) {
        this.url = ajaxUrl;
    }
    
    callForData(programId, frequency, tva) {
        let params = {
            programId: programId,
            frequency: frequency,
            reportType: tva ? 'tva' : 'timeperiods'
        };
        return $.get(this.url, params);
    }
}

class Indicator {
    @observable timeperiodsData = {};
    @observable tvaData = {};
    @observable id = null;

    constructor(program) {
        this.program = program;
    }

    loadData(data) {
        this.id = data.id;
        this.sortIndex = data.sortIndex;
        this.number = data.number;
        this.name = data.name;
        this.level = data.level;
        this.sites = data.sites;
        this.types = data.indicatorTypes;
        this.sector = data.sector;
        this.frequency = data.frequency;
        this.unitOfMeasure = data.unitOfMeasure;
        this.cumulative = data.cumulative;
        this.unitType = data.unitType;
        this.baseline = data.baseline;
        this.lopTarget = data.lopTarget;
        this.lopActual = data.lopActual;
        this.lopMet = data.lopMet;
        if (data.reportData) {
            this.loadReportData(data.reportData);
        }
    }
    
    loadReportData(reportData) {
        if (reportData.timeperiods) {
            Object.entries(reportData.timeperiods).forEach(
                ([frequency, values]) => {
                    this.timeperiodsData[frequency] = values;
                }
            )
        }
        if (reportData.tva) {
            Object.entries(reportData.tva).forEach(
                ([frequency, values]) => {
                    this.tvaData[frequency] = values;
                }
            )
        }
    }
    
    @computed get indicatorData() {
        let frequency = String(this.program.rootStore.selectedFrequencyId);
        let reportData = this.program.rootStore.isTVA
                         ? this.tvaData
                         : this.timeperiodsData;
        if (reportData[frequency]) {
            return reportData[frequency]
                   .slice(this.program.rootStore.startPeriod,
                          parseInt(this.program.rootStore.endPeriod) + 1);
        }
        return false;
    }
    
    @computed get isPercent() {
        return this.unitType == '%';
    }
    
}


class Program {
    @observable indicators = null;
    @observable reportsLoaded = {
        tva: [],
        timeperiods: []
    };

    constructor(rootStore, programJSON) {
        this.rootStore = rootStore;
        this.id = programJSON.id;
        this.name = programJSON.name;
        this.frequencies = programJSON.frequencies;
        this.periodDateRanges = programJSON.periodDateRanges;
    }
    
    periods(frequency) {
        return frequency in this.periodDateRanges ? this.periodDateRanges[frequency] : false;
    }
    
    periodCount(frequency) {
        return this.periods(frequency) ? this.periods(frequency).length : 0;
    }
    
    currentPeriod(frequency) {
        let periods = this.periods(frequency);
        if (!periods) {
            return null;
        } else if (frequency == 7) {
            return periods.filter((period) => !period[4]).length - 1;
        } else {
            return periods.filter((period) => !period[2]).length - 1;
        }
    }
    
    @action
    loadData(data) {
        if (!(data.programId == this.id)) {
            //something went wrong
            console.log("what happened?  data", data);
        }
        if (this.indicators === null) {
            this.indicators = {};
        }
        data.indicators.forEach(
            (indicatorJSON) => {
                if (this.indicators[indicatorJSON.id] == undefined) {
                    this.indicators[indicatorJSON.id] = new Indicator(this);
                }
                this.indicators[indicatorJSON.id].loadData(indicatorJSON);
            }
        );
        this.reportsLoaded[data.reportType].push(String(data.reportFrequency));
    }
    
    @computed get reportIndicators() {
        if (this.indicators === null) {
            return false;
        }
        if ((this.rootStore.isTVA && this.reportsLoaded.tva.indexOf(String(this.rootStore.selectedFrequencyId)) == -1) ||
            (!this.rootStore.isTVA && this.reportsLoaded.timeperiods.indexOf(String(this.rootStore.selectedFrequencyId)) == -1)) {
                return false;
            }
        return Object.entries(this.indicators).filter(
            ([pk, indicator]) => {
                return (!this.rootStore.isTVA || indicator.frequency == this.rootStore.selectedFrequencyId);
            }
        ).map(([pk, indicator]) => indicator).sort((a, b) => a.sortIndex - b.sortIndex);
        
    }
    
    @computed get reportLevels() {
        if (!this.reportIndicators) {
            return [];
        }
        return [...new Set(this.reportIndicators.map(indicator => indicator.level))];
    }
    
    @computed get reportSites() {
        if (!this.reportIndicators) {
            return [];
        }
        let sites = this.reportIndicators.map(indicator => indicator.sites)
                        .reduce((pre, cur) => {return pre.concat(cur)})
                        .map((elem) => ({value: elem.pk, label: elem.name}));
        return [...new Set(sites.map(JSON.stringify))].map(JSON.parse);
    }
    
    @computed get reportTypes() {
        if (!this.reportIndicators) {
            return [];
        }
        let types = this.reportIndicators.map(indicator => indicator.types)
                        .reduce((pre, cur) => {return pre.concat(cur)})
                        .map((elem) => ({value: elem.pk, label: elem.name}));
        return [...new Set(types.map(JSON.stringify))].map(JSON.parse);
    }
    
    @computed get reportSectors() {
        if (!this.reportIndicators) {
            return [];
        }
        return [...new Set(
            this.reportIndicators.map(
                indicator => JSON.stringify({value: indicator.sector.pk, label:indicator.sector.name}))
            )].map(JSON.parse);
    }

}

class ProgramStore  {
    constructor(rootStore, programsJSON) {
        this.rootStore = rootStore;
        this.programs = {};
        programsJSON.forEach(programJSON => {
            this.programs[programJSON.id] = new Program(this.rootStore, programJSON);
        });
    }
    
    getProgram(id) {
        return this.programs[id];
    }

}

export class RootStore {
    @observable selectedProgram = null;
    @observable selectedFrequencyId = null;
    @observable startPeriod = '';
    @observable endPeriod = '';
    @observable nullRecent = false;
    @observable levelFilters = [];
    @observable siteFilters = [];
    @observable typeFilters = [];
    @observable sectorFilters = [];
    reportType = null;
    router = null;
    currentPeriod = null;
    loading = false;
    
    constructor(contextData) {
        this.programStore = new ProgramStore(this, contextData.programs);
        this.reportAPI = new ReportAPI('/indicators/iptt_report_data/');
        this._periodLabels = {
            [TIMEPERIODS]: contextData.labels.timeperiods,
            [TVA]: contextData.labels.targetperiods,
            names: contextData.labels.periodNames
        };
    }
    
    init = (router) => {
        this.router = router;
        let params = router.getState().params;
        let reload = false;
        this.setProgramId(params.programId);
        this.setReportType(params.reportType);
        if (params.timeperiods || params.targetperiods) {
            params.frequency = params.timeperiods || params.targetperiods;
            delete params['timeperiods'];
            delete params['targetperiods'];
            reload = true;
        }
        this.setFrequencyId(params.frequency);
        if (params.timeframe == 1) {
            params.start = 0;
            params.end = this.selectedProgram.periodDateRanges[params.frequency].length - 1;
            delete params['timeframe'];
            reload = true;
        } else if (params.timeframe == 2) {
            let numrecent = params.numrecentperiods || 2;
            params.end = this.selectedProgram.currentPeriod(params.frequency);
            params.start = params.end - numrecent + 1;
            delete params['timeframe'];
            delete params['numrecentperiods'];
            reload = true;
        } else if (params.start === undefined || params.end === undefined) {
            params.start = 0;
            params.end = this.selectedProgram.periodDateRanges[params.frequency].length - 1;
            delete params['timeframe'];
            delete params['numrecentperiods'];
            delete params['start_period'];
            delete params['end_period'];
            reload = true;
        }
        this.setStartPeriod(params.start);
        this.setEndPeriod(params.end);
        if (reload) {
            router.navigate(router.getState().name, params, {reload: true});
        }
    }
    
    updateUrl = (param, newValue) => {
        let oldParams = this.router.getState().params;
        if (newValue !== null && oldParams[param] != newValue) {
            let newParams = { ...oldParams, [param]: newValue };
            this.router.navigate(this.router.getState().name, newParams, {replace: true});
        }
    }
    
    updateRoute = ({ previousRoute, route }) => {
        //console.log("updating route from", previousRoute, "  to ", route);
    }
    
    // REPORT TYPE:
    
    setReportType(reportType) {
        if (reportType == 'timeperiods') {
            this.reportType = TIMEPERIODS;
        } else {
            this.reportType = TVA;
        }
    }
    
    get isTVA() {
        return (this.reportType === TVA);
    }
    
    @computed get reportIndicators() {
        if (this.selectedProgram === null || !this.selectedFrequencyId) {
            return [];
        }
        if (this.selectedProgram.reportIndicators) {
            //return this.selectedProgram.reportIndicators;
            let indicators = this.selectedProgram.reportIndicators;
            if (this.levelFilters && this.levelFilters.length > 0) {
                indicators = indicators.filter(
                    indicator => this.levelFilters.map(levelOption => levelOption.value).indexOf(indicator.level) != -1
                );
            }
            if (this.siteFilters && this.siteFilters.length > 0) {
                let sitePks = this.siteFilters.map(siteOption => siteOption.value);
                indicators = indicators.filter(
                    (indicator) => indicator.sites.map(site => site.pk).filter(pk => sitePks.includes(pk)).length > 0
                );
            }
            if (this.typeFilters && this.typeFilters.length > 0) {
                let typePks = this.typeFilters.map(typeOption => typeOption.value);
                indicators = indicators.filter(
                    (indicator) => indicator.types.map(iType => iType.pk).filter(pk => typePks.includes(pk)).length > 0
                );
            }
            if (this.sectorFilters && this.sectorFilters.length > 0) {
                indicators = indicators.filter(
                    indicator => this.sectorFilters.map(sectorOption => sectorOption.value).indexOf(indicator.sector.pk) != -1
                );
            }
            return indicators;
        } else {
            this.callForData();
            return false;
        }
    }

    callForData = () => {
        if (!this.loading) {
            this.loading = true;
            this.reportAPI.callForData(this.selectedProgram.id, this.selectedFrequencyId, this.isTVA)
                .then((data) => { this.selectedProgram.loadData(data); this.loading=false; });
        }
    }
    
    // FILTER SECTION:
    
    //SELECTING PROGRAMS:

    setProgramId(id) {
        if (id === null) {
            this.selectedProgram = null;
        } else if (this.selectedProgram == null || this.selectedProgram.id != id) {
            this.updateUrl('programId', id);
            this.selectedProgram = this.programStore.getProgram(id);
            if (this.isTVA && this.selectedFrequencyId
                && this.selectedProgram.frequencies.indexOf(parseInt(this.selectedFrequencyId)) == -1) {
                this.setFrequencyId(null);
            } else if (this.selectedFrequencyId !== null) {
                this.setFrequencyId(this.selectedFrequencyId);
                this.updatePeriods();
            }
        }
    }
    
    @computed get selectedProgramOption() {
        if (this.selectedProgram === null) {
            return {value: null, label: BLANK_LABEL};
        }
        return {value: this.selectedProgram.id, label: this.selectedProgram.name};
    }
    
    get programOptions() {
        // all available options for Programs dropdown:
        return Object.entries(this.programStore.programs).map(
            ([id, program]) => ({value: id, label: program.name})
        );
    }
    
    //SELECTING FREQUENCY:
    
    setFrequencyId(id) {
        if (id === null) {
            this.selectedFrequencyId = null;
        } else if (this.selectedFrequencyId != id) {
            this.selectedFrequencyId = id;
            this.updateUrl('frequency', id);
            //refresh periods to make sure they're in range:
            this.updatePeriods();
            this.updateCurrentPeriod();
        }
    }
    
    updateCurrentPeriod() {
        this.currentPeriod = this.selectedProgram.currentPeriod(this.selectedFrequencyId);
    }
    
    updatePeriods() {
        if (this.selectedFrequencyId == 2) {
            this.setStartPeriod(0);
            this.setEndPeriod(1);
        } else {
            if (this.startPeriod != '') {
                this.setStartPeriod(this.startPeriod);
            }
            if (this.endPeriod != '') {
                this.setEndPeriod(this.endPeriod);
            }
        }
    }
    
    @computed get selectedFrequencyOption() {
        if (this.selectedProgram === null || this.selectedFrequencyId === null) {
            return {value: null, label: BLANK_LABEL};
        }
        return {
            value: this.selectedFrequencyId,
            label: this._periodLabels[this.reportType][this.selectedFrequencyId]
            };
    }
    
    @computed get frequencyOptions() {
        if (this.selectedProgram === null) {
            return [{value: null, label: BLANK_LABEL},];
        }
        else if (this.reportType == TIMEPERIODS) {
            return Object.entries(this._periodLabels[TIMEPERIODS]).map(
              ([id, label]) => ({value: id, label: label})
            );
        } else {
            return this.selectedProgram.frequencies.map(
                (id) => ({value: id, label: this._periodLabels[TVA][id]})
            );
        }
    }
    
    //PERIODS:
    
    setStartPeriod(period) {
        //use '' for null values as React does badly with null value for select
        if (this.selectedFrequencyId == 2) {
            this.startPeriod = 0;
            this.updateUrl('start', this.startPeriod);
        } else if (this.selectedFrequencyId && this.selectedProgram) {
            period = period !== null
                     ? period < this.selectedProgram.periodCount(this.selectedFrequencyId)
                        ? period
                        : 0
                    : '';
            this.startPeriod = period;
            this.updateUrl('start', this.startPeriod);
        }
    }
    
    setEndPeriod(period) {
        if (this.selectedFrequencyId == 2) {
            this.endPeriod = 1;
            this.updateUrl('end', this.endPeriod);
        } else if (this.selectedFrequencyId && this.selectedProgram) {
            this.nullRecent = false;
            period = period !== null
                     ? period < this.selectedProgram.periodCount(this.selectedFrequencyId)
                        ? period
                        : this.selectedProgram.periodCount(this.selectedFrequencyId) - 1
                    : '';
            this.endPeriod = period;
            this.updateUrl('end', this.endPeriod);
        }
    }
    
    @computed get startPeriodLabel() {
        if (this.selectedProgram && this.selectedFrequencyId
            && this.startPeriod !== null && this.startPeriod !== ''
            && this.startPeriod <= this.selectedProgram.periodCount(this.selectedFrequencyId)) {
            return this.selectedProgram.periods(this.selectedFrequencyId)[this.startPeriod][0];
        }
        return '';
    }
    
    @computed get endPeriodLabel() {
        if (this.selectedProgram && this.selectedFrequencyId
            &&this.endPeriod !== null && this.endPeriod !== ''
            && this.endPeriod < this.selectedProgram.periodCount(this.selectedFrequencyId)) {
            return this.selectedProgram.periods(this.selectedFrequencyId)[this.endPeriod][1];
        }
        return '';
    }
    
    @computed get selectedPeriods() {
        if (!this.selectedProgram || !this.selectedFrequencyId || this.selectedFrequencyId === 1
            || this.startPeriod === null || this.endPeriod === null) {
            return [];
        }
        return this.selectedProgram.periods(this.selectedFrequencyId).slice(this.startPeriod, parseInt(this.endPeriod) + 1);
    }
    
    @computed get periodOptions() {
        if (this.selectedProgram === null || this.selectedFrequencyId === null) {
            return [{value: null, label: BLANK_LABEL}];
        } else if (this.selectedFrequencyId == 7) {
            let years = {};
            this.selectedProgram.periodDateRanges[7].forEach(
                ( period, index ) => {
                    let label = this.getPeriodLabel(period, index);
                    let year = period[3];
                    if (!(year in years)) {
                        years[year] = [];
                    }
                    years[year].push({value: index, label: label.title});
                }
            );
            return years;
        } else if (this.selectedFrequencyId == 2 || this.selectedFrequencyId == 1) {
            return this.selectedProgram.periods(this.selectedFrequencyId).map(
                (labels, index) => {
                    return {value: index, label: labels[index]}
                }
            )
        }
        return this.selectedProgram.periods(this.selectedFrequencyId).map(
            (labels, index) => {
                let label = this.getPeriodLabel(labels, index);
                return {value: index, label: label.title + ' ' + '(' + label.subtitle + ')'};
            }
        );
    }
    
    getPeriodLabel = (period, index) => {
        if (this.selectedFrequencyId == 7) {
            let [, , monthLabel, year] = period;
            return {title: monthLabel + ' ' + year, subtitle: ''};
        } else if (this.selectedFrequencyId == 2) {
            return {title: period[2].toUpperCase(), subtitle: ''};
        } else {
            let [startLabel, endLabel] = period;
            return {title: this._periodLabels.names[this.selectedFrequencyId] + " " + (index + 1),
                    subtitle: startLabel + ' - ' + endLabel};
        }
    }
    
    // SHOW ALL / MOST RECENT OPTIONS:
    
    setShowAll = () => {
        this.setStartPeriod(0);
        this.setEndPeriod(this.selectedProgram.periodCount(this.selectedFrequencyId) - 1);
    }
    
    setMostRecent = (numrecent) => {
        if (numrecent === '') {
            this.nullRecent = true;
        } else if (numrecent !== null) {
            let startPeriod = Math.max(this.currentPeriod - numrecent + 1, 0);
            this.setEndPeriod(this.currentPeriod);
            this.setStartPeriod(startPeriod);
        }
    }
    
    @computed get timeframeEnabled() {
        //showAll and Most Recent don't make sense for non time-aware frequencies:
        return (this.selectedProgram && this.selectedFrequencyId != 2 && this.selectedFrequencyId != 1);
    }
    
    @computed get showAll() {
        return (this.timeframeEnabled && this.startPeriod == 0
                && this.endPeriod == this.selectedProgram.periodCount(this.selectedFrequencyId) - 1);
    }
    
    @computed get mostRecent() {
        if (this.nullRecent) {
            return '';
        } else if (this.timeframeEnabled && !this.showAll && this.currentPeriod !== null
            && this.endPeriod == this.currentPeriod) {
            return this.endPeriod - this.startPeriod + 1;
        }
        return null;
    }
    
}