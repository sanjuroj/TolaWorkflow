import React from 'react'
import { observer } from "mobx-react"
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const DisaggregationType = observer(({disaggregation, expanded, expandAction, updateLabel}) => {
    return (
        <div className="edit-disaggregation__row">
            <div className="row-expand__toggle">
                <span onClick={expandAction}>
                    <FontAwesomeIcon icon={expanded ? 'caret-down' : 'caret-right'} />
                </span>
            </div>
            <div className="row__content">
                <a onClick={expandAction} tabIndex='0'>
                    {disaggregation.disaggregation_type}
                </a>
                {expanded && (
                    <form>
                    {disaggregation.labels.map((label, idx) =>
                        <div className="form-group disaggregation-label-group">
                            <input
                                key={idx}
                                value={label.label}
                                onChange={(e) => updateLabel(idx, e.target.value)}
                                className="form-control"
                            />
                            <a tabIndex="0" o1nClick={() => deleteAction()} className="btn btn-link btn-danger">
                                <FontAwesomeIcon icon={'trash'} /> Remove
                            </a>
                        </div>
                    )}
                    <div>
                        <a tabIndex="0" className="btn-link btn-add"><FontAwesomeIcon icon={'plus-circle'} /> Add another option</a>
                    </div>
                    </form>
                )}
            </div>
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
        const {expanded_id} = this.state
        if (id == expanded_id) {
            this.setState({expanded_id: null})
        } else {
            this.setState({expanded_id: id})
        }
    }

    updateLabel(disaggregationId, labelIndex, value) {
        console.log(`${disaggregationId}, ${labelIndex}, ${value}`)
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
                        updateLabel={(labelIndex, value) => this.updateLabel(disaggregation.id, labelIndex, value)}
                    />
                )}
                <div className="form-group">
                    <button className="btn btn-primary" onClick={(e) => this.save(e)}>{gettext("Save Changes")}</button>
                    <button className="btn btn-outline-primary" type="button" onClick={() => this.resetForm()}>{gettext("Reset")}</button>
                </div>
                <div>
                    <a tabIndex="0" className="btn-link btn-add"><FontAwesomeIcon icon={'plus-circle'} /> {gettext("Add country disaggregation")}</a>
                </div>
            </div>
        )
    }
}
