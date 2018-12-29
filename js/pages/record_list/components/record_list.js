import React from 'react';
import classNames from 'classnames';
import { observer } from "mobx-react"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import eventBus from '../../../eventbus';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import {Select} from '../../../components/bootstrap_multiselect';

// library.add(faCaretDown, faCaretRight);





// @observer
// class IndicatorFilter extends React.Component{
//     render() {
//         const indicators = this.props.rootStore.indicatorStore.indicators;
//         const selectedIndicatorIds = this.props.uiStore.selectedIndicatorIds;
//
//         const indicatorSelectOptions = indicators.map(i => {
//             return {
//                 value: i.id,
//                 label: i.name,
//             }
//         });
//
//         return <nav className="list__filters list__filters--inline-label" id="id_div_indicators">
//             <label className="filters__label">
//                 {gettext("Find an indicator:")}
//             </label>
//             <div className="filters__control">
//                 <Select forceEmptySelect={true}
//                         options={indicatorSelectOptions}
//                         selected={selectedIndicatorIds}
//                         onSelectCb={(selectedIndicatorIds) => eventBus.emit('select-indicators-to-filter', selectedIndicatorIds)} />
//             </div>
//         </nav>;
//     }
// }

const columns = [
    {
        dataField: 'name',
        text: 'Record',
        sort: true
    },
    {
        dataField: 'create_date',
        text: 'Date added',
        sort: true
    }
];


export const RecordsView = observer(function ({rootStore}) {
    return <React.Fragment>
        <div><h3>Hi world!</h3></div>
        <div>
            <BootstrapTable keyField="id" data={rootStore.records} columns={columns} bootstrap4={true} pagination={ paginationFactory() }/>
        </div>
    </React.Fragment>
});
