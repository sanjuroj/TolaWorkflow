import React from 'react';
import ReactDOM from 'react-dom';
import { inject, observer } from 'mobx-react';

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
        return !this.props.routeStore.pinData || !this.state.reportName;
    }
    handleClick = () => {
        this.setState({sending: true});
        $.ajax({
            type: "POST",
            url: this.props.routeStore.pinUrl,
            data: {name: this.state.reportName, ...this.props.routeStore.pinData },
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
                            <span>
                                {
                                    gettext('Success!  This report is now pinned to the program page')
                                }
                            </span>
                        </p>
                        <p>
                           <a href={ this.props.filterStore.programPageUrl }>
                                {
                                    gettext('Visit the program page now.')
                                }
                           </a>
                        </p>
                      </div>
                    : <React.Fragment>
                        <div className="form-group">
                            <label className="text-uppercase">
                                {
                                    /* # Translators: a field where users can name their newly created report */
                                    gettext('Report name')
                                }
                            </label>
                            <input type="text" className="form-control"
                                 value={ this.state.reportName }
                                 onChange={ this.handleChange }
                                 disabled={ this.state.sending }/>
                        </div>
                        { this.state.sending
                            ? <div className="btn btn-outline-primary" disabled>
                                <img src='/static/img/ajax-loader.gif' />&nbsp;
                                    { gettext('Loading') }
                              </div>
                            : <button type="button"
                                  onClick={ this.handleClick }
                                  disabled={ this.isDisabled() }
                                  className="btn btn-primary">
                                    {
                                        gettext('Pin to program page')
                                    }
                              </button>
                        }
                        </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

@inject('filterStore', 'routeStore')
export class PinButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }
    
    componentDidMount = () => {
        var content = `<div id="pin_popover_content"></div>`;
        var showFn = ($el) => {
            ReactDOM.render(
                <PinPopover
                    filterStore={this.props.filterStore}
                    routeStore={this.props.routeStore}
                />,
                document.querySelector('#pin_popover_content')
            );
        };
        $(this.refs.target).popover({
            content: content,
            html: true,
            placement: 'bottom'
        }).on('shown.bs.popover', showFn);
    }

    handleClose(e) {
        this.setState({open: false});
    }

    render() {
        return (
            <React.Fragment>
                <button
                    href="#"
                    className="btn btn-sm btn-secondary"
                    ref="target">
                <i className="fas fa-thumbtack"></i>
                    {
                        /* # Translators: a button that lets a user "pin" (verb) a report to their home page */
                        gettext('Pin')
                    }
                </button>
            </React.Fragment>
        );
    }
}


@observer
class ExcelPopover extends React.Component {
    getCurrent = () => {
        if (this.props.routeStore.excelUrl) {
            window.open(this.props.routeStore.excelUrl, '_blank');
        }
    }

    getAll = () => {
        if (this.props.routeStore.fullExcelUrl) {
            window.open(this.props.routeStore.fullExcelUrl, '_blank');
        }
    }
    render() {
        return (
            <div className="">
                <button type="button" className="btn btn-primary btn-block"
                     onClick={ this.getCurrent }>
                    {
                        /* # Translators: a download button for a report containing just the data currently displayed */
                        gettext('Current view')
                    }
                </button>
                <button type="button" className="btn btn-primary btn-block"
                     onClick={ this.getAll }>
                    {
                        /* # Translators: a download button for a report containing all available data */
                        gettext('All program data')
                    }
                </button>
            </div>
        );
    }
}

@inject('filterStore', 'routeStore')
@observer
export class ExcelButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }
    
    componentDidMount = () => {
        if (this.props.filterStore.isTVA) {
            var content = `<div id="excel_popover_content"></div>`;
            var showFn = ($el) => {
                ReactDOM.render(
                    <ExcelPopover
                        filterStore={this.props.filterStore}
                        routeStore={this.props.routeStore} />,
                    document.querySelector('#excel_popover_content')
                );
            };
            $(this.refs.target).popover({
                content: content,
                html: true,
                placement: 'bottom'
            }).on('shown.bs.popover', showFn);
        }
        
    }

    handleClick = () => {
        if (!this.props.filterStore.isTVA && this.props.routeStore.excelUrl) {
            window.open(this.props.routeStore.excelUrl, '_blank');
        }
    }

    render() {
        return (
            <React.Fragment>
                <button type="button"
                     className="btn btn-sm btn-secondary"
                     ref="target"
                     onClick={this.handleClick.bind(this) }>
                     <i className="fas fa-download"></i> Excel
                     </button>
            </React.Fragment>
        );
    }
}
