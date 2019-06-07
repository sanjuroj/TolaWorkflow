import React from 'react';
import classNames from 'classnames';
import { observer, inject } from "mobx-react"
import { toJS, extendObservable } from 'mobx';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretDown, faArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import { SingleReactSelect } from "../../../components/selectWidgets";
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import HelpPopover from "../../../components/helpPopover";



library.add(faCaretDown, faCaretRight, faArrowsAlt);

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

    componentDidMount() {
        // Enable popovers after update (they break otherwise)
        $('*[data-toggle="popover"]').popover({
            html: true
        });
    }

    buildIPTTUrl = (indicator_ids) => {
        let url = `/indicators/iptt_report/${this.props.rootStore.levelStore.program_id}/timeperiods/?frequency=3&start=0&end=999`;
        indicator_ids.forEach( i => url += "&indicators="+i);
        return url
    };

    render(){
        // the level card shouldn't be displayed if it's parent level is not expandoed (except
        // if the level is the top level one).
        if (this.props.rootStore.uiStore.hasVisibleChildren.indexOf(this.props.level.parent) < 0 && this.props.level.parent != null){
            return null;
        }

        // Prepare the indicator links for the indicator popover

        let allIndicatorLinks = [];

        // Get indicator ids linked to this level and create a hyperlink for a filtered IPTT.
        let sameLevelIndicatorIds = this.props.levelProps.indicators.map( i => i.id);
        if (sameLevelIndicatorIds.length > 0) {
            const linkText = `All indicators linked to ${this.props.levelProps.tierName} ${this.props.levelProps.ontologyLabel}`
            allIndicatorLinks.push(`<a href=${this.buildIPTTUrl(sameLevelIndicatorIds)}>${linkText}</a>`);
        }

        // Get indicator ids linked to the descendants of this level, add the indicator ids identified
        // above, and create a hyperlink for a filtered IPTT.  Only do this if the level has sublevels.
        if (this.props.levelProps.tierName != this.props.rootStore.levelStore.chosenTierSet.slice(-1)[0]) {
            let descendantIndicatorIds = this.props.levelProps.descendantIndicatorIds;
            descendantIndicatorIds = descendantIndicatorIds.concat(sameLevelIndicatorIds);
            if (descendantIndicatorIds.length > 0) {
                const linkText = `All indicators linked to ${this.props.levelProps.tierName} ${this.props.levelProps.ontologyLabel} and sub-levels`;
                allIndicatorLinks.unshift(`<a href=${this.buildIPTTUrl(descendantIndicatorIds)}>${linkText}</a>`);
            }
        }

        // Create IPTT hyperlinks for each individual indicator linked to this level
        let individualLinks = this.props.levelProps.indicators.map( (indicator, index) => {
            const ontologyLabel = this.props.levelProps.ontologyLabel + String.fromCharCode(97+index) + ": ";
            return `<li class="nav-item"><a href=${this.buildIPTTUrl([indicator.id])}>${ontologyLabel}${indicator.name}</a></li>`;
        });
        allIndicatorLinks = allIndicatorLinks.concat(individualLinks);


        let indicatorMarkup = `<ul class="nav flex-column">${allIndicatorLinks.join("<br>")}</ul>`;
        const iCount = this.props.levelProps.indicators.length;
        /* # Translators: This is a count of indicators associated with another object */
        const indicatorCountText = interpolate(ngettext("%s indicator", "%s indicators", iCount), [iCount]);

        // The expando caret is only applied to levels that:
        // 1. Aren't at the end of the leveltier hierarchy
        // 2. Actually have children
        let expando = null;
        if (this.props.levelProps.tierName != toJS(this.props.rootStore.levelStore.chosenTierSet.slice(-1)[0]) &&
            this.props.rootStore.levelStore.levels.filter( l => l.parent == this.props.level.id).length > 0){
            expando = <FontAwesomeIcon className="text-action" icon={this.props.rootStore.uiStore.hasVisibleChildren.indexOf(this.props.level.id) >= 0 ? 'caret-down' : 'caret-right'} />
        }

        return (
            <div className="level-card level-card--collapsed" id={this.props.level.id}>
                <div
                    className={expando ? "level-card__toggle": ""}
                    onClick={(e) => this.props.rootStore.uiStore.updateVisibleChildren(this.props.level.id)}>
                    {expando}
                    <span className="level-card--collapsed__name">
                        <LevelTitle
                            tierName={this.props.levelProps.tierName}
                            ontologyLabel={this.props.levelProps.ontologyLabel}
                            classes="level-title--collapsed"
                        />
                        &nbsp;{this.props.level.name}
                    </span>
                </div>
                <div className="level-card--collapsed__actions">
                    <div className="actions__top btn-row">
                        { this.props.levelProps.canDelete &&
                            <button
                                className="btn btn-sm btn-link btn-danger"
                                onClick={this.deleteLevel}>
                                <i className="fas fa-trash-alt"></i>{gettext("Delete")}
                            </button>
                        }
                        {this.props.levelProps.canEdit &&
                            <button className="btn btn-sm btn-link btn-text" onClick={this.editLevel}>
                                <i className="fas fa-edit"/>{gettext("Edit")}
                            </button>
                        }
                    </div>
                    <div className="actions__bottom">
                        <button
                            className="btn btn-sm btn-link no-bold"
                            data-toggle="popover"
                            data-trigger="focus"
                            data-placement="bottom"
                            data-html="true"
                            title="Track indicator performance"
                            data-content={indicatorMarkup}
                            disabled={allIndicatorLinks.length == 0}>
                            {indicatorCountText}
                        </button>
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
        this.indicatorWasReordered = false;
        extendObservable(this, {
            name: props.level.name,
            assumptions: props.level.assumptions,
            indicators: props.levelProps.indicators.sort((a, b) => a.level_order - b.level_order),
        });
    }

    onDragEnd = ({oldIndex, newIndex}) => {
        const indicatorId = this.indicators[oldIndex].id;
        const fakeChangeObj = {value: newIndex + 1, name: newIndex + 1};
        this.updateIndicatorOrder(fakeChangeObj, indicatorId)
    };


    updateIndicatorOrder = (changeObj, indicatorId) => {
        this.indicatorWasReordered = true;
        let oldIndex = this.indicators.find( i => i.id == indicatorId).level_order - 1;
        let newIndex = changeObj.value - 1;
        let tempIndicators = this.indicators.slice();
        tempIndicators.splice(newIndex, 0, tempIndicators.splice(oldIndex, 1)[0]);
        tempIndicators.forEach( (indicator, index) => indicator.level_order = index + 1);
        this.indicators.replace(tempIndicators);
    }

    /*
    Using this allows us to use the same submit function for all three buttons.  Shame the function has to
    be passed all the way down to the button to work.
     */
    updateSubmitType = (newType) => {
        this.submitType = newType;
    };

    componentDidMount() {
        // Enable popovers after update (they break otherwise)
        $('*[data-toggle="popover"]').popover({
            html: true
        });
    }

    saveLevel = (event) => {
        event.preventDefault();
        this.props.rootStore.levelStore.saveLevelToDB(
            this.submitType,
            this.props.level.id,
            this.indicatorWasReordered,
            {name: this.name,assumptions: this.assumptions,indicators: toJS(this.indicators)}
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
        // Need to reference indicators so it reacts to changes.  Simply passing the observable this.indicators through
        // to IndicatorList will result in a non-reactive Indicator list form fields.
        const tempIndicators = toJS(this.indicators);
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
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            id="level-name"
                            name="name"
                            value={this.name || ""}
                            autoComplete="off"
                            onChange={this.onFormChange}
                        />
                    </div>
                    <div className="form-group">
                            <label htmlFor="assumptions">Assumptions</label>
                        <textarea
                            className="form-control"
                            id="level-assumptions"
                            disabled={this.name? "" : "disabled"}
                            name="assumptions"
                            autoComplete="off"
                            value={this.assumptions || ""}
                            onChange={this.onFormChange}/>
                    </div>
                    <IndicatorList
                        level={this.props.level}
                        tierName={this.props.levelProps.tierName}
                        indicators={this.indicators}
                        changeFunc={this.updateIndicatorOrder}
                        dragEndFunc={this.onDragEnd}/>

                    <ButtonBar
                        level={this.props.level}
                        levelProps={this.props.levelProps}
                        isActive={this.props.rootStore.uiStore.expandedCards[0] == this.props.level.id}
                        submitFunc={this.updateSubmitType}
                        cancelFunc={this.cancelEdit}
                        nameVal={this.name}
                        tierCount={this.props.rootStore.levelStore.chosenTierSet.length}
                    />
                </form>
            </div>

        )
    }
}


@inject('rootStore')
class ButtonBar extends React.Component {
    render() {
        let disabledText = this.props.isActive && this.props.nameVal ? "" : "disabled";

        // Build the button text with the right sibling level name, then build the button.
        let addAnotherButton = null;
        if (this.props.level.parent != null && this.props.level.parent != "root") {
            {/* # Translators: On a button, with a tiered set of objects, save current object and add another one in the same tier, e.g. "Save and add another Outcome" when the user is editing an Outcome */}
            const buttonText = interpolate(gettext("Save and add another %s"), [this.props.levelProps.tierName])
            addAnotherButton = <LevelButton disabledText={disabledText} classes="btn-primary" icon='plus-circle' text={buttonText} submitType="saveAndAddSibling"  submitFunc={this.props.submitFunc} />
        }

        // Build the button text with the right child level name, then build the button.
        let addAndLinkButton = null;
        const tierCount = this.props.rootStore.levelStore.chosenTierSet.length;
        if (this.props.level.level_depth < tierCount) {
            {/* # Translators: On a button, with a tiered set of objects, save current object and add another one in the next lower tier, e.g. "Save and add another Activity" when the user is editing a Goal */}
            const buttonText = interpolate(gettext("Save and link %s"), [this.props.levelProps.childTierName])
            addAndLinkButton = <LevelButton disabledText={disabledText} classes="btn btn-primary" icon='stream' text={buttonText} submitType="saveAndAddChild" submitFunc={this.props.submitFunc} />
        }
        return (
            <div className="button-bar btn-row">
                <LevelButton disabledText={disabledText} classes="btn-primary" text={gettext("Save and close")} icon='save' submitType="saveOnly" submitFunc={this.props.submitFunc} />
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
                {/*this.props.icon ?  <FontAwesomeIcon icon={this.props.icon} /> : ''*/}
            </button>
        )

    }
}

class IndicatorList extends React.Component {

    componentDidMount() {
        // Enable popovers after update (they break otherwise)
        $('*[data-toggle="popover"]').popover({
            html: true
        });
    }

    render() {
        // Create the list of indicators and the dropdowns for setting the indicator order
        let options = this.props.indicators.map( (entry, index) => {return {value: index+1, label: index+1}});

        let indicatorMarkup = [];
        this.props.indicators.forEach( (indicator) => {
            // let options = this.props.indicators.map( (entry, index) => <option value={index+1}>{index+1}</option>);
            indicatorMarkup.push(
                <React.Fragment>
                    <SingleReactSelect
                        update={(value) => this.props.changeFunc(value, indicator.id)}
                        selectId={"ind"+indicator.id}
                        labelClasses="col-form-label"
                        value={{value: indicator.level_order, label: indicator.level_order}}
                        label={indicator.name}
                        options={options}/>
                    <a href="#" className="indicator-link"><i className="fas fa-cog"></i> Settings</a>
                </React.Fragment>
            )
        });

        // Conditionally set the other elements that are only visible when there are indicators
        let order = null;
        let helpLink = null;
        if (this.props.indicators.length > 0) {
            order = "Order";
            helpLink =
                <HelpPopover
                    content='To remove an indicator: Click “Settings”, where you can reassign the indicator to a different level or delete it.'
                    placement="bottom"/>
        }

        return(
            <ul id="level-card--indicator-links" style={{backgroundColor: "white", padding: "1em"}}>
                <div>
                    Indicators Linked to this {this.props.tierName}
                    {order}
                    {helpLink}
                </div>
                <div>
                    <SortableContainer onSortEnd={this.props.dragEndFunc} useDragHandle lockAxis="y" lockToContainerEdges>
                        {indicatorMarkup.map((value, index) => (
                            <SortableItem key={`item-${index}`} index={index} value={value} />
                        ))}
                      </SortableContainer>
                </div>
                <div>
                    <a href="#" role="button" className="btn btn-link btn-add">
                    <img className="fas fa-plus-circle"></img>
                    <span>Add Indicator</span>
                    </a>
                </div>
            </ul>
        )
    }
}

const SortableItem = sortableElement(({value}) => <li><DragHandle/>{value}</li>);

const SortableContainer = sortableContainer(({children}) => {
    return <ul>{children}</ul>;
});

const DragHandle = sortableHandle(() => <span><FontAwesomeIcon icon={faArrowsAlt} /></span>);



