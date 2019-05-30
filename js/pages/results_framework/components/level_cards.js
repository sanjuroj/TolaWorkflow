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
    deleteLevel = () => {
        const levelTitle = this.props.levelProps.tierName + " " + this.props.levelProps.ontologyLabel;
        create_no_rationale_changeset_notice({
            /* # Translators:  This is a confirmation prompt that is triggered by clicking on a delete button. The code is a reference to the specific item being deleted.  Only one item can be deleted at a time. */
            message_text: `Are you sure you want to delete ${levelTitle}?`,
            on_submit: () => this.props.rootStore.levelStore.deleteLevelFromDB(this.props.level.id)});

    };

    editLevel = () => {
        this.props.rootStore.uiStore.addExpandedCard(this.props.level.id)
    };

    render(){

        if (this.props.rootStore.uiStore.hasVisibleChildren.indexOf(this.props.level.parent) < 0 && this.props.level.parent != null){
            return null;
        }
        const iCount = this.props.levelProps.indicators.length;
        /* # Translators: This is a count of indicators associated with another object */
        const indicatorCountText = interpolate(ngettext("%s indicator", "%s indicators", iCount), [iCount]);

        // The expando caret is only applied to levels that:
        // 1. Aren't at the end of the leveltier hierarchy
        // 2. Actually have children
        let expando = null;
        if (this.props.levelProps.tierName != toJS(this.props.rootStore.levelStore.chosenTierSet.slice(-1)[0]) &&
            this.props.rootStore.levelStore.levels.filter( l => l.parent == this.props.level.id).length > 0){
            expando = <FontAwesomeIcon icon={this.props.rootStore.uiStore.hasVisibleChildren.indexOf(this.props.level.id) >= 0 ? 'caret-down' : 'caret-right'} />
        }

        return (
            <div className="level-card level-card--collapsed" id={this.props.level.id}>
                <div onClick={(e) => this.props.rootStore.uiStore.updateVisibleChildren(this.props.level.id)}>
                    {expando}
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
                </div>
                <div className="level-card--collapsed__actions">
                    <div className="actions__top" style={{display: "flex", justifyContent: "flex-end"}}>
                        { this.props.levelProps.canDelete &&
                            <button
                                className="btn btn-sm btn-link btn-danger"
                                onClick={this.deleteLevel}>
                                <i className="fas fa-trash-alt"></i>&nbsp;{gettext("Delete")}
                            </button>
                        }
                        {this.props.levelProps.canEdit &&
                            <button className="btn btn-sm btn-link btn-text" onClick={this.editLevel}>
                                <i className="fas fa-edit"/>&nbsp;{gettext("Edit")}
                            </button>
                        }
                    </div>
                    <div className="actions__bottom" style={{display: "flex", justifyContent: "flex-end"}}>
                        <button className="btn btn-sm btn-link no-bold">{indicatorCountText}</button>
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

    saveLevel = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        this.props.rootStore.levelStore.saveLevelToDB(
            this.submitType,
            this.props.level.id,
            {name: this.name, assumptions: this.assumptions}
        )

    };

    cancelEdit = () => {
        this.props.rootStore.levelStore.cancelEdit(this.props.level.id)
    };

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
                        autoComplete="off"
                        onChange={this.onFormChange}    />
                    <label htmlFor="assumptions">Assumptions</label>
                    <textarea
                        className="form-control"
                        type="text"
                        id="level-assumptions"
                        name="assumptions"
                        autoComplete="off"
                        value={this.assumptions || ""}
                        onChange={this.onFormChange}/>
                    <ButtonBar
                        level={this.props.level}
                        levelProps={this.props.levelProps}
                        isActive={this.props.rootStore.uiStore.expandedCards[0] == this.props.level.id ? true : false}
                        submitFunc={this.updateSubmitType}
                        cancelFunc={this.cancelEdit}
                        tierCount={this.props.rootStore.levelStore.chosenTierSet.length}/>
                </form>
            </div>

        )
    }
}


@inject('rootStore')
class ButtonBar extends React.Component {
    render() {
        let disabledText = this.props.isActive ? "" : "disabled";

        // Build the button text with the right sibling level name, then build the button.
        let addAnotherButton = null;
        if (this.props.level.parent != null && this.props.level.parent != "root") {
            {/* # Translators: On a button, with a tiered set of objects, save current object and add another one in the same tier, e.g. "Save and add another Outcome" when the user is editing an Outcome */}
            const buttonText = interpolate(gettext("Save and add another %s"), [this.props.levelProps.tierName])
            addAnotherButton = <LevelButton disabledText={disabledText} classes="btn-primary" text={buttonText} submitType="saveAndAddSibling"  submitFunc={this.props.submitFunc} />
        }

        // Build the button text with the right child level name, then build the button.
        let addAndLinkButton = null;
        const tierCount = this.props.rootStore.levelStore.chosenTierSet.length;
        if (this.props.level.level_depth < tierCount) {
            {/* # Translators: On a button, with a tiered set of objects, save current object and add another one in the next lower tier, e.g. "Save and add another Activity" when the user is editing a Goal */}
            const buttonText = interpolate(gettext("Save and link %s"), [this.props.levelProps.childTierName])
            addAndLinkButton = <LevelButton disabledText={disabledText} classes="btn btn-primary" text={buttonText} submitType="saveAndAddChild" submitFunc={this.props.submitFunc} />
        }
        return (
            <div className="button-bar">
                <LevelButton disabledText={disabledText} classes="btn btn-primary" text={gettext("Save and close")} submitType="saveOnly" submitFunc={this.props.submitFunc} />
                {addAnotherButton}
                {addAndLinkButton}
                <LevelButton classes="btn btn-reset" text={gettext("Cancel")} submitType="cancel" submitFunc={this.props.cancelFunc} />
            </div>
        )

    }
}

class LevelButton extends React.Component {

    render() {
        const buttonType = this.props.submitType == "cancel" ? "button" : "submit";
        return (
            <button
                disabled={this.props.disabledText}
                type={buttonType}
                className={this.props.classes + ' level-button btn btn-sm'}
                onClick={() =>this.props.submitFunc(this.props.submitType)}>
                {this.props.text}
            </button>
        )

    }
}
