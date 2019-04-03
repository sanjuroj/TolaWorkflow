import React from 'react'
import ReactDOM from 'react-dom'
import {ProgramAuditLogStore} from './models'
import {IndexView} from './views'

/*
 * Model/Store setup
 */
const store = new ProgramAuditLogStore(
    jsContext.program_id,
    jsContext.program_name,
)

ReactDOM.render(
    <IndexView store={store} />,
    document.querySelector('#app_root')
)
