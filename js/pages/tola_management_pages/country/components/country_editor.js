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
        const {ProfileSection, HistorySection} = this.props

        const active_page = this.state.active_page

        return (
            <div className="program-editor row">
                <div className="editor__navigation col-sm-3">
                    <ul className="list-group">
                        <li className={classNames('list-group-item', {'selected': active_page=='profile'})} onClick={() => this.updateActivePage('profile')}>Profile</li>
                        <li className={classNames('list-group-item', 'disabled')}>Strategic Objective</li>
                        <li className={classNames('list-group-item', 'disabled')}>Indicator Disaggregation</li>
                        {/* <li className={`list-group-item ${history_active_class} ${new_class}`} onClick={() => this.updateActivePage('status_and_history')}>Status and History</li> */}
                    </ul>
                </div>
                <div className="program-editor__content col-sm-9">
                    {this.state.active_page == 'profile' &&
                    <ProfileSection />
                    }

                    {this.state.active_page == 'history' &&
                    <HistorySection />
                    }
                </div>
            </div>
        )
    }
}
