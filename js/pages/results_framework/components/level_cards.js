import React from 'react';
import classNames from 'classnames';
import { observer, inject } from "mobx-react"
import { toJS } from 'mobx';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select';


library.add(faCaretDown, faCaretRight);

export class LevelTitle extends React.Component {

    render() {
        return (
            <span className={'level-title ' + this.props.classes}>
                {this.props.tierName}
                {/*if we don't check whether there is an ontology, there ill be an extra
                space before the colon */}
                {this.props.ontologyLabel ? " " + this.props.ontologyLabel : null}:
            </span>
        )

    }
}

@inject('rootStore', 'uiStore')
@observer
export class LevelCardCollapsed extends React.Component {
    constructor(props){
        super(props);
        this.deleteLevel = this.deleteLevel.bind(this);
        this.editLevel = this.editLevel.bind(this);
    }

    deleteLevel() {
        const currentElement =  document.getElementById(this.props.level.id);
        console.log("You clicked delete level")
    }

    editLevel = () => {
        console.log("You clicked to edit level")
        this.props.uiStore.addExpandedCard(this.props.level.id)
    };

    render(){
        return (
            <div className="level-card--collapsed" id={this.props.level.id}>
                <div className="level-card--collapsed__name">
                    <strong>
                        <LevelTitle
                            tierName={this.props.levelProps.tierName}
                            ontologyLabel={this.props.levelProps.ontologyLabel}
                            classes="level-title--collapsed"
                        />
                    </strong>
                    <span>&nbsp;{this.props.level.name}</span>
                </div>
                <div className="level-card--collapsed__actions">
                    <div className="actions__top" style={{display: "flex", justifyContent: "flex-end"}}>
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
                    <div className="actions__bottom" style={{display: "flex", justifyContent: "flex-end"}}>
                        <button className="btn btn-sm btn-link">Indicators</button>
                    </div>
                </div>
            </div>

        )
    }
}


@inject('rootStore')
@observer
export class LevelCardExpanded extends React.Component {
    constructor(props){
        super(props);
        this.onFormChange = this.onFormChange.bind(this);
        // this.saveLevel = this.saveLevel.bind(this);
        // this.saveLevel = this.saveLevel.bind(this);
    }

    saveLevel() {
        const currentElement =  document.getElementById(this.props.level.id);
        console.log("You clicked delete level")
    }

    saveAndCreateChild() {
        const currentElement =  document.getElementById(this.props.level.id);
        console.log("You clicked to save and and a child level")
    }

    saveAndCreateSibling() {
        const currentElement =  document.getElementById(this.props.level.id);
        console.log("You clicked to save and and a sibling level")
    }

    onFormChange(event){
        this.props.level[event.target.name] = event.target.value;
    }

    render(){

        return (
            <div className="level-card--expanded" id={this.props.level.id}>
                <div>
                    <LevelTitle
                        tierName={this.props.levelProps.tierName}
                        ontologyLabel={this.props.levelProps.ontologyLabel}
                        classes="level-title--expanded"
                    />

                </div>
                <form className="level-card--expanded__form">
                    <input
                        type="text"
                        id="level-name"
                        name="name"
                        value={this.props.level.name || ""}
                        onChange={this.onFormChange}    />
                    <label htmlFor="assumptions">Assumptions</label>
                    <input
                        type="text"
                        id="level-assumptions"
                        name="assumptions"
                        value={this.props.level.assumptions || ""}
                        onChange={this.onFormChange}/>
                    <ButtonBar />
                </form>
            </div>

        )
    }
}


class ButtonBar extends React.Component {
    render() {
        return (
            <div className="button-bar">
                <LevelButton classes="" text="Save and close" />
                <LevelButton classes="" text="Save and another" />
                <LevelButton classes="" text="Save and link" />
            </div>
        )

    }
}

class LevelButton extends React.Component {

    render() {
        return (
            <button className={this.props.classes + ' level-button'}>
                {this.props.text}
            </button>
        )

    }
}
