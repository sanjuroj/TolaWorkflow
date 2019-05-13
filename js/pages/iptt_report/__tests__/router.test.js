import ipttRouter from '../router';
import { TVA, TIMEPERIODS, GROUP_BY_CHAIN, GROUP_BY_LEVEL } from '../../../constants';


var mockProgramStore = {
    validPID: true,
    validFrequencies: [1, 4, 5],
    groupByOld: false,
    validateProgramId( id ) {
        if (this.validPID) {
            return Promise.resolve(parseInt(id));
        } else {
            return Promise.reject("bad ID");
        }
    },
    validateFrequency( programId, frequency, reportType ) {
        var frequencies = reportType === TIMEPERIODS ? [3, 4, 5, 6, 7] : this.validFrequencies;
        if (frequencies.includes(parseInt(frequency))) {
            return parseInt(frequency);
        }
        throw "bad freq";
    },
    currentPeriod( programId, frequency) {
        return 7;
    },
    lastPeriod( programId, frequency ) {
        return 8;
    },
    startPeriodFromDate( programId, frequency, date ) {
        if (date instanceof Date && !isNaN(date)) {
            return 3;
        }
        throw "bad date";
    },
    endPeriodFromDate( programId, frequency, date ) {
        if (date instanceof Date && !isNaN(date)) {
            if (date.toISOString() == new Date('2017-01-31').toISOString()) {
                return 10;
            }
            return 6;
        }
        throw "bad date";
    },
    oldLevels( programId ) {
        return this.groupByOld;
    }
}

describe('router params processing initial url string', () => {
    var instance;
    var params = {name: 'iptt.tva', programId: '442', frequency: '4'};
    beforeEach(() => {
        instance = new ipttRouter();
        instance.programStore = mockProgramStore;
        instance.programStore.validPID = true;
        instance.programStore.validFrequencies = [1, 4, 5];
    });
    it('processes report type from route name tva', () => {
        instance.processParams({...params, name: 'iptt.tva'});
        expect(instance.reportType).toEqual(TVA);
    });
    it('processes report type from route name timeperiods', () => {
        instance.processParams({...params, name: 'iptt.timeperiods'});
        expect(instance.reportType).toEqual(TIMEPERIODS);
    });
    it('handles nonsense report type', () => {
        instance.processParams({...params, name: 'iptt'});
        expect(instance.reportType).toBeNull();
    });
    it('processes programID for valid from programStore', async () => {
        expect.assertions(3);
        expect(instance.programId).toBeNull();
        await instance.processParams({...params, name: 'iptt.tva', programId: '442'});
        expect(instance.reportType).toEqual(TVA);
        expect(instance.programId).toEqual(442);
    });
    it('processes programID for invalid from programStore', done => {
        expect.assertions(3);
        mockProgramStore.validPID = false;
        expect(instance.processParams({...params, name: 'iptt.tva', programId: '442'})
            .finally(() => {
                expect(instance.reportType).toEqual(TVA);
                expect(instance.programId).toBeNull();
                mockProgramStore.validPID = true;
                done();
            })
        ).rejects.toEqual("bad ID");
    });
    it('processes frequency for timeperiods report', done => {
        expect.assertions(5);
        expect(instance.frequency).toBeNull();
        expect(instance.processParams({...params, name: 'iptt.timeperiods', programId: '438', frequency: '3'})
            .finally(() => {
                expect(instance.reportType).toEqual(TIMEPERIODS);
                expect(instance.programId).toEqual(438);
                expect(instance.frequency).toEqual(3);
                done();
            })
        ).resolves.toBeTruthy();
    });
    it('processes frequency for timeperiods report', done => {
        expect.assertions(4);
        expect(instance.processParams({...params, name: 'iptt.timeperiods', programId: '438', frequency: '7'})
            .finally(() => {
                expect(instance.reportType).toEqual(TIMEPERIODS);
                expect(instance.programId).toEqual(438);
                expect(instance.frequency).toEqual(7);
                done();
            })
        ).resolves.toBeTruthy();
    });
    it('processes invalid frequency for timeperiods report', done => {
        expect.assertions(3);
        expect(instance.processParams({...params, name: 'iptt.timeperiods', programId: '120', frequency: '1'})
            .finally(() => {
                expect(instance.programId).toEqual(120);
                expect(instance.frequency).toBeNull();
                done();
            })
        ).rejects.toEqual("bad freq");
    });
    it('processes invalid frequency for timeperiods report', done => {
        expect.assertions(2);
        expect(instance.processParams({...params, name: 'iptt.timeperiods', frequency: '2'})
            .finally(() => {
                expect(instance.frequency).toBeNull();
                done();
            })
        ).rejects.toEqual("bad freq");
    });
    it('processes valid frequency for tva report', done => {
        expect.assertions(2);
        expect(instance.processParams({...params, name: 'iptt.tva', frequency: '1'})
            .finally(() => {
                expect(instance.frequency).toEqual(1);
                done();
            })
        ).resolves.toBeTruthy();
    });
    it('processes invalid frequency for tva report', done => {
        expect.assertions(2);
        expect(instance.processParams({...params, name: 'iptt.tva', frequency: '3'})
            .finally(() => {
                expect(instance.frequency).toBeNull();
                done();
            })
        ).rejects.toEqual("bad freq");
    });
    it('processes timeperiods as frequency count (good)', done => {
        expect.assertions(2);
        let {frequency, ...otherParams} = params;
        expect(instance.processParams({...otherParams, name: 'iptt.timeperiods', timeperiods: '5'})
            .finally(() => {
                expect(instance.frequency).toEqual(5);
                done();
            })
        ).resolves.toBeTruthy();
    });
    it('processes timeperiods as frequency count (bad)', done => {
        expect.assertions(2);
        let {frequency, ...otherParams} = params;
        expect(instance.processParams({...otherParams, name: 'iptt.timeperiods', timeperiods: '1'})
            .finally(() => {
                expect(instance.frequency).toBeNull();
                done();
            })
        ).rejects.toEqual("bad freq");
    });
    it('processes targetperiods as frequency count (good)', done => {
        expect.assertions(2);
        let {frequency, ...otherParams} = params;
        expect(instance.processParams({...otherParams, name: 'iptt.tva', targetperiods: '5'})
            .finally(() => {
                expect(instance.frequency).toEqual(5);
                done();
            })
        ).resolves.toBeTruthy();
    });
    it('processes targetperiods as frequency count (bad)', done => {
        expect.assertions(2);
        let {frequency, ...otherParams} = params;
        expect(instance.processParams({...otherParams, name: 'iptt.tva', targetperiods: '2'})
            .finally(() => {
                expect(instance.frequency).toBeNull();
                done();
            })
        ).rejects.toEqual("bad freq");
    });
    it('processes show all (timeframe=1)', done => {
        expect(instance.processParams({...params, timeframe: '1'})
               .finally(() => {
                expect(instance.startPeriod).toEqual(0);
                expect(instance.endPeriod).toEqual(8);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes most recent (timeframe=2)', done => {
        expect(instance.processParams({...params, timeframe: '2', numrecentperiods: '3'})
               .finally(() => {
                expect(instance.startPeriod).toEqual(5);
                expect(instance.endPeriod).toEqual(7);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes most recent without numrecentperiods', done => {
        expect(instance.processParams({...params, timeframe: '2'})
               .finally(() => {
                expect(instance.startPeriod).toEqual(6);
                expect(instance.endPeriod).toEqual(7);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes date ranges that validate', done => {
        expect(instance.processParams({...params, start_period: '2017-11-01', end_period: '2018-12-31'})
               .finally(() => {
                expect(instance.startPeriod).toEqual(3);
                expect(instance.endPeriod).toEqual(6);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes date ranges that dont validate', done => {
        expect.assertions(3);
        expect(instance.processParams({...params, start_period: '2017-13-41', end_period: '2018-12-33'})
               .finally(() => {
                expect(instance.startPeriod).toBeNull();
                expect(instance.endPeriod).toBeNull();
                done();
               })
        ).rejects.toEqual("bad date");
    });
    it('adjusts dates greater than program range', done => {
        expect(instance.processParams({...params, start_period: '2017-11-01', end_period: '2017-01-31'})
            .finally(() => {
                expect(instance.startPeriod).toEqual(3);
                expect(instance.endPeriod).toEqual(8);
                done();
            })
        ).resolves.toBeTruthy();
    });
    it('processes groupby value', done => {
        expect.assertions(2);
        expect(instance.processParams({...params, groupby: '1'})
               .finally(() => {
                expect(instance.groupBy).toEqual(GROUP_BY_CHAIN);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes groupby value 2', done => {
        expect.assertions(2);
        expect(instance.processParams({...params, groupby: '2'})
               .finally(() => {
                expect(instance.groupBy).toEqual(GROUP_BY_LEVEL);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes groupby value', done => {
        expect.assertions(2);
        mockProgramStore.groupByOld = true;
        expect(instance.processParams({...params, groupby: '1'})
               .finally(() => {
                expect(instance.groupBy).toBeNull();
                mockProgramStore.groupByOld = false;
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes groupby value 2', done => {
        expect.assertions(2);
        mockProgramStore.groupByOld = true;
        expect(instance.processParams({...params, groupby: '2'})
               .finally(() => {
                expect(instance.groupBy).toBeNull();
                mockProgramStore.groupByOld = false;
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes single level filter', done => {
        expect(instance.processParams({...params, levels: '21'})
               .finally(() => {
                expect(instance.levels).toEqual([21]);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes multiple level filters', done => {
        expect(instance.processParams({...params, levels: ['21', '32', '45']})
               .finally(() => {
                expect(instance.levels).toEqual([21, 32, 45]);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('removes one tiers if set to levels', done => {
        expect.assertions(3);
        expect(instance.processParams({...params, levels: ['21', '32', '45'], tiers: '24'})
               .finally(() => {
                expect(instance.levels).toEqual([21, 32, 45]);
                expect(instance.tiers).toBeNull();
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('removes many tiers if set to levels', done => {
        expect.assertions(3);
        expect(instance.processParams({...params, levels: ['21', '32', '45'], tiers: '24'})
               .finally(() => {
                expect(instance.levels).toEqual([21, 32, 45]);
                expect(instance.tiers).toBeNull();
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes single tiers filter', done => {
        expect.assertions(2);
        expect(instance.processParams({...params, tiers: '21'})
               .finally(() => {
                expect(instance.tiers).toEqual([21]);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes multiple tiers filters', done => {
        expect.assertions(2);
        expect(instance.processParams({...params, tiers: ['21', '32', '45']})
               .finally(() => {
                expect(instance.tiers).toEqual([21, 32, 45]);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes single sites filter', done => {
        expect.assertions(2);
        expect(instance.processParams({...params, sites: '21'})
               .finally(() => {
                expect(instance.sites).toEqual([21]);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes multiple sites filters', done => {
        expect.assertions(2);
        expect(instance.processParams({...params, sites: ['21', '32', '45']})
               .finally(() => {
                expect(instance.sites).toEqual([21, 32, 45]);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes single types filter', done => {
        expect.assertions(2);
        expect(instance.processParams({...params, types: '21'})
               .finally(() => {
                expect(instance.types).toEqual([21]);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes multiple types filters', done => {
        expect.assertions(2);
        expect(instance.processParams({...params, types: ['21', '32', '45']})
               .finally(() => {
                expect(instance.types).toEqual([21, 32, 45]);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes single indicators filter', done => {
        expect.assertions(2);
        expect(instance.processParams({...params, indicators: '21'})
               .finally(() => {
                expect(instance.indicators).toEqual([21]);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes multiple indicators filters', done => {
        expect.assertions(2);
        expect(instance.processParams({...params, indicators: ['21', '32', '45']})
               .finally(() => {
                expect(instance.indicators).toEqual([21, 32, 45]);
                done();
               })
        ).resolves.toBeTruthy();
    });
    it('processes many filters', done => {
        expect.assertions(6);
        expect(instance.processParams({
            ...params,
            levels: ['22', '44'],
            tiers: '100',
            sites: '43',
            types: ['100', '99']})
            .finally(() => {
                expect(instance.levels).toEqual([22, 44]);
                expect(instance.tiers).toBeNull();
                expect(instance.sites).toEqual([43]);
                expect(instance.types).toEqual([100, 99]);
                expect(instance.indicators).toBeNull();
                done();
            })
        ).resolves.toBeTruthy();
    });
    it('gets params', done => {
        expect.assertions(2);
        let paramsToStart = {
            ...params,
            timeframe: '1',
            levels: ['22', '44'],
            tiers: '100',
            sites: '43',
            types: ['100', '99']
        };
        instance.processParams(paramsToStart)
            .finally(() => {
                let {name, timeframe, tiers, ...expectedParams} = paramsToStart;
                expectedParams.start = '0';
                expectedParams.end = '8';
                expectedParams.groupby = '1';
                expectedParams.sites = ['43'];
                expect(instance.routeName).toEqual(name);
                expect(instance.routeParams).toEqual(expectedParams);
                done();
        });
    });
});