import React from 'react';
import ReactDOM from 'react-dom';
import {ProgramStore} from './models';
import {IndexView} from './views';
import api from './api';

/*
 * Model/Store setup
 */

const {
    country_filter,
    organization_filter,
    countries,
    organizations,
    allPrograms,
    sectors,
} = jsContext

/* formatting filters to be used by the ProgramStore */
function makeCountryOptions(countryIds) {
    let options = countryIds.reduce((acc, id) => {
        let country = countries[id]
        if (country) {
            acc.push({label: country.name,  value: country.id})
        }
        return acc
    }, [])
    return options
}
function makeOrganizationOptions(organizationIds) {
    let options = organizationIds.reduce((acc, id) => {
        let organization = organizations[id]
        if (organization) {
            acc.push({label: organization.name, value: organization.id})
        }
        return acc
    }, [])
    return options
}
const filters = {
    countries: makeCountryOptions(country_filter),
    organizations: makeOrganizationOptions(organization_filter),
}

const initialData = {
    countries,
    organizations,
    allPrograms,
    sectors,
    filters,
}
const store = new ProgramStore(
    api,
    initialData,
);


ReactDOM.render(
    <IndexView store={store} />,
    document.querySelector('#app_root')
);
