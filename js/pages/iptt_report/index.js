import React from 'react';
import ReactDOM from 'react-dom';
import { ProgramSelect, PeriodSelect, ShowAllSelect, MostRecentSelect, MostRecentCount } from '../iptt_shared/components/form';
import { IPTTReportUIStore, BLANK_LABEL, TVA, TIMEPERIODS } from '../iptt_shared/models';

const reportType = (jsContext.reportType == 'timeperiods') ? TIMEPERIODS : TVA;

class IPTTReport extends React.Component {
    render() {
        return <div>Hello</div>;
    }
}

let uiStore = new IPTTReportUIStore(jsContext, reportType);

class IPTTFilterForm extends React.Component {
    render() {
        return <React.Fragment>
                    <h3 className="filter-title">Report Options</h3>
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
                </React.Fragment>
    }
}

ReactDOM.render(<IPTTFilterForm uiStore={uiStore} reportType={reportType}/>,
                document.querySelector('#filter-top'));
ReactDOM.render(<IPTTReport uiStore={uiStore} />,
                document.querySelector('#iptt-report-react-component'));