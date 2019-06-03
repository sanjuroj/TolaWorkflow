import { observable, computed, action, toJS, runInAction } from "mobx";
import { trimOntology } from '../../level_utils'
import { api } from "../../api.js"

export class RootStore {
    constructor (program_id, levels, indicators, levelTiers, tierTemplates, accessLevel) {
        this.levelStore =  new LevelStore(program_id, levels, indicators, levelTiers, tierTemplates, accessLevel, this);
        this.uiStore = new UIStore(this);
    }
}

export class LevelStore {
    @observable levels = [];
    @observable indicators = [];
    @observable chosenTierSetKey = "";
    @observable chosenTierSet = [];
    tierTemplates;
    defaultTemplateKey = "";
    customTierSetKey = "";
    program_id = "";
    accessLevel = false;

    constructor(program_id, levels, indicators, levelTiers, tierTemplates, accessLevel, rootStore) {
        this.rootStore = rootStore;
        this.levels = levels;
        this.indicators = indicators;

        this.tierTemplates = tierTemplates;
        this.defaultTemplateKey = "mc_standard";
        this.customTierSetKey = "custom";
        this.program_id = program_id;
        this.accessLevel = accessLevel;

        // Set the stored tier set key and the values, if they exist.  Use the default if they don't.
        if (levelTiers.length > 0) {
            // deriveTemplateKey relies on chosenTierSet to be populated, so need to set it first.
            this.chosenTierSet = levelTiers.map( t => t.name);
            this.chosenTierSetKey = this.deriveTemplateKey(levelTiers);
        }
        else {
            this.chosenTierSetKey = this.defaultTemplateKey;
            this.chosenTierSet = this.tierTemplates[this.chosenTierSetKey]['tiers'];
        }
    }

    @computed get sortedLevels () {
        return this.levels.slice().sort((a, b) => {a.level_depth - b.level_depth || a.customsort - b.customsort})
    }

    @computed get levelProperties () {
        let levelProperties = {};

        for (let level of this.levels) {
            let properties = {};
            const childrenIds = this.getChildLevels(level.id).map( l => l.id);
            const indicatorCount = this.indicators.filter( i => i.level == level.id);

            properties['indicators'] = this.getLevelIndicators(level.id);
            properties['descendantIndicatorIds'] = this.getDescendantIndicatorIds(childrenIds);
            properties['ontologyLabel'] = this.buildOntology(level.id);
            properties['tierName'] = this.chosenTierSet[level.level_depth-1];
            properties['childTierName'] = null;
            if (this.chosenTierSet.length > level.level_depth) {
                properties['childTierName'] = this.chosenTierSet[level.level_depth];
            }

            properties['canDelete'] = childrenIds.length==0 && indicatorCount==0 && this.accessLevel=='high';
            properties['canEdit'] = this.accessLevel == 'high';
            levelProperties[level.id] = properties;
        }

        return levelProperties
    }

    @computed get chosenTierSetName () {
        if (this.chosenTierSetKey == this.customTierSetKey){
            return "Custom"
        }
        else {
            return this.tierTemplates[this.chosenTierSetKey]['name']
        }
    };

    @action
    changeTierSet(newTierSetKey) {
        this.chosenTierSetKey = newTierSetKey;
        this.chosenTierSet = this.tierTemplates[newTierSetKey]['tiers']
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
        this.rootStore.uiStore.hasVisibleChildren.push(newLevel.parent)

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
            })
            .catch(error => console.log('error', error))
    };

    deleteLevelFromDB = (levelId) => {
        api.delete(`/level/${levelId}`)
            .then(response => {
                this.levels.replace(response.data);
                this.rootStore.uiStore.removeExpandedCard(levelId);
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
                    this.rootStore.uiStore.removeExpandedCard(levelId);
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

    deriveTemplateKey = () => {
        // Check each tier set in the templates to see if the tier order and content are exactly the same
        // If they are, return the template key
        const levelTierStr = JSON.stringify(toJS(this.chosenTierSet));
        for (let templateKey in this.tierTemplates){
            // not an eligable template if the key is inherited or if the lengths of the tier sets don't match.
            if (!this.tierTemplates.hasOwnProperty(templateKey) ||
                this.chosenTierSet.length != this.tierTemplates[templateKey]['tiers'].length) {
                continue;
            }
            const templateValuesStr = JSON.stringify(this.tierTemplates[templateKey]['tiers']);
            if (levelTierStr == templateValuesStr) {
                return templateKey;
            }
        }

        // If this has been reached, the db has stored tiers but they're not a match to a template
        return "custom";
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

    getChildLevels = levelId => this.levels.filter( l => l.parent == levelId);

    getLevelIndicators = levelId => this.indicators.filter( i => i.level == levelId)

    getDescendantIndicatorIds = (childLevelIds) => {
        // console.log('childidsss', childIds)
        const childLevels = this.levels.filter( l => childLevelIds.includes(l.id));
        // console.log('before loop', toJS(childLevels))
        let newIndicatorIds = []
        childLevels.forEach( childLevel => {
            newIndicatorIds = newIndicatorIds.concat(this.indicators.filter( i => i.level == childLevel.id).map( i => i.id))
            let grandChildIds = this.levels.filter( l => l.parent == childLevel.id).map( l => l.id);
            newIndicatorIds = newIndicatorIds.concat(this.getDescendantIndicatorIds(grandChildIds, newIndicatorIds));
        });
        // console.log('after loop', priorIds)
        return newIndicatorIds
    }

}


export class UIStore {
    @observable expandedCards = [];
    @observable hasVisibleChildren = [];

    constructor (rootStore) {
        this.rootStore = rootStore;
    }

    @computed get tierLockStatus () {
        // The leveltier picker should be disabled if there is at least one saved level in the DB.
        let notNewLevels = this.rootStore.levelStore.levels.filter( l => l.id != "new");
        if  (notNewLevels.length > 0) {
            return "locked"
        }
        // The apply button should not be visible if there is only one level visible (i.e. saved to the db or not)
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
    updateVisibleChildren = (levelId, forceRemove=false) => {
        if (this.hasVisibleChildren.indexOf(levelId) >= 0 || forceRemove) {
            this.hasVisibleChildren = this.hasVisibleChildren.filter( level_id => level_id != levelId );
            const childLevels = this.rootStore.levelStore.levels.filter( l => l.parent == levelId);
            childLevels.forEach( l => this.updateVisibleChildren(l.id, true))
        }
        else {
            this.hasVisibleChildren.push(levelId);
        }
    }
}
