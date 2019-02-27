import React from 'react'
import { observer } from "mobx-react"
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const new_objective_data = {
    id: 'new',
    name: '',
    description: '',
    status: [],
}

const StrategicObjectiveForm = observer(({objective_name, objective, expanded, expandAction, updateFormField, resetForm}) => {
    const statusOptions = [
        {value: 'proposed', label: 'proposed'},
        {value: 'active', label: 'active'},
        {value: 'acheived', label: 'achieved'},
    ]
    const objective_status = objective.status
    const selectedStatus = objective_status ? objective_status.map(x=>statusOptions.find(y=>y.value==x)) : []
    return (
        <div className="strategic_objective__row">
            <div onClick={expandAction}>
                <FontAwesomeIcon icon={expanded ? 'caret-down' : 'caret-right'} /> {objective_name}
            </div>
            { expanded && (
                <form className="form">
                    <div className="form-group">
                        <label htmlFor="objective-name-input">
                            Objective Name*
                        </label>
                        <input
                            id="objective-name"
                            className="form-control"
                            value={objective.name}
                            onChange={(e) => updateFormField('name', e.target.value)}
                            type="text"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="objective-description-input">
                            Description
                        </label>
                        <textarea
                            id="objective-description"
                            className="form-control"
                            value={objective.description}
                            onChange={(e) => updateFormField('description', e.target.value)}
                            type="text"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="objectives-status-input">Status</label>
                        <CheckboxedMultiSelect
                            value={selectedStatus}
                            options={statusOptions}
                            onChange={(e) => updateFormField('status', e.map(x=>x.value)) }
                            className={'react-select'}
                            id="program-sectors-input"
                            />
                    </div>
                    <div className="form-group">
                        {objective.id=='new' && (
                            <div>
                                <button className="btn btn-primary" type="button">Save</button>
                            </div>
                        )}
                        {objective.id!='new' && (
                            <div>
                                <button className="btn btn-primary" type="button">Save Changes</button>
                                <button className="btn btn-outline-primary" type="button" onClick={resetForm}>Reset</button>
                            </div>
                        )}
                    </div>
                </form>
            )}
        </div>
    )
})
@observer
export default class EditObjectives extends React.Component {
    constructor(props) {
        super(props)

        const {objectives} = props

        const managed_objectives = objectives.map(objective => ({...objective}))
        this.state = {
            original_data: [...objectives],
            managed_data: managed_objectives,

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

    updateFormField(objectiveId, fieldKey, value) {
        let {managed_data} = this.state
        let objective = managed_data.find(x=> x.id==objectiveId)
        let modified = Object.assign(objective, {[fieldKey]: value})
        let new_managed_data = managed_data.map(objective => {
            if (objective.id == modified.id) {
                return modified
            }
            return objective
        })
        this.setState({managed_data: new_managed_data})
    }

    resetForm(objectiveId){
        let objective_original = this.state.original_data.find(x=> x.id==objectiveId)
        let new_managed_data = this.state.managed_data.map(objective => {
            if (objective.id == objective_original.id) {
                return {...objective_original}
            }
            return objective
        })
        this.setState({managed_data: new_managed_data})
    }

    addObjective(e) {
        e.preventDefault()
        let managed_data = this.state.managed_data.concat([new_objective_data])
        this.setState({managed_data: managed_data})
    }

    render() {
        const {expanded_id,  managed_data, original_data} = this.state
        return (
            <div>
                <h3>Strategic Objectives</h3>
                {managed_data.map((objective, idx) =>
                    <StrategicObjectiveForm
                        key={objective.id}
                        objective_name={original_data.find(x=>x.id==objective.id) ? original_data.find(x=>x.id==objective.id).name : 'New Strategic Objective'}
                        objective={objective}
                        expanded={objective.id==expanded_id}
                        expandAction={() => this.toggleExpand(objective.id)}
                        updateFormField={(attribute, value) => this.updateFormField(objective.id, attribute, value)}
                        resetForm={() => this.resetForm(objective.id)}
                    />
                )}
                <div>
                    <a
                        href='#'
                        onClick={(e) => this.addObjective(e)}
                        className="btn-link btn-add"
                    >
                        <FontAwesomeIcon icon={'plus-circle'} /> Add strategic objective
                    </a>
                </div>
            </div>
        )
    }
}
