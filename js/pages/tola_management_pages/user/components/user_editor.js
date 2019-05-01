import React from 'react'
import { observer } from "mobx-react"

@observer
export default class UserEditor extends React.Component {
    updateActivePage(new_page) {
        if(!this.props.new) {
            this.props.notifyPaneChange(new_page)
        }
    }

    render() {
        const {ProfileSection, ProgramSection, HistorySection, active_pane} = this.props

        const profile_active_class = (active_pane == 'profile')?'active':''
        const programs_active_class = (active_pane == 'programs_and_roles')?'active':''
        const history_active_class = (active_pane == 'status_and_history')?'active':''
        const new_class = (this.props.new)?'disabled':''

        return (
            <div className="tab-set--vertical">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a href="#" className={`nav-link ${profile_active_class}`}
                            onClick={(e) => { e.preventDefault(); this.updateActivePage('profile')}}>
                            {gettext("Profile")}
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={`nav-link text-nowrap ${programs_active_class} ${new_class}`}
                            onClick={(e) => { e.preventDefault(); this.updateActivePage('programs_and_roles')}}>
                            {gettext("Programs and Roles")}
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={`nav-link text-nowrap ${history_active_class} ${new_class}`}
                            onClick={(e) => { e.preventDefault(); this.updateActivePage('status_and_history')}}>
                            {gettext("Status and History")}
                        </a>
                    </li>
                </ul>
                <div className="tab-content">
                    {active_pane == 'profile' &&
                    <ProfileSection />
                    }

                    {active_pane == 'programs_and_roles' &&
                    <ProgramSection />
                    }

                    {active_pane == 'status_and_history' &&
                    <HistorySection />
                    }
                </div>
            </div>
        )
    }
}
