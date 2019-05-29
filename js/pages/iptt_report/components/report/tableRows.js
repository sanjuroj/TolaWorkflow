import React from 'react';
import { inject, observer } from 'mobx-react';

function ipttRound(value, percent) {
    if (value && !isNaN(parseFloat(value))) {
        if (!Number.isInteger(value)) {
            value = Number.parseFloat(value).toFixed(2);
            value = value.endsWith('00') ? parseInt(value) : value.endsWith('0') ? value.slice(0, -1) : value;
        } else {
            value = String(value);
        }
        return percent === true ? `${value}%` : value;
    }
    return '-';
}

const IndicatorEditModalCell = ({ indicator }) => {
    return (
        <td className="td-no-side-borders">
            <a href={ `/indicators/indicator_update/${indicator.pk}/` }
               data-programid={ indicator.program.pk }
               className="indicator-link float-right">
                <i className="fas fa-cog"></i>
            </a>
        </td>
    );
}

const IndicatorResultModalCell = ({ indicator }) => {
    return (
        <td className="td-no-side-borders">
            <button type="button" className="btn btn-link p-1 indicator-ajax-popup indicator-data"
                    data-indicatorid={ indicator.pk } data-container="body"
                    data-trigger="focus" data-toggle="popover" data-placement="bottom"
                    data-original-title="results">
                <i className="fas fa-table"></i>
            </button>
            { indicator.name }
        </td>
    )
}

const IndicatorCell = ({ value, resultCell, ...props }) => {
    if (resultCell && resultCell === true) {
        return <td { ...props }>{ value }</td>;
    }
    return (
        <td className="td-no-side-borders" { ...props }>{ value }</td>
    );
}

const PercentCell = ({ value, ...props }) => {
    value = ipttRound(value, true);
    return <IndicatorCell value={ value } align="right" { ...props } />;
}

const NumberCell = ({ value, ...props }) => {
    value = ipttRound(value, false);
    return <IndicatorCell value={ value } align="right" { ...props } />;
}

const TVAResultsGroup = ({ value, resultCell, ...props }) => {
    return (
        <React.Fragment>
            <NumberCell value={ value.target } />
            <NumberCell value={ value.actual } />
            <PercentCell value={ value.met }/>
        </React.Fragment>
    );
}

const TVAResultsGroupPercent = ({ value, resultCell, ...props }) => {
    return (
        <React.Fragment>
            <PercentCell value={ value.target } />
            <PercentCell value={ value.actual } />
            <PercentCell value={ value.met }/>
        </React.Fragment>
    );
}

const IndicatorRow = inject('reportStore')(
    observer(({ reportStore, indicator, levelCol }) => {
        var ValueCell;
        var PeriodCell;
        if (indicator.unitType == '%') {
            ValueCell = PercentCell;
            PeriodCell = reportStore.isTVA ? TVAResultsGroupPercent : PercentCell;
        } else {
            ValueCell = NumberCell;
            PeriodCell = reportStore.isTVA ? TVAResultsGroup : NumberCell;
        }
        return (
            <tr>
                <IndicatorCell value={ indicator.number || '—' } align="center" />
                <IndicatorResultModalCell indicator={ indicator } />
                <IndicatorEditModalCell indicator={ indicator } />
                { levelCol && <IndicatorCell value={ indicator.levelName } /> }
                <IndicatorCell value={ indicator.unitOfMeasure } />
                <IndicatorCell value={ indicator.directionOfChange } align="center" />
                <IndicatorCell value={ indicator.cumulative } />
                <IndicatorCell value={ indicator.unitType } align="center" />
                <ValueCell value={ indicator.baseline } />
                <ValueCell value={ indicator.lopTarget } />
                <ValueCell value={ indicator.lopActual } />
                <PercentCell value={ indicator.lopMet } />
                {
                    reportStore.periodValues(indicator).map(
                        (value, index) => <PeriodCell value={ value } key={ index } resultCell={ true }/>
                    )
                }
                
            </tr>
        );
    })
);

const LevelTitleRow = inject('reportStore')(
    observer(({ reportStore, children }) => {
        return (
            <tr>
            <td colSpan={ reportStore.reportWidth }
                className="iptt-level-row"
            >
               { children }
            </td>
            </tr>
        )
    })
);

const LevelRow = ({ level }) => {
    return (
        <LevelTitleRow>
             { level.tier.name }{ level.ontology ? ` ${level.ontology}` : '' }: { level.name }
        </LevelTitleRow>
    )
}

const BlankLevelRow = () => {
    return (
        <LevelTitleRow>
        {
            gettext('Indicators unassigned to a results framework level')
        }
        </LevelTitleRow>
    )
}

const LevelGroup = ({ level, indicators }) => {
    return (
        <React.Fragment>
            {
                level ? <LevelRow level={ level } />
                      : (indicators && indicators.length > 0) && <BlankLevelRow />
            }
            {
                indicators.map(
                    (indicator, index) => (
                        <IndicatorRow indicator={ indicator }
                                      levelCol={ false }
                                      key={ index } />
                                      )
                )
            }
        </React.Fragment>
    );
}


export { LevelGroup, IndicatorRow };