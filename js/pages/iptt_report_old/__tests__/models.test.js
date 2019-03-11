/**
 * Tests for the iptt_report/models module
 * @see module:iptt_report/models
 */

import {
    ReportProgramFilterData,
    IPTTReportUIStore,
    IPTTReportStore
} from '../models';

import { TVA } from '../../iptt_shared/models';

const programData = [
    {
        frequencies: [1],
        id: 66,
        name: "Stabilisation",
        timeperiods_url: "/indicators/iptt_report/66/timeperiods/",
        tva_url: "/indicators/iptt_report/66/targetperiods/",
        periods: {}
    },
    {
        frequencies: [1, 2, 3, 6],
        id: 442,
        name: "TolaData Test",
        timeperiods_url: "/indicators/iptt_report/442/timeperiods/",
        tva_url: "/indicators/iptt_report/442/targetperiods/",
        reportingStart: 'Jan 1, 2017',
        reportingEnd: 'Oct 31, 2020',
        periods: {
            3: [
                {
                    sort_index: 0,
                    label: 'Year 1'
                },
                {
                    sort_index: 1,
                    label: 'Year 2'
                },
                {
                    sort_index: 2,
                    label: 'Year 3'
                },
                {
                    sort_index: 3,
                    label: 'Year 4'
                },
            ],
            6: [
                {
                    sort_index: 0,
                    label: 'Quarter 1'
                },
                {
                    sort_index: 1,
                    label: 'Quarter 2'
                },
                {
                    sort_index: 2,
                    label: 'Quarter 3'
                },
            ]
        }
    },
    {
        frequencies: [],
        id: 31,
        name: "Empty",
        timeperiods_url: "/indicators/iptt_report/31/timeperiods/",
        tva_url: "/indicators/iptt_report/31/targetperiods/",
        periods: {}
    },
];

const routerData = {
    programId: 442,
    reportType: TVA,
    frequency: 3,
    showAll: true
};

const labels = {
    frequencies: {
        1: "Life of Program (LoP) only",
        2: "Midline and endline",
        3: "Annual",
        4: "Semi-annual",
        5: "Tri-annual",
        6: "Quarterly",
        7: "Monthly"
    },
    filterTitle: "Report options",
    applyButton: "Apply",
    resetButton: "Reset",
    mostRecent: "Most recent",
    mostRecentCount: "enter a number",
    programSelect: "Program",
    periodSelect: "Target periods",
    showAll: "Show all",
    startPeriodSelect: "Start",
    endPeriodSelect: "End"
};

describe('ReportProgramFilterData', () => {
    let PFD = new ReportProgramFilterData(programData);
    it('instances with program JSON', () => {
        expect(PFD.programs).not.toBeUndefined();
    });
    it('returns program IDs', () => {
        expect(PFD.programIDs.length).toEqual(3);
        expect(PFD.programIDs).toContain('66');
        expect(PFD.programIDs).toContain('442');
        expect(PFD.validID(66)).toBeTruthy();
        expect(PFD.validID('66')).toBeTruthy();
        expect(PFD.validID(442)).toBeTruthy();
        expect(PFD.validID(12)).toBeFalsy();
    });
    it('returns a program', () => {
        let program = PFD.getProgram(66);
        expect(program.name).toBe('Stabilisation');
    });
});

const ipttJSON = {
    programId: 442
};

describe('IPTTReportStore', () => {
    let reportStore;
    beforeEach(() => {
        reportStore = new IPTTReportStore(ipttJSON);
    });
    it('returns the correct program ID', () => {
        expect(reportStore.programId).toEqual(442);
    });
});


describe('IPTTReportUIStore', () => {
    let programStore;
    let reportStore;
    let store;
    beforeEach(() => {
        programStore = new ReportProgramFilterData(programData);
        reportStore = new IPTTReportStore(ipttJSON);
        store = new IPTTReportUIStore(programStore, labels, reportStore, routerData);
    });
    it('returns the correct labels', () => {
        expect(store.labels.filterTitle).toEqual("Report options");
        expect(store.labels.applyButton).toEqual("Apply");
        expect(store.labels.resetButton).toEqual("Reset");
    });
    it('initializes the correct program', () => {
        expect(store.selectedProgramId).toEqual(442);
        expect(store.selectedFrequencyId).toEqual(3);
        expect(store.showAll).toBeTruthy();
        expect(store.reportType).toEqual(TVA);
    });
    it('initializes selected form options', () => {
        expect(store.selectedProgramOption).toEqual({value:442, label: "TolaData Test"});
        expect(store.programOptions.length).toEqual(2);
        expect(store.selectedFrequencyOption).toEqual({value:3, label: "Annual"});
        expect(store.frequencyOptions.length).toEqual(4);
    });
    it('initializes start period label and options', () => {
        expect(store.labels.startPeriodSelect).toEqual('Start');
        expect(store.selectedStartPeriod).toEqual(0);
        store.setStartPeriod(2);
        expect(store.selectedStartPeriod).toEqual(2);
        store.setShowAll();
        expect(store.selectedStartPeriod).toEqual(0);
    });
    it('initializes end period label and options', () => {
        expect(store.labels.endPeriodSelect).toEqual('End');
        expect(store.selectedEndPeriod).toEqual(3);
        expect(store.showAll).toBeTruthy();
        store.setEndPeriod(2);
        expect(store.showAll).toBeFalsy();
        expect(store.selectedEndPeriod).toEqual(2);
        store.setShowAll();
        expect(store.selectedEndPeriod).toEqual(3);
    });
    it('initializes with correct labels for lop frequency', () => {
        expect(store.getPeriods().length).toEqual(4);
        expect(store.getPeriods(true).length).toEqual(4);
        store.setSelectedFrequency(1);
        expect(store.selectedFrequencyId).toEqual(1);
        expect(store.selectedStartPeriod).toEqual(0);
        expect(store.selectedEndPeriod).toEqual(0);
        expect(store.showAll).toBeTruthy();
        expect(store.getPeriods().length).toEqual(1);
        expect(store.getPeriods(true).length).toEqual(1);
    });
    it('updates periods to match most recent', () => {
        store.setMostRecentCount(2);
        expect(store.selectedStartPeriod).toEqual(2);
        expect(store.selectedEndPeriod).toEqual(3);
        expect(store.showAll).toBeFalsy();
        expect(store.mostRecent).toBeTruthy();
        store.setStartPeriod(1);
        expect(store.showAll).toBeFalsy();
        expect(store.mostRecent).toBeFalsy();
        store.setStartPeriod(0);
        expect(store.showAll).toBeTruthy();
    });
    it('does not reload when program has not changed', () => {
        expect(store.getPeriods()[0].label).toEqual('Year 1');
        store.setSelectedFrequency(6);
        expect(store.getPeriods()[0].label).toEqual('Quarter 1');
        expect(store.submitUrl).toBeFalsy();
        store.setStartPeriod(1);
        expect(store.submitUrl).toBeFalsy();
        store.setEndPeriod(2);
        expect(store.submitUrl).toBeFalsy();
    });
    it('does reload when program changes', () => {
       store.setSelectedProgram(66);
       expect(store.frequencyOptions.length).toBe(1);
       expect(store.selectedFrequencyId).toBe(null);
       store.setSelectedFrequency(1);
       expect(store.selectedFrequencyId).toBe(1);
       expect(store.submitUrl).not.toBeFalsy();
    });
});