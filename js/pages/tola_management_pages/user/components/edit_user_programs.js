import React from 'react'
import Select from 'react-select'
import { observer } from "mobx-react"
import {AutoSizer, Table, Column, CellMeasurer, CellMeasurerCache} from 'react-virtualized'

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

//we need to flatten the country -> program heirarchy to support the virtualized table
const flatten_programs = (countries, programs, access) => countries.flatMap(country => [country, ...country.programs])

const denormalize = (countries, programs, access_listing) => {
    return Object.entries(countries).map(([id, country]) => ({
        id: country.id,
        name: country.name,
        has_access: access_listing && access_listing.country[country.id] || false,
        permissions: {
            options: country_options,
            permission_level: country_options[0]
        },
        type: "country",
        programs: country.programs.map(program_id => {
            const program = programs[program_id]
            return {
                id: program.id,
                name: program.name,
                has_access: access_listing && access_listing.country[country.id] || access_listing.program[program.id] || false,
                permissions: {
                    options: program_options,
                    permission_level: program_options[0]
                },
                type: "program"
            }
        }),
    }))
}

//we need to filter across both programs and countries, prioritizing
//countries. we'll filter by country unless there are none, then we filter
//by program instead
const apply_filter = (filter_string, listing) => {
    let filtered_countries = listing.filter(
        country => country.name.toLowerCase().includes(filter_string.toLowerCase())
    )
    if(filtered_countries.length > 0) {
        return filtered_countries.filter(country => country.programs.length > 0)
    } else {
        return [
            ...listing.map(country => ({
                ...country,
                programs: country.programs.filter(
                    program => program.name.toLowerCase().includes(filter_string.toLowerCase())
                )
            }))
        ].filter(country => country.programs.length > 0)
    }
}

@observer
export default class EditUserPrograms extends React.Component {
    constructor(props) {
        super(props)
        const {store} = props
        const denormalized = denormalize(store.countries, store.programs, store.editing_target_data.programs)
        const filtered_countries = apply_filter('', denormalized)
        this.state = {
            filter_string: '',
            filtered_countries: filtered_countries,
            flattened_programs: flatten_programs(filtered_countries),
            original_user_program_access: props.store.editing_target_data.programs,
            user_program_access: props.store.editing_target_data.programs
        }
    }

    componentWillReceiveProps(next_props) {
        const denormalized = denormalize(next_props.store.countries, next_props.store.programs, store.editing_target_data.programs)
        const filtered_countries = apply_filter(this.state.filter_string, denormalized)
        this.setState({
            filtered_countries: filtered_countries,
            flattened_programs: flatten_programs(filtered_countries),
            original_user_program_access: next_props.store.editing_target_data.programs,
        })
    }

    saveForm() {
        this.props.onSave(this.state.user_program_access)
    }

    resetForm() {
        const denormalized = denormalize(this.props.store.countries, this.props.store.programs, this.state.original_user_program_access)
        const filtered_countries = apply_filter(this.state.filter_string, denormalized)
        this.setState({
            filtered_countries: filtered_countries,
            flattened_programs: flatten_programs(filtered_countries),
            user_program_access: this.state.original_user_program_access
        })

    }

    toggleProgramAccess(program_id) {
        const changed_program = this.props.store.programs[program_id]
        const country_access = this.state.user_program_access.country[changed_program.country_id]
        const new_user_program_access = {
            country: {
                ...this.state.user_program_access.country,
                //it's either already false, or will be after this program has changed
                [changed_program.country_id]: false
            },
            program: Object.entries(this.props.store.programs).reduce((xs, [id, program]) => {
                if(id == changed_program.id) {
                    xs[id] = !(this.state.user_program_access.program[program.id] || country_access)
                } else {
                    xs[id] = (changed_program.country_id == program.country_id && country_access) || this.state.user_program_access.program[program.id]
                }
                return xs
            },{})
        }

        const denormalized = denormalize(this.props.store.countries, this.props.store.programs, new_user_program_access)
        const filtered_countries = apply_filter(this.state.filter_string, denormalized)

        this.setState({
            filtered_countries: filtered_countries,
            flattened_programs: flatten_programs(filtered_countries),
            user_program_access: new_user_program_access
        })
    }

    toggleCountryAccess(country_id) {
        const new_user_program_access = {
            country: {
                ...this.state.user_program_access.country,
                [country_id]: !this.state.user_program_access.country[country_id]
            },
            //remove all program access if they have been granted access to a country
            program: Object.entries(this.props.store.programs).reduce((xs, [id, program]) => {
                xs[id] = program.country_id != country_id && this.state.user_program_access.program[program.id]
                return xs
            },{})
        }

        const denormalized = denormalize(this.props.store.countries, this.props.store.programs, new_user_program_access)
        const filtered_countries = apply_filter(this.state.filter_string, denormalized)

        this.setState({
            filtered_countries: filtered_countries,
            flattened_programs: flatten_programs(filtered_countries),
            user_program_access: new_user_program_access
        })
    }

    changeCountryRole(country_id, new_val) {

    }

    changeProgramRole(program_id, new_val) {

    }

    updateProgramFilter(val) {
        const denormalized = denormalize(this.props.store.countries, this.props.store.programs, this.state.user_program_access)
        const filtered_countries = apply_filter(val, denormalized)

        this.setState({
            filter_string: val,
            filtered_countries: filtered_countries,
            flattened_programs: flatten_programs(filtered_countries),
        })
    }

    render() {
        const {user, onSave} = this.props

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
                        <div className="virtualized-table__wrapper">
                            <AutoSizer>
                                {({height, width}) =>
                                    <Table
                                    height={height}
                                    headerHeight={50}
                                    width={width}
                                    rowGetter={({index}) => this.state.flattened_programs[index]}
                                    rowHeight={50}
                                    rowCount={this.state.flattened_programs.length}>

                                        <Column
                                        dataKey="has_access"
                                        width={50}
                                        cellDataGetter={({rowData}) => ({checked: rowData.has_access, id: rowData.id, action: (rowData.type == "country")?this.toggleCountryAccess.bind(this):this.toggleProgramAccess.bind(this)})}
                                        cellRenderer={({cellData}) => <input type="checkbox" checked={cellData.checked} onChange={() => cellData.action(cellData.id)} />}/>

                                        <Column
                                        dataKey="name"
                                        label="Countries and Programs"
                                        width={200}
                                        flexGrow={2}
                                        cellDataGetter={({rowData}) => ({bold: rowData.type == "country", name: rowData.name})}
                                        cellRenderer={({cellData}) => {
                                            if(cellData.bold) {
                                                return <strong>{cellData.name}</strong>
                                            } else {
                                                return <span>{cellData.name}</span>
                                            }
                                        }} />

                                        <Column
                                        width={100}
                                        flexGrow={1}
                                        dataKey="permissions"
                                        label="Roles and Permissions"
                                        cellDataGetter={({rowData}) => ({id: rowData.id, permissions: rowData.permissions, action: (rowData.type == "country")?this.changeCountryRole.bind(this):this.changeProgramRole.bind(this)})}
                                        cellRenderer={({cellData}) =>
                                            <select value={cellData.permissions.permission_level.value} onChange={(val) => cellData.action(cellData.id, val)} >
                                                {cellData.permissions.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                                            </select>
                                        }/>

                                    </Table>
                                }
                            </AutoSizer>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button type="button" className="btn btn-primary" onClick={() => this.saveForm()}>Save Changes</button>
                        <button type="button" className="btn btn-outline-primary" onClick={() => this.resetForm()}>Reset</button>
                    </div>
                </div>
            </div>
        )
    }
}
