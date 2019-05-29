import React from 'react';
import { observer, inject } from 'mobx-react';

import { LevelGroup, IndicatorRow } from './tableRows';

const ReportTableBody = inject('reportStore')(
    observer(({ reportStore }) => {
        return (
        <tbody>
            {
                reportStore.levelRows ?
                    reportStore.groupedIndicatorRows.map(
                        ({level, indicators}, index) => (
                            <LevelGroup level={ level } indicators={ indicators } key={ index } />
                        )
                    )
                :
                    reportStore.indicatorRows.map(
                        (indicator, index) => (
                            <IndicatorRow indicator={ indicator }
                                          levelCol={ reportStore.levelColumn }
                                          key={ index } />
                        )
                    )
            }
        </tbody>
        );
    })
);

export default ReportTableBody;