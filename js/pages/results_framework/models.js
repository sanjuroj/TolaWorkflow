import { observable, computed, action, toJS, runInAction } from "mobx";
import { trimOntology } from '../../level_utils'
import { api } from "../../api.js"

export class RootStore {
    constructor (program_id, levels, levelTiers, tierPresets) {
        this.levelStore =  new LevelStore(program_id, levels, levelTiers, tierPresets, this);
        this.uiStore = new UIStore(this);
    }
}

export class LevelStore {
    @observable levels = [];
    @observable chosenTierSet = [];
    @observable chosenTierSetName = "";
    tierPresets = {};
    defaultPreset = "Mercy Corps standard";
    program_id = ""

    constructor(program_id, levels, levelTiers, tierPresets, rootStore) {
        this.rootStore = rootStore;
        this.levels = levels;
        this.tierPresets = tierPresets;
        this.program_id = program_id;

        // Set the stored tierset and its name, if they exist.  Use the default if they don't.
        if (levelTiers.length > 0) {
            this.chosenTierSet = levelTiers;
            this.chosenTierSetName = this.derive_preset_name(levelTiers, tierPresets);
        }
        else {
            this.chosenTierSetName = this.defaultPreset;
        }
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

    @computed get sortedLevels () {
        return this.levels.slice().sort((a, b) => {a.level_depth - b.level_depth || a.customsort - b.customsort})
    }

    @computed get levelProperties () {
        let levelProperties = {};
        for (let level of this.levels) {
            let properties = {};
            properties['ontologyLabel'] = this.buildOntology(level.id);
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
    createNewLevelFromSibling = (siblingId) => {

        // Copy sibling data for the new level and then clear some of it out
        let sibling = toJS(this.levels.find( l => l.id == siblingId));
        let newLevel = Object.assign({}, sibling)
        newLevel.customsort +=1;
        newLevel.id = "new";
        newLevel.name = "";
        newLevel.assumptions = "";

        // bump the customsort field for siblings that come after the inserted Level
        let siblingsToReorder = this.levels.filter( l => {
            return l.customsort > sibling.customsort && l.parent == sibling.parent;
        })
        siblingsToReorder.forEach( sib => sib.customsort+=1)

        // add new Level to the various Store components
        this.rootStore.uiStore.expandedCards.push("new")
        this.rootStore.uiStore.activeCard = "new"
        this.levels.push(newLevel)

    };

    @action
    createFirstLevel = () => {
        let newLevel = {
            id: "new",
            program: this.program_id,
            name: "",
            assumptions: "",
            customsort: 1,
            level_depth: 1,
            parent: "root"
        }
        this.levels.push(newLevel)
        this.rootStore.uiStore.expandedCards.push("new")
    }

    // TODO: better error handling for API

    saveLevelToDB = (submitType, levelId, formData) => {
        let targetLevel = this.levels.find(level => level.id == levelId);
        let levelToSave = Object.assign(toJS(targetLevel), formData);
        if (levelId == "new") {
            delete levelToSave.id;

            api.post(`/insert_new_level/`, levelToSave)
                .then(response => {
                    runInAction(() => {
                        this.levels.replace(response.data)
            })
                })
                .catch(error => console.log('error', error))

        } else {
            api.put(`/level/${levelId}/`, levelToSave)
                .then(response => {
                    runInAction( () => {
                        Object.assign(targetLevel, response.data);
                    });
                    this.rootStore.uiStore.removeExpandedCard(levelId)
                    if (submitType == "saveAndAddSibling"){
                        this.createNewLevelFromSibling(levelId)
                    }

                })
                .catch( error => {
                    console.log("There was an error:", error)
                })
        }

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


    buildOntology = (levelId, ontologyArray = []) => {
        let level = toJS(this.levels.find( l => l.id == levelId))
        if (level.parent) {
            ontologyArray.unshift(level.customsort)
            return this.buildOntology(level.parent, ontologyArray)
        }
        else {
            return ontologyArray.join(".")
        }
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
