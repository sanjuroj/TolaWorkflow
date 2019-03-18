import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('labels', 'rootStore')
@observer
export class QSTVATimeFrameRadio extends React.Component {
    checkMostRecent = () => {
        //default value of 2 in case of clicking "most recent" radio box - default behavior
        this.props.rootStore.setTVAMostRecent(null);
    }
    updateMostRecentCount = (e) => {
        this.props.rootStore.setTVAMostRecent(e.target.value);
    }
    render() {
        return <div className="form-row mb-3">
                    <div className="col-sm-4">
                        <div className="form-check form-check-inline pt-1">
                            <span className="form-check-input">
                                <input type="radio"
                                       checked={ this.props.rootStore.tvaShowAll }
                                       disabled={ this.props.rootStore.tvaRadioDisabled }
                                       onChange={ this.props.rootStore.setTVAShowAll }
                                       />
                            </span>
                            <label className="form-check-label">
                                { this.props.labels.showAll }
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-4 p-0">
                        <div className="form-check form-check-inline pt-1">
                            <span className="form-check-input">
                                <input type="radio"
                                       checked={ this.props.rootStore.tvaMostRecent }
                                       disabled={ this.props.rootStore.tvaRadioDisabled }
                                       onChange={ this.checkMostRecent }
                                       />
                            </span>
                            <label className="form-check-label">
                                { this.props.labels.mostRecent}
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <input type="number" className="form-control"
                               value={ this.props.rootStore.tvaMostRecentCountDisplay }
                               disabled={ this.props.rootStore.tvaRadioDisabled }
                               placeholder={ this.props.labels.mostRecentPlaceholder }
                               onChange={ this.updateMostRecentCount }
                               />
                    </div>
               </div>;
    }
}
