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
        return <React.Fragment>
                <div id="filter-top" className="p-3">
                    <h3 className="filter-title">{this.props.uiStore.labels.filterTitle}</h3>
                    <ProgramSelect {...this.props}
                        classNames="form-control" outerClassNames="form-row mb-3"
                        labelClassNames="col-form-label" />
                    <PeriodSelect {...this.props}
                        classNames="form-control" outerClassNames="form-row mb-3"
                        labelClassNames="col-form-label" />
                    <div className="form-row mb-3">
                        <div className="col-sm-4">
                            <ShowAllSelect {...this.props} outerClassNames="pt-1" />
                        </div>
                        <div className="col-sm-4 p-0">
                            <MostRecentSelect {...this.props} outerClassNames="pt-1" />
                        </div>
                        <div className="col-sm-4">
                            <MostRecentCount {...this.props} />
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
                    <LevelSelect {...this.props} outerClassNames="form-group mb-2"
                                labelClassNames="col-form-label text-uppercase" classNames="form-control" />
                    <TypeSelect {...this.props} outerClassNames="form-group mb-2"
                                labelClassNames="col-form-label text-uppercase" classNames="form-control" />
                    <SectorSelect {...this.props} outerClassNames="form-group mb-2"
                                labelClassNames="col-form-label text-uppercase" classNames="form-control" />
                    <SiteSelect {...this.props} outerClassNames="form-group mb-2"
                                labelClassNames="col-form-label text-uppercase" classNames="form-control" />
                    <IndicatorSelect {...this.props} outerClassNames="form-group mb-2"
                                labelClassNames="col-form-label text-uppercase" classNames="form-control" />
                </div>
                <div id="filter-bottom" className="d-flex justify-content-between no-gutters p-3">
                    <div className="col pr-2">
                        <button onClick={this.props.uiStore.applyFilters} className="btn btn-block btn-primary">
                            {this.props.uiStore.labels.applyButton}
                        </button>
                    </div>
                    <div className="col pl-2">
                        <button onClick={this.props.uiStore.resetAll} className="btn btn-block btn-inverse">
                            {this.props.uiStore.labels.resetButton}
                        </button>
                    </div>
                </div>
                </React.Fragment>
    }
}