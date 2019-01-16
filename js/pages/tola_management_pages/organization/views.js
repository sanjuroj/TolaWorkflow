import React from 'react';
import { observer } from "mobx-react"

//Temporarily table instead of Table

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
                        <div className="list-table-column">Program</div>
                        <div className="list-table-column">Status</div>
                    </div>

                    <table striped bordered condensed hover>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Organization</th>
                          <th>Programs</th>
                          <th>Users</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {store.organizations.map(org =>
                          <tr key={org.url}>
                            <td>ICON</td>
                            <td>{org.name}</td>
                            <td><a href=''>N Programs</a></td>
                            <td><a href=''>N Users</a></td>
                            <td>Active</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                </div>
            </div>
        </div>
)
