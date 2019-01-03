import React from 'react'
import ReactPaginate from 'react-paginate'
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
                        <div className="list-table-row" key={user.id}>
                            <div className="list-table-column"></div>
                            <div className="list-table-column">{user.name}</div>
                            <div className="list-table-column">{user.organization_name && <a href="">{user.organization_name}</a>}</div>
                            <div className="list-table-column"><a>{user.user_programs} programs</a></div>
                            <div className="list-table-column">{user.is_active?'Active':'Inactive'}</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="list-metadata">
                <div id="users-count">{store.users_count?`${store.users_count} users`:`--`}</div>
                <div id="pagination-controls">
                    {store.total_pages &&
                    <ReactPaginate
                        previousLabel={"previous"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={store.total_pages}
                        initialPage={store.current_page}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={page => store.changePage(page)}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} />
                    }
                </div>
            </div>
        </div>
)
