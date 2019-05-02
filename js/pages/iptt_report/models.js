/**
 * Data models for the IPTT report reqct page
 * @module iptt_report/models
 */

import {observable, action, computed} from "mobx";
import { trimOntology } from '../../level_utils'

/**
 * models list:
 * ReportStore (observable - all data for report)
 * ProgramStore (observable - all program options)
 */

const BLANK_LABEL = '---------';
const TVA = 1;
const TIMEPERIODS = 2;

export class ReportAPI {
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

class Level {
    constructor(program, levelJSON) {
        this.program = program;
        this.id = levelJSON.id;
        this.name = levelJSON.name;
        this.tier = levelJSON.tier;
        this.tierPk = levelJSON.tierPk;
        this.ontology = levelJSON.ontology;
        this.parentPk = levelJSON.parent;
        this.displayOntology = trimOntology(this.ontology);
        this.depth = levelJSON.depth;
        this.level2parent = levelJSON.level2parent;
        this.sortIndex = levelJSON.sort;
    }
    
    @computed get indicators() {
        return this.program.filteredIndicators
               ? this.program.filteredIndicators.filter(indicator => indicator.levelId == this.id)
               : [];
    }
    
    @computed get allIndicators() {
        return this.program.allIndicators
               ? this.program.allIndicators.filter(indicator => indicator.levelId == this.id)
               : [];
    }
    
    /** label for the row in the IPTT report, either Goal: goal name or Outcome 1: outcome name */
    get titleRow() {
        return `${this.tier}` + (this.displayOntology ? ` ${this.displayOntology}` : '') + `: ${this.name}`;
    }
    
    get optionName() {
        return this.tier + ' ' + this.sortIndex + ' and sub-levels: ' + this.name;
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
        this.pk = data.id;
        this.sortIndex = data.sortIndex;
        this.number = data.number;
        this.name = data.name;
        this.level = data.level;
        this.tierDepth = data.tierDepth;
        this.levelId = data.levelpk;
        this.levelOrder = data.levelOrder;
        this.sites = data.sites;
        this.types = data.indicatorTypes;
        this.sector = data.sector;
        this.frequency = data.frequency;
        this.directionOfChange = data.directionOfChange;
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
    
    get isPercent() {
        return this.unitType == '%';
    }
    
    get numberDisplay() {
        if (this.program.levels[this.levelId]) {
            let level = this.program.levels[this.levelId];
            return `${level.tier} ${level.displayOntology}${this.levelOrder}`;
        }
        return this.number;
    }
    
}


class Program {
    @observable indicators = null;
    @observable levels = null;
    @observable resultChainFilter = 'loading';
    @observable resultChainHeader = 'loading';
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
        if (this.levels === null) {
            this.levels = {};
        }
        data.levels.forEach(
            levelJSON => {
                if (this.levels[levelJSON.id] == undefined) {
                    this.levels[levelJSON.id] = new Level(this, levelJSON);
                }
            }
        )
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
        if (data.resultChainFilter) {
            this.resultChainFilter = data.resultChainFilter;
        }
        if (data.resultChainHeader) {
            this.resultChainHeader = data.resultChainHeader;
        }
        this.reportsLoaded[data.reportType].push(String(data.reportFrequency));
    }
    
    @computed get levelsChain() {
        if (!this.levels || this.levels.length == 0) {
            return false;
        }
        let levels = Object.values(this.levels)
                .sort((levelA, levelB) => levelA.ontology < levelB.ontology ? -1 : 1);
        if (false && this.rootStore.filtersApplied) {
            levels = levels.filter(level => level.indicators.length > 0)
        }
        return levels;
    }
    
    @computed get levelsGrouped() {
        if (!this.levels || this.levels.length == 0) {
            return false;
        }
        function groupCompare(a, b) {
            if (a.depth < b.depth) {
                return -1;
            } else if (a.depth > b.depth) {
                return 1;
            } else if (a.ontology < b.ontology) {
                return -1;
            } else if (b.ontology < a.ontology) {
                return 1;
            }
            return 0;
        }
        let levels = Object.values(this.levels)
                           .sort(groupCompare);
        if (false && this.rootStore.filtersApplied) {
            levels = levels.filter(level => level.indicators.length > 0)
        }
        return levels;
    }
    
    @computed get allNoLevelIndicators() {
        return this.allIndicators ? this.allIndicators.filter(indicator => !indicator.levelId) : false;
    }
    
    @computed get filteredNoLevelIndicators() {
        return this.filteredIndicators ? this.filteredIndicators.filter(indicator => !indicator.levelId) : false;
    }
    
    @computed get thisReportNotLoaded() {
        return ((this.rootStore.isTVA
                 && this.reportsLoaded.tva.indexOf(String(this.rootStore.selectedFrequencyId)) == -1) ||
                (!this.rootStore.isTVA
                 && this.reportsLoaded.timeperiods.indexOf(String(this.rootStore.selectedFrequencyId)) == -1));
    }
    
    @computed get allIndicators() {
        if (!this.indicators || this.indicators.length == 0) {
            return false;
        } else {
            return Object.values(this.indicators).sort((a, b) => a.sortIndex - b.sortIndex);
        }
    }
    
    @computed get filteredIndicators() {
        let indicators = this.allIndicators;
        if (!indicators) {
            return false;
        }
        indicators = this.rootStore.filterOnTiers(indicators);
        indicators = this.rootStore.filterOnLevelChains(indicators);
        indicators = this.rootStore.filterOnSites(indicators);
        indicators = this.rootStore.filterOnTypes(indicators);
        indicators = this.rootStore.filterOnSectors(indicators);
        indicators = this.rootStore.filterOnIndicatorIds(indicators);
        return indicators;
    }
    
    @computed get reportLevelTiers() {
        if (!this.levelsChain) {
            return [];
        }
        return [...new Set(this.levelsChain.filter(
            level => level.allIndicators && level.allIndicators.length > 0
        ).map(level => ({label: level.tier, value: level.tierPk,
                         sortIndex: level.depth, filterType: 'tier'})
        ).map(JSON.stringify))].map(JSON.parse);
    }

    @computed get reportLevelChains() {
        if (!this.levelsChain) {
            return [];
        }
        let level2s = this.levelsChain.filter(
            level => level.depth == this.rootStore.levelFilterDepth
        );
        let indicatorCounts = {};
        level2s.forEach(
            level2 => indicatorCounts[level2.id] = level2.allIndicators.length
        );
        this.levelsChain.filter(
            level => level.level2parent
        ).forEach(
            level => indicatorCounts[level.level2parent] += level.allIndicators.length
        )
        level2s = level2s.filter(
            level2 => indicatorCounts[level2.id]
        );
        return [...new Set(
            level2s.map(level => ({label: level.optionName, value: level.id,
                         sortIndex: level.sort, filterType: 'level'})
            ).map(JSON.stringify))].map(JSON.parse);
    }
    
    @computed get reportSites() {
        let indicators = this.allIndicators;
        if (!indicators || indicators.length == 0) {
            return [];
        }
        let sites = indicators.map(indicator => indicator.sites)
                        .reduce((pre, cur) => {return pre.concat(cur)})
                        .map((elem) => ({value: elem.pk, label: elem.name}))
                        .filter(elem => elem.label != '');
        return [...new Set(sites.map(JSON.stringify))].map(JSON.parse);
    }
    
    @computed get reportTypes() {
        let indicators = this.allIndicators;
        if (!indicators || indicators.length == 0) {
            return [];
        }
        return [...new Set(
            indicators.map(indicator => indicator.types)
                        .reduce((pre, cur) => {return pre.concat(cur)})
                        .map((elem) => ({value: elem.pk, label: elem.name}))
                        .map(JSON.stringify))].map(JSON.parse);
    }
    
    @computed get reportSectors() {
        let indicators = this.allIndicators;
        if (!indicators || indicators.length == 0) {
            return [];
        }
        return [...new Set(
            indicators.map(
                indicator => JSON.stringify({value: indicator.sector.pk, label:indicator.sector.name}))
            )].map(JSON.parse).filter(elem => elem.label != '');
    }
    
    @computed get reportIndicatorsOptions() {
        let levels = this.rootStore.levelGrouping ? this.levelsGrouped : this.levelsChain;
        if (!levels || levels.length == 0) {
            return [];
        }
        let indicators = levels.map(
            level => ({
                label: level.tier + ' ' + level.displayOntology,
                options: level.allIndicators.map(indicator => ({value: indicator.pk,
                                                               label: `${indicator.numberDisplay}: ${indicator.name}`}))
            })
        );
        return indicators;
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
    @observable levelGrouping = false;
    @observable levelFilters = [];
    @observable tierFilters = [];
    @observable siteFilters = [];
    @observable typeFilters = [];
    @observable sectorFilters = [];
    @observable indicatorFilters = [];
    @observable noIndicatorsForFrequency = false;
    @observable loading = false;
    @observable initialized = false;
    noLevelRowLabel = 'No level';
    reportType = null;
    router = null;
    currentPeriod = null;
    
    headerCols = 8;
    lopCols = 3;
    levelFilterDepth = 2;
    
    
    constructor(contextData, reportAPI) {
        this.programStore = new ProgramStore(this, contextData.programs);
        this.noLevelRowLabel = contextData.labels.noLevelIndicatorsRowLabel;
        this.reportAPI = reportAPI;
        this._periodLabels = {
            [TIMEPERIODS]: contextData.labels.timeperiods,
            [TVA]: contextData.labels.targetperiods,
            names: contextData.labels.periodNames
        };
    }
    
    init = (router) => {
        this.router = router;
        this.loading = true;
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
        this.levelGrouping = params.groupby || 0;
        this.updateUrl('groupby', this.levelGrouping);
        if (reload) {
            router.navigate(router.getState().name, params, {reload: true});
        }
        this.loading = false;
        this.callForData();
    }
    
    updateUrl = (param, newValue) => {
        let oldParams = this.router.getState().params;
        if (newValue !== null && oldParams[param] != newValue) {
            let newParams = { ...oldParams, [param]: newValue };
            this.router.navigate(this.router.getState().name, newParams, {replace: true});
        }
    }
    
    @computed get pinData() {
        if (!this.selectedProgram) {
            return false;
        }
        let queryString = window.location.search;
        queryString = queryString && queryString.length > 0 && queryString[0] == '?' ? queryString.slice(1) : queryString;
        return !this.selectedProgram ? false : {
            program: this.selectedProgram.id,
            report_type: this.router.getState().params.reportType,
            query_string: queryString
        };
    }
    
    @computed get programPageUrl() {
        return this.selectedProgram ? '/program/' + this.selectedProgram.id + '/' : false;
    }
    
    @computed get currentExcelURL() {
        let params = this.router.getState().params;
        let url = '/indicators/iptt_excel/' + window.location.search;
        url += '&programId=' + this.selectedProgram.id;
        url += '&reportType=' + (this.isTVA ? 'tva' : 'timeperiods');
        return url;
    }
    
    @computed get allExcelURL() {
        let params = this.router.getState().params;
        let url = '/indicators/iptt_excel/?frequency=all';
        url += '&programId=' + this.selectedProgram.id;
        url += '&reportType=' + (this.isTVA ? 'tva' : 'timeperiods');
        return url;
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

    @computed get filtersApplied() {
        return (this.levelFilters.length > 0 ||
                this.tierFilters.length > 0 ||
                this.siteFilters.length > 0 ||
                this.typeFilters.length > 0 ||
                this.sectorFilters.length > 0 ||
                this.indicatorFilters.length > 0);
    }
    
    @computed get report() {
        let levels;
        if (this.selectedProgram === null || !this.selectedFrequencyId) {
            return [];
        }
        else if (this.levelGrouping) {
            levels = this.selectedProgram.levelsGrouped;
        } else {
            levels = this.selectedProgram.levelsChain;
        }
        if (this.selectedProgram.filteredNoLevelIndicators &&
            this.selectedProgram.filteredNoLevelIndicators.length > 0) {
            levels = levels.concat([{titleRow: this.noLevelRowLabel,
                                    indicators: this.selectedProgram.filteredNoLevelIndicators}]);
        }
        if (levels && this.filtersApplied) {
            levels = levels.filter(level => level.indicators.length > 0);
        }
        if (levels) {
            return levels;
        }
        return false;
    }
    
    filterOnTiers(indicators) {
        if (this.tierFilters && this.tierFilters.length > 0) {
            let tierDepths = this.tierFilters.map(tierOption => tierOption.sortIndex);
            indicators = indicators.filter(
                (indicator) => tierDepths.indexOf(indicator.tierDepth) != -1
            );
        }
        return indicators;
    }
    
    filterOnLevelChains(indicators) {
        if (this.levelFilters && this.levelFilters.length > 0) {
            let level2Pks = this.levelFilters.map(levelOption => levelOption.value);
            let levelIds = this.selectedProgram.levelsGrouped.filter(
                level => level2Pks.indexOf(level.level2parent) != -1
            ).map( level => level.id );
            indicators = indicators.filter(
                (indicator) => (levelIds.indexOf(indicator.levelId) != -1 || level2Pks.indexOf(indicator.levelId) != -1)
            );
        }
        return indicators;
    }
    
    filterOnTypes(indicators) {
        if (this.typeFilters && this.typeFilters.length > 0) {
            let typePks = this.typeFilters.map(typeOption => typeOption.value);
            indicators = indicators.filter(
                (indicator) => indicator.types.map(iType => iType.pk).filter(pk => typePks.includes(pk)).length > 0
            );
        }
        return indicators;
    }
    
    filterOnSectors(indicators) {
        if (this.sectorFilters && this.sectorFilters.length > 0) {
            indicators = indicators.filter(
                indicator => this.sectorFilters.map(sectorOption => sectorOption.value).indexOf(indicator.sector.pk) != -1
            );
        }
        return indicators;
    }
    
    filterOnSites(indicators) {
        if (this.siteFilters && this.siteFilters.length > 0) {
            let sitePks = this.siteFilters.map(siteOption => siteOption.value);
            indicators = indicators.filter(
                (indicator) => indicator.sites.map(site => site.pk).filter(pk => sitePks.includes(pk)).length > 0
            );
        }
        return indicators;
    }
    
    filterOnIndicatorIds(indicators) {
        if (this.indicatorFilters && this.indicatorFilters.length > 0) {
            indicators = indicators.filter(
                indicator => this.indicatorFilters.map(indicatorOption => indicatorOption.value).indexOf(indicator.pk) != -1
            );
        }
        return indicators;
    }

    callForData = () => {
        if (!this.loading) {
            this.loading = true;
            this.reportAPI.callForData(this.selectedProgram.id, this.selectedFrequencyId, this.isTVA)
                .then((data) => {
                    this.selectedProgram.loadData(data);
                    this.updateFilters();
                    this.loading=false;
                    this.initialized=true;
                    });
        }
    }
    
    updateFilters = () => {
        let params = this.router.getState().params;
        if (params.frequency && this.isTVA
                && this.selectedProgram.frequencies.indexOf(parseInt(params.frequency)) == -1) {
                this.noIndicatorsForFrequency = true;
                this.setFrequencyId(null);
        }
        if (params.levels) {
            let levels = params.levels instanceof(Array) ? params.levels.map(Number) : [params.levels].map(Number);
            this.levelFilters = this.selectedProgram.reportLevelChains.filter(
                levelOption => levels.indexOf(levelOption.value) != -1
            );
            this.updateUrl('levels', this.levelFilters.map(levelOption => levelOption.value));
            if (params.tiers) {
                this.updateUrl('params', []);
            }
        }
        if (params.tiers) {
            let tiers = params.tiers instanceof(Array) ? params.tiers.map(Number) : [params.tiers].map(Number);
            this.tierFilters = this.selectedProgram.reportLevelTiers.filter(
                tierOption => tiers.indexOf(tierOption.value) != -1
            );
            this.updateUrl('tiers', this.tierFilters.map(tierOption => tierOption.value));
        }
        if (params.sites) {
            let sites = params.sites instanceof(Array) ? params.sites.map(Number) : [params.sites].map(Number);
            this.siteFilters = this.selectedProgram.reportSites.filter(
                siteOption => sites.indexOf(siteOption.value) != -1
            );
            this.updateUrl('sites', this.siteFilters.map(siteOption => siteOption.value));
        }
        if (params.types) {
            let theseTypes = params.types instanceof(Array) ? params.types.map(Number) : [params.types].map(Number);
            this.typeFilters = this.selectedProgram.reportTypes.filter(
                typeOption => theseTypes.indexOf(typeOption.value) != -1
            );
            this.updateUrl('types', this.typeFilters.map(typeOption => typeOption.value));
        }
        if (params.sectors) {
            let sectors = params.sectors instanceof(Array) ? params.sectors.map(Number) : [params.sectors].map(Number);
            this.sectorFilters = this.selectedProgram.reportSectors.filter(
                sectorOption => sectors.indexOf(sectorOption.value) != -1
            );
            this.updateUrl('sectors', this.sectorFilters.map(sectorOption => sectorOption.value));
        }
        if (params.indicators) {
            let indicators = params.indicators instanceof (Array) ? params.indicators.map(Number) : [params.indicators].map(Number);
            this.indicatorFilters = this.selectedProgram.reportIndicatorsOptions.filter(
                indicatorOption => indicators.indexOf(indicatorOption.value) != -1
            );
            this.updateUrl('indicators', this.indicatorFilters.map(indicatorOption => indicatorOption.value));
        }
    }
    
    // FILTER SECTION:
    
    //SELECTING PROGRAMS:

    setProgramId(id) {
        if (id === null) {
            this.selectedProgram = null;
        } else if (this.selectedProgram == null || this.selectedProgram.id != id) {
            this.noIndicatorsForFrequency = false;
            this.updateUrl('programId', id);
            this.selectedProgram = this.programStore.getProgram(id);
            if (this.isTVA && this.selectedFrequencyId
                && this.selectedProgram.frequencies.indexOf(parseInt(this.selectedFrequencyId)) == -1) {
                this.noIndicatorsForFrequency = true;
                this.setFrequencyId(null);
            } else if (this.selectedFrequencyId !== null) {
                this.setFrequencyId(this.selectedFrequencyId);
                this.updatePeriods();
            }
            if (this.selectedFrequencyId !== null && !this.report) {
                this.callForData();
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
            if (this.isTVA && this.selectedFrequencyId
                && this.selectedProgram.frequencies.indexOf(parseInt(this.selectedFrequencyId)) != -1) {
                this.noIndicatorsForFrequency = false;
            }
            // refresh periods to make sure they're in range:
            this.updatePeriods();
            this.updateCurrentPeriod();
            // call for data if not loaded:
            if (this.selectedProgram.thisReportNotLoaded) {
                this.callForData();
            }
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
    
    setLevelGrouping = (value) => {
        this.levelGrouping = value == 1;
        this.updateUrl('groupby', value);
    }
    
    setLevelFilters = (selected) => {
        this.levelFilters = selected;
        this.tierFilters = [];
        this.updateUrl('levels', selected.map(item => item.value));
        this.updateUrl('tiers', []);
    }
    
    setTierFilters = (selected) => {
        this.levelFilters = [];
        this.tierFilters = selected;
        this.updateUrl('tiers', selected.map(item => item.value));
        this.updateUrl('levels', []);
   }
    
    setSiteFilters = (selected) => {
        this.siteFilters = selected;
        this.updateUrl('sites', selected.map(item => item.value));
    }
    
    setTypeFilters = (selected) => {
        this.typeFilters = selected;
        this.updateUrl('types', selected.map(item => item.value));
    }
    
    setSectorFilters = (selected) => {
        this.sectorFilters = selected;
        this.updateUrl('sectors', selected.map(item => item.value));
    }
    
    setIndicatorFilters = (selected) => {
        this.indicatorFilters = selected;
        this.updateUrl('indicators', selected.map(item => item.value));
    }
    
    clearFilters = () => {
        this.levelFilters = this.siteFilters = this.typeFilters = this.sectorFilters = this.tierFilters = this.indicatorFilters = [];
        this.updateUrl('levels', []);
        this.updateUrl('tiers', []);
        this.updateUrl('sites', []);
        this.updateUrl('types', []);
        this.updateUrl('sectors', []);
        this.updateUrl('indicators', []);
    }
    
}