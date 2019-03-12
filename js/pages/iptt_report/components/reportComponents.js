import React from 'react';
import { observer, inject } from 'mobx-react';
import { PinButton, ExcelButton } from './buttons';

export const IPTTHeader = inject('labels', 'rootStore')(
    observer(({ labels, rootStore }) => {
        return <div className="page-subheader">
                    <div id="id_span_iptt_date_range" className="subheader__title">
                        <h2 className="pt-3 text-title-case">{ labels.reportTitle }</h2>
                        <h4 className="pb-3">{ rootStore.startPeriodLabel } - { rootStore.endPeriodLabel }</h4>
                    </div>
                    <div className="subheader__actions">
                        <PinButton />
                        <ExcelButton />
                    </div>
                </div>
    })
);


const SubheadCell = (props) => {
    let tdStyle = {};
    if (props.minWidth) {
        tdStyle.minWidth = props.minWidth;
    }
    return <th scope="col" className={"align-bottom text-uppercase " + (props.classes || '')}
            style={ tdStyle }>{ props.cellText }</th>;
}

@inject('labels', 'rootStore')
@observer
class IPTTSubheadRow extends React.Component {
    getDateRangeHeaders = () => {
        let headers = [];
        let periods = this.props.rootStore.selectedPeriods;
        if (!periods) {
            return headers;
        } else if (this.props.rootStore.isTVA) {
            periods.forEach(
                (period, index) => {
                    headers.push(<SubheadCell classes="text-right" minWidth="110px" key={ index + 'a' }
                            cellText={ this.props.labels.columnHeaders.target} />);
                    headers.push(<SubheadCell classes="text-right" minWidth="110px" key={ index + 'b' }
                            cellText={ this.props.labels.columnHeaders.actual} />);
                    headers.push(<SubheadCell classes="text-right" minWidth="110px" key={ index + 'c' }
                            cellText={ this.props.labels.columnHeaders.met} />);
                }
            );
        } else {
            periods.forEach(
                (period, index) => {
                    headers.push(<SubheadCell classes="text-right" key={ index }
                            cellText={ this.props.labels.columnHeaders.actual} />);
                }
            );
        }
        return headers;
    }
    render() {
        let colLabels = this.props.labels.columnHeaders;
        return <tr>
                    <SubheadCell minWidth='80px' cellText={ colLabels.number } />
                    <SubheadCell minWidth='600px' classes='td-no-side-borders'
                                 cellText={ colLabels.indicator } />
                    <SubheadCell classes="td-no-side-borders" />
                    <SubheadCell minWidth='90px' cellText={ colLabels.level } />
                    <SubheadCell minWidth='250px' cellText={ colLabels.uom } />
                    <SubheadCell cellText={ colLabels.change } />
                    <SubheadCell minWidth='130px' cellText={ colLabels.cumulative } />
                    <SubheadCell minWidth='50px' cellText={ colLabels.numType } />
                    <SubheadCell cellText={ colLabels.baseline } />
                    <SubheadCell minWidth='110px' classes='text-right td-no-side-borders'
                        cellText={ colLabels.target } />
                    <SubheadCell minWidth='110px' classes='text-right td-no-side-borders'
                        cellText={ colLabels.actual } />
                    <SubheadCell minWidth='110px' classes='text-right td-no-side-borders'
                        cellText={ colLabels.met } />
                    { this.getDateRangeHeaders() }
               </tr>;
    }
}

const IPTTTableHead = inject('labels', 'rootStore')(
    observer(
        ({ labels, rootStore }) => {
            let getDateHeaders = () => {
                let headers = [];
                let periods = rootStore.selectedPeriods;
                if (!periods) {
                    return headers;
                }
                periods.forEach(
                    (period, index) => {
                        index += parseInt(rootStore.startPeriod);
                        let label = rootStore.getPeriodLabel(period, index);
                        headers.push(
                            <td scope="col" colSpan={ rootStore.isTVA ? '3' : '1'}
                                className={"text-center lopCols text-nowrap align-bottom" + (rootStore.selectedFrequencyId == 7 ? " text-uppercase" : "")} 
                                key={ index }> { label.title }<br /><small>{ label.subtitle }</small>
                            </td>
                        );
                    }
                );
                return headers;
            }
            return <thead className="thead-light">
                        <tr>
                            <td colSpan="9" id="id_td_iptt_program_name"
                                className="lopCols align-bottom pt-2"> 
                                <h5 className="m-0">
                                    <strong>{ rootStore.selectedProgram.name }</strong>
                                </h5>
                            </td>
                            <td scope="colgroup" colSpan="3"
                             className="text-center align-bottom text-uppercase">
                             { labels.columnHeaders.lop }
                             </td>
                             { getDateHeaders() }
                        </tr>
                        <IPTTSubheadRow />
                    </thead>
        }
    )
)

const IndicatorTD = observer((props) => {
    return <td className="td-no-side-borders" {...props}>{props.children}</td>;
});

@inject('rootStore')
@observer
class IndicatorRow extends React.Component {
    getPeriodValues = () => {
        let periodCells = [];
        for (let index=parseInt(this.props.rootStore.startPeriod); index<=parseInt(this.props.rootStore.endPeriod); index++) {
            periodCells.push(
                <td key={index} align="right">data for period {index} </td>
            )
        }
        return periodCells;
    }
    render() {
        let indicator = this.props.indicator;
        let calButton = <button type="button" className="btn btn-link p-1 indicator-ajax-popup indicator-data"
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
        return <tr>
                    <IndicatorTD>{ indicator.number }</IndicatorTD>
                    <IndicatorTD>{ calButton }{ indicator.name }</IndicatorTD>
                    <IndicatorTD>{ updateButton }</IndicatorTD>
                    <IndicatorTD>{ indicator.level }</IndicatorTD>
                    <IndicatorTD>{ indicator.unitOfMeasure }</IndicatorTD>
                    <IndicatorTD align="right">{ indicator.directionOfChange }</IndicatorTD>
                    <IndicatorTD>{ indicator.cumulative }</IndicatorTD>
                    <IndicatorTD>{ indicator.unitType }</IndicatorTD>
                    <IndicatorTD align="right">{ indicator.baseline }</IndicatorTD>
                    <IndicatorTD align="right">{ indicator.lopTarget }</IndicatorTD>
                    <IndicatorTD align="right">{ indicator.lopActual }</IndicatorTD>
                    <IndicatorTD align="right">{ indicator.lopMet }</IndicatorTD>
                    { this.getPeriodValues() }
               </tr>;
    }
}

const IPTTTableBody = inject('rootStore', 'reportStore')(
    observer(
        ({rootStore, reportStore}) => {
            const indicatorRows = reportStore.getIndicators(rootStore.selectedProgram.id).map(
                (indicator) => <IndicatorRow indicator={indicator} key={indicator.id} />
            );
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