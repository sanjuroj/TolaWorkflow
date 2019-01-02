import React from 'react';
import { observer } from "mobx-react"

export const IndexView = observer(
    ({store}) =>
        <div>
            <div className="filter-section">

            </div>
            <div className="list-section">
                <div className="list-controls">
                    <select>
                        <option>Bulk actions</option>
                    </select>
                    <button>Add User</button>
                </div>
                <div className="list-table">
                    <div className="list-table-header list-table-row">
                        <div className="list-table-column"></div>
                        <div className="list-table-column">User</div>
                        <div className="list-table-column">Organization</div>
                        <div className="list-table-column">Programs</div>
                        <div className="list-table-column">Status</div>
                    </div>
                    {store.users.map(user =>
                        <div className="list-table-row" key={user.url}>
                            <div className="list-table-column"></div>
                            <div className="list-table-column">{user.name}</div>
                            <div className="list-table-column">{user.organization && <a href="">{user.organization.name}</a>}</div>
                            <div className="list-table-column"></div>
                            <div className="list-table-column"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
)
