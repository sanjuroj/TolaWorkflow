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

const flattenPrograms = (programsByCountry) => programsByCountry.flatMap(
    country => [
        {
            id: country.id,
            name: country.name,
            has_access: country.has_access,
            permissions: {
                options: country_options,
                permission_level: country_options[0]
            },
            type: "country"
        },
        ...country.programs.map(program => ({
            id: program.id,
            name: program.name,
            has_access: program.has_access,
            permissions: {
                options: program_options,
                permission_level: program_options[0]
            },
            type: "program"
        }))
    ]
)

const applyProgramAccess = (program_access, programs_by_country) => {
    if(!program_access) return programs_by_country

    return programs_by_country.map(country => {
        return {
            ...country,
            has_access: program_access.country_access[country.id],
            programs: country.programs.map(program => {
                return {
                    ...program,
                    has_access: program_access.country_access[country.id] || program_access.program_access[program.id]
                }
            })
        }
    })
}

@observer
export default class EditUserPrograms extends React.Component {
    constructor(props) {
        super(props)
        const program_access = applyProgramAccess(props.store.editing_target_data, props.programsByCountry)
        this.state = {
            program_filter: '',
            filtered_countries: program_access,
            flattened_programs: flattenPrograms(program_access),
            original_user_program_access: props.store.editing_target_data,
            user_program_access: props.store.editing_target_data
        }
    }


    saveForm() {
        this.props.onSave({})
    }

    resetForm() {
        const program_access = applyProgramAccess(this.state.original_user_program_access, this.state.filtered_countries)
        this.setState({
            filtered_countries: program_access,
            flattened_programs: flattenPrograms(program_access),
            user_program_access: this.state.original_user_program_access
        })

    }

    toggleProgramAccess(program_id) {

    }

    toggleCountryAccess(country_id) {
        const new_user_program_access = {
            ...this.state.user_program_access,
            [country_id]: !this.state.user_program_access[country_id]
        }
        const program_access = applyProgramAccess(new_user_program_access, this.state.filtered_countries)

        this.setState({
            filtered_countries: program_access,
            flattened_programs: flattenPrograms(program_access),
            user_program_access: new_user_program_access
        })
    }

    componentWillReceiveProps(next_props) {
        const program_access = applyProgramAccess(next_props.store.editing_target_data, next_props.programsByCountry)
        this.setState({
            filtered_countries: program_access,
            flattened_programs: flattenPrograms(program_access),
            original_user_program_access: next_props.store.editing_target_data,
        })
    }

    updateProgramFilter(val) {
        //we need to filter across both programs and countries, prioritizing
        //countries. we'll filter by country unless there are none, then we filter
        //by program instead
        const filtered_countries = (() => {
            let filtered_countries = this.props.programsByCountry.filter(
                country => country.name.toLowerCase().includes(val.toLowerCase())
            )
            if(filtered_countries.length > 0) {
                return filtered_countries
            } else {
                return [
                    ...this.props.programsByCountry.map(country => ({
                        ...country,
                        programs: country.programs.filter(
                            program => program.name.toLowerCase().includes(val.toLowerCase())
                        )
                    }))
                ].filter(country => country.programs.length > 0)
            }
        })()

        const program_access = applyProgramAccess(this.state.user_program_access, filtered_countries)

        this.setState({
            program_filter: val,
            filtered_countries: program_access,
            flattened_programs: flattenPrograms(program_access),
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
                        <div style={{height: `30vh`}}>
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
                                        cellRenderer={({cellData}) => <Select options={cellData.options} value={cellData.permission_level} /> }/>

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
