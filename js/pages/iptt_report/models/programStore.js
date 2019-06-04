import { observable, computed } from 'mobx';
import { TVA, TIMEPERIODS, GROUP_BY_CHAIN, GROUP_BY_LEVEL, TIME_AWARE_FREQUENCIES } from '../../../constants';

const _gettext = (typeof gettext !== 'undefined') ?  gettext : (s) => s;

class Indicator {
    program = null;
    pk = null;
    levelpk = null;
    number = null;
    name = null;
    unitOfMeasure = null;
    directionOfChange = null;
    cumulative = null;
    unitType = null;
    baseline = null;
    typePks = [];
    sitePks = [];
    sectorPk = null;
    lopTarget = null;
    lopActual = null;
    lopMet = null;
    frequency = null;
    sortIndex = null;
    reportData = {
        [TIMEPERIODS]: {},
        [TVA]: {}
    };

    constructor(indicatorJSON, program) {
        this.pk = parseInt(indicatorJSON.pk);
        this.number = indicatorJSON.number || indicatorJSON.old_number;
        this.name = indicatorJSON.name;
        this.unitOfMeasure = indicatorJSON.unitOfMeasure;
        this.directionOfChange = indicatorJSON.directionOfChange;
        this.cumulative = indicatorJSON.cumulative;
        this.unitType = indicatorJSON.unitType;
        this.baseline = indicatorJSON.baseline;
        this.typePks = indicatorJSON.indicatorTypes.map(indicatorType => parseInt(indicatorType.pk));
        this.sitePks = indicatorJSON.sites.map(site => parseInt(site.pk));
        this.sectorPk = (indicatorJSON.sector && indicatorJSON.sector.pk && parseInt(indicatorJSON.sector.pk));
        this.lopTarget = parseFloat(indicatorJSON.lopTarget);
        this.lopActual = parseFloat(indicatorJSON.lopActual);
        this.lopMet = (indicatorJSON.lopMet && !isNaN(parseFloat(indicatorJSON.lopMet))) ?
                        parseFloat(indicatorJSON.lopMet)*100 : null;
        this.frequency = parseInt(indicatorJSON.frequency);
        this.loadReportData(indicatorJSON.reportData);
        this.sortIndex = parseInt(indicatorJSON.sortIndex);
        this.levelpk = parseInt(indicatorJSON.levelpk) || null;
        this.program = program;
    }
    
    loadReportData(reportJSON) {
        if (reportJSON.timeperiods) {
            Object.keys(reportJSON.timeperiods)
                .forEach(frequency => {
                    this.reportData[TIMEPERIODS][frequency] = reportJSON.timeperiods[frequency].map(
                        result => parseFloat(result)
                    )});
        }
        if (reportJSON.tva) {
            Object.keys(reportJSON.tva)
                .forEach(frequency => {
                    this.reportData[TVA][frequency] = reportJSON.tva[frequency].map(
                        resultSet => ({
                            target: parseFloat(resultSet.target),
                            actual: parseFloat(resultSet.value),
                            met: (
                            ((resultSet.target && !isNaN(parseFloat(resultSet.target))) &&
                             (resultSet.value && !isNaN(parseFloat(resultSet.value)) &&
                              parseFloat(resultSet.target) != 0)) ?
                                    parseFloat(resultSet.value)/parseFloat(resultSet.target) * 100 : null
                                 )
                                 })
                    )
                })
        }
    }
    
    get level() {
        return this.program.getLevel(this.levelpk);
    }
    
    get levelName() {
        return this.level ? this.level.name : null;
    }

}

class Level {
    program = null;
    pk = null;
    name = null;
    _sort = null;

    constructor(levelJSON, program) {
        this.program = program;
        this.pk = parseInt(levelJSON.pk);
        this.name = levelJSON.name;
        this._sort = parseInt(levelJSON.sort);
    }
    
    @computed get indicators() {
        return this.program.indicators.filter(indicator => indicator.levelpk == this.pk);
    }

}

class OldLevel extends Level {
    @computed get sort() {
        return this._sort;
    }
}

class NewLevel extends Level {
    tierPk = null;
    ontology = null;
    sortOntology = null;
    depth = null;
    _level2parent = null;
    _parent = null;
    
    constructor(levelJSON, program) {
        super(levelJSON, program);
        this.tierPk = parseInt(levelJSON.tierPk);
        this.ontology = levelJSON.ontology;
        this.sortOntology = levelJSON.sort_ontology;
        this.depth = parseInt(levelJSON.depth);
        this._level2parent = parseInt(levelJSON.level2parent);
        this._parent = parseInt(levelJSON.parent);
    }
    
    get tier() {
        return this.program.getTier(this.tierPk);
    }
    
    get outcomeChainDisplay() {
        return `${this.tier.name} ${this.sort} and sub-levels: ${this.name}`;
    }
    
    get childLevels() {
        return this.program.levels.filter(level => level._parent == this.pk);
    }
    
    @computed get sort() {
        return this.sortOntology || this._sort;
    }
}

class Tier {
    program = null;
    pk = null;
    name = null;
    depth = null;
    constructor(levelJSON, program) {
        this.program = program;
        this.pk = parseInt(levelJSON.tierPk);
        this.name = levelJSON.tier;
        this.depth = parseInt(levelJSON.depth);
    }
    
    @computed get levels() {
        return this.program.levels.filter(level => level.tierPk == this.pk);
    }
    
}


class Period {
    index = null;
    start = null;
    end = null;
    current = null;
    name = null;
    display = null;
    range = null;
    constructor(periodJSON, index, frequency) {
        this.index = index;
        this.start = new Date(periodJSON[0]);
        this.end = new Date(periodJSON[1]);
        this.startDisplay = periodJSON[0];
        this.endDisplay = periodJSON[1];
        if (TIME_AWARE_FREQUENCIES.includes(frequency)) {
            this.current = frequency === 7 ?
                periodJSON.length > 4 && (periodJSON[4] === true || periodJSON[4] === "True") :
                periodJSON.length > 2 && (periodJSON[2] === true || periodJSON[2] === "True");
            switch (frequency) {
                case 3:
                    this.name = `${_gettext('Year')} ${index + 1}`;
                    this.range = `${periodJSON[0]} - ${periodJSON[1]}`;
                    this.display = `${this.name} (${this.range})`;
                    break;
                case 4:
                    this.name = `${_gettext('Semi-annual period')} ${index + 1}`;
                    this.range = `${periodJSON[0]} - ${periodJSON[1]}`;
                    this.display = `${this.name} (${this.range})`;
                    break;
                case 5:
                    this.name = `${_gettext('Tri-annual period')} ${index+1}`;
                    this.range = `${periodJSON[0]} - ${periodJSON[1]}`;
                    this.display = `${this.name} (${this.range})`;
                    break;
                case 6:
                    this.name = `${_gettext('Quarter')} ${index+1}`;
                    this.range = `${periodJSON[0]} - ${periodJSON[1]})`;
                    this.display = `${this.name} (${this.range})`;
                    break;
                case 7:
                    this.name = `${periodJSON[2]} ${periodJSON[3]}`;
                    this.range = false;
                    this.display = this.name;
                    break;
            }
        }
        if (frequency === 2 || frequency === 8) {
            this.name = periodJSON[2];
        }
    }

    startAfter(date) {
        if (this.start.getUTCFullYear() < date.getUTCFullYear()) {
            return false;
        } else if (this.start.getUTCFullYear() > date.getUTCFullYear()) {
            return true;
        } else if (this.start.getUTCMonth() < date.getUTCMonth()) {
            return false;
        } else if (this.start.getUTCMonth() > date.getUTCMonth()) {
            return true;
        } else if (this.start.getUTCDate() < date.getUTCDate()) {
            return false;
        }
        return true;
    }
    
    endBefore(date) {
        if (this.end.getUTCFullYear() > date.getUTCFullYear()) {
            return false;
        } else if (this.end.getUTCFullYear() < date.getUTCFullYear()) {
            return true;
        } else if (this.end.getUTCMonth() > date.getUTCMonth()) {
            return false;
        } else if (this.end.getUTCMonth() < date.getUTCMonth()) {
            return true;
        } else if (this.end.getUTCDate() > date.getUTCDate()) {
            return false;
        }
        return true;
    }
    
    get year() {
        return this.start.getUTCFullYear();
    }
}

class PeriodRange {
    frequency = null;
    periods = [];
    constructor(frequency, periodsJSON) {
        this.frequency = parseInt(frequency);
        this.periods = periodsJSON.map((periodJSON, index) => new Period(periodJSON, index, this.frequency));
    }
    
    get currentPeriods() {
        return this.periods.filter(period => !period.current);
    }
    
    periodRange(startPeriod, endPeriod) {
        return this.periods.slice(startPeriod, endPeriod + 1);
    }
    
    startAfter(date) {
        return this.periods.filter(period => period.startAfter(date));
    }
    
    endBefore(date) {
        return this.periods.filter(period => period.endBefore(date));
    }
    
    filter(filterFn) {
        return this.periods.filter(filterFn);
    }
    
    getPeriod = ({
        startAfter = null,
        endBefore = null,
        current = null,
        last = null,
        index = null
        } = {}) => {
        if (startAfter !== null) {
            return this.startAfter(startAfter)[0];
        } else if (endBefore !== null) {
            return this.endBefore(endBefore).slice(-1)[0];
        } else if (current !== null) {
            return this.currentPeriods.slice(-1)[0];
        } else if (last !== null) {
            return this.periods.slice(-1)[0];
        } else if (index !== null) {
            return this.periods[index];
        }
    }
}

class Program {
    @observable pk = null;
    @observable name = null;
    @observable frequencies = [];
    @observable validTVA = false;
    @observable validTIMEPERIODS = true;
    @observable periods = {};
    @observable oldLevels = false;
    @observable initialized = {
        [TVA]: [],
        [TIMEPERIODS]: []
    };
    @observable calls = {
        [TVA]: {},
        [TIMEPERIODS]: {}
    };
    @observable _levels = {};
    @observable _tiers = {};
    @observable _sites = {};
    @observable _sectors = {};
    @observable _types = {};
    @observable _indicators = {};

    constructor(JSON) {
        this.pk = parseInt(JSON.id);
        this.name = JSON.name;
        this.frequencies = JSON.frequencies.map(Number);
        this.validTVA = this.frequencies.length > 0;
        this.validTIMEPERIODS = true;
        this.oldLevels = JSON.old_style_levels === true || JSON.old_style_levels === "True";
        Object.entries(JSON.periodDateRanges)
            .forEach(([frequency, periodsJSON]) => {
                this.periods[parseInt(frequency)] = new PeriodRange(frequency, periodsJSON);
            });
    }
    
    getIndicator = ( indicatorPk ) => {
        if (this._indicators[indicatorPk] && this._indicators[indicatorPk] !== undefined) {
            return this._indicators[indicatorPk];
        }
        return {};
    }
    
    loadReportData = ( reportJSON ) => {
        this.addLevels(reportJSON.levels);
        if (reportJSON.indicators && Array.isArray(reportJSON.indicators)) {
            reportJSON.indicators.forEach(indicatorJSON => {
                let indicatorPk = parseInt(indicatorJSON.pk);
                if (indicatorJSON.sector && indicatorJSON.sector.pk) {
                    let sectorPk = parseInt(indicatorJSON.sector.pk);
                    if (this._sectors[sectorPk] === undefined) {
                        this._sectors[sectorPk] = {
                            pk: sectorPk,
                            name: indicatorJSON.sector.name || ''
                        };
                    }
                }
                if (indicatorJSON.sites && Array.isArray(indicatorJSON.sites)) {
                    indicatorJSON.sites.forEach(siteJSON => {
                        let sitePk = parseInt(siteJSON.pk);
                        if (this._sites[sitePk] === undefined) {
                            this._sites[sitePk] =  {
                                pk: sitePk,
                                name: siteJSON.name
                            };
                        }
                    });
                }
                if (indicatorJSON.indicatorTypes && Array.isArray(indicatorJSON.indicatorTypes)) {
                    indicatorJSON.indicatorTypes.forEach(typeJSON => {
                        let typePk = parseInt(typeJSON.pk);
                        if (this._types[typePk] === undefined) {
                            this._types[typePk] = {
                                pk: typePk,
                                name: typeJSON.name
                            };
                        }
                    });
                }
                if (this._indicators[indicatorPk] && this._indicators[indicatorPk].pk === indicatorPk) {
                    this._indicators[indicatorPk].loadReportData(indicatorJSON.reportData);
                } else {
                    this._indicators[indicatorPk] = new Indicator(indicatorJSON, this);
                }
            });
        }
        this.initialized[parseInt(reportJSON.reportType)].push(parseInt(reportJSON.reportFrequency));
        this.calls[parseInt(reportJSON.reportType)][parseInt(reportJSON.reportFrequency)] = false;
    }
    
    validFrequency = ( frequency ) => {
        return this.frequencies.includes(frequency);
    }
    
    periodsFor =  ( frequency ) => {
        return this.periods[parseInt(frequency)];
    }
    
    currentPeriod = ( frequency ) => {
        return this.periodsFor(frequency).getPeriod({current: true});
    }
    
    lastPeriod = ( frequency ) => {
        return this.periodsFor(frequency).getPeriod({last: true});
    }
    
    isLoaded = ( reportType, frequency ) => {
        return this.initialized[reportType].includes(frequency);
    }
    
    isLoading = ( reportType, frequency ) => {
        let loadingValue = this.calls[reportType][frequency];
        if (loadingValue === undefined || loadingValue === false) {
            return false;
        }
        return loadingValue;
    }
    
    setLoading = ( reportType, frequency, call ) => {
        this.calls[reportType][frequency] = call;
    }
    
    addLevels = ( levelsJSON ) => {
        if (!this.oldLevels) {
            levelsJSON.forEach(levelJSON => {
                let levelPk = parseInt(levelJSON.pk);
                if (!isNaN(levelPk)) {
                    this._levels[levelPk] = new NewLevel(levelJSON, this);
                    let tierPk = parseInt(levelJSON.tierPk);
                    if (!isNaN(tierPk)) {
                        if (!this._tiers[tierPk]) {
                            this._tiers[tierPk] = new Tier(levelJSON, this);
                        }
                    }
                }
            });
        } else {
            levelsJSON.forEach(levelJSON => {
                let levelPk = parseInt(levelJSON.pk);
                if (!isNaN(levelPk)) {
                    this._levels[levelPk] = new OldLevel(levelJSON, this);
                }
            });
        }
    }
    
    getLevel = ( pk ) => {
        pk = parseInt(pk);
        return this._levels[pk] !== undefined ? this._levels[pk] : null;
    }
    
    getTier = ( pk ) => {
        pk = parseInt(pk);
        return this._tiers[pk] !== undefined ? this._tiers[pk] : null;
    }
    
    @computed get levels() {
        return this._levels && Object.values(this._levels);
    }
    
    @computed get tiers() {
        return !this.oldLevels && this._tiers && Object.values(this._tiers).sort((x, y) => x.depth - y.depth);
    }
    
    @computed get resultChainFilterLabel() {
        return this.tiers && this.tiers.length > 1 && `by ${this.tiers[1].name} chain`;
    }
    
    @computed get types() {
        return this._types && Object.values(this._types);
    }
    
    @computed get sectors() {
        return this._sectors && Object.values(this._sectors);
    }
    
    @computed get sites() {
        return this._sites && Object.values(this._sites);
    }
    
    @computed get indicators() {
        return this._indicators && Object.values(this._indicators);
    }
    
    @computed get unassignedIndicators() {
        return this.indicators.filter(indicator => indicator.level === null)
    }
    
    validLevel = (level) => this._levels[level] !== undefined
    
    validTier = (tier) => !this.oldLevels && this._tiers[tier] !== undefined;
    
    validType = (type) => this._types[type] !== undefined;
    
    validSite = (site) => this._sites[site] !== undefined;
    
    validSector = (sector) => this._sectors[sector] !== undefined;
    
    validIndicator = (indicator) => this._indicators[indicator] !== undefined;
    
    @computed get programPageUrl() {
        return `/program/${this.pk}/`;
    }
    
}

/* Export for testing: */
export { Program, PeriodRange, Period };

export default class ProgramStore {
    @observable _programs = {};
    api = null;

    constructor(contextData, api) {
        this.api = api;
        this.addPrograms(contextData.programs);
        if (contextData.reportData !== undefined) {
            this.getProgram( parseInt(contextData.reportData.programId) )
                .loadReportData(contextData.reportData);
        }
    }

    /**
     * used at init - runs through program JSON and stores validated JSON data as program objects
     */
    addPrograms = (programsJSON) => {
        programsJSON.forEach((programJSON) => {
            this.addProgram(programJSON);
        });
    }
    
    /**
     * stores one program's JSON data as a new program object
     */
    addProgram = (programJSON) => {
        this._programs[programJSON.id] = new Program(programJSON);
    }
    
    @computed get programs() {
        return Object.values(this._programs).sort(this.sortByName);
    }
    
    /**
     * returns a validator function for the specified report type to check ids for validity against
     */
    validProgramId = ( reportType ) => {
        return (id) => this.programs.filter(reportType === TVA ? program => program.validTVA : program => program.validTIMEPERIODS)
            .map(program => program.pk)
            .includes(id);
    }

    /**
     * Return all program objects for a given report type
     */
    getPrograms = ( reportType ) => {
        return this.programs.filter(reportType === TVA ? program => program.validTVA : program=>program.validTIMEPERIODS);
    }

    getProgram = ( id ) => {
        return this._programs[id];
    }
    
    loadProgram = ( reportType, id, frequency ) => {
        if (this.getProgram(id).isLoaded(reportType, frequency)) {
            return Promise.resolve(this.getProgram(id));
        } else if (this.getProgram(id).isLoading(reportType, frequency) !== false) {
            return Promise.resolve(this.getProgram(id).isLoading(reportType, frequency));
        }
        const dataHandler = this.getProgram(id).loadReportData;
        let call = this.api.callForReportData( reportType, id, frequency )
                    .then(dataHandler);
        this.getProgram(id).setLoading(reportType, frequency, call);
        return call;
    }
    
    getLoadedProgram = ( reportType, id, frequency ) => {
        return this.loadProgram(reportType, id, frequency).then(() => this.getProgram(id));
    }

    sortByName = ( programA, programB ) => {
        return programA.name > programB.name ? 1
                    : programB.name < programA.name ? -1
                        : 0;
    }
}