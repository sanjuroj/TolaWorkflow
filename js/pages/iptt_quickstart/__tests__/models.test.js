/**
 * Tests for the iptt_quickstart/models module
 * @see module:iptt_quickstart/models
 */

import {
    QuickstartProgramFilterData,
    DualFilterStore,
    IPTTQuickstartTVAStore,
    IPTTQuickstartTimeperiodsStore
} from '../models';
import { TVA, TIMEPERIODS } from '../../iptt_shared/models';

const programData = [
    {
        frequencies: [1],
        id: 66,
        name: "Stabilisation",
        timeperiods_url: "/indicators/iptt_report/66/timeperiods/",
        tva_url: "/indicators/iptt_report/66/targetperiods/",
    },
    {
        frequencies: [1, 2, 3, 6, 7],
        id: 442,
        name: "TolaData Test",
        timeperiods_url: "/indicators/iptt_report/442/timeperiods/",
        tva_url: "/indicators/iptt_report/442/targetperiods/",
    },
    {
        frequencies: [],
        id: 31,
        name: "Empty",
        timeperiods_url: "/indicators/iptt_report/31/timeperiods/",
        tva_url: "/indicators/iptt_report/31/targetperiods/",
    },
];

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
    mostRecent: "Most recent",
    mostRecentCount: "enter a number",
    programSelect: "Program",
    showAll: "Show all",
    submit: "View Report",
    timeperiodsSubtitle: "View the most recent two months of results. (You can customize your time periods.) This report does not include periodic targets.",
    timeperiodsTitle: "Recent progress for all indicators",
    periodSelect: "Target periods",
    tvaSubtitle: "View results organized by target period for indicators that share the same target frequency.",
    tvaTitle: "Periodic targets vs. actuals",
};

describe('QuickstartProgramFilterData', () => {
    let QsPFD = new QuickstartProgramFilterData(programData);
    it('instances with program JSON', () => {
        expect(QsPFD.programs).not.toBeUndefined();
    });
    it('returns program IDs', () => {
        expect(QsPFD.programIDs.length).toEqual(3);
        expect(QsPFD.programIDs).toContain('66');
        expect(QsPFD.programIDs).toContain('442');
        expect(QsPFD.validID(66)).toBeTruthy();
        expect(QsPFD.validID('66')).toBeTruthy();
        expect(QsPFD.validID(442)).toBeTruthy();
        expect(QsPFD.validID(12)).toBeFalsy();
    });
    it('returns a program', () => {
        let program = QsPFD.getProgram(66);
        expect(program.name).toBe('Stabilisation');
    });
});

describe('IPTTQuickstartUIStore', () => {
    var programStore;
    beforeEach(() => {
        programStore = new QuickstartProgramFilterData(programData);
    });
    describe('as a TVA UI Store', () => {
        var store;
        beforeEach(() => {
            store = new IPTTQuickstartTVAStore(programStore, labels);
        });
        it('returns the correct form type', () => {
            expect(store.reportType).toBe(TVA);
            expect(store.enabled).toBeTruthy();
        });
        it('returns the correct title', () => {
            expect(store.formTitle).toBe("Periodic targets vs. actuals");
            expect(store.formSubtitle).toBe("View results organized by target period for indicators that share the same target frequency.");
        });
        it('returns program label and options', () => {
            expect(store.labels.programSelect).toBe("Program");
            //only two because no frequency programs are excluded
            expect(store.programOptions).toEqual([
                {value: "66", label: "Stabilisation"},
                {value: "442", label: "TolaData Test"}
            ]);
        });
        it('updates selected program', () => {
            store.setSelectedProgram(66);
            expect(store.selectedProgramOption).toEqual({value: 66, label: "Stabilisation"});
            expect(store.selectedProgramId).toEqual(66);
            store.setSelectedProgram(442);
            expect(store.selectedProgramOption).toEqual({value: 442, label: "TolaData Test"});
        });
        it('returns frequency label and options', () => {
            expect(store.labels.periodSelect).toBe('Target periods');
            store.setSelectedProgram(442);
            expect(store.frequencyOptions).toEqual([
                {value: 1, label: "Life of Program (LoP) only"},
                {value: 2, label: "Midline and endline"},
                {value: 3, label: "Annual"},
                {value: 6, label: "Quarterly"},
                {value: 7, label: "Monthly"},
            ]);
        });
        it('updates selected frequency', () => {
            store.setSelectedProgram(442);
            store.setSelectedFrequency(3);
            expect(store.selectedFrequencyId).toEqual(3);
            expect(store.selectedFrequencyOption).toEqual({value:3, label: "Annual"});
        });
        it('returns showall label and options', () => {
            store.setSelectedProgram(442);
            store.setSelectedFrequency(3);
            expect(store.labels.showAll).toBe("Show all");
            expect(store.showAll).toBeTruthy();
        });
        it('returns mostrecent label and options', () => {
            store.setSelectedProgram(442);
            store.setSelectedFrequency(3);
            expect(store.labels.mostRecent).toBe("Most recent");
            expect(store.mostRecent).toBeFalsy();
        });
        it('updates showall and mostrecent with change', () => {
            store.setSelectedProgram(442);
            store.setSelectedFrequency(3);
            store.setMostRecent();
            expect(store.mostRecent).toBeTruthy();
            expect(store.showAll).toBeFalsy();
            store.setShowAll();
            expect(store.mostRecent).toBeFalsy();
            expect(store.showAll).toBeTruthy();
        });
        it('returns mostrecentcount label', () => {
            store.setSelectedProgram(442);
            store.setSelectedFrequency(3);
            expect(store.labels.mostRecentCount).toBe("enter a number");
            expect(store.mostRecentCount).toBe(null);
        });
        it('updates mostrecentcount', () => {
            store.setSelectedProgram(442);
            store.setSelectedFrequency(3);
            store.setMostRecentCount(4);
            expect(store.mostRecentCount).toBe(4);
            expect(store.mostRecent).toBeTruthy();
            expect(store.showAll).toBeFalsy();
        });
        it('labels the submit button', () => {
            expect(store.labels.submit).toBe("View Report");
            expect(store.submitUrl).toBeFalsy();
        });
        it('produces the correct URL', () => {
            store.setSelectedProgram(442);
            expect(store.submitUrl).toBeFalsy();
            store.setSelectedFrequency(3);
            expect(store.submitUrl).toEqual('/indicators/iptt_report/442/targetperiods/?frequency=3&show_all=1');
            store.setMostRecentCount(4);
            expect(store.submitUrl).toEqual('/indicators/iptt_report/442/targetperiods/?frequency=3&recents=4');
            store.setSelectedFrequency(6);
            expect(store.submitUrl).toEqual('/indicators/iptt_report/442/targetperiods/?frequency=6&recents=4');
            store.setSelectedProgram(66);
            expect(store.selectedFrequencyId).toBe(null);
            expect(store.submitUrl).toBeFalsy();
            store.setSelectedFrequency(1);
            expect(store.submitUrl).toEqual('/indicators/iptt_report/66/targetperiods/?frequency=1');
        });
    });
    describe('as a Timeperiods UI Store', () => {
        var store;
        beforeEach(() => {
            store = new IPTTQuickstartTimeperiodsStore(programStore, labels);
        });
        it('returns the correct form type', () => {
            expect(store.reportType).toBe(TIMEPERIODS);
            expect(store.enabled).toBeFalsy();
        });
        it('returns the correct title', () => {
            expect(store.formTitle).toBe("Recent progress for all indicators");
            expect(store.formSubtitle).toBe("View the most recent two months of results. (You can customize your time periods.) This report does not include periodic targets.");
        });
        it('returns program select label and options', () => {
            expect(store.labels.programSelect).toBe("Program");
            expect(store.programOptions).toEqual([
                {value: "31", label: "Empty"},
                {value: "66", label: "Stabilisation"},
                {value: "442", label: "TolaData Test"}
            ]);
        });
        it('updates selected program and triggers event bus', () => {
            store.setSelectedProgram(66);
            expect(store.selectedProgramOption).toEqual({value: 66, label: "Stabilisation"});
            expect(store.selectedProgramId).toEqual(66);
            store.setSelectedProgram(442);
            expect(store.selectedProgramOption).toEqual({value: 442, label: "TolaData Test"});
            expect(store.selectedProgramId).toEqual(442);            
        });
        it('produces the correct URL', () => {
            expect(store.submitUrl).toBeFalsy();
            store.setSelectedProgram(442);
            expect(store.submitUrl).toEqual('/indicators/iptt_report/442/timeperiods/?frequency=7&recents=2');
            store.setSelectedProgram(66);
            expect(store.submitUrl).toEqual('/indicators/iptt_report/66/timeperiods/?frequency=7&recents=2');
        });
    });
    describe('as a dual filter store', () => {
        var tvaStore;
        var tpStore;
        var dualStore;
        beforeEach(() => {
            dualStore = new DualFilterStore(programStore, labels);
            tvaStore = dualStore.getStore(TVA);
            tpStore = dualStore.getStore(TIMEPERIODS);
        });
        it('enables the other store on activate', () => {
           expect(tvaStore.enabled).toBeTruthy();
           expect(tpStore.enabled).toBeFalsy();
           tpStore.setSelectedProgram(66);
           expect(tvaStore.enabled).toBeFalsy();
           expect(tvaStore.submitUrl).toBeFalsy();
           expect(tpStore.enabled).toBeTruthy();
           expect(tpStore.submitUrl).toEqual('/indicators/iptt_report/66/timeperiods/?frequency=7&recents=2');
           tvaStore.setSelectedProgram(442);
           expect(tvaStore.enabled).toBeTruthy();
           expect(tpStore.enabled).toBeFalsy();
           expect(tpStore.submitUrl).toBeFalsy();
        });
    });
});
