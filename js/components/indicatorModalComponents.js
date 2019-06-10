import React from 'react';
import { observer } from 'mobx-react';

/*
 *{!readonly &&
            <a role="button" className="btn-link btn-add" onClick={e => openCreateIndicatorFormModal(programId)}>
                <i className="fas fa-plus-circle"/> {gettext("Add indicator")}
            </a>
            */

export const AddIndicatorButton = observer(({ readonly, ...params }) => {
    return (
        <a role="button" className="btn-link btn-add" onClick={e => openCreateIndicatorFormModal(params)}>
            <i className="fas fa-plus-circle"/> {gettext("Add indicator")}
        </a>
    );
});