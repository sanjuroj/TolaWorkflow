import React from 'react';
import classNames from 'classnames';
import { observer, inject } from "mobx-react"
import eventBus from '../../../eventbus';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import {IndicatorFilterType} from "../models";
import Select from 'react-select';


library.add(faCaretDown, faCaretRight);

class LevelCard extends React.Component {
    render(){
        return (
            <div>{this.props.level.name}</div>
        )
    }
}



@inject('rootStore')
@observer
class LevelList extends React.Component {
    render() {
        return (
            this.props.rootStore.levels.map( (level, index) => {
                return <LevelCard key={index} level={level} />
            })

        )
    }
}


export const LevelListing = observer(function (props) {
    return (
        <div id="level-list" style={{flexGrow:"2"}}><LevelList /></div>
    )
});
