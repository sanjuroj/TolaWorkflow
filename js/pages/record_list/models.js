import { observable, computed, action } from "mobx";



export class RecordListStore {
    @observable records = [];
    @observable programs = [];

    constructor(records, programs) {
        this.records = records;
        this.programs = programs;
    }
}

export class RecordListUIStore {
    // @observable currentIndicatorFilter;  // selected gas gauge filter
    // @observable selectedIndicatorIds = []; // indicators filter
    //
    // constructor() {
    //     this.setIndicatorFilter = this.setIndicatorFilter.bind(this);
    //     this.clearIndicatorFilter = this.clearIndicatorFilter.bind(this);
    //     this.setSelectedIndicatorIds = this.setSelectedIndicatorIds.bind(this);
    // }
    //
    // @action
    // setIndicatorFilter(indicatorFilter) {
    //     this.currentIndicatorFilter = indicatorFilter;
    // }
    //
    // @action
    // clearIndicatorFilter() {
    //     this.currentIndicatorFilter = null;
    // }
    //
    // @action
    // setSelectedIndicatorIds(selectedIndicatorIds) {
    //     this.selectedIndicatorIds = selectedIndicatorIds;
    // }
}
