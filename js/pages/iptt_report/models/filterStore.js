import { observable, action, computed, reaction } from 'mobx';
import {
    TVA,
    TIMEPERIODS,
    GROUP_BY_CHAIN,
    GROUP_BY_LEVEL,
    BLANK_OPTION,
    TIME_AWARE_FREQUENCIES,
    getPeriodLabels
} from '../../../constants';

import { flattenArray, ensureNumericArray } from '../../../general_utilities';

const _gettext = (typeof gettext !== 'undefined') ?  gettext : (s) => s;

const {targetperiodLabels, timeperiodLabels } = getPeriodLabels();

export default class FilterStore {
    programStore = null;
    @observable _reportType = null;
    @observable _programId = null;
    @observable _frequencyId = null;
    @observable _startPeriod = null;
    @observable _endPeriod = null;
    @observable _groupBy = null;
    @observable _levels = [];
    @observable _tiers = [];
    @observable _sites = [];
    @observable _sectors = [];
    @observable _types = [];
    @observable _indicators = [];
    @observable _latchMostRecent = false;
    _oldShowAll = null;
    _oldMostRecent = null;
    

    constructor(programStore) {
        this.programStore = programStore;
        const reportChange = reaction(
            () => this.frequencyId !== null && [this.reportType, this.programId, this.frequencyId],
            (reportParams) => {this._reportParamsUpdated(reportParams);}
        );
    }

    set reportType(reportType) {
        reportType = parseInt(reportType);
        if (reportType && [TVA, TIMEPERIODS].includes(reportType)) {
            this._reportType = reportType;
        } else {
            this._reportType = null;
        }
    }

    @computed get reportType() {
        return this._reportType;
    }
    
    @computed get isTVA() {
        return this.reportType === TVA;
    }
    
    /* returns a function which will check program IDs for validity given the report type:
     * - for timeperiods: does the program exist and have indicators
     * - for tva: does the program exist and have indicators in TVA frequencies
     */
    @computed get _validProgramId() {
        return this.programStore.validProgramId(this._reportType);
    }
    
    set programId(programId) {
        programId = parseInt(programId);
        if (this._validProgramId(programId)) {
            this.updateTransitionParams()
            this._programId = programId;
        }
    }
    
    @computed get programId() {
        return this._programId;
    }
    
    @computed get program() {
        if (this._programId !== null) {
            return this.programStore.getProgram(this._programId);
        }
        return null;
    }
    
    /* Whether the frequency selector is disabled */
    @computed get frequencyDisabled() {
        return !(this.program !== null);
    }

    /* Internally checks if frequency is valid selection before saving
     *  - must be time-aware for Timeperiods report
     *  - must be a valid frequency for the program for TVA report
     */
    _validFrequency = (frequencyId) => {
        if (frequencyId && this.program) {
            if (this.isTVA) {
                return this.program.validFrequency(frequencyId);
            } else {
                return TIME_AWARE_FREQUENCIES.includes(frequencyId);
            }
        }
        return false;
    }
    
    set frequencyId(frequencyId) {
        frequencyId = parseInt(frequencyId);
        if (this._validFrequency(frequencyId)) {
            this.updateTransitionParams()
            this._frequencyId = frequencyId;
        }
    }
    
    @computed get frequencyId() {
        if (this._frequencyId) {
            return this._frequencyId;
        }
        return null;
    }
    
    /* Returns a promise to be completed after programStore loads the program from the API call
     * promise will immediately complete if the program is already loaded
     */
    getLoadedProgram() {
        this.updateTransitionParams();
        if (this.reportType && this.program && this.frequencyId) {
            return this.programStore.getLoadedProgram(
                this.reportType, this.programId, this.frequencyId
            );
        } else {
            return Promise.reject(false);
        }
    }
    
    @computed get programIsLoaded() {
        if (this.frequencyId) {
            return this.program.isLoaded(this.reportType, this.frequencyId);
        }
        return false;
    }
    
    updateTransitionParams() {
        this._oldShowAll = this.showAll;
        this._oldMostRecent = this.mostRecent;
        this._latchMostRecent = false;
    }
    
    clearTransitionParams() {
        this._oldShowAll = null;
        this._oldMostRecent = null;
    }
    
    get oldShowAll() {
        return this._oldShowAll;
    }
    
    get oldMostRecent() {
        return this._oldMostRecent;
    }
    
    
    /* Action to take (as a reaction) when report type, program id, or frequencyid change
     * contains logic for:
     *  - updating the program in the programstore (including api call if necessary)
     *  - making sure the new frequency is valid (and if not replacing with one that is)
     *  - updating start and end periods to make sense in the new frequency
     *  - clearing indicator filters
     */
    @action _reportParamsUpdated([reportType, programId, frequencyId]) {
        this.programStore.loadProgram(reportType, programId, frequencyId)
            .then(() => {
                const showAll = this.oldShowAll;
                const mostRecent = this.oldMostRecent;
                this.clearTransitionParams();
                this.frequencyId = this.frequencyId || null;
                if (!this._validFrequency(frequencyId)) {
                    this.frequencyId = this.isTVA ?
                        this.program.frequencies[0] :
                        TIME_AWARE_FREQUENCIES[0];
                    this.showAll = true;
                }
                if (showAll) {
                    this.showAll = true;
                } else if (mostRecent !== false) {
                    this.mostRecent = mostRecent;
                } else {
                    this.startPeriod = this.startPeriod || 0;
                    this.endPeriod = this.endPeriod || this.lastPeriod.index;
                }
                if (this.reportType === TVA && this.indicators && this.indicators.length > 0) {
                    this.indicators = [];
                }
            });
    }

    /* Whether the start and end period selectors are enabled */    
    @computed get periodsDisabled() {
        let ret = !(TIME_AWARE_FREQUENCIES.includes(this.frequencyId));
        return ret;
    }
    
    /* Returns all periods for the given program and frequency
     *   Note this returns a PeriodRange (see ./programStore.js for details)
     */
    @computed get periods() {
        if (this.frequencyId && this.frequencyId !== 1) {
            return this.program.periodsFor(this.frequencyId);
        }
        return null;
    }

    /* Returns the last period for the current program/frequency (for setting end) */
    @computed get lastPeriod() {
        if (this.frequencyId) {
            return this.program.lastPeriod(this.frequencyId);
        }
        return null;
    }

    /* "Current" here means most recently completed (for calculating most recent x periods) */
    @computed get currentPeriod() {
        if (this.frequencyId) {
            return this.program.currentPeriod(this.frequencyId);
        }
        return null;
    }
    
    set startPeriod(startPeriod) {
        if (this.lastPeriod !== null) {
            this._startPeriod = Math.max(0, Math.min(this.lastPeriod.index, startPeriod));
            this._latchMostRecent = false;
            if (this.endPeriod && this._startPeriod > this.endPeriod) {
                this.endPeriod = startPeriod;
            }
        }
    }
    
    @computed get startPeriod() {
        if (!this.periodsDisabled && this.lastPeriod !== null && this._startPeriod <= this.lastPeriod.index) {
            return this._startPeriod;
        }
        return null;
    }
    
    set endPeriod(endPeriod) {
        if (this.lastPeriod !== null) {
            this._endPeriod = Math.max((this.startPeriod || 0), Math.min(this.lastPeriod.index, endPeriod));
            this._latchMostRecent = false;
        }
    }
    
    @computed get endPeriod() {
        if (!this.periodsDisabled && this.lastPeriod !== null && this._endPeriod <= this.lastPeriod.index) {
            return this._endPeriod;
        }
        return null;
    }
    
    set showAll(showAll) {
        if (showAll === true && this.lastPeriod) {
            this.startPeriod = 0;
            this.endPeriod = this.lastPeriod.index;
            this._latchMostRecent = false;
        }
    }
    
    @computed get _internalShowAll() {
        return (
            this.startPeriod === 0 && this.lastPeriod && this.endPeriod === this.lastPeriod.index
            );
    }
    
    @computed get showAll() {
        return (
            !this._latchMostRecent && this._internalShowAll
            );
    }
    
    set mostRecent(count) {
        if (this.currentPeriod) {
            this.endPeriod = this.currentPeriod.index;
            this.startPeriod = Math.max(0, this.currentPeriod.index - (parseInt(count) || 2) + 1);
            this._latchMostRecent = this._internalShowAll;
        }
    }
    
    @computed get mostRecent() {
        if (!this.showAll && this.currentPeriod && this.endPeriod === this.currentPeriod.index) {
            return this.currentPeriod.index - this.startPeriod + 1;
        }
        return false;
    }

    /* Added so that the most recent display can bypass show-all logic and display a value */
    @computed get _mostRecentValue() {
        if (this.currentPeriod && this.endPeriod === this.currentPeriod.index) {
            return this.currentPeriod.index - this.startPeriod + 1;
        }
        return false;
    }
    
    setStartPeriodFromDate(dateObj) {
        if (this.periods) {
            this.startPeriod = this.periods.getPeriod({startAfter: dateObj}).index;
        }
        return null;
    }
    
    setEndPeriodFromDate(dateObj) {
        if (this.periods) {
            this.endPeriod = this.periods.getPeriod({endBefore: dateObj}).index;
        }
        return null;
    }
    
    /* whether the program is using old-style (non-satsuma) levels */
    @computed get oldLevels() {
        if (this.program !== null) {
            return this.program.oldLevels;
        }
        return null;
    }

    @computed get groupByDisabled() {
        return this.oldLevels !== false;
    }
    
    set groupBy(groupBy) {
        if ([GROUP_BY_CHAIN, GROUP_BY_LEVEL].includes(parseInt(groupBy))) {
            this._groupBy = parseInt(groupBy);
        }
    }
    
    @computed get groupBy() {
        if (!this.groupByDisabled) {
            return this._groupBy || GROUP_BY_CHAIN;
        }
        return null;
    }
    
    @computed get resultChainFilterLabel() {
        return this.program.resultChainFilterLabel;
    }
    
    /* whether the lower-half filters (which filter visible indicators) are enabled
     * Logic: they are enabled when the program is fully loaded for this frequency
     */
    @computed get filtersDisabled() {
        return !(this.programIsLoaded);
    }
    
    /* Levels = old-style levels (assigned pk manually in views_reports.py)
     * or new style levels (specific rf level items, i.e. Output 1.1) by pk
     */
    set levels(levels) {
        if (!this.filtersDisabled && ensureNumericArray(levels)) {
            this._levels = ensureNumericArray(levels);
            this._tiers = [];
        } else {
            this._levels = [];
        }
    }
    
    @computed get levels() {
        if (!this.filtersDisabled && this._levels && this._levels.length > 0) {
            return this._levels.filter(this.program.validLevel);
        }
        return [];
    }
    
    /* Tiers: only for new style levels, the leveltier (i.e. Outcome) */
    set tiers(tiers) {
        if (!this.filtersDisabled && !this.groupByDisabled && ensureNumericArray(tiers)) {
            this._tiers = ensureNumericArray(tiers);
            this._levels = [];
        } else {
            this._tiers = [];
        }
    }
    
    @computed get tiers() {
        if (!this.filtersDisabled && this._tiers &&
            this._tiers.length > 0 && !this.groupByDisabled) {
            return this._tiers.filter(this.program.validTier);
        }
        return [];
    }
    
    set sites(sites) {
        if (!this.filtersDisabled && ensureNumericArray(sites)) {
            this._sites = ensureNumericArray(sites);
        } else {
            this._sites = [];
        }
    }
    
    @computed get sites() {
        if (!this.filtersDisabled && this._sites && this._sites.length > 0) {
            return this._sites.filter(this.program.validSite);
        }
        return [];
    }
    
    /* "Types" as in Indicator Types (i.e. Custom/donor) */
    set types(types) {
        if (!this.filtersDisabled && ensureNumericArray(types)) {
            this._types = ensureNumericArray(types);
        } else {
            this._types = [];
        }
    }
    
    @computed get types() {
        if (!this.filtersDisabled && this._types && this._types.length > 0) {
            return this._types.filter(this.program.validType);
        }
        return [];
    }
    
    set sectors(sectors) {
        if (!this.filtersDisabled && ensureNumericArray(sectors)) {
            this._sectors = ensureNumericArray(sectors);
        } else {
            this._sectors = [];
        }
    }
    
    @computed get sectors() {
        if (!this.filtersDisabled && this._sectors && this._sectors.length > 0) {
            return this._sectors.filter(this.program.validSector);
        }
        return [];
    }
    
    /* setting indicator PKs for filtering ( show only those indicators) */
    set indicators(indicators) {
        if (!this.filtersDisabled && ensureNumericArray(indicators)) {
            this._indicators = ensureNumericArray(indicators);
        } else {
            this._indicators = [];
        }
    }
    
    @computed get indicators() {
        if (!this.filtersDisabled && this._indicators && this._indicators.length > 0) {
            return this._indicators.filter(this.program.validIndicator);
        }
        return [];
    }
    
    /** OPTION providers for select widgets: ******/
    
    
    @computed get programOptions() {
        let programs = this.reportType && this.programStore.getPrograms(this.reportType);
        return (programs && programs.length > 0)
                    ? programs.map(program => ({value: program.pk, label: program.name}))
                    : [BLANK_OPTION];
    }
    
    @computed get selectedProgramOption() {
        if (this.program) {
            return {
                value: this.programId,
                label: this.program.name
            };
        }
        return null;
    }
    
    @computed get frequencyOptions() {
        if (this.program && this.reportType === TIMEPERIODS) {
            return TIME_AWARE_FREQUENCIES.map(pk => ({value: pk, label: timeperiodLabels[pk]}));
        } else if (this.program && this.reportType === TVA) {
            return this.program.frequencies.filter(pk => pk !== 8)
                .map(pk => ({value: pk, label: targetperiodLabels[pk]}));
        } else {
            return [BLANK_OPTION];
        }
    }
    
     @computed get selectedFrequencyOption() {
        if (this.frequencyId) {
            return {
                value: this.frequencyId,
                label: this.isTVA ? targetperiodLabels[this.frequencyId]
                                : timeperiodLabels[this.frequencyId]
            };
        } else {
            return BLANK_OPTION;
        }
    }

    _getPeriodOptions(periodFilter) {
        if (!this.frequencyId || !TIME_AWARE_FREQUENCIES.includes(this.frequencyId)) {
            return [BLANK_OPTION];
        } else if (this.frequencyId == 3) {
            // years don't have year-based opt-groups:
            return this.periods.filter(periodFilter).map(
                period => ({label:period.display, value: period.index})
            );
        } else {
            let periods = this.periods.filter(periodFilter);
            // all non-annual time-aware frequencies are opt-grouped by year:
            let years = Array.from(new Set(this.periods.filter(periodFilter)
                                            .map(period => period.year))).sort();
            return years.map(
                year => {
                    let options = periods.filter(period => period.year === year)
                                    .map(period => ({label: period.display, value: period.index}));
                    return {
                        label: year,
                        options: options
                    };
                });
        }
    }
    
    @computed get startOptions() {
        return this._getPeriodOptions(() => true);
    }
    
    /* Label for the date section under the title of the report */
    @computed get startPeriodLabel() {
        if (this.startPeriod !== null) {
            return this.periods.getPeriod({index: this.startPeriod}).startDisplay;
        }
        if (this.frequencyId === 1 || this.frequencyId === 2) {
            return this.program.reportingStart;
        }
        return null;
    }
    
    @computed get endOptions() {
        const periodFilter = (period) => period.index >= this.startPeriod;
        return this._getPeriodOptions(periodFilter);
    }
    
    /* Label for the date section under the title of the report */
    @computed get endPeriodLabel() {
        if (this.endPeriod !== null) {
            return this.periods.getPeriod({index: this.endPeriod}).endDisplay;
        }
        if (this.frequencyId === 1 || this.frequencyId === 2) {
            return this.program.reportingEnd;
        }
        return null;
    }
    
    
    @computed get levelOptions() {
        if (!this.filtersDisabled && this.groupByDisabled) {
            // old-style (non-RF) levels:
            let availableLevels = this.levels.concat(
                this.filterIndicators(this.program.indicators, 'levels').map(
                    indicator => indicator.level ? indicator.level.pk : null
            ));
            return this.program.levels.filter(
                    level => availableLevels.includes(level.pk)
                ).sort((x, y) => x.pk - y.pk)
                .map(level => ({value: level.pk, label: level.name, filterType: 'level'}));
        } else if (!this.filtersDisabled) {
            // new style levels and leveltiers:
            let availableTiers = this.tiers.concat(
                this.filterIndicators(this.program.indicators, 'levels').map(
                    indicator => indicator.level ? indicator.level.tierPk : null
            ));
            let tiers = this.program.tiers.filter(
                tier => availableTiers.includes(tier.pk)
            );
            let availableLevels = flattenArray(this.levels.concat(
                this.filterIndicators(this.program.indicators, 'levels').map(
                    indicator => indicator.level ? [indicator.level.pk, indicator.level._level2parent] : []
                )
            ));
            let levels = this.program.levels.filter(
                level => availableLevels.includes(level.pk)
            );
            let options = [];
            if (tiers && tiers.length > 0) {
                options.push({
                    label: '',
                    options: tiers.sort((x, y) => x.depth - y.depth)
                                .map(tier => ({value: tier.pk, label: tier.name, filterType: 'tier'}))
                });
            }
            if (levels && levels.length > 0) {
                options.push({
                    label: _gettext('Outcome Chains'),
                    options: levels.filter(
                        level => level.tier.depth == 2
                    ).map(
                        level => ({value: level.pk, label: level.outcomeChainDisplay, filterType: 'level'})
                    )
                });
            }
            return options;
        }
        return null;
    }
    
    @computed get levelsSelected() {
        if (this.levels && this.levels.length > 0) {
            return this.program.levels.filter(level => this.levels.includes(level.pk))
                    .map(level => ({value: level.pk, label: level.name, filterType: 'level'}));
        }
        return [];
    }
    
    @computed get tiersSelected() {
        if (this.tiers && this.tiers.length > 0) {
            return this.program.tiers.filter(tier => this.tiers.includes(tier.pk))
                    .map(tier => ({value: tier.pk, label: tier.name, filterType: 'tier'}));
        }
        return [];
    }
    
    @computed get typeOptions() {
        if (!this.filtersDisabled) {
            let availableTypes = flattenArray(this.types.concat(this.filterIndicators(this.program.indicators, 'types').map(
                indicator => indicator.typePks
            )));
            return this.program.types.filter(
                iType => availableTypes.includes(iType.pk)
            ).map(iType => ({value: iType.pk, label: iType.name}));
        }
        return null;
    }
    
    @computed get typesSelected() {
        if (this.types && this.types.length > 0) {
            return this.typeOptions.filter(typeOpt => this.types.includes(typeOpt.value));
        }
        return [];
    }
    
    @computed get sectorOptions() {
        if (!this.filtersDisabled) {
            let availableSectors = this.sectors.concat(
                this.filterIndicators(this.program.indicators, 'sectors').map(
                    indicator => indicator.sectorPk
                )
            );
            return this.program.sectors.filter(
                sector => availableSectors.includes(sector.pk)
                ).map(sector => ({value: sector.pk, label: sector.name}));
        }
        return null;
    }
    
     @computed get sectorsSelected() {
        if (this.sectors && this.sectors.length > 0) {
            return this.sectorOptions.filter(sector => this.sectors.includes(sector.value));
        }
        return [];
    }
    
    @computed get siteOptions() {
        if (!this.filtersDisabled) {
            let availableSites = this.sites.concat(
                flattenArray(this.filterIndicators(this.program.indicators, 'sites').map(
                    indicator => indicator.sitePks
                ))
            );
            return this.program.sites.filter(
                site => availableSites.includes(site.pk)
            ).map(site => ({value: site.pk, label: site.name}));
        }
        return null;
    }
    
    @computed get sitesSelected() {
        if (this.sites && this.sites.length > 0) {
            return this.siteOptions.filter(site => this.sites.includes(site.value));
        }
        return [];
    }
    
    @computed get indicatorOptions() {
        if (!this.filtersDisabled) {
            if (this.groupByDisabled) {
                return this.filterIndicators(this.program.indicators, 'indicators')
                    .map(indicator => ({value: indicator.pk, label: indicator.name}));
            } else {
                return this.filterLevels('indicators').map(
                    level => ({
                        label: `${level.tier.name} ${level.sortDisplay}`,
                        options: this.filterIndicators(level.indicators, 'indicators').map(
                            indicator => ({
                                    value: indicator.pk,
                                    label: `${indicator.number} ${indicator.name}`
                                })
                        )
                    })
                ).concat([{
                    label: gettext('Indicators unassigned to a results framework level'),
                    options: this.filterIndicators(
                        this.program.unassignedIndicators, 'indicators').map(
                            indicator => ({value: indicator.pk, label: indicator.name}))
                    }]).filter(({label, options}) => options && options.length > 0);
            }
        }
        return [];
    }
    
     @computed get indicatorsSelected() {
        if (this.indicators && this.indicators.length > 0) {
            let indicatorOptions = this.groupByDisabled ? this.indicatorOptions :
                flattenArray(this.indicatorOptions.map(optgroup => optgroup.options));
            return indicatorOptions.filter(indicator => this.indicators.includes(indicator.value));
        }
        return [];
    }
    
    @action clearFilters = () => {
        this.sectors = [];
        this.types = [];
        this.sites = [];
        this.indicators = [];
        this.levels = [];
        this.tiers = [];
    }
    
    /* whether this is in an unfiltered state */
    @computed get noFilters() {
        return (
            (!this.indicators || this.indicators.length == 0) &&
            (!this.types || this.types.length == 0) &&
            (!this.levels || this.levels.length == 0) &&
            (!this.tiers || this.tiers.length == 0) &&
            (!this.sectors || this.sectors.length == 0) &&
            (!this.sites || this.sites.length == 0)
            );
    }
    
    @computed get programPageUrl() {
        if (this.program) {
            return this.program.programPageUrl;
        }
        return false;
    }
    
    @computed get filteredIndicators() {
        return this.filterIndicators(this.program.indicators);
    }
    
    filterIndicators(indicatorSet, skip = false) {
        let indicators = indicatorSet.sort((a, b) => a.sortIndex - b.sortIndex);
        if (this.groupByDisabled) {
            indicators = indicators.sort((a, b) => {
                if (a.levelpk && b.levelpk) {
                    if (a.levelpk != b.levelpk) {
                        return (a.levelpk < b.levelpk) ? -1 
                                : (b.levelpk < a.levelpk) ? 1 : 0;
                    } else if (a.old_number && b.old_number) {
                        return (a.old_number < b.old_number) ? -1
                            : (b.old_number < a.old_number) ? 1 : 0;
                    } else if (a.old_number) {
                        return -1;
                    } else if (b.old_numbeR) {
                        return 1;
                    }
                    return 0;
                } else if (a.levelpk) {
                    return -1;
                } else if (b.levelpk) {
                    return 1;
                } 
                return 0;
            });
        }
        
        if (this.reportType === TVA) {
            indicators = indicators.filter(
                indicator => indicator.frequency == this.frequencyId
            );
        }
        if (skip !== 'indicators' && this.indicators && this.indicators.length > 0) {
            indicators = indicators.filter(indicator => this.indicators.includes(indicator.pk));
        }
        if (skip !== 'types' && this.types && this.types.length > 0) {
            indicators = indicators.filter(
                indicator => (
                    indicator.typePks.length > 0 &&
                    indicator.typePks.filter(pk => this.types.includes(pk)).length > 0
                )
            );
        }
        if (skip !== 'sites' && this.sites && this.sites.length > 0) {
            indicators = indicators.filter(
                indicator => (
                    indicator.sitePks.length > 0 &&
                    indicator.sitePks.filter(pk => this.sites.includes(pk)).length > 0
                )
            );
        }
        if (skip !== 'sectors' && this.sectors && this.sectors.length > 0) {
            indicators = indicators.filter(
                indicator => indicator.sectorPk && this.sectors.includes(indicator.sectorPk)
            );
        }
        if (skip !== 'levels' && this.levels && this.levels.length > 0) {
            if (this.groupByDisabled) {
                indicators = indicators.filter(
                    indicator => indicator.level && this.levels.includes(indicator.levelpk)
                );
            } else {
                indicators = indicators.filter(
                  indicator => (
                    indicator.level && (this.levels.includes(indicator.level.pk) ||
                                        this.levels.includes(indicator.level._level2parent))
                    )
                );
            }
        } else if (skip !== 'levels' && this.tiers && this.tiers.length > 0) {
            indicators = indicators.filter(
                indicator => (
                    indicator.level && indicator.level.tierPk && this.tiers.includes(indicator.level.tierPk)
                )
            )
        }
        return indicators || [];
    }
    
    @computed get filteredLevels() {
        return this.filterLevels(false);
    }
    
    filterLevels(skip = false) {
        var levels = false;
        if (this.groupBy === GROUP_BY_LEVEL) {
            levels = this.program.levels.sort(
                (levela, levelb) => levela.sort - levelb.sort).sort(
                (levela, levelb) => levela.depth - levelb.depth
            )
        } else if (this.groupBy === GROUP_BY_CHAIN) {
            let parents = this.program.levels.filter(level => !level._parent);
            levels = this._findChildren(parents, []);
        }
        if (levels) {
            var levelPks;
            if (skip) {
                levelPks = new Set(this.filterIndicators(this.program.indicators, skip).map(indicator => indicator.levelpk));
            } else {
                levelPks = new Set(this.filteredIndicators.map(indicator => indicator.levelpk));
            }
            levels = levels.filter(level => !level._parent || levelPks.has(level.pk));
            if (levels.length == 1 && !levelPks.has(levels[0].pk)) {
                return [];
            }
            return levels;
        }
        return [];
    }
    
    _findChildren(parents) {
        let levels = [];
        for (let i = 0; i < parents.length; i++) {
            levels.push(parents[i]);
            if (parents[i].childLevels && parents[i].childLevels.length > 0) {
                levels = levels.concat(this._findChildren(parents[i].childLevels));
            }
        }
        return levels;
    }
    
    @action
    indicatorUpdate = (ev, {programId, indicatorId, ...params}) => {
        if (programId && programId == this.programId) {
            this.programStore.updateIndicator(
                this.reportType, programId, this.frequencyId, indicatorId
            );
        }
    }
    
    @action
    indicatorDelete = (ev, {programId, indicatorId, ...params}) => {
        if (programId && programId == this.programId) {
            this.programStore.removeIndicator(programId, indicatorId);
        }
    }
}