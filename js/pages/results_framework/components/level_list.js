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

class LevelCardCollapsed extends React.Component {
    titleStyle = {};
    render(){
        return (
            <div>
                <strong>
                    {this.props.levelProps.tierName}
                    {/*if we don't check whether there is an ontology, there ill be an extra space before the colon */}
                    {this.props.levelProps.ontologyLabel ? " " + this.props.levelProps.ontologyLabel : null }:
                </strong>
                <span>&nbsp;{this.props.level.name}</span>
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
                return <LevelCardCollapsed key={index} level={level} levelProps={this.props.rootStore.levelProperties[level.id]} />
            })

        )
    }
}


export const LevelListing = observer(function (props) {
    return (
        <div id="level-list" style={{flexGrow:"2"}}><LevelList /></div>
    )
});
