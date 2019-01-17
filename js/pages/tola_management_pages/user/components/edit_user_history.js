import React from 'react'
import { observer } from "mobx-react"
import Select from 'react-select'

const status_options = [
    {value: true, label: 'Active'},
    {value: false, label: 'Inactive'}
]

export class EditUserHistory extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            original_user_data: props.userData,
            user_data: props.userData
        }
    }

    onChange(new_value) {
        this.setState({
            user_data: {
                ...this.state.user_data,
                is_active: new_value.value
            }
        })
    }

    onReset() {
        this.setState({
            user_data: this.state.original_user_data
        })
    }

    render() {
        const selected = status_options.find(option => option.value == this.state.user_data.is_active)
        return <div className="edit-user-history">
            <div className="row">
                <div className="col">
                    <Select options={status_options} value={selected} onChange={(new_value) => this.onChange(new_value)} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-primary" type="button" onClick={() => this.props.onSave(this.state.user_data)}>Save Changes</button>
                    <button className="btn btn-outline-primary" type="button" onClick={() => this.onReset()}>Reset</button>
                </div>
            </div>
        </div>
    }
}

export default EditUserHistory
