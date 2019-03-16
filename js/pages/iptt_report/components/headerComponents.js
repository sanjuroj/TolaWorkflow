import React from 'react';
import { observer, inject } from 'mobx-react';


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



export const IPTTTableHead = inject('labels', 'rootStore')(
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