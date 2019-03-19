import React from 'react'
import { observer } from "mobx-react"
import classNames from 'classnames'

@observer
export default class CountryEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            active_page: 'profile'
        }
    }

    updateActivePage(new_page) {
        if(!this.props.new) {
            this.setState({active_page: new_page})
        }
    }

    render() {
        const {ProfileSection, StrategicObjectiveSection, DisaggregationSection} = this.props

        const active_page = this.state.active_page

        return (
            <div className="tab-set--vertical">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a href="#" className={classNames('nav-link', {'active': active_page=='profile'})}
                            onClick={(e) => { e.preventDefault(); this.updateActivePage('profile')}}>
                            {gettext("Profile")}
                            </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={classNames('nav-link', {
                                'active': active_page=='objectives',
                                'disabled': this.props.new,
                            })}
                            onClick={(e) => { e.preventDefault(); this.updateActivePage('objectives')}}>
                            {gettext("Strategic Objectives")}
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={classNames('nav-link', {
                                'active': active_page=='disaggregations',
                                'disabled': this.props.new,
                            })}
                            onClick={(e) => { e.preventDefault(); this.updateActivePage('disaggregations')}}>
                            {gettext("Country Disaggregations")}
                        </a>
                    </li>
                </ul>
                <div className="tab-content">
                    {this.state.active_page == 'profile' && (
                        <ProfileSection />
                    )}

                    {this.state.active_page == 'objectives' && (
                        <StrategicObjectiveSection />
                    )}

                    {this.state.active_page == 'disaggregations' && (
                        <DisaggregationSection />
                    )}
                </div>
            </div>
        )
    }
}
