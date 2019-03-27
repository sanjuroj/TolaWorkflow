import React from 'react';
import classNames from 'classnames';
import { observer, inject } from "mobx-react"
import { toJS } from 'mobx';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select';


library.add(faCaretDown, faCaretRight);

@inject('rootStore')
class LevelCardCollapsed extends React.Component {
    constructor(props){
        super(props);
        this.deleteLevel = this.deleteLevel.bind(this);
        this.editLevel = this.editLevel.bind(this);
    }

    deleteLevel() {
        const currentElement =  document.getElementById(this.props.level.id);
        console.log("You clicked delete level")
    }

    editLevel() {
        const currentElement =  document.getElementById(this.props.level.id);
        console.log("You clicked to edit level")
    }

    render(){
        return (
            <div className="levelcard" id={this.props.level.id}>
                <div className="levelcard-collapsed__name">
                    <strong>
                        {this.props.levelProps.tierName}
                        {/*if we don't check whether there is an ontology, there ill be an extra
                        space before the colon */}
                        {this.props.levelProps.ontologyLabel ? " " + this.props.levelProps.ontologyLabel : null }:
                    </strong>
                    <span>&nbsp;{this.props.level.name}</span>
                </div>
                <div className="levelcard-collapsed__rightbuttons">
                    <div className="topButtons" style={{display: "flex", justifyContent: "flex-end"}}>
                        { this.props.levelProps.canDelete &&
                            <button
                                className="btn btn-sm btn-link btn-danger"
                                onClick={this.deleteLevel}
                            >
                                <i className="fas fa-trash-alt"></i>&nbsp;{gettext("Delete")}
                            </button>
                        }
                        <button className="btn btn-sm btn-link btn-text" onClick={this.editLevel}>
                        <i className="fas fa-edit"/>&nbsp;{gettext("Edit")}</button>
                    </div>
                    <div className="bottomButtons" style={{display: "flex", justifyContent: "flex-end"}}>
                        <button className="btn btn-sm btn-link">Indicators</button>
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
                    <LevelCardCollapsed
                        level={elem}
                        levelProps={this.props.rootStore.levelProperties[elem.id]} />
                    {children.length > 0 &&
                        <LevelList
                            rootStore={this.props.rootStore}
                            renderList={children} />
                    }
                </div>
            )
        })
        console.log('returnvalsss', toJS(returnVals))
        return returnVals
    }




}

export const LevelListing = observer(function (props) {
    return (
        <div id="level-list" style={{flexGrow:"2"}}><LevelList renderList='initial' /></div>
    )
});
