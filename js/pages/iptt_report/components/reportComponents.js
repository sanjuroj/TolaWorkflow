import React from 'react';
import { observer, inject } from 'mobx-react';
import { IPTTTableHead } from './headerComponents';


const EMPTY_CELL = '—';


const IndicatorTD = observer((props) => {
    return <td className="td-no-side-borders" {...props}>{props.children}</td>;
});


const TVAValue = observer(({ target, value, isPercent }) => {
    let percentText = (value && target && target != 0) ? String(Math.round(value / target * 1000) / 10) + '%' : EMPTY_CELL;
    let valueText = value ? String(Math.round(value)) + (isPercent ? '%' : '') : EMPTY_CELL;
    let targetText = target ? String(Math.round(target)) + (isPercent ? '%' : '') : EMPTY_CELL;
    return <React.Fragment>
        <td align="right">{targetText}</td>
        <td align="right">{valueText}</td>
        <td align="right">{percentText}</td>
    </React.Fragment>
});

@inject('rootStore')
@observer
class IndicatorRow extends React.Component {
    getPeriodValues = () => {
        if (!this.props.indicator.indicatorData) {
            return <td key={this.props.index}>Loading</td>;
        } else if (this.props.rootStore.isTVA) {
            return this.props.indicator.indicatorData.map(
                (values, index) => <TVAValue key={index} isPercent={this.props.indicator.isPercent} {...values} />
            );
        } else {
            return this.props.indicator.indicatorData.map(
                (value, index) => {
                    return <td key={index} align="right">
                        {value ? String(Math.round(value)) + (this.props.indicator.isPercent ? '%' : '') : EMPTY_CELL}</td>;
                }
            );
        }
    }
    render() {
        let indicator = this.props.indicator;
        if (indicator.id === null) {
            return <Loading />;
        }
        let resultsButton = <button type="button" className="btn btn-link p-1 indicator-ajax-popup indicator-data"
                         data-indicatorid={indicator.id}
                         data-container="body"
                         data-trigger="focus"
                         data-toggle="popover"
                         data-placement="bottom">
                            <i className="fas fa-table"></i>
                        </button>;
        let updateButton = <a href="#" className="indicator-link float-right">
                                <i className="fas fa-cog"></i>
                            </a>;
        let baseline = indicator.baseline ? String(indicator.baseline) + (indicator.isPercent ? '%' : '') : EMPTY_CELL;
        let lopTarget = indicator.lopTarget ? String(Math.round(indicator.lopTarget)) + (indicator.isPercent ? '%' : '') : EMPTY_CELL;
        let lopActual = indicator.lopActual
                        ? indicator.isPercent
                            ? String(Math.round(indicator.lopActual * 10)/10) + '%'
                            : String(Math.round(indicator.lopActual))
                        : EMPTY_CELL;
        let lopMet = indicator.lopMet ? String(Math.round(indicator.lopMet * 1000)/10) + '%' : EMPTY_CELL;
        return <tr>
                    <IndicatorTD>{ indicator.number }</IndicatorTD>
                    <IndicatorTD>{ resultsButton }  { indicator.name }</IndicatorTD>
                    <IndicatorTD>{ updateButton }</IndicatorTD>
                    <IndicatorTD>{ indicator.level }</IndicatorTD>
                    <IndicatorTD>{ indicator.unitOfMeasure }</IndicatorTD>
                    <IndicatorTD align="right">{ indicator.directionOfChange }</IndicatorTD>
                    <IndicatorTD>{ indicator.cumulative }</IndicatorTD>
                    <IndicatorTD>{ indicator.unitType }</IndicatorTD>
                    <IndicatorTD align="right">{ baseline }</IndicatorTD>
                    <IndicatorTD align="right">{ lopTarget }</IndicatorTD>
                    <IndicatorTD align="right">{ lopActual }</IndicatorTD>
                    <IndicatorTD align="right">{ lopMet }</IndicatorTD>
                    { this.getPeriodValues() }
               </tr>;
    }
}

const Loading = () => {
    return <tr><td>Loading</td></tr>;
}

const NoIndicatorsForFrequency = inject('labels')(({ labels }) => {
    return <tr><td colSpan="8">{ labels.noIndicatorsForFrequency }</td></tr>;
})

const IPTTTableBody = inject('rootStore')(
    observer(
        ({rootStore}) => {
            const indicatorRows = (rootStore.reportIndicators && rootStore.reportIndicators.length > 0)
                                  ? rootStore.reportIndicators.map(
                                    (indicator, count) => <IndicatorRow indicator={indicator} key={count} />
                                  ) : rootStore.noIndicatorsForFrequency
                                    ? <NoIndicatorsForFrequency />
                                    : <Loading />;
            
            return <tbody>
                        {indicatorRows}
                   </tbody>
        }
    )
)

@inject('labels', 'rootStore')
@observer
export class IPTTTable extends React.Component {
    render() {
        return <table className="table table-sm table-bordered table-hover" id="iptt_table">
                    <colgroup scope="col" span="9"></colgroup>
                    <colgroup scope="col" span="3" className="lopCols"></colgroup>
                    <colgroup scope="col" span={ this.props.rootStore.selectedPeriods.length }></colgroup>
                    <IPTTTableHead />
                    <IPTTTableBody />
               </table>;
    }
}