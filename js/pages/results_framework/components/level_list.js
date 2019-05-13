import React from 'react';
import classNames from 'classnames';
import { observer, inject } from "mobx-react"
import { toJS } from 'mobx';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select';
import {LevelCardCollapsed, LevelCardExpanded} from "./level_cards";

library.add(faCaretDown, faCaretRight);

@inject('rootStore', 'uiStore')
@observer
class LevelList extends React.Component {

    render() {
        let renderList = [];
        if (this.props.renderList == 'initial') {
            renderList = this.props.rootStore.levels.filter(level => level.parent == null).sort(elem => elem.customsort)
        }
        else{
            renderList = this.props.renderList.sort(elem => elem.customsort);
        }

        return renderList.map((elem) => {
            let card = '';
            if (elem.id in this.props.uiStore.expandedCards) {
                card =
                    <LevelCardExpanded
                        level={elem}
                        levelProps={this.props.rootStore.levelProperties[elem.id]}/>
            }
            else {
                card =
                    <LevelCardCollapsed
                        level={elem}
                        levelProps={this.props.rootStore.levelProperties[elem.id]}/>

            }

            let children = this.props.rootStore.levels.filter(level => level.parent == elem.id);
            let childLevels = null;
            if (children.length > 0){
                childLevels =  <LevelList
                    rootStore={this.props.rootStore}
                    uiStore={this.props.uiStore}
                    renderList={children}/>
            }

            return (
                <div key={elem.id} className="leveltier--new">
                    {card}
                    {childLevels}
                </div>
            )
    })}
}

export const LevelListing = observer(function (props) {
    return (
        <div id="level-list" style={{flexGrow:"2"}}><LevelList renderList='initial' /></div>
    )
});
