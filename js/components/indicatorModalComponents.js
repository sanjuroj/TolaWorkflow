import React from 'react';
import { observer } from 'mobx-react';

export const AddIndicatorButton = observer(({ readonly, ...params }) => {
    return (
            <button disabled={readonly} className="btn btn-link btn-add" onClick={e => openCreateIndicatorFormModal(params)}>
                <i className="fas fa-plus-circle"/> {gettext("Add indicator")}
            </button>
    );
});
