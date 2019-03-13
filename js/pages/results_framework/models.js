import { observable, computed, action } from "mobx";

// Types of filters available on the program page
export const IndicatorFilterType = Object.freeze({
    noFilter: 0,
    missingTarget: 1,
    missingResults: 2,
    missingEvidence: 3,

    aboveTarget: 5,
    belowTarget: 6,
    onTarget: 7,
});


export class RFPageStore {
    @observable levels = [];
    @observable levelTiers = [];
    tierPresets = {};

    constructor(levels, levelTiers, tierPresets) {
        this.levels = levels;
        this.levelTiers = levelTiers;
        this.tierPresets = tierPresets;
    }

    @action
    update(indicator) {
        let i = this.indicators.findIndex(e => e.id === indicator.id);
        if (i > -1) {
            this.indicators[i] = indicator;
        }
    }

}

export class RFPageUIStore {
    @observable selectedPreset = '';

    constructor() {
        this.changePreset = this.changePreset.bind(this);
    }

    @action
    changePreset(newPreset) {
        this.selectedPreset = newPreset;
    }
}
