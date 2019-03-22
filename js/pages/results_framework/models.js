import { observable, computed, action } from "mobx";

export class RFPageStore {
    @observable levels = [];
    @observable chosenTierSet = [];
    @observable chosenTierSetName = "";
    tierPresets = {};

    constructor(levels, levelTiers, tierPresets) {
        // Set and sort levels
        this.levels = levels.sort( function (a, b) {
            if (a.ontology < b.ontology) {
                return -1;
            }
            if (b.ontology < a.ontology) {
                return 1;
            }
            return 0
        });

        // Set the stored tierset and its name, if they exist
        if (levelTiers.length) {
            this.chosenTierSetName = this.derive_preset_name(levelTiers, tierPresets);
            this.chosenTierSet = levelTiers;
        }
        // else {
        //     this.selectedTierSetName = none;
        //     this.chosenLevelTierSet = tierPresets[this.defaultPreset];
        // }
        this.tierPresets = tierPresets;
    }

    @computed get tierList () {
        if (!this.chosenTierSet && !this.chosenTierSetName){
            return [];
        }
        else if (this.chosenTierSetName in this.tierPresets){
            return this.tierPresets[this.chosenTierSetName];
        }
        else {
            return this.chosenTierSet;
        }
    }

    @action
    changeTierSet(newTierSetName) {
        this.chosenTierSetName = newTierSetName;
    }

    derive_preset_name(chosenTierSet, tierPresets) {
        if (!chosenTierSet){
            return None;
        }
        for (preset_name in tierPresets){
            // TODO: need to actually implement this
            return preset_name;
        }
    }
}
