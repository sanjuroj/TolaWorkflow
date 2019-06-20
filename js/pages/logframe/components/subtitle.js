import React from 'react';
import { observer, inject } from 'mobx-react';
import { GroupBySelect } from '../../../components/selectWidgets';


const SubTitleRow = inject('dataStore', 'filterStore')(
    observer(({ dataStore, filterStore }) => {
        return (
            <div className="logframe--subheader">
                <h4><a href={ dataStore.program_page_url }>{ dataStore.name }</a></h4>
                { dataStore.results_framework &&
                    <GroupBySelect
                        chainLabel={ dataStore.rf_chain_sort_label }
                        value={ filterStore.groupBy }
                        update={ e => { filterStore.setGroupBy(e.target.value); } }
                        labelClass="col-form-label"
                        formGroupClass="form-row inline-select"
                    />
                }
            </div>
        )
    })
)

export default SubTitleRow;