import React from 'react'
import Select from 'react-select'
import { observer } from "mobx-react"

const program_options = [
    {value: 'low', label: 'Low'},
    {value: 'medium', label: 'Medium'},
    {value: 'high', label: 'High'},
]

const country_options = [
    {value: 'user', label: 'User'},
    {value: 'basic_admin', label: 'Basic Admin'},
    {value: 'super_admin', label: 'Super Admin'},
]

const Row = ({checked, name, options, bold, selection, onToggle}) => {
    return <tr>
        <td><input checked={checked} type="checkbox" onChange={() => onToggle(name)}/></td>
        {bold &&
         <td><strong>{name}</strong></td>
        }
        {!bold &&
         <td>{name}</td>
        }
        <td> <Select options={options} value={selection} /> </td>
    </tr>
}

const flattenCountries = (countries) => countries.flatMap(country => {
    const programs = country.programs.map(program => ({
        selected: country.selected || false,
        name: program.name,
        options: program_options,
        key: program.id,
        perm_selection: program_options[0]
    }))
    return [
        {
            selected: false,
            name: country.name,
            options: country_options,
            bold: true,
            key: country.id,
            perm_selection: country_options[0]
        },
        ...programs
    ]
})

const CountryRows = ({programsByCountry, onToggle}) => {
    return <tbody>
        {flattenCountries(programsByCountry).map(row => <Row checked={row.selected} name={row.name} options={row.options} bold={row.bold} selection={row.perm_selection} onToggle={onToggle}/>)}
    </tbody>
}

@observer
export default class EditUserPrograms extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            program_filter: '',
            filtered_countries: props.programsByCountry
        }
    }


    saveForm(e) {
        e.preventDefault()
    }

    updateProgramFilter(val) {
        let country_in_filter = this.props.programsByCountry.findIndex(country => country.name.toLowerCase().includes(val.toLowerCase()))
        if(country_in_filter != -1) {
            this.setState({
                program_filter: val,
                filtered_countries: this.props.programsByCountry.filter(country => country.name.toLowerCase().includes(val.toLowerCase()))
            })
        } else {
            let new_filtered_countries = [...this.props.programsByCountry.map(country => ({...country, programs: country.programs.filter(program => program.name.toLowerCase().includes(val.toLowerCase()))}))]

            console.log(new_filtered_countries)
            this.setState({
                program_filter: val,
                filtered_countries: new_filtered_countries.filter(country => country.programs.length > 0)
            })
        }
    }

    toggleUserAccess(row_data) {

    }

    render() {
        const {user} = this.props
        return (
            <div className="edit-user-programs container">
                <h2>{user.name}: Programs and Roles</h2>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <input type="text" className="form-control" onChange={(e) => this.updateProgramFilter(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Countries and Programs</th>
                                    <th>Roles and Permissions</th>
                                </tr>
                            </thead>
                            <CountryRows programsByCountry={this.state.filtered_countries} onToggle={(row_data) => this.toggleUserAccess(row_data)}/>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
