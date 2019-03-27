import { observable, computed, action, toJS } from "mobx";

import { trimOntology } from '../../level_utils'

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
        if (levelTiers.length > 0) {
            this.chosenTierSet = levelTiers;
            this.chosenTierSetName = this.derive_preset_name(levelTiers, tierPresets);

        }
        // else {
        //     this.selectedTierSetName = none;
        //     this.chosenLevelTierSet = tierPresets[this.defaultPreset];
        // }
        this.tierPresets = tierPresets;

        this.addChildLevel = this.addChildLevel.bind(this);
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

    @computed get levelProperties () {
        let levelProperties = {};
        for (let level of this.levels) {
            let properties = {};
            properties['ontologyLabel'] = trimOntology(level.ontology);
            properties['tierName'] = this.tierList[level.get_level_depth-1];
            const childCount =  this.levels.filter(l => l.parent == level.id).length;
            properties['canDelete'] = childCount==0;
            levelProperties[level.id] = properties
        }
        console.log("levelTierNameMap", toJS(levelProperties))
        return levelProperties
    }

    @action
    changeTierSet(newTierSetName) {
        this.chosenTierSetName = newTierSetName;
    }

    @action
    addChildLevel(level_id){
        console.log('yay', level_id)
    }

    derive_preset_name(levelTiers, tierPresets) {
        if (!levelTiers){
            return None;
        }
        const levelTiersArray = levelTiers.sort(t => t.tier_depth).map(t => t.name);
        const levelTierStr = JSON.stringify(levelTiersArray);
        for (let presetName in tierPresets){
            if (levelTiers.length != tierPresets[presetName].length){
                continue
            }
            const presetValues = JSON.stringify(tierPresets[presetName]);
            if (levelTierStr == presetValues) {
                return presetName;
            }
        }
        return "Custom"
    }
}
