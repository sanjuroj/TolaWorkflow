import React from 'react';

export const IPTTButton = ( props ) => {
    return (
        <div className={ "btn btn-primary btn-block" + (props.isDisabled ? " disabled" : "")}
             onClick={ props.action }>
                { props.label }
        </div>
    );
}