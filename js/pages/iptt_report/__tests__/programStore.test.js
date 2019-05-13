
import { TVA, TIMEPERIODS, GROUP_BY_CHAIN, GROUP_BY_LEVEL } from '../../../constants';
import ProgramStore from '../models/programStore';

import programJSON from './fixtures/programStore';

describe('programStore init', () => {
    it('initializes without crashing', () => {
        let instance = new ProgramStore();
        instance.addPrograms(programJSON);
    });
    describe('initialied programstore', () => {
        var instance;
        beforeEach(() => {
            instance = new ProgramStore();
            instance.addPrograms(programJSON);
        });
        it('validates program ids', () => {
            expect(instance.validateProgramId( 1 )).toBeTruthy();
            expect(instance.validateProgramId( 2 )).toBeTruthy();
            expect(instance.validateProgramId( 5 )).toBeFalsy();
        });
        it('validates frequencies', () => {
            expect(instance.validateFrequency(1, 1, TIMEPERIODS)).toBeFalsy();
            expect(instance.validateFrequency(1, 2, TIMEPERIODS)).toBeFalsy();
            expect(instance.validateFrequency(1, 8, TIMEPERIODS)).toBeFalsy();
            expect(instance.validateFrequency(1, 3, TIMEPERIODS)).toBeTruthy();
            expect(instance.validateFrequency(1, 4, TIMEPERIODS)).toBeTruthy();
            expect(instance.validateFrequency(1, 5, TIMEPERIODS)).toBeTruthy();
            expect(instance.validateFrequency(1, 6, TIMEPERIODS)).toBeTruthy();
            expect(instance.validateFrequency(1, 7, TIMEPERIODS)).toBeTruthy();
            expect(instance.validateFrequency(1, 1, TVA)).toBeTruthy();
            expect(instance.validateFrequency(1, 3, TVA)).toBeTruthy();
            expect(instance.validateFrequency(2, 1, TVA)).toBeTruthy();
            expect(instance.validateFrequency(2, 4, TVA)).toBeTruthy();
            expect(instance.validateFrequency(2, 2, TVA)).toBeFalsy();
            expect(instance.validateFrequency(2, 8, TVA)).toBeFalsy();
            expect(instance.validateFrequency(1, 7, TVA)).toBeFalsy();
        });
        it('returns the current period', () => {
            expect(instance.currentPeriod(1, 4)).toEqual(2);
            expect(instance.currentPeriod(1, 3)).toEqual(1);
            expect(instance.currentPeriod(2, 4)).toEqual(2);
            expect(instance.currentPeriod(2, 3)).toEqual(1);
        });
        it('returns the last period', () => {
            expect(instance.lastPeriod(1, 3)).toEqual(1);
            expect(instance.lastPeriod(1, 4)).toEqual(3);
            expect(instance.lastPeriod(2, 3)).toEqual(2);
            expect(instance.lastPeriod(2, 4)).toEqual(5);
        });
        it('returns the start period by date', () => {
            expect(instance.startPeriodFromDate(1, 3, new Date('2019-01-01'))).toEqual(1);
            expect(instance.startPeriodFromDate(1, 4, new Date('2019-01-01'))).toEqual(2);
            expect(instance.startPeriodFromDate(2, 4, new Date('2020-01-01'))).toEqual(4);
        });
        it('returns the end period by date', () => {
            expect(instance.endPeriodFromDate(1, 3, new Date('2018-12-31'))).toEqual(0);
            expect(instance.endPeriodFromDate(1, 4, new Date('2018-12-31'))).toEqual(1);
            expect(instance.endPeriodFromDate(2, 4, new Date('2020-06-30'))).toEqual(4);
        });
        it('returns the old level correctly', () => {
            expect(instance.oldLevels( 1 )).toBeTruthy();
            expect(instance.oldLevels( 2 )).toBeFalsy();
        });
    });
});