import React from 'react'
import Select from 'react-select'
import { observer } from "mobx-react"
import classNames from 'classnames'


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
export default class EditCountryProfile extends React.Component {
    constructor(props) {
        super(props)
        const {country_data} = props

        this.state = {
            original_data: Object.assign({}, country_data),
            managed_data: Object.assign({}, country_data)
        }
    }

    hasUnsavedDataAction() {
        this.props.onIsDirtyChange(JSON.stringify(this.state.managed_data) != JSON.stringify(this.state.original_data))
    }

    save() {
        const country_id = this.props.country_data.id
        const country_data = this.state.managed_data
        this.props.onUpdate(country_id, country_data)
    }

    saveNew() {
        const country_data = this.state.managed_data
        this.props.onCreate(country_data)
    }

    updateFormField(fieldKey, val) {
        this.setState({
            managed_data: Object.assign(this.state.managed_data, {[fieldKey]: val})
        }, () => this.hasUnsavedDataAction())
    }

    resetForm() {
        this.setState({
            managed_data: Object.assign({}, this.state.original_data)
        }, () => this.hasUnsavedDataAction())
    }

    formErrors(fieldKey) {
        return this.props.errors[fieldKey]
    }

    render() {
        const formdata = this.state.managed_data
        const selectedOrganization = this.props.organizationOptions.find(x=>x.value==formdata.organization)
        return (
            <div className="tab-pane--react">
                <form className="form">
                    <div className="form-group">
                        <label htmlFor="country-name-input">{gettext("Country name")}<span className="required">*</span></label>
                        <input
                            type="text"
                            value={formdata.country}
                            onChange={(e) => this.updateFormField('country', e.target.value) }
                            className={classNames('form-control', { 'is-invalid': this.formErrors('country') })}
                            id="country-name-input"
                            required />
                        <ErrorFeedback errorMessages={this.formErrors('country')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="country-description-input">{gettext("Description")}</label>
                        <textarea
                            value={formdata.description}
                            onChange={(e) => this.updateFormField('description', e.target.value) }
                            className={classNames('form-control', { 'is-invalid': this.formErrors('description') })}
                            id="country-description-input"
                            />
                        <ErrorFeedback errorMessages={this.formErrors('description')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="country-code-input">{gettext("Country Code")}</label>
                        <input
                            value={formdata.code}
                            onChange={(e) => this.updateFormField('code', e.target.value) }
                            className={classNames('form-control', { 'is-invalid': this.formErrors('code') })}
                            id="country-code-input"
                            />
                        <ErrorFeedback errorMessages={this.formErrors('code')} />
                    </div>
                    {this.props.new &&
                    <div className="form-group btn-row">
                        <button className="btn btn-primary" type="button" onClick={(e) => this.saveNew(e)}>{gettext("Save Changes")}</button>
                        {/* <button className="btn btn-primary" onClick={(e) => this.saveNewAndAddAnother(e)}>Save And Add Another</button> */}
                        <button className="btn btn-reset" type="button" onClick={() => this.resetForm()}>{gettext("Reset")}</button>
                    </div>
                    }
                    {!this.props.new &&
                    <div className="form-group btn-row">
                        <button className="btn btn-primary" type="button" onClick={(e) => this.save(e)}>{gettext("Save Changes")}</button>
                        <button className="btn btn-reset" type="button" onClick={() => this.resetForm()}>{gettext("Reset")}</button>
                    </div>
                    }
                </form>
            </div>
        )
    }
}
