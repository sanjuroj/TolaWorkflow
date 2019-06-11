import React from 'react';
import { observer } from 'mobx-react';

export const AddIndicatorButton = observer(({ readonly, ...params }) => {
    if (readonly) {
        // do we want to show a message of some kind to folks for whom this button is disabled or just hide it?
        return '';
    }
    return (
            <a role="button" className="btn-link btn-add" onClick={e => openCreateIndicatorFormModal(params)}>
                <i className="fas fa-plus-circle"/> {gettext("Add indicator")}
            </a>
    );
});