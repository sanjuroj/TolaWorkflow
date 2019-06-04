import React from 'react';
import { observer, inject } from 'mobx-react';
import { PinButton, ExcelButton } from './buttons';


const IPTTHeader = inject('filterStore')(
    observer(({ filterStore }) => {
        return <div className="page-subheader">
                    <div id="id_span_iptt_date_range" className="subheader__title">
                        <h2 className="pt-3 text-title-case">{
                            gettext('Indicator Performance Tracking Table')
                        }</h2>
                        <h4 className="pb-3">{ (filterStore.startPeriodLabel && filterStore.endPeriodLabel)
                                               ? filterStore.startPeriodLabel + " - " + filterStore.endPeriodLabel
                                               : "" }</h4>
                    </div>
                    <div className="subheader__actions">
                        <PinButton />
                        <ExcelButton />
                    </div>
                </div>
    })
);


export default IPTTHeader;