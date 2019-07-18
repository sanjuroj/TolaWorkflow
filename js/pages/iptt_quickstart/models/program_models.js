export class QSProgram {
    constructor(rootStore, programJSON) {
        this.rootStore = rootStore;
        this.id = parseInt(programJSON.id);
        this.name = programJSON.name;
        this.frequencies = programJSON.frequencies;
        this.periodDateRanges = programJSON.periodDateRanges;
    }
    
    periods(frequency) {
        return frequency in this.periodDateRanges ? this.periodDateRanges[frequency] : false;
    }
    
    periodCount(frequency) {
        return this.periods(frequency) ? this.periods(frequency).length : 0;
    }
}

export default class QSProgramStore  {
    constructor(rootStore, programsJSON) {
        this.rootStore = rootStore;
        this.programs = {};
        programsJSON.forEach(programJSON => {
            this.programs[programJSON.id] = new QSProgram(this.rootStore, programJSON);
        });
    }
    
    getProgram(id) {
        return this.programs[id];
    }
    
    get programList() {
        return Object.values(this.programs).sort(
            (a, b) => {
                return a.name.toUpperCase() < b.name.toUpperCase() ?
                    -1 :
                    a.name.toUpperCase() > b.name.toUpperCase() ?
                        1 : 0;
            }
        );
    }

}