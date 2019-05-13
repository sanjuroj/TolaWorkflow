/**
 * Data model for Level objects in IPTT Report
 */

export default class Level {
    constructor(program, levelJSON) {
        this.program = program;
        this.id = levelJSON.id;
        this.name = levelJSON.name;
        this.tier = levelJSON.tier;
        this.tierPk = levelJSON.tierPk;
        this.ontology = levelJSON.ontology;
        this.parentPk = levelJSON.parent;
        this.displayOntology = trimOntology(this.ontology);
        this.depth = levelJSON.depth;
        this.level2parent = levelJSON.level2parent;
        this.sortIndex = levelJSON.sort;
    }
    
    @computed get indicators() {
        return this.program.filteredIndicators
               ? this.program.filteredIndicators.filter(indicator => indicator.levelId == this.id)
               : [];
    }
    
    @computed get allIndicators() {
        return this.program.allIndicators
               ? this.program.allIndicators.filter(indicator => indicator.levelId == this.id)
               : [];
    }
    
    /** label for the row in the IPTT report, either Goal: goal name or Outcome 1: outcome name */
    get titleRow() {
        return `${this.tier}` + (this.displayOntology ? ` ${this.displayOntology}` : '') + `: ${this.name}`;
    }
    
    get optionName() {
        return this.tier + ' ' + this.sortIndex + ' and sub-levels: ' + this.name;
    }

}