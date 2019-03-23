import React from 'react';
import { inject, observer } from 'mobx-react';
import Popover from 'react-simple-popover';

@inject('labels', 'rootStore')
class PinPopover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reportName: '',
            sending: false,
            sent: false
        };
    }
    handleChange = (e) => {
        this.setState({reportName: e.target.value});
    }
    isDisabled = () => {
        return !this.props.rootStore.pinData || !this.state.reportName;
    }
    handleClick = () => {
        //send this.props.rootStore.pinUrl as data to this.props.labels.pin.creatUrl
        //with data "name" as this.state.reportName
        this.setState({sending: true});
        $.ajax({
            type: "POST",
            url: this.props.labels.pin.createUrl,
            data: {name: this.state.reportName, ...this.props.rootStore.pinData },
            success: () => {this.setState({sending:false, sent: true}); },
            error: () => {console.log("AJAX ERROR");}
        });
    }
    render() {
        return (
            <React.Fragment>
                { this.state.sent
                    ? <div className="form-group">
                        <p>
                            <span>{ this.props.labels.pin.successMsg }</span>
                        </p>
                        <p>
                           <a href={ this.props.rootStore.programPageUrl }>
                                { this.props.labels.pin.successLink }
                           </a>
                        </p>
                      </div>
                    : <React.Fragment>
                        <div className="form-group">
                            <label className="text-uppercase">
                               { this.props.labels.pin.reportName }
                            </label>
                            <input type="text" className="form-control"
                                 value={ this.state.reportName }
                                 onChange={ this.handleChange }
                                 disabled={ this.state.sending }/>
                        </div>
                        { this.state.sending
                            ? <div className="btn btn-outline-primary" disabled>
                                <img src='/static/img/ajax-loader.gif' />&nbsp;
                                    { this.props.labels.loading }
                              </div>
                            : <button type="button"
                                  onClick={ this.handleClick }
                                  disabled={ this.isDisabled() }
                                  className="btn btn-primary">
                                      { this.props.labels.pin.submitButton }
                              </button>
                        }
                        </React.Fragment>
                        
                }
            </React.Fragment>
        );
    }
}

@inject('labels')
export class PinButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }
    
    handleClick(e) {
        this.setState({open: !this.state.open});
    }
    
    handleClose(e) {
        this.setState({open: false});
    }
    
    render() {
        return (
            <React.Fragment>
                <div
                    className="btn btn-sm btn-secondary"
                    ref="target"
                    onClick={ this.handleClick.bind(this) }>
                <i className="fas fa-thumbtack"></i> { this.props.labels.pin.buttonLabel }
                </div>
                <Popover
                    placement='bottom'
                    style={ {width: 'auto' } }
                    target={ this.refs.target }
                    show={ this.state.open }
                    onHide={ this.handleClose.bind(this) } >
                    <PinPopover />
                </Popover>
            </React.Fragment>
        );
    }
}

export const ExcelButton = inject('labels')(({ labels }) => {
        return <button type="button" className="btn btn-sm btn-secondary">
                    <i className="fas fa-download"></i> { labels.excel }
                </button>;
            
    }
);