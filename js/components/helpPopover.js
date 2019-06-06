import React from 'react'

export default class HelpPopover extends React.Component {
    constructor(props) {
        super(props)
        this.content = props.content;
        this.placement = props.placement || null;
    }

    render() {
        return (
            <a
                tabIndex="0"
                data-toggle="popover"
                data-trigger="focus"
                data-html="true"
                data-placement={this.placement}
                data-content={this.content}>
            <i className="far fa-question-circle"></i></a>
        )
    }
}
