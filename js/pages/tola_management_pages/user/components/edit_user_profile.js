import React from 'react'
import Select from 'react-select'
import { observer } from "mobx-react"

@observer
export default class EditUserProfile extends React.Component {
    constructor(props) {
        super(props)
        const {userData} = props
        const organization_listing = (() => {
            if(props.new) {
                return props.organizations.filter(o => o.value != 1 || props.is_superuser)
            } else {
                return props.organizations
            }
        })()
        const selected_organization = organization_listing.find(o => o.value == userData.organization_id)
        this.state = {
            original_user_data: {...userData},
            managed_user_data: {...userData},
            selected_organization,
            organization_listing
        }
    }


    save(e) {
        e.preventDefault()
        this.props.onUpdate(this.state.managed_user_data)
    }

    saveNew(e) {
        e.preventDefault()
        this.props.onCreate(this.state.managed_user_data)
    }

    saveNewAndAddAnother(e) {
        e.preventDefault()
        this.props.onCreateAndAddAnother(this.state.managed_user_data)
    }

    updateFirstName(new_first_name) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                first_name: new_first_name,
            }
        })
    }

    updateLastName(new_last_name) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                last_name: new_last_name,
            }
        })
    }

    updateOrganization(new_option) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                organization_id: new_option.value,
            },
            selected_organization: new_option
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
        const selected_organization = this.state.organization_listing.find(o => o.value == this.state.original_user_data.organization_id)
        this.setState({
            managed_user_data: this.state.original_user_data,
            selected_organization
        })
    }

    render() {
        const ud = this.state.managed_user_data
        const e = this.props.errors
        const disabled = this.props.disabled
        const error_classes = {
            first_name: (e.first_name)?'is-invalid':'',
            last_name: (e.last_name)?'is-invalid':'',
            email: (e.email)?'is-invalid':'',
            organization: (e.organization_id)?'is-invalid':''
        }
        return (
            <div className="edit-user-profile container">
                <form className="form">
                    <div className="form-group">
                        <label htmlFor="user-first-name-input">{gettext("Preferred First Name")}<span className="required">*</span></label>
                        <input
                            disabled={disabled}
                            className={"form-control "+error_classes.first_name}
                            type="text"
                            value={ud.first_name}
                            onChange={(e) => this.updateFirstName(e.target.value) }
                            id="user-first-name-input"
                            required />
                        {e.name &&
                        <div className="invalid-feedback">
                            {e.name}
                        </div>
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-last-name-input">{gettext("Preferred Last Name")}<span className="required">*</span></label>
                        <input
                            disabled={disabled}
                            className={"form-control "+error_classes.last_name}
                            type="text"
                            value={ud.last_name}
                            onChange={(e) => this.updateLastName(e.target.value) }
                            id="user-last-name-input"
                            required />
                        {e.name &&
                         <div className="invalid-feedback">
                             {e.name}
                         </div>
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-organization-input">{gettext("Organization")}<span className="required">*</span></label>
                        <Select
                            isDisabled={disabled}
                            className={"form-control "+error_classes.organization}
                            value={this.state.selected_organization}
                            options={this.state.organization_listing}
                            onChange={(e) => this.updateOrganization(e)}
                            placeholder="None Selected"
                            id="user-organization-input" />
                        {e.organization_id &&
                        <div className="invalid-feedback">
                            {e.organization_id}
                        </div>
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-title-input">{gettext("Title")}</label>
                        <input
                            disabled={disabled}
                            maxLength="50"
                            type="text"
                            value={ud.title}
                            onChange={(e) => this.updateTitle(e.target.value)}
                            className="form-control"
                            id="user-title-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-email-input">{gettext("Email")}<span className="required">*</span></label>
                        <input
                            disabled={disabled}
                            className={"form-control "+error_classes.email}
                            type="email"
                            value={ud.email}
                            onChange={(e) => this.updateEmail(e.target.value)}
                            id="user-email-input" />
                        {e.email &&
                        <div className="invalid-feedback">
                            {e.email}
                        </div>
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-phone-input">{gettext("Phone")}</label>
                        <input
                            disabled={disabled}
                            type="tel"
                            value={ud.phone}
                            onChange={(e) => this.updatePhone(e.target.value)}
                            className="form-control"
                            id="user-phone-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-mode-of-contact-input">{gettext("Preferred Mode of Contact")}</label>
                        <input
                            disabled={disabled}
                            type="text"
                            value={ud.mode_of_contact}
                            onChange={(e) => this.updateModeOfContact(e.target.value)}
                            className="form-control"
                            id="user-mode-of-contact-input" />
                    </div>
                    {this.props.new && !disabled &&
                    <div className="form-group">
                        <button className="btn btn-primary" onClick={(e) => this.saveNew(e)}>{gettext("Save")}</button>
                        <button className="btn btn-primary" onClick={(e) => this.saveNewAndAddAnother(e)}>{gettext("Save And Add Another")}</button>
                        <button className="btn btn-outline-primary" type="button" onClick={() => this.resetForm()}>{gettext("Reset")}</button>
                    </div>
                    }
                    {!this.props.new && !disabled &&
                    <div className="form-group">
                        <button className="btn btn-primary" onClick={(e) => this.save(e)}>{gettext("Save")}</button>
                        <button className="btn btn-outline-primary" type="button" onClick={() => this.resetForm()}>{gettext("Reset")}</button>
                    </div>
                    }
                </form>
            </div>
        )
    }
}
