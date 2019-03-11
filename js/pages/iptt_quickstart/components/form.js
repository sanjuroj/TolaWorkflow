import React from 'react';
import {
    ProgramSelect,
    PeriodSelect,
    ShowAllSelect,
    MostRecentSelect,
    MostRecentCount,
    IPTTSubmit
} from '../../iptt_shared/components/form'
import { TVA } from '../../iptt_shared/models';


export const IPTTQuickstartForm = (props) => {
    let classNames = {
        outerDivClass: 'form-group',
        labelClass: 'col-form-label text-uppercase',
        fieldClass: ''
    };
    let radioClassNames = {
        ...classNames,
        outerDivClass: 'form-check form-check-inline pv-1',
        spanClass: 'form-check-input'
    };

    return <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{props.uiStore.formTitle}</h5>
                    <p className="card-subtitle text-muted mb-2">{props.uiStore.formSubtitle}</p>
                    <ProgramSelect {...props} { ...classNames } />
                    { props.uiStore.reportType == TVA && (
                        <React.Fragment>
                            <PeriodSelect {...props} { ...classNames } outerDivClass={'form-group pt-4'} />
                            <div className="form-group d-lg-flex pb-4">
                                <ShowAllSelect {...props} { ...radioClassNames } />
                                <MostRecentSelect {...props} { ...radioClassNames } />
                                <MostRecentCount {...props} />
                            </div>
                        </React.Fragment>
                        ) }
                    <IPTTSubmit {...props} />
                </div>
            </div>;
};