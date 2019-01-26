import React from 'react'
import Select from 'react-select'
import { observer } from "mobx-react"

@observer
export default class EditUserProfile extends React.Component {
    constructor(props) {
        super(props)
        const {userData} = props
        const organization_listing = props.organizations.map(org => ({value: org.id, label: org.name}))
        const selected_organization = organization_listing.find(o => o.value == userData.organization_id)
        const user_data = {
            id: userData.id,
            full_name: userData.name || '',
            organization: selected_organization?selected_organization:null,
            mode_of_address: userData.mode_of_address || '',
            title: userData.title || '',
            email: userData.email || '',
            phone: userData.phone_number || '',
            mode_of_contact: userData.mode_of_contact || '',
            is_active: userData.is_active
        }
        this.state = {
            original_user_data: user_data,
            managed_user_data: user_data,
            organization_listing
        }
    }


    save(e) {
        e.preventDefault()
        const ud = this.state.managed_user_data
        const marshalled_user_data = {
            ...ud,
            name: ud.full_name,
            organization_id: (ud.organization)?ud.organization.value:null,
            phone_number: ud.phone
        }
        this.props.onUpdate(marshalled_user_data)
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

    saveNewAndAddAnother(e) {
        e.preventDefault()
        const ud = this.state.managed_user_data
        const marshalled_user_data = {
            ...ud,
            name: ud.full_name,
            organization_id: (ud.organization)?ud.organization.value:null,
            phone_number: ud.phone
        }
        this.props.onCreateAndAddAnother(marshalled_user_data)
    }

    updateFullName(new_full_name) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                full_name: new_full_name,
            }
        })
    }

    updateModeOfAddress(new_mode_of_address) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                mode_of_address: new_mode_of_address,
            }
        })
    }

    updateOrganization(new_option) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                organization: new_option,
            }
        })
    }

    updateTitle(new_title) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                title: new_title,
            }
        })
    }

    updateEmail(new_email) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                email: new_email,
            }
        })
    }

    updatePhone(new_phone) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                phone: new_phone,
            }
        })
    }

    updateModeOfContact(new_mode_of_contact) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                mode_of_contact: new_mode_of_contact,
            }
        })
    }

    resetForm() {
        this.setState({
            managed_user_data: this.state.original_user_data
        })
    }

    render() {
        const ud = this.state.managed_user_data
        return (
            <div className="edit-user-profile container">
                <form className="form">
                    <div className="form-group">
                        <label htmlFor="user-full-name-input">Full name<span className="required">*</span></label>
                        <input
                            type="text"
                            value={ud.full_name}
                            onChange={(e) => this.updateFullName(e.target.value) }
                            className="form-control"
                            id="user-full-name-input"
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-mode-of-address-input">Preferred Mode Of Address</label>
                        <input
                            type="text"
                            value={ud.mode_of_address}
                            onChange={(e) => this.updateModeOfAddress(e.target.value)}
                            className="form-control"
                            id="user-mode-of-address-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-organization-input">Organization<span className="required">*</span></label>
                        <Select
                            value={ud.organization}
                            options={this.state.organization_listing}
                            onChange={(e) => this.updateOrganization(e)}
                            placeholder="None Selected"
                            id="user-organization-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-title-input">Title</label>
                        <input
                            maxLength="3"
                            type="text"
                            value={ud.title}
                            onChange={(e) => this.updateTitle(e.target.value)}
                            className="form-control"
                            id="user-title-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-email-input">Email<span className="required">*</span></label>
                        <input
                            type="email"
                            value={ud.email}
                            onChange={(e) => this.updateEmail(e.target.value)}
                            className="form-control"
                            id="user-email-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-phone-input">Phone</label>
                        <input
                            type="tel"
                            value={ud.phone}
                            onChange={(e) => this.updatePhone(e.target.value)}
                            className="form-control"
                            id="user-phone-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-mode-of-contact-input">Preferred Mode of Contact</label>
                        <input
                            type="text"
                            value={ud.mode_of_contact}
                            onChange={(e) => this.updateModeOfContact(e.target.value)}
                            className="form-control"
                            id="user-mode-of-contact-input" />
                    </div>
                    {this.props.new &&
                    <div className="form-group">
                        <button className="btn btn-primary" onClick={(e) => this.saveNew(e)}>Save</button>
                        <button className="btn btn-primary" onClick={(e) => this.saveNewAndAddAnother(e)}>Save And Add Another</button>
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
