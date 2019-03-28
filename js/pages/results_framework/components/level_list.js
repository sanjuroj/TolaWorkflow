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

@inject('rootStore')
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



        let returnVals = renderList.map((elem) => {
            let children = this.props.rootStore.levels.filter(level => level.parent == elem.id);
            return (
                <div key={elem.id} className="new-leveltier">
                    <LevelCardExpanded
                        level={elem}
                        levelProps={this.props.rootStore.levelProperties[elem.id]} />
                    {children.length > 0 &&
                        <LevelList
                            rootStore={this.props.rootStore}
                            renderList={children} />
                    }
                </div>
            )
        });

        return returnVals
    }
}

export const LevelListing = observer(function (props) {
    return (
        <div id="level-list" style={{flexGrow:"2"}}><LevelList renderList='initial' /></div>
    )
});
