import React from 'react';
import { observer, inject } from 'mobx-react';
import { PinButton, ExcelButton } from './buttons';

export const IPTTHeader = inject('labels', 'rootStore')(
    observer(({ labels, rootStore }) => {
        return <div className="page-subheader">
                    <div id="id_span_iptt_date_range" className="subheader__title">
                        <h2 className="pt-3 text-title-case">{ labels.reportTitle }</h2>
                        <h4 className="pb-3">{ rootStore.dateRange }</h4>
                    </div>
                    <div className="subheader__actions">
                        <PinButton />
                        <ExcelButton />
                    </div>
                </div>
    })
);

@inject('labels', 'rootStore')
@observer
export class IPTTTable extends React.Component {
    render() {
        return <table className="table table-sm table-bordered table-hover">
                    <thead className="thead-light">
                        <tr>
                            <td className="lopCols align-bottom pt-2"> 
                                <h5 className="m-0">{ this.props.rootStore.selectedProgram.name }</h5>
                            </td>
                        </tr>
                    </thead>
               </table>;
    }
}