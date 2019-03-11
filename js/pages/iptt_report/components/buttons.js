import React from 'react';
import { inject } from 'mobx-react';


export const PinButton = inject('labels')(({ labels }) => {
        return <button type="button" className="btn btn-sm btn-secondary">
                    <i className="fas fa-thumbtack"></i> { labels.pin }
                </button>;
    }
);

export const ExcelButton = inject('labels')(({ labels }) => {
        return <button type="button" className="btn btn-sm btn-secondary">
                    <i className="fas fa-download"></i> { labels.excel }
                </button>;
            
    }
);