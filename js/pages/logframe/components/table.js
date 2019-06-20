import React from 'react';
import { computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import HeaderRow from './headers';

const LevelNameCell = ({ name }) => {
    return <div className="table-cell level-cell">{ name }</div>;
}

const IndicatorCell = ({ indicator }) => {
    return (
        <div className="table-cell--text">
            { gettext('Indicator')}{ indicator.number_display ? ` ${indicator.number_display}:` : '' } { indicator.name }
        </div>
    );
}

const MeansCell = ({ indicator }) => {
    return (
        <div className="table-cell--text">
            { indicator.means_of_verification }
        </div>
    );
}

const IndicatorCells = ({ indicators }) => {
    if (!indicators) {
        return (
            <div className="table-cell-inner-row colspan-2 table-cell ">
                <div className="table-cell--text table-cell--empty"></div>
                <div className="table-cell--text table-cell--empty"></div>
            </div>
        );
    }
    return (
            <div className="table-cell-column colspan-2">
                {indicators.map((indicator, idx) => {
                    return (
                        <div className="table-cell-inner-row" key={ idx }>
                            <IndicatorCell indicator={ indicator } key={ `ind${idx}` } />
                            <MeansCell indicator={ indicator } key={ `means${idx}` } />
                        </div>
                    );
                })
                }
            </div>
        );
}

const AssumptionsCell = ({ assumptions }) => {
    return <div className="table-cell">{ assumptions }</div>
}


const LevelRow = ({ level }) => {
    return (
        <div className="logframe--table--row">
            <LevelNameCell name={ level.display_name } />
            <IndicatorCells indicators={ level.indicators } />
            <AssumptionsCell assumptions={ level.assumptions } />
        </div>
    );
}


@inject('dataStore', 'filterStore')
@observer
class LogframeTable extends React.Component {
    constructor(props) {
        super(props);
    }
    
    @computed
    get levels() {
        if (this.props.dataStore.results_framework) {
            return this.props.dataStore.getLevelsGroupedBy(this.props.filterStore.groupBy)
        }
        return [];
    }
    
    @computed
    get unassignedLevel() {
        if (this.props.dataStore.unassignedIndicators.length > 0) {
            return {
                display_name: gettext('Indicators unassigned to  a results framework level'),
                indicators: this.props.dataStore.unassignedIndicators,
                assumptions: null
            };
        }
        return false;
    }
    
    render() {
        return (
            <React.Fragment>
                <HeaderRow headers={ this.props.filterStore.headerColumns } />
                { this.levels.map((level, idx) => <LevelRow level={ level } key={ idx } />) }
                { this.unassignedLevel && <LevelRow level={ this.unassignedLevel } /> }
            </React.Fragment>
        );
    }
}

export default LogframeTable;