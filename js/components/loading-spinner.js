
import React from 'react'

const LoadingSpinner = ({children, isLoading, className, ...props}) => {
    const loading = (isLoading)?'loading':''
    return <div className={'loading-spinner__container '+loading+' '+(className || '')} {...props}>
        <div className='loading-spinner__overlay'>
            <div className='loading-spinner__spinner'></div>
        </div>
        {children}
    </div>
}

export default LoadingSpinner
