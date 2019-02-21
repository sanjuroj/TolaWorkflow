import React from 'react';
import { ProgramSelect, PeriodSelect, ShowAllSelect, MostRecentSelect, MostRecentCount, IPTTSubmit } from '../../iptt_shared/components/form'
import { TVA, TIMEPERIODS } from '../../iptt_shared/models';


export const IPTTQuickstartForm = (props) => {
    const title = props.reportType == TVA ? props.uiStore.labels.tvaTitle : props.uiStore.labels.timeperiodsTitle;
    const subtitle = props.reportType == TVA ? props.uiStore.labels.tvaSubtitle : props.uiStore.labels.timeperiodsSubtitle;
    return <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-subtitle text-muted mb-2">{subtitle}</p>
                    <ProgramSelect {...props} outerClassNames="form-group" labelClassNames="col-form-label text-uppercase"/>
                    { props.reportType == TVA && (
                        <React.Fragment>
                            <PeriodSelect {...props} outerClassNames="form-group pt-4" labelClassNames="col-form-label text-uppercase" />
                            <div className="form-group d-lg-flex pb-4">
                                <ShowAllSelect {...props} outerClassNames="py-1 pr-2" />
                                <MostRecentSelect {...props} outerClassNames="py-1" />
                                <MostRecentCount {...props} />
                            </div>
                        </React.Fragment>
                        ) }
                    <div className="d-flex justify-content-center mb-1">
                        <IPTTSubmit {...props} />
                    </div>
                </div>
            </div>;
};