import React from 'react'
import Select from 'react-select'
import { observer } from "mobx-react"
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'

@observer
export default class EditProgramProfile extends React.Component {
    constructor(props) {
        super(props)
        const {program_data} = props
        this.fundingStatusOptions = [
            {value: 'Funded', label: 'Funded'},
            {value: 'Complete', label: 'Complete'},
        ]

        this.state = {
            original_data: Object.assign({}, program_data),
            managed_data: Object.assign({}, program_data)
        }
    }


    save(e) {
        e.preventDefault()
        const program_id = this.props.program_data.id
        const program_data = this.state.managed_data
        /*
        const marshalled_user_data = {
            ...ud,
            name: ud.full_name,
            organization_id: (ud.organization)?ud.organization.value:null,
            phone_number: ud.phone
        }
        */
        this.props.onUpdate(program_id, program_data)
    }

    saveNew(e) {
        e.preventDefault()
        const ud = this.state.managed_user_data
        const marshalled_user_data = {
            ...ud,
            name: ud.full_name,
            organization_id: (ud.organization)?ud.organization.value:null,
            phone_number: ud.phone
        }
        this.props.onCreate(marshalled_user_data)
    }

    updateFormField(fieldKey, val) {
        this.setState({
            managed_data: Object.assign(this.state.managed_data, {[fieldKey]: val})
        })
    }

    resetForm() {
        this.setState({
            managed_data: Object.assign({}, this.state.original_data)
        })
    }

    render() {
        const formdata = this.state.managed_data
        const selectedFundingStatus = this.fundingStatusOptions.find(x=> x.value == formdata.funding_status)
        const selectedCountries = formdata.country.map(x=>this.props.countryOptions.find(y=>y.value==x))
        const selectedSectors = formdata.sector.map(x=>this.props.sectorOptions.find(y=>y.value==x))
        return (
            <div className="edit-user-profile container">
                <form className="form">
                    <div className="form-group">
                        <label htmlFor="program-name-input">Program name<span className="required">*</span></label>
                        <input
                            type="text"
                            value={formdata.name}
                            onChange={(e) => this.updateFormField('name', e.target.value) }
                            className="form-control"
                            id="program-name-input"
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-gait-input">GAIT ID</label>
                        <input
                            type="tel"
                            value={formdata.gaitid}
                            onChange={(e) => this.updateFormField('gaitId', e.target.value) }
                            className="form-control"
                            id="program-gait-input"
                            disabled={!this.props.new}
                            />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-fund-code-input">Fund Code</label>
                        <input
                            type="tel"
                            value=""
                            onChange={(e) => this.updateFormField('fundCode', e.target.value) }
                            className="form-control"
                            id="program-fund-code-input"
                            disabled={true}
                            />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-description-input">Description</label>
                        <textarea
                            value={formdata.description}
                            onChange={(e) => this.updateFormField('description', e.target.value) }
                            className="form-control"
                            id="program-description-input"
                            />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-county-input">Countries<span className="required">*</span></label>
                        <CheckboxedMultiSelect
                            value={selectedCountries}
                            options={this.props.countryOptions}
                            onChange={(e) => this.updateFormField('country', e.map(x=>x.value)) }
                            id="program-country-input"
                            />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-sectors-input">Sectors</label>
                        <CheckboxedMultiSelect
                            value={selectedSectors}
                            options={this.props.sectorOptions}
                            onChange={(e) => this.updateFormField('sector', e.map(x=>x.value)) }
                            id="program-sectors-input"
                            />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-funding-status-input">Funding Status</label>
                        <Select
                            value={selectedFundingStatus}
                            options={this.fundingStatusOptions}
                            onChange={(e) => this.updateFormField('funding_status', e.value) }
                            isSearchable={false}
                            id="program-funding-status-input"
                            />
                    </div>
                    {this.props.new &&
                    <div className="form-group">
                        <button className="btn btn-primary" onClick={(e) => this.saveNew(e)}>Save</button>
                        {/* <button className="btn btn-primary" onClick={(e) => this.saveNewAndAddAnother(e)}>Save And Add Another</button> */}
                        <button className="btn btn-outline-primary" type="button" onClick={() => this.resetForm()}>Reset</button>
                    </div>
                    }
                    {!this.props.new &&
                    <div className="form-group">
                        <button className="btn btn-primary" onClick={(e) => this.save(e)}>Save</button>
                        <button className="btn btn-outline-primary" type="button" onClick={() => this.resetForm()}>Reset</button>
                    </div>
                    }
                </form>
            </div>
        )
    }
}
