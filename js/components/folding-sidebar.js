import React from 'react'

class Expander extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            folded: false,
        }
    }

    toggleFolded() {
        this.setState({
            folded: !this.state.folded
        })
    }

    render() {
        const {className, ...props} = this.props
        const icon = (this.state.folded)?"fa-chevron-right":"fa-chevron-left"
        return <div className={"folding-sidebar "+(className || '')} {...props}>
            {!this.state.folded &&
            <React.Fragment>{this.props.children}</React.Fragment>
            }

            <div className="folding-sidebar__trigger" onClick={() => this.toggleFolded()}>
                <i key={icon}><span className={"fa "+icon}></span></i>
            </div>
        </div>
    }
}

export default Expander
