import React from 'react'
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import { observer } from "mobx-react"

@observer
export default class EditOrganizationProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            initial_data: props.organizationData,
            managed_data: {...props.organizationData}
        }
    }

    save(e) {
        e.preventDefault()
        this.props.onSave(this.state.managed_data)
    }

    saveNew(e) {
        e.preventDefault()
        this.props.onSaveNew(this.state.managed_data)
    }

    saveNewAndAddAnother(e) {
        e.preventDefault()
        this.props.onSaveNewAndAddAnother(this.state.managed_data)
    }

    resetForm() {
        this.setState({
            managed_data: this.state.initial_data
        })
    }

    updateName(new_name) {
        let new_data = this.state.managed_data
        new_data.name = new_name
        this.setState({
            managed_data: new_data
        })
    }

    updateCountries(new_countries) {
        let new_data = this.state.managed_data
        new_data.countries = new_countries
        this.setState({
            managed_data: new_data
        })
    }

    updateSectors(new_sectors) {
        let new_data = this.state.managed_data
        new_data.sectors = new_sectors
        this.setState({
            managed_data: new_data
        })
    }

    updatePrimaryAddress(new_address) {
        let new_data = this.state.managed_data
        new_data.primary_address = new_address
        this.setState({
            managed_data: new_data
        })
    }

    updatePrimaryContactName(new_name) {
        let new_data = this.state.managed_data
        new_data.primary_contact_name = new_name
        this.setState({
            managed_data: new_data
        })
    }

    updatePrimaryContactEmail(new_email) {
        let new_data = this.state.managed_data
        new_data.primary_contact_email = new_email
        this.setState({
            managed_data: new_data
        })
    }

    updatePrimaryContactPhone(new_phone) {
        let new_data = this.state.managed_data
        new_data.primary_contact_phone = new_phone
        this.setState({
            managed_data: new_data
        })
    }

    updateModeOfContact(new_mode_of_contact) {
        let new_data = this.state.managed_data
        new_data.mode_of_contact = new_mode_of_contact
        this.setState({
            managed_data: new_data
        })
    }

    render() {
        let od = this.state.managed_data
        return (
            <div className="edit-organization-profile container">
                <form className="form">
                    <div className="form-group">
                        <label htmlFor="organization-name-input">Organization name<span className="required">*</span></label>
                        <input
                            type="text"
                            value={od.name}
                            onChange={(e) => this.updateName(e.target.value) }
                            className="form-control"
                            id="organization-name-input"
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="countries-input">Countries<span className="required">*</span></label>
                        <CheckboxedMultiSelect
                            value={od.countries}
                            options={this.props.countryListing}
                            onChange={(e) => this.updateCountries(e)}
                            placeholder="None Selected"
                            id="countries-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sectors-input">Sectors</label>
                        <CheckboxedMultiSelect
                            value={od.sectors}
                            options={this.props.sectorOptions}
                            onChange={(e) => this.updateSectors(e)}
                            placeholder="None Selected"
                            id="sectors-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="primary-address-input">Primary Address<span className="required">*</span></label>
                        <textarea
                            value={od.primary_address}
                            onChange={(e) => this.updatePrimaryAddress(e.target.value)}
                            className="form-control"
                            id="primary-address-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="primary-contact-name-input">Primary Contact Name<span className="required">*</span></label>
                        <input
                            type="text"
                            value={od.primary_contact_name}
                            onChange={(e) => this.updatePrimaryContactName(e.target.value) }
                            className="form-control"
                            id="primary-contact-name-input"
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="primary-contact-email-input">Primary Contact Email<span className="required">*</span></label>
                        <input
                            type="text"
                            value={od.primary_contact_email}
                            onChange={(e) => this.updatePrimaryContactEmail(e.target.value) }
                            className="form-control"
                            id="primary-contact-email-input"
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="primary-contact-phone-input">Primary Contact Phone Number<span className="required">*</span></label>
                        <input
                            type="text"
                            value={od.primary_contact_phone}
                            onChange={(e) => this.updatePrimaryContactPhone(e.target.value) }
                            className="form-control"
                            id="primary-contact-phone-input"
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mode-of-contact-input">Preferred Mode of Contact</label>
                        <input
                            type="text"
                            value={od.mode_of_contact}
                            onChange={(e) => this.updateModeOfContact(e.target.value) }
                            className="form-control"
                            id="mode-of-contact-input" />
                    </div>
                    {this.props.new &&
                    <div className="form-group">
                        <button className="btn btn-primary" onClick={(e) => this.saveNew(e)}>Save</button>
                        <button className="btn btn-primary" onClick={(e) => this.saveNewAndAddAnother(e)}>Save and Add Another</button>
                        <button className="btn btn-outline-primary" type="button" onClick={() => this.resetForm()}>Clear</button>
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
