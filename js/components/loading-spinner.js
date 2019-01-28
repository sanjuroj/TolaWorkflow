
import React from 'react'

const LoadingSpinner = ({children, isLoading, className, ...props}) => {
    if(isLoading) {
        return <div className={'loading-spinner__container '+(className || '')} {...props}>
            <div className='loading-spinner__overlay'>
                <div className='loading-spinner__spinner'></div>
            </div>
            {children}
        </div>
    } else {
        return React.Children.only(children)
    }
}

export default LoadingSpinner
