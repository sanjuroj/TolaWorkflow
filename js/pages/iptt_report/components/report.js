import React from 'react';

export const IPTTHeader = (props) => {
    return <div className="page-subheader">
                <div id="id_span_iptt_date_range" className="subheader__title">
                    <h2 className="pt-3">{props.uiStore.labels.reportTitle}</h2>
                    <h4 className="pb-3">dates</h4>
                </div>
                <div className="subheader__actions">
                    <button type="button" id="id_button_pin" className="btn btn-sm btn-secondary">
                        <i className="fas fa-thumbtack"></i> {props.uiStore.labels.pinButton}
                    </button>   
                    <a href="#" className="btn btn-sm btn-secondary">
                        <i className="fas fa-download"></i> {props.uiStore.labels.excelButton}
                    </a>
                </div>
           </div>;
}