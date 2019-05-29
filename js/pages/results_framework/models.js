import { observable, computed, action, toJS, runInAction } from "mobx";
import { trimOntology } from '../../level_utils'
import { api } from "../../api.js"

export class RootStore {
    constructor (program_id, levels, indicators, levelTiers, tierPresets) {
        this.levelStore =  new LevelStore(program_id, levels, indicators, levelTiers, tierPresets, this);
        this.uiStore = new UIStore(this);
    }
}

export class LevelStore {
    @observable levels = [];
    @observable indicators = [];
    @observable chosenTierSet = [];
    @observable chosenTierSetName = "";
    tierPresets = {};
    defaultPreset = "Mercy Corps standard";
    program_id = "";

    constructor(program_id, levels, indicators, levelTiers, tierPresets, rootStore) {
        this.rootStore = rootStore;
        this.levels = levels;
        this.indicators = indicators;
        this.tierPresets = tierPresets;
        this.program_id = program_id;

        // Set the stored tierset and its name, if they exist.  Use the default if they don't.
        if (levelTiers.length > 0) {
            this.chosenTierSet = levelTiers.map( t => t.name);
            this.chosenTierSetName = this.derive_preset_name(levelTiers, tierPresets);
        }
        else {
            this.chosenTierSetName = this.defaultPreset;
            this.chosenTierSet = this.tierPresets[this.defaultPreset];
        }
    }

    @computed get sortedLevels () {
        return this.levels.slice().sort((a, b) => {a.level_depth - b.level_depth || a.customsort - b.customsort})
    }

    @computed get levelProperties () {
        let levelProperties = {};
        this.indicators.forEach( i => console.log(toJS(i)));
        for (let level of this.levels) {
            let properties = {};
            properties['indicators'] = this.getLevelIndicators(level.id);
            properties['ontologyLabel'] = this.buildOntology(level.id);
            properties['tierName'] = this.chosenTierSet[level.level_depth-1];
            properties['childTierName'] = null;
            if (this.chosenTierSet.length > level.level_depth) {
                properties['childTierName'] = this.chosenTierSet[level.level_depth];
            }
            const childCount =  this.levels.filter(l => l.parent == level.id).length;
            const indicatorCount = this.indicators.filter( i => i.level == level.id);
            properties['canDelete'] = childCount==0 && indicatorCount==0;
            levelProperties[level.id] = properties;
        }
        return levelProperties
    }

    @action
    changeTierSet(newTierSetName) {
        this.chosenTierSetName = newTierSetName;
        this.chosenTierSet = this.tierPresets[newTierSetName]
    }

    @action
    cancelEdit = levelId => {
        if (levelId == "new") {
            const targetLevel = this.levels.find(l => l.id == levelId);

            // First update any customsort values that were modified when this card was created
            let siblingsToReorder = this.levels.filter(l => {
                return l.customsort > targetLevel.customsort && l.parent == targetLevel.parent;
            });
            siblingsToReorder.forEach(sib => sib.customsort -= 1);

            // Now remove the new card
            this.levels.replace(this.levels.filter((element) => element.id != "new"));
        }
        this.rootStore.uiStore.removeExpandedCard(levelId)

    };

    @action
    createNewLevelFromSibling = (siblingId) => {
        // Copy sibling data for the new level and then clear some of it out
        let sibling = toJS(this.levels.find( l => l.id == siblingId));
        let newLevel = Object.assign({}, sibling);
        newLevel.customsort += 1;
        newLevel.id = "new";
        newLevel.name = "";
        newLevel.assumptions = "";

        // bump the customsort field for siblings that come after the inserted Level
        let siblingsToReorder = this.levels.filter( l => {
            return sibling && l.customsort > sibling.customsort && l.parent == sibling.parent;
        });
        siblingsToReorder.forEach( sib => sib.customsort+=1);
        // add new Level to the various Store components
        this.rootStore.uiStore.expandedCards.push("new");
        this.rootStore.uiStore.activeCard = "new";
        this.levels.push(newLevel);
    };

    @action
    createNewLevelFromParent = (parentId) => {
        // Copy data for the new level and then clear some of it out
        let parent = toJS(this.levels.find( l => l.id == parentId));
        let newLevel = {
            id:"new",
            customsort: 1,
            name: "",
            assumptions: "",
            parent: parentId,
            level_depth: parent.level_depth + 1,
            program: this.program_id
        };

        // bump the customsort field for siblings that come after the inserted Level
        let siblingsToReorder = this.levels.filter( l => l.parent == parentId);

        siblingsToReorder.forEach( sib => sib.customsort+=1);
        // add new Level to the various Store components
        this.rootStore.uiStore.expandedCards.push("new");
        this.rootStore.uiStore.activeCard = "new";
        this.levels.push(newLevel);

    };


    @action
    createFirstLevel = () => {
        // Using "root" for parent id so the Django view can distinguish between top tier level and 2nd tier level
        let newLevel = {
            id: "new",
            program: this.program_id,
            name: "",
            assumptions: "",
            customsort: 1,
            level_depth: 1,
            parent: "root"
        };
        this.levels.push(newLevel);
        this.rootStore.uiStore.expandedCards.push("new")
    }

    saveLevelTiersToDB = () => {
        const tier_data = {program_id: this.program_id, tiers: this.chosenTierSet};
        api.post(`/save_leveltiers/`, tier_data)
            .then(response => {
                console.log("Level Tiers Saved!")
            })
            .catch(error => console.log('error', error))
    };

    deleteLevelFromDB = (levelId) => {
        const level_data = {level: levelId};
        api.delete(`/level/${levelId}`)
            .then(response => {
                this.levels.replace(response.data);
                if (this.levels.length == 0){
                    this.createFirstLevel()
                }
            })
            .catch(error => console.log('error', error))
    };


    // TODO: better error handling for API
    saveLevelToDB = (submitType, levelId, formData) => {
        let targetLevel = this.levels.find(level => level.id == levelId);
        let levelToSave = Object.assign(toJS(targetLevel), formData);
        if (levelId == "new") {
            if (levelToSave.parent == "root") {
                this.saveLevelTiersToDB()
            }
            delete levelToSave.id;

            api.post(`/insert_new_level/`, levelToSave)
                .then(response => {
                    runInAction(() => {
                        this.levels.replace(response.data['all_data'])
                    });
                    const newId = response.data["new_level"]["id"];
                    if (submitType == "saveAndAddSibling"){
                        this.createNewLevelFromSibling(newId);
                    }
                    else if (submitType == "saveAndAddChild"){
                        this.createNewLevelFromParent(newId);
                    }
                })
                .catch(error => console.log('error', error))

        } else {
            api.put(`/level/${levelId}/`, levelToSave)
                .then(response => {
                    runInAction( () => {
                        Object.assign(targetLevel, response.data);
                    });
                    this.rootStore.uiStore.removeExpandedCard(levelId);
                    if (submitType == "saveAndAddSibling"){
                        this.createNewLevelFromSibling(levelId);
                    }
                    else if (submitType == "saveAndAddChild"){
                        this.createNewLevelFromParent(levelId);
                    }

                })
                .catch( error => {
                    console.log("There was an error:", error);
                })
        }

    };

    derive_preset_name(levelTiers, tierPresets) {
        if (!levelTiers){
            return null;
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
        return "Custom";
    }


    buildOntology = (levelId, ontologyArray = []) => {
        let level = toJS(this.levels.find( l => l.id == levelId));
        /*  If there is no parent (saved top tier level) or the parent is "root" (unsaved top tier level)
            then we should return with adding to the ontology because there is no ontology entry for the top tier
         */
        if (level.parent && level.parent != "root") {
            ontologyArray.unshift(level.customsort);
            return this.buildOntology(level.parent, ontologyArray);
        }
        else {
            return ontologyArray.join(".");
        }
    };

    getLevelIndicators = (levelId) => {
        return this.indicators.filter( i => i.level == levelId);
    }

}


export class UIStore {
    @observable expandedCards = [];
    @observable hasVisibleChildren = [];

    constructor (rootStore) {
        this.rootStore = rootStore;
    }

    @computed get tierLockStatus () {
        let notNewLevels = this.rootStore.levelStore.levels.filter( l => l.id != "new");
        if  (notNewLevels.length > 0) {
            return "locked"
        }
        else if (this.rootStore.levelStore.levels.length == 1){
            return "primed"
        }
        return null;
    }

    @action
    addExpandedCard = (levelId) => {
        if (!this.expandedCards.includes(levelId)) {
            this.expandedCards.push(levelId);
        }
    }

    @action
    removeExpandedCard = (levelId) => {
        this.expandedCards = this.expandedCards.filter( level_id => level_id != levelId );
    };

    @action
    updateVisibleChildren = (levelId) => {
        if (this.hasVisibleChildren.indexOf(levelId) >= 0) {
            this.hasVisibleChildren = this.hasVisibleChildren.filter( level_id => level_id != levelId );
        }
        else {
            this.hasVisibleChildren.push(levelId);
        }
    }
}
