import React from 'react';
import { inject, observer } from 'mobx-react';

export const IPTTSubmit = inject('labels', 'rootStore')(
    observer(({ url, labels, rootStore}) => {
        const handleClick = () => window.location.href = rootStore[url];
        const inlineCSS = {
            width: '100%'
        };
        return  <div className="d-flex justify-content-center mb-1">
                <button
                className="btn btn-primary"
                onClick={ handleClick }
                disabled={ !rootStore[url] }
                style={ inlineCSS }>{ labels.submitButton }</button>
            </div>;    
    })
)