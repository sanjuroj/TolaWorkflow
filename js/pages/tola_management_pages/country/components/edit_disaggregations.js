import React from 'react'
import { observer } from "mobx-react"
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const DisaggregationType = observer(({disaggregation, expanded, expandAction}) => {
    return (
        <div className="disaggregation__row" onClick={() => expandAction()}>
            <div>
                <FontAwesomeIcon icon={expanded ? 'caret-down' : 'caret-right'} /> {disaggregation.disaggregation_type}
            </div>
            {expanded && (
                disaggregation.labels.map(label =>
                    <div key={label.id}>{label.label}</div>
                )
            )}
        </div>
    )
})

const ErrorFeedback = observer(({errorMessages}) => {
    if (!errorMessages) {
        return null
    }
    return (
    <div className="invalid-feedback">
        {errorMessages.map((message, index) =>
            <span key={index}>{message}</span>
        )}
    </div>
    )
})
@observer
export default class EditDisaggregations extends React.Component {
    constructor(props) {
        super(props)

        const {disaggregations} = props

        const managed_disaggregations = disaggregations.map(disagg => ({...disagg}))

        this.state = {
            original_data: [...disaggregations],
            managed_data: managed_disaggregations,
            expanded_id: null,
        }
    }

    toggleExpand(id) {
        let {expanded_id} = this.state
        if (id == expanded_id) {
            this.setState({expanded_id: null})
        } else {
            this.setState({expanded_id: id})
        }
    }

    render() {
        const {expanded_id, managed_data, original_data} = this.state

        return (
            <div>
                <h3>Country Disaggregations</h3>
                {managed_data.map(disaggregation =>
                    <DisaggregationType
                        key={disaggregation.id}
                        disaggregation={disaggregation}
                        expanded={disaggregation.id==expanded_id}
                        expandAction={() => this.toggleExpand(disaggregation.id)}
                    />
                )}
                <div className="form-group">
                    <button className="btn btn-primary" onClick={(e) => this.save(e)}>{gettext("Save Changes")}</button>
                    <button className="btn btn-outline-primary" type="button" onClick={() => this.resetForm()}>{gettext("Reset")}</button>
                </div>
                <div>
                    <a href='#' className="btn-link btn-add"><FontAwesomeIcon icon={'plus-circle'} /> {gettext("Add country disaggregation")}</a>
                </div>
            </div>
        )
    }
}
