import { observable, action } from 'mobx';

export class IPTTReportStore {
    @observable dateRanges;
    @observable program = {};
    
    constructor(jsContext) {
        this.dateRanges = [1, 2, 3];
        this.program.name = 'banana program';
    }
}