import { observable, action, computed, reaction } from 'mobx';
import { TVA, TIMEPERIODS, GROUP_BY_CHAIN, GROUP_BY_LEVEL, BLANK_OPTION, TIME_AWARE_FREQUENCIES } from '../../../constants';

const _gettext = (typeof gettext !== 'undefined') ?  gettext : (s) => s;

function flattenArray(arr, depth = 1) {
    if (depth == 5) {
        return arr;
    }
    let flattened = [];
    arr.forEach(item => {
        if (Array.isArray(item)) {
            flattened = flattened.concat(flattenArray(item, depth+1));
        } else {
            flattened.push(item);
        }
    });
    return flattened;
}

var targetperiodLabels = {
    1: _gettext("Life of Program (LoP) only"),
    3: _gettext("Annual"),
    2: _gettext("Midline and endline"),
    5: _gettext("Tri-annual"),
    4: _gettext("Semi-annual"),
    7: _gettext("Monthly"),
    6: _gettext("Quarterly")
}

var timeperiodLabels = {
    3: _gettext("Years"),
    5: _gettext("Tri-annual periods"),
    4: _gettext("Semi-annual periods"),
    7: _gettext("Months"),
    6: _gettext("Quarters")
}

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

    constructor(programStore) {
        this.programStore = programStore;
        const reportChange = reaction(
            () => this.frequencyId !== null && [this.reportType, this.programId, this.frequencyId],
            (reportParams) => {this._reportParamsUpdated(reportParams);}
        );
    }

    set reportType(reportType) {
        if ([TVA, TIMEPERIODS].includes(reportType)) {
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
    
    @computed get _validProgramId() {
        return this.programStore.validProgramId(this._reportType);
    }
    
    set programId(programId) {
        programId = parseInt(programId);
        if (this._validProgramId(programId)) {
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
    
    
    getLoadedProgram() {
        if (this.reportType && this.program && this.frequencyId) {
            return this.programStore.getLoadedProgram(this.reportType, this.programId, this.frequencyId);
        } else {
            return Promise.reject(false);
        }
    }
    
    @computed get frequencyDisabled() {
        return !(this.program !== null);
    }
    
    _validFrequency = (frequencyId) => {
        if (this.program) {
            if (this.isTVA) {
                return this.program.validFrequency(frequencyId);
            } else {
                return TIME_AWARE_FREQUENCIES.includes(frequencyId);
            }
        }
        return false;
    }
    
    @computed get programIsLoaded() {
        if (this.frequencyId) {
            return this.program.isLoaded(this.reportType, this.frequencyId);
        }
        return false;
    }
    
    set frequencyId(frequencyId) {
        frequencyId = parseInt(frequencyId);
        if (this._validFrequency(frequencyId)) {
            this._frequencyId = frequencyId;
        }
    }
    
    @computed get frequencyId() {
        if (this._validFrequency(this._frequencyId)) {
            return this._frequencyId;
        }
        return null;
    }

    @action _reportParamsUpdated([reportType, programId, frequencyId]) {
        this.programStore.loadProgram(reportType, programId, frequencyId)
            .then(() => {
                this.frequencyId = this.frequencyId || null;
                this.startPeriod = this.startPeriod || 0;
                this.endPeriod = this.endPeriod || this.lastPeriod.index;
                if (this.reportType === TVA && this.indicators && this.indicators.length > 0) {
                    this.indicators = [];
                }
            });
    }
    
    @computed get periodsDisabled() {
        let ret = !(TIME_AWARE_FREQUENCIES.includes(this.frequencyId));
        return ret;
    }
    
    @computed get periods() {
        if (this.frequencyId && this.frequencyId !== 1) {
            return this.program.periodsFor(this.frequencyId);
        }
        return null;
    }
    
    @computed get lastPeriod() {
        if (this.frequencyId) {
            return this.program.lastPeriod(this.frequencyId);
        }
        return null;
    }
    
    @computed get currentPeriod() {
        if (this.frequencyId) {
            return this.program.currentPeriod(this.frequencyId);
        }
    }
    
    set startPeriod(startPeriod) {
        if (this.lastPeriod !== null) {
            this._startPeriod = Math.max(0, Math.min(this.lastPeriod.index, startPeriod));
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
        }
    }
    
    @computed get showAll() {
        return this.startPeriod === 0 && this.lastPeriod && this.endPeriod === this.lastPeriod.index;
    }
    
    set mostRecent(count) {
        if (this.currentPeriod) {
            this.endPeriod = this.currentPeriod.index;
            this.startPeriod = Math.max(0, this.currentPeriod.index - (parseInt(count) || 2) + 1);
        }
    }
    
    @computed get mostRecent() {
        if (!this.showAll && this.currentPeriod && this.endPeriod === this.currentPeriod.index) {
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
    
    @computed get reportLoaded() {
        if (this.frequencyId) {
            return this.program.isLoaded(this.reportType, this.frequencyId);
        }
        return null;
    }
    
    @computed get filtersDisabled() {
        return !(this.reportLoaded);
    }
    
    set levels(levels) {
        if (!this.filtersDisabled) {
            this._levels = levels;
            this._tiers = null;
        }
    }
    
    @computed get levels() {
        if (this._levels && this._levels.length > 0 && !this.filtersDisabled) {
            return this._levels.filter(this.program.validLevel);
        }
        return [];
    }
    
    set tiers(tiers) {
        if (!this.filtersDisabled && !this.groupByDisabled) {
            this._tiers = tiers;
            this._levels = null;
        }
    }
    
    @computed get tiers() {
        if (this._tiers && this._tiers.length > 0 && !this.groupByDisabled) {
            return this._tiers.filter(this.program.validTier);
        }
        return [];
    }
    
    set sites(sites) {
        if (!this.filtersDisabled) {
            this._sites = sites;
        }
    }
    
    @computed get sites() {
        if (this._sites && this._sites.length > 0 && !this.filtersDisabled) {
            return this._sites.filter(this.program.validSite);
        }
        return [];
    }
    
    set types(types) {
        if (!this.filtersDisabled) {
            this._types = types;
        }
    }
    
    @computed get types() {
        if (this._types && this._types.length > 0 && !this.filtersDisabled) {
            return this._types.filter(this.program.validType);
        }
        return [];
    }
    
    set sectors(sectors) {
        if (!this.filtersDisabled) {
            this._sectors = sectors;
        }
    }
    
    @computed get sectors() {
        if (this._sectors && this._sectors.length > 0 && !this.filtersDisabled) {
            return this._sectors.filter(this.program.validSector);
        }
        return [];
    }
    
    set indicators(indicators) {
        if (!this.filtersDisabled) {
            this._indicators = indicators;
        }
    }
    
    @computed get indicators() {
        if (this._indicators && this._indicators.length > 0 && !this.filtersDisabled) {
            return this._indicators.filter(this.program.validIndicator);
        }
        return [];
    }
    
    
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
            return this.program.frequencies.filter(pk => pk !== 8).map(pk => ({value: pk, label: targetperiodLabels[pk]}));
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
            return this.periods.filter(periodFilter).map(
                period => ({label:period.display, value: period.index})
            );
        } else {
            let years = Array.from(new Set(this.periods.filter(periodFilter)
                                            .map(period => period.year))).sort();
            return years.map(
                year => ({
                    label: year,
                    options: this.periods.filter(periodFilter).filter(period => period.year === year)
                                .map(period => ({label: period.display, value: period.index}))
                })
            );
        }
    }
    
    @computed get startOptions() {
        return this._getPeriodOptions(() => true);
    }
    
    @computed get startPeriodLabel() {
        if (this.startPeriod !== null) {
            return this.periods.getPeriod({index: this.startPeriod}).startDisplay;
        }
        return null;
    }
    
    @computed get endOptions() {
        const periodFilter = (period) => period.index >= this.startPeriod;
        return this._getPeriodOptions(periodFilter);
    }
    
    @computed get endPeriodLabel() {
        if (this.endPeriod !== null) {
            return this.periods.getPeriod({index: this.endPeriod}).endDisplay;
        }
        return null;
    }
    
    @computed get levelOptions() {
        if (!this.filtersDisabled && this.groupByDisabled) {
            let availableLevels = this.levels.concat(
                this.filterIndicators(this.program.indicators, 'levels').map(
                    indicator => indicator.level ? indicator.level.pk : null
            ));
            return this.program.levels.filter(
                    level => availableLevels.includes(level.pk)
                ).sort((x, y) => x.pk - y.pk)
                .map(level => ({value: level.pk, label: level.name, filterType: 'level'}));
        } else if (!this.filtersDisabled) {
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
                return this.filteredLevels.map(
                    level => ({
                        label: `${level.tier.name} ${level.sort}`,
                        options: this.filterIndicators(level.indicators, 'indicators').map(
                            indicator => ({value: indicator.pk, label: `${indicator.number} ${indicator.name}`})
                        )
                    })
                ).concat([
                    {label: gettext('Indicators unassigned to a results framework level'),
                    options: this.filterIndicators(this.program.unassignedIndicators, 'indicators').map(
                            indicator => ({value: indicator.pk, label: indicator.name}))
                    }]).filter(({label, options}) => options && options.length > 0);
            }
        }
        return null;
    }
    
     @computed get indicatorsSelected() {
        if (this.indicators && this.indicators.length > 0) {
            return flattenArray(
                this.indicatorOptions.map(optgroup => optgroup.options)
                ).filter(indicator => this.indicators.includes(indicator.value));
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
    
    @computed get pinData() {
        if (this.frequencyId) {
            return this.router.pinData;
        }
        return false;
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
            if (this.noFilters) {
                return levels;
            }
            let levelPks = new Set(this.filteredIndicators.map(indicator => indicator.levelpk));
            return levels.filter(level => levelPks.has(level.pk));
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
}