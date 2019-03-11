import React from 'react';
import {
    ProgramSelect,
    PeriodSelect,
    ShowAllSelect,
    MostRecentSelect,
    MostRecentCount,
    StartPeriodSelect,
    EndPeriodSelect,
    LevelSelect,
    TypeSelect,
    SectorSelect,
    SiteSelect,
    IndicatorSelect
} from '../../iptt_shared/components/form';

export class IPTTFilterForm extends React.Component {
    render() {
        let store = this.props.uiStore;
        let classNames = {
            outerDivClass: 'form-row mb-3',
            fieldClass: 'form-control',
            labelClass: 'col-form-label'
        };
        let radioClassNames = {
            outerDivClass: 'form-check form-check-inline pt-1',
            fieldClass: '',
            spanClass: 'form-check-input',
            labelClass: 'form-check-label'
        };
        let multiselectClassNames = {
            outerDivClass: 'form-group mb-2',
            labelClass: 'col-form-label text-uppercase',
            fieldClass: 'form-control'
        };
        return <React.Fragment>
                <div id="filter-top" className="p-3">
                    <h3 className="filter-title">{store.labels.filterTitle}</h3>
                    <ProgramSelect {...this.props} { ...classNames } />
                    <PeriodSelect {...this.props} { ...classNames } />
                    <div className="form-row mb-3">
                        <div className="col-sm-4">
                            <ShowAllSelect {...this.props} {...radioClassNames} />
                        </div>
                        <div className="col-sm-4 p-0">
                            <MostRecentSelect {...this.props} {...radioClassNames}  />
                        </div>
                        <div className="col-sm-4">
                            <MostRecentCount {...this.props} fieldClass={'form-control'} />
                        </div>
                    </div>
                    <div className="form-row mb-3">
                        <StartPeriodSelect {...this.props} />
                    </div>
                    <div className="form-row mb-3">
                        <EndPeriodSelect {...this.props} />
                    </div>
                </div>
                <div id="filter-middle" className="p-3">
                    <LevelSelect {...this.props} {...multiselectClassNames} />
                    <TypeSelect {...this.props} {...multiselectClassNames} />
                    <SectorSelect {...this.props} {...multiselectClassNames} />
                    <SiteSelect {...this.props} {...multiselectClassNames} />
                    <IndicatorSelect {...this.props} {...multiselectClassNames} />
                </div>
                <div id="filter-bottom" className="d-flex justify-content-between no-gutters p-3">
                    <div className="col pr-2">
                        <button onClick={ store.applyFilters } className="btn btn-block btn-primary">
                            { store.labels.applyButton }
                        </button>
                    </div>
                    <div className="col pl-2">
                        <button onClick={ store.resetAll } className="btn btn-block btn-inverse">
                            { store.labels.resetButton }
                        </button>
                    </div>
                </div>
                </React.Fragment>
    }
}