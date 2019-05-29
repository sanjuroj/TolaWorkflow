import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('rootStore')
@observer
export class QSTVATimeFrameRadio extends React.Component {
    setMostRecentCount = (e) => {
        this.props.rootStore.setMostRecentCount(e.target.value);
    }
    render() {
        return <div className="form-row mb-3">
                    <div className="col-sm-4">
                        <div className="form-check form-check-inline pt-1">
                            <span className="form-check-input">
                                <input type="radio"
                                       checked={ this.props.rootStore.showAll }
                                       disabled={ this.props.rootStore.periodCountDisabled }
                                       onChange={ this.props.rootStore.setShowAll }
                                       />
                            </span>
                            <label className="form-check-label">
                                { gettext('Show all') }
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-4 p-0">
                        <div className="form-check form-check-inline pt-1">
                            <span className="form-check-input">
                                <input type="radio"
                                       checked={ this.props.rootStore.mostRecent }
                                       disabled={ this.props.rootStore.periodCountDisabled }
                                       onChange={ this.props.rootStore.setMostRecent }
                                       />
                            </span>
                            <label className="form-check-label">
                                { gettext('Most recent') }
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <input type="number" className="form-control"
                               value={ this.props.rootStore.mostRecentCountDisplay }
                               disabled={ this.props.rootStore.periodCountDisabled }
                               placeholder={ gettext('enter a number') }
                               onChange={ this.setMostRecentCount }
                               />
                    </div>
               </div>;
    }
}
