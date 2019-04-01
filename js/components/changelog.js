import React from 'react'

const ChangeField = ({name, data}) => {
    return <div className="change__field">
        <strong>{name}</strong>: {(data != undefined && data != null)?data.toString():'N/A'}
    </div>
}

const ChangeLogEntryHeader = ({data}) => {
    return <tr className="changelog__entry__header is-expanded"> {/* TODO: apply is-expanded dynamically */}
        <td className="text-nowrap text-action"><i className="fas fa-caret-down"></i>&nbsp;<strong>{data.date}</strong></td>
        <td className="text-nowrap">{data.admin_user}</td>
        <td>{data.pretty_change_type}</td>
        <td></td>
        <td></td>
    </tr>
}

const ChangeLogEntryRow = ({data}) => {
    if (data.change_type == 'user_programs_updated') {
        // Create multiple row for program/country changes:
        return <React.Fragment>
            {Object.entries(data.diff_list.countries).length > 0 &&
                Object.entries(data.diff_list.countries).map(([id, country]) =>
                    <tr key={id} className="changelog__entry__row">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <div className="changelog__change--prev">
                                <ChangeField name="country" data={country.prev.country} />
                                <ChangeField name="role" data={country.prev.role} />
                            </div>
                        </td>
                        <td>
                            <div className="changelog__change--new">
                                <ChangeField name="country" data={country.new.country} />
                                <ChangeField name="role" data={country.new.role} />
                            </div>
                        </td>
                    </tr>
                )
            }
            {Object.entries(data.diff_list.programs).length > 0 &&
                Object.entries(data.diff_list.programs).map(([id, program]) =>
                    <tr key={id} className="changelog__entry__row">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <div className="changelog__change--prev">
                                <ChangeField name="program" data={program.prev.program} />
                                <ChangeField name="country" data={program.prev.country} />
                                <ChangeField name="role" data={program.prev.role} />
                            </div>
                        </td>
                        <td>
                            <div className="changelog__change--new">
                                <ChangeField name="program" data={program.new.program} />
                                <ChangeField name="country" data={program.new.country} />
                                <ChangeField name="role" data={program.new.role} />
                            </div>
                        </td>
                    </tr>
                )
            }
        </React.Fragment>
    } else {
        return <tr className="changelog__entry__row">
            <td className="text-nowrap"></td>
            <td></td>
            <td></td>
            <td>
                <div className="changelog__change--prev">
                    {data.diff_list.map((changeset, id)  =>
                        <ChangeField key={id} name={changeset.pretty_name} data={changeset.prev} />
                    )}
                </div>
            </td>
            <td>
                <div className="changelog__change--new">
                    {data.diff_list.map((changeset, id) =>
                        <ChangeField key={id} name={changeset.pretty_name} data={changeset.new} />
                    )}
                </div>
            </td>
        </tr>
    }
}

const ChangeLogEntry = ({data}) => {
    return <tbody className="changelog__entry" key={data.id}>
        <ChangeLogEntryHeader data={data} />
        <ChangeLogEntryRow data={data} />
    </tbody>
}

const ChangeLog = ({data}) => {
    return <table className="table table-sm bg-white table-bordered text-small changelog">
        <thead>
            <tr>
                <th className="text-nowrap">{gettext("Date")}</th>
                <th className="text-nowrap">{gettext("Admin")}</th>
                <th className="text-nowrap">{gettext("Change Type")}</th>
                <th className="text-nowrap td--half-stretch">{gettext("Previous Entry")}</th>
                <th className="text-nowrap td--half-stretch">{gettext("New Entry")}</th>
            </tr>
        </thead>
        {data.map((entry, id) =>
            <ChangeLogEntry key={id} data={entry} />
        )}
    </table>
}

export default ChangeLog
