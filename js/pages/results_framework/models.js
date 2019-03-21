import { observable, computed, action } from "mobx";

export class RFPageStore {
    @observable levels = [];
    @observable levelTiers = [];
    tierPresets = {};

    constructor(levels, levelTiers, tierPresets) {
        this.levels = levels.sort( function (a, b) {
            if (a.ontology < b.ontology) {
                return -1;
            }
            if (b.ontology < a.ontology) {
                return 1;
            }
            return 0
        });
        this.levelTiers = levelTiers;
        this.tierPresets = tierPresets;
    }
}

export class RFPageUIStore {
    @observable selectedPreset;
    @observable levelTiers;
    tierPresets;
    defaultPreset = 'Mercy Corps standard';

    constructor(levelTiers, tierPresets){
        if (levelTiers.length) {
            this.selectedPreset = this.derive_preset_name(levelTiers, tierPresets);
            this.levelTiers = levelTiers;
        }
        else {
            this.selectedPreset = this.defaultPreset;
            this.levelTiers = tierPresets[this.defaultPreset];
        }
        this.tierPresets = tierPresets;

        this.changePreset = this.changePreset.bind(this);

    }

    @computed get tierList () {
        if (!this.selectedPreset && !this.levelTiers){
            return null;
        }
        else if (this.selectedPreset in this.tierPresets){
            return this.tierPresets[this.selectedPreset];
        }
        else {
            return this.levelTiers;
        }
    }

    @action
    changePreset(newPreset) {
        this.selectedPreset = newPreset;
    }

    derive_preset_name(levelTiers, tierPresets) {
        if (!levelTiers){
            return None;
        }
        for (let preset_name in tierPresets){
            return preset_name;
        }
    }


}
