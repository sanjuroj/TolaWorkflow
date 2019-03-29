import React from 'react'

class Expander extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
            overflowing: false,
        }
        this.ref = React.createRef()
    }

    componentDidMount() {
        if(this.ref.current.scrollHeight > this.ref.current.clientHeight) {
            this.setState({overflowing: true})
        }
    }

    toggleExpanded(e) {
        e.preventDefault()
        this.setState({
            expanded: !this.state.expanded
        })
    }

    render() {
        return <div className="changelog-entry">
            <div ref={this.ref} className="changelog-entry__expanding" style={{height: !this.state.expanded && (this.props.height || 50)}}>
                {this.props.children}
            </div>
            {this.state.overflowing &&
            <div className="changelog-entry__expand-trigger">
                <a href="" onClick={(e) => this.toggleExpanded(e)}>{(this.state.expanded)?'Show Less':'Show More'}</a>
            </div>
            }
        </div>
    }
}

export default Expander
