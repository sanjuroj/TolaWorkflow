/**
 * Program data for logframe view
 */
import { GROUP_BY_CHAIN, GROUP_BY_LEVEL } from '../../../constants';

class Indicator {
    constructor(indicatorData) {
        this.pk = indicatorData.pk;
        this.level_order = indicatorData.level_order;
        this.level = indicatorData.level || false;
        this.name = indicatorData.name;
        this.number_display = indicatorData.number_display;
        this.means_of_verification = indicatorData.means_of_verification;
    }
}

class Level {
    constructor(levelData, indicators) {
        this.pk = levelData.pk;
        this.display_name = levelData.display_name;
        this.level_depth = levelData.get_level_depth;
        this.ontology = levelData.ontology;
        this.indicators = [];
        if (levelData.indicators && Array.isArray(levelData.indicators)) {
            levelData.indicators.forEach(indicatorPk => this.indicators.push(indicators[indicatorPk]));
        }
        this.assumptions = levelData.assumptions;
        this.child_levels = levelData.child_levels || [];
        
    }
}

class ProgramStore {
    _levelsByPk = {};
    _levelsByChain = [];
    _levelsByTier = [];
    _indicatorsByPk = {};
    _unassignedIndicatorPks = [];

    constructor(programData) {
        this.name = programData.name;
        this.results_framework = programData.results_framework;
        this.results_framework_url = this.results_framework ? programData.results_framework_url : false;
        this.program_page_url = programData.program_page_url;
        this.rf_chain_sort_label = this.results_framework ? programData.rf_chain_sort_label : false;
        if (programData.indicators && Array.isArray(programData.indicators)) {
            programData.indicators.forEach(indicatorData => {
                let indicator = new Indicator(indicatorData);
                this._indicatorsByPk[indicator.pk] = indicator;
                if (!indicator.level) {
                    this._unassignedIndicatorPks.push(indicator.pk);
                }
            });
        }
        if (programData.levels && Array.isArray(programData.levels)) {
            programData.levels.forEach(
                level => {
                    let levelObj = new Level(level, this._indicatorsByPk);
                    this._levelsByPk[levelObj.pk] = levelObj;
                    this._levelsByChain.push(levelObj.pk);
                    this._levelsByTier.push(levelObj.pk);
                }
            );
            this._levelsByTier.sort((level_a, level_b) => {
                return (this._levelsByPk[level_a].level_depth < this._levelsByPk[level_b].level_depth) ? -1
                            : (this._levelsByPk[level_b].level_depth < this._levelsByPk[level_a].level_depth) ? 1
                                : (this._levelsByPk[level_a].ontology < this._levelsByPk[level_b].ontology) ? -1
                                    : (this._levelsByPk[level_b].ontology < this._levelsByPk[level_a].ontology) ? 1 : 0;
            });
            let sortedByChain = [];
            this._levelsByChain.filter(
                levelpk => this._levelsByPk[levelpk].level_depth == 1
            ).forEach(
                levelpk => {
                    sortedByChain = sortedByChain.concat(this.getChildLevels(levelpk));
                }
            );
            this._levelsByChain = sortedByChain;
        }
        
    }
    
    getChildLevels = (levelpk) => {
        let levels = [levelpk];
        this._levelsByPk[levelpk].child_levels.forEach(
            child_pk => {
                levels = levels.concat(this.getChildLevels(child_pk));
            }
        );
        return levels;
    }
    
    getLevelsGroupedBy = (grouping) => {
        if (parseInt(grouping) === GROUP_BY_CHAIN) {
            return this._levelsByChain.map(
                pk => this._levelsByPk[pk]
            )
        } else if (parseInt(grouping) === GROUP_BY_LEVEL) {
            return this._levelsByTier.map(
                pk => this._levelsByPk[pk]
            )
        }
        return Object.values(this._levelsByPk);
    }
    
    get unassignedIndicators() {
        if (!this._unassignedIndicatorPks || this._unassignedIndicatorPks.length == 0) {
            return [];
        }
        return this._unassignedIndicatorPks.map(
            pk => this._indicatorsByPk[pk]
        );
    }
    
}

export default ProgramStore;