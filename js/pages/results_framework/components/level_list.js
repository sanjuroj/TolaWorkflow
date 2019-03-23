import React from 'react';
import classNames from 'classnames';
import { observer, inject } from "mobx-react"
import { toJS } from 'mobx';
import eventBus from '../../../eventbus';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import {IndicatorFilterType} from "../models";
import Select from 'react-select';


library.add(faCaretDown, faCaretRight);

class LevelCardInactive extends React.Component {
    render(){
        return (
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", backgroundColor: "white", margin:"2em 0"}}>
                <div className="levelNameCollapsed">
                    <strong>
                        {this.props.levelProps.tierName}
                        {/*if we don't check whether there is an ontology, there ill be an extra
                        space before the colon */}
                        {this.props.levelProps.ontologyLabel ? " " + this.props.levelProps.ontologyLabel : null }:
                    </strong>
                    <span>&nbsp;{this.props.level.name}</span>
                </div>
                <div className="levelCollapsedButtons">
                    <div className="topButtons" style={{display: "flex", justifyContent: "flex-end"}}>
                        { this.props.levelProps.canDelete &&
                            <button type="button" className="btn btn-sm btn-link btn-danger">
                                <i className="fas fa-trash-alt"></i>&nbsp;{gettext("Delete")}
                            </button>
                        }
                        <button className="btn btn-sm btn-link btn-text">
                        <i className="fas fa-edit"/>&nbsp;{gettext("Edit")}</button>
                    </div>
                    <div className="bottomButtons" style={{display: "flex", justifyContent: "flex-end"}}>
                        <button type="button" className="btn btn-sm btn-link">Indicators</button>
                    </div>
                </div>
            </div>

        )
    }
}



@inject('rootStore')
@observer
class LevelList extends React.Component {
    render() {
        return (
            this.props.rootStore.levels.map( (level, index) => {
                return <LevelCardInactive
                    key={index}
                    level={level}
                    levelProps={this.props.rootStore.levelProperties[level.id]} />
            })

        )
    }
}


export const LevelListing = observer(function (props) {
    return (
        <div id="level-list" style={{flexGrow:"2"}}><LevelList /></div>
    )
});
