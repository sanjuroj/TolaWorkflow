import { observable, computed, action, toJS, runInAction } from "mobx";
import { api } from "../../api.js";
import { trimOntology } from '../../level_utils'

export class RootStore {
    constructor (levels, levelTiers, tierPresets) {
        this.levelStore =  new LevelStore(levels, levelTiers, tierPresets, this);
        this.uiStore = new UIStore(this);
    }
}

export class LevelStore {
    @observable levels = [];
    @observable chosenTierSet = [];
    @observable chosenTierSetName = "";
    tierPresets = {};

    constructor(levels, levelTiers, tierPresets, rootStore) {
        this.rootStore = rootStore;
        this.levels = levels;
        this.tierPresets = tierPresets;

        // Set the stored tierset and its name, if they exist
        if (levelTiers.length > 0) {
            this.chosenTierSet = levelTiers;
            this.chosenTierSetName = this.derive_preset_name(levelTiers, tierPresets);
        }
        // else {
        //     this.selectedTierSetName = none;
        //     this.chosenLevelTierSet = tierPresets[this.defaultPreset];
        // }

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
            properties['tierName'] = this.tierList[level.level_depth-1];
            const childCount =  this.levels.filter(l => l.parent == level.id).length;
            properties['canDelete'] = childCount==0;
            levelProperties[level.id] = properties
        }
        return levelProperties
    }

    @action
    changeTierSet(newTierSetName) {
        this.chosenTierSetName = newTierSetName;
    }

    @action
    saveAndAddSiblingLevel = (level_id) =>{
        console.log('yay', level_id);
        level = this.levels.find( l => l.id = level_id);
        console.log(level)
        this.saveLevelToDB(level_id);
        this.createNewLevel(level_id);

    }

    @action
    createNewLevelFromSibling = (sibling_id) => {
        sibling = this.levels.find( l => l.id == sibling_id);
    }

    saveLevelToDB = (levelId) => {
        console.log('this', levelId)
        let levelData = toJS(this.levels).filter( l => l.id == levelId)[0];
        if (levelId == "new") {
            console.log('want to create a new level')
        } else {
            console.log('in update, id=', levelId)
            api.put(`/level/${levelId}/`, levelData)
                .then(response => {
                    let targetLevel = this.levels.find(level => level.id == levelId);
                    runInAction( () => {
                        Object.assign(targetLevel, response.data)
                    });
                    this.rootStore.uiStore.removeExpandedCard(levelId)

                })
                .catch( error => {
                    console.log("There was an error:", error)
                })
        }
        let targetLevelFinal = this.levels.find(level => level.id == levelId);
        console.log('final target', toJS(targetLevelFinal))
    };


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


export class UIStore {
    @observable expandedCards = [];
    @observable activeLevel = "";

    constructor (rootStore) {
        this.rootStore = rootStore;
    }

    @action
    addExpandedCard = (levelId) => {
        if (!this.expandedCards.includes(levelId)) {
            this.expandedCards.push(levelId);
        }
    }

    @action
    removeExpandedCard = (levelId) => {
        this.expandedCards = this.expandedCards.filter( level_id => level_id != levelId )
    }
}
