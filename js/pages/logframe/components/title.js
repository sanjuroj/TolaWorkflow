import React from 'react';
import { inject } from 'mobx-react';

const ExcelButton = inject('filterStore')(
    ({ filterStore }) => {
        const clickHandler = filterStore.excelUrl ?
            () => { window.open(filterStore.excelUrl, '_blank') } :
            (e) => { e.preventDefault(); };
        return (
            <button type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={ clickHandler }
                    disabled={ !filterStore.excelUrl }>
                <i className="fas fa-download"></i> Excel
            </button>
        );
    }
);

const TitleBar = inject('dataStore')(
    ({ dataStore }) => {
        return (
        <React.Fragment>
            <span className="logframe--header">
                <h1>{
                    // # Translators: short for "Logistical Framework"
                    gettext('Logframe')
                }</h1>
                { dataStore.results_framework &&
                <a href={ dataStore.results_framework_url }>
                    <i className="fas fa-sitemap"></i>
                    {
                        gettext('View results framework')
                    }
                </a>
                }
            </span>
            <ExcelButton />
        </React.Fragment>
        );
    }
)

export default TitleBar;