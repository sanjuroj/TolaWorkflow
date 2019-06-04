import React from 'react';
import { observer, inject } from 'mobx-react';

import * as HeaderCells from './headerCells';


const ProgramNameRow = inject('reportStore')(
    observer(({ reportStore }) => {
        return (
            <tr className="title-row">
                <td colSpan={ reportStore.levelColumn ? 9 : 8 } id="id_td_iptt_program_name" className="align-bottom pt-2">
                    <h5 className="m-0">
                       { reportStore.programName }
                    </h5>
                </td>
                <td scope="colgroup" colSpan="3"
                    className="text-center title-row text-nowrap align-bottom text-uppercase">
                    {
                        /* # Translators: header for a group of columns showing totals over the life of the program */
                        gettext('Life of program')
                    }
                </td>
                {
                    reportStore.reportPeriods.map(
                        (period, index) => (
                            <HeaderCells.PeriodHeader isTVA={ reportStore.isTVA} key={ index }
                                                      period={ period } />
                        )
                    )
                }
            </tr>
        );
    })
);

const ColumnHeaderRow = inject('reportStore')(
    observer(({ reportStore }) => {
        return (
            <tr>
                <HeaderCells.BorderedHeader
                    styleWidth={110}
                    align="center"
                    label={
                        /* # Translators: Abbreviation as column header for "number" column */
                        gettext('No.')
                    } />
                <HeaderCells.UnBorderedHeader
                    styleWidth={600}
                    label={
                        /* # Translators: Column header for indicator Name column */
                        gettext('Indicator')
                    } />
                <HeaderCells.UnBorderedHeader />
                { reportStore.levelColumn && <HeaderCells.BorderedHeader
                    styleWidth={90}
                    label={
                        /* # Translators: Column header for indicator Level name column */
                        gettext('Level')
                    } />
                }
                <HeaderCells.BorderedHeader
                    styleWidth={250}
                    label={
                        /* # Translators: Column header */
                        gettext('Unit of measure')
                    } />
                <HeaderCells.BorderedHeader
                    label={
                        /* # Translators: Column header for "direction of change" column (increasing/decreasing) */
                        gettext('Change')
                    } />
                <HeaderCells.BorderedHeader
                    styleWidth={130}
                    label={
                        /* # Translators: Column header, stands for "Cumulative"/"Non-cumulative" */
                        gettext('C / NC')
                    } />
                <HeaderCells.BorderedHeader
                    styleWidth={50}
                    label={
                        /* # Translators: Column header, numeric or percentage type indicator */
                        gettext('# / %')
                    } />
                <HeaderCells.BorderedHeader
                    label={
                        /* # Translators: Column header */
                        gettext('Baseline')
                    } />
                <HeaderCells.TVAHeader />
                { reportStore.reportPeriods.map(
                    (period, index) => (reportStore.isTVA ?
                                <HeaderCells.TVAHeader key={ index } /> :
                                <HeaderCells.ActualHeader key={ index } />
                              )
                )}
            </tr>
        )
    })
);

const ReportTableHeader = () => {
    return (
        <thead className="thead-light">
            <ProgramNameRow />
            <ColumnHeaderRow />
        </thead>
        );
}

export default ReportTableHeader;