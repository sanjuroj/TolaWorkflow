import React from 'react'
import { observer } from "mobx-react"
import classNames from 'classnames'

@observer
export default class CountryEditor extends React.Component {

    updateActivePage(new_page) {
        if(!this.props.new) {
            this.props.notifyPaneChange(new_page)
        }
    }

    render() {
        const {ProfileSection, StrategicObjectiveSection, DisaggregationSection, active_pane} = this.props

        return (
            <div className="tab-set--vertical">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a href="#" className={classNames('nav-link', {'active': active_pane=='profile'})}
                            onClick={(e) => { e.preventDefault(); this.updateActivePage('profile')}}>
                            {gettext("Profile")}
                            </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={classNames('nav-link', {
                                'active': active_pane=='objectives',
                                'disabled': this.props.new,
                            })}
                            onClick={(e) => { e.preventDefault(); this.updateActivePage('objectives')}}>
                            {gettext("Strategic Objectives")}
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={classNames('nav-link', {
                                'active': active_pane=='disaggregations',
                                'disabled': this.props.new,
                            })}
                            onClick={(e) => { e.preventDefault(); this.updateActivePage('disaggregations')}}>
                            {gettext("Country Disaggregations")}
                        </a>
                    </li>
                </ul>
                <div className="tab-content">
                    {active_pane == 'profile' && (
                        <ProfileSection />
                    )}

                    {active_pane == 'objectives' && (
                        <StrategicObjectiveSection />
                    )}

                    {active_pane == 'disaggregations' && (
                        <DisaggregationSection />
                    )}
                </div>
            </div>
        )
    }
}
