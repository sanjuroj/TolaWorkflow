import React from 'react';
import classNames from 'classnames';
import { observer, inject } from "mobx-react"
import { toJS, extendObservable } from 'mobx';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select';


library.add(faCaretDown, faCaretRight);

export class LevelTitle extends React.Component {

    render() {
        return (
            <h3 className={'level-title ' + this.props.classes}>
                {this.props.tierName}
                {/*if we don't check whether there is an ontology, there ill be an extra
                space before the colon */}
                {this.props.ontologyLabel ? " " + this.props.ontologyLabel : null}
            </h3>
        )

    }
}

@inject('rootStore')
@observer
export class LevelCardCollapsed extends React.Component {
    constructor(props){
        super(props);
        this.deleteLevel = this.deleteLevel.bind(this);
        this.editLevel = this.editLevel.bind(this);
    }

    deleteLevel() {
        console.log("You clicked delete level")
    }

    editLevel = () => {
        this.props.rootStore.uiStore.addExpandedCard(this.props.level.id)
    };

    render(){
        return (
            <div className="level-card level-card--collapsed" id={this.props.level.id}>
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
        this.submitType = "saveOnly";
        extendObservable(this, {
            name: props.level.name,
            assumptions: props.level.assumptions,
        })
    }

    /*
    Using this allows us to use the same submit function for all three buttons.  Shame the function has to
    be passed all the way down to the button to work.
     */
    updateSubmitType = (newType) => {
        this.submitType = newType;
    };

    saveLevel = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        this.props.rootStore.levelStore.saveLevelToDB(
            this.submitType,
            this.props.level.id,
            {name: this.name, assumptions: this.assumptions}
        )

    };

    cancelEdit = (e) => {
        this.props.rootStore.levelStore.cancelEdit(this.props.level.id)
    }

    onFormChange = (event) => {
        event.preventDefault();
        this[event.target.name] = event.target.value;
    };

    render(){
        return (
            <div className="level-card level-card--expanded" id={this.props.level.id}>
                <div>
                    <LevelTitle
                        tierName={this.props.levelProps.tierName}
                        ontologyLabel={this.props.levelProps.ontologyLabel}
                        classes="level-title--expanded"
                    />

                </div>
                <form className="level-card--expanded__form" onSubmit={this.saveLevel}>
                    <textarea
                        className="form-control"
                        type="text"
                        id="level-name"
                        name="name"
                        value={this.name || ""}
                        onChange={this.onFormChange}    />
                    <label htmlFor="assumptions">Assumptions</label>
                    <textarea
                        className="form-control"
                        type="text"
                        id="level-assumptions"
                        name="assumptions"
                        value={this.assumptions || ""}
                        onChange={this.onFormChange}/>
                    <ButtonBar
                        level={this.props.level}
                        submitFunc={this.updateSubmitType}
                        cancelFunc={this.cancelEdit}
                        tierCount={this.props.rootStore.levelStore.chosenTierSet.length}/>
                </form>
            </div>

        )
    }
}


class ButtonBar extends React.Component {
    render() {
        let addAnotherButton = null;
        if (this.props.level.parent != null && this.props.level.parent != "root") {
            addAnotherButton = <LevelButton classes="btn-primary" text={gettext("Save and another")} submitType="saveAndAddSibling"  submitFunc={this.props.submitFunc} />
        }

        let addAndLinkButton = null;
        if (this.props.level.level_depth < this.props.tierCount) {
            addAndLinkButton = <LevelButton classes="btn-primary" text={gettext("Save and link")} submitType="saveAndAddChild" submitFunc={this.props.submitFunc} />
        }
        return (
            <div className="button-bar">
                <LevelButton classes="btn-primary" text={gettext("Save and close")} submitType="saveOnly" submitFunc={this.props.submitFunc} />
                {addAnotherButton}
                {addAndLinkButton}
                <LevelButton classes="btn-reset" text={gettext("Cancel")} submitType="cancel" submitFunc={this.props.cancelFunc} />
            </div>
        )

    }
}

class LevelButton extends React.Component {

    render() {
        const buttonType = this.props.submitType == "cancel" ? "button" : "submit";
        return (
            <button
                type={buttonType}
                className={this.props.classes + ' level-button btn'}
                onClick={() =>this.props.submitFunc(this.props.submitType)}>
                {this.props.text}
            </button>
        )

    }
}
