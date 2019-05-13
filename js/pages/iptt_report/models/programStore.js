import { observable } from 'mobx';
import { TVA, TIMEPERIODS, GROUP_BY_CHAIN, GROUP_BY_LEVEL } from '../../../constants';

export default class ProgramStore {
    @observable programs = {};
    
    addPrograms = (programsJSON) => {
        programsJSON.forEach((programJSON) => {
            this.addProgram(programJSON);
        });
    }
    
    addProgram = (programJSON) => {
        this.programs[programJSON.id] = programJSON;
    }
    
    validateProgramId = ( id ) => {
        return this.programs[id] !== undefined;
    }
    
    validateFrequency = ( programId, frequency, reportType ) => {
        return this.validateProgramId(programId) &&
                (reportType === TIMEPERIODS && [3, 4, 5, 6, 7].includes(parseInt(frequency))) ||
                (reportType == TVA && this.programs[programId].frequencies.includes(parseInt(frequency)));
    }
    
    currentPeriod = ( programId, frequency ) => {
        return this.programs[programId].periodDateRanges[frequency]
                .filter(x => x[2] != "True").length - 1;
    }
    
    lastPeriod = ( programId, frequency ) => {
        return this.programs[programId].periodDateRanges[frequency].length - 1;
    }
    
    convertDate = ( date ) => {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }
    
    startPeriodFromDate = ( programId, frequency, date ) => {
        if (date instanceof Date && !isNaN(date)) {
            let dates = this.programs[programId].periodDateRanges[frequency]
                        .map(x => this.convertDate(new Date(x[0] + ' GMT')));
            let index = dates.indexOf(this.convertDate(date));
            if (index !== -1) {
                return index;
            }
        }
        throw "bad date";
    }
    
    endPeriodFromDate = ( programId, frequency, date ) => {
        if (date instanceof Date && !isNaN(date)) {
            let dates = this.programs[programId].periodDateRanges[frequency]
                        .map(x => this.convertDate(new Date(x[1] + ' GMT')));
            let index = dates.indexOf(this.convertDate(date));
            if (index !== -1) {
                return index;
            }
        }
        throw "bad date";
    }
    
    oldLevels = ( programId ) => {
        return this.programs[programId].oldLevels;
    }
}