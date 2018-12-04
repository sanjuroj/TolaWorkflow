import { observable, computed, action } from "mobx";

// Types of filters available on the program page
export const IndicatorFilterType = Object.freeze({
    missingTarget: 1,
    missingResults: 2,
    missingEvidence: 3,

    aboveTarget: 5,
    belowTarget: 6,
    onTarget: 7,
});

export class IndicatorStore {
    @observable indicators = [];

    constructor(indicators) {
        this.indicators = indicators;

        this.updateIndicator = this.updateIndicator.bind(this);
        this.filterIndicators = this.filterIndicators.bind(this);
    }

    @action
    updateIndicator(indicator) {
        let i = this.indicators.findIndex(e => e.id === indicator.id);
        if (i > 0) {
            this.indicators[i] = indicator;
        }
    }

    @computed
    get getIndicatorsNeedingTargets() {
        return this.indicators.filter(i => i.all_targets_defined === 0);
    }

    @computed
    get getIndicatorsNeedingResults() {
        return this.indicators.filter(i => i.results_count === 0);
    }

    @computed
    get getIndicatorsNeedingEvidence() {
        return this.indicators.filter(i => i.results_count !== i.results_with_evidence_count);
    }

    @computed
    get getIndicatorsNotReporting() {
        return this.indicators.filter(i => i.over_under === null);
    }

    @computed
    get getIndicatorsAboveTarget() {
        return this.indicators.filter(i => i.over_under > 0);
    }

    @computed
    get getIndicatorsBelowTarget() {
        return this.indicators.filter(i => i.over_under < 0);
    }

    @computed
    get getIndicatorsOnTarget() {
        return this.indicators.filter(i => i.over_under === 0);
    }

    @computed
    get getIndicatorsReporting() {
        return this.indicators.filter(i => i.reporting === true);
    }

    filterIndicators(filterType) {
        let indicators;

        switch (filterType) {
            case IndicatorFilterType.missingTarget:
                indicators = this.getIndicatorsNeedingTargets;
                break;
            case IndicatorFilterType.missingResults:
                indicators = this.getIndicatorsNeedingResults;
                break;
            case IndicatorFilterType.missingEvidence:
                indicators = this.getIndicatorsNeedingEvidence;
                break;
            case IndicatorFilterType.aboveTarget:
                indicators = this.getIndicatorsAboveTarget;
                break;
            case IndicatorFilterType.belowTarget:
                indicators = this.getIndicatorsBelowTarget;
                break;
            case IndicatorFilterType.onTarget:
                indicators = this.getIndicatorsOnTarget;
                break;
            default:
                indicators = this.indicators;
        }

        return indicators
    }

    @computed
    get getTotalResultsCount() {
        return this.indicators.reduce((acc, i) => acc + i.results_count, 0);
    }

    @computed
    get getTotalResultsWithEvidenceCount() {
        return this.indicators.reduce((acc, i) => acc + i.results_with_evidence_count, 0);
    }
}

export class ProgramPageStore {
    indicatorStore;
    @observable program = {};
    @observable resultsMap = new Map(); // indicator id -> results HTML str

    constructor(indicators, program) {
        this.indicatorStore = new IndicatorStore(indicators);
        this.program = program;

        this.addResultsHTML = this.addResultsHTML.bind(this);
        this.deleteResultsHTML = this.deleteResultsHTML.bind(this);
    }

    @action
    addResultsHTML(indicatorId, htmlStr) {
        this.resultsMap.set(parseInt(indicatorId), htmlStr);
    }

    @action
    deleteResultsHTML(indicatorId) {
        this.resultsMap.delete(indicatorId);
    }
}

export class ProgramPageUIStore {
    @observable currentIndicatorFilter;  // selected gas gauge filter
    @observable selectedIndicatorIds = []; // indicators filter

    constructor() {
        this.setIndicatorFilter = this.setIndicatorFilter.bind(this);
        this.clearIndicatorFilter = this.clearIndicatorFilter.bind(this);
        this.setSelectedIndicatorIds = this.setSelectedIndicatorIds.bind(this);
    }

    @action
    setIndicatorFilter(indicatorFilter) {
        this.currentIndicatorFilter = indicatorFilter;
    }

    @action
    clearIndicatorFilter() {
        this.currentIndicatorFilter = null;
    }

    @action
    setSelectedIndicatorIds(selectedIndicatorIds) {
        this.selectedIndicatorIds = selectedIndicatorIds;
    }
}
