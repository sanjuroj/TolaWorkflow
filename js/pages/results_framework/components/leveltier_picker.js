import React from 'react';
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";

import Select from 'react-select';

@inject('rootStore')
@observer
class Picker extends React.Component {
    handleChange = selectedTemplate => {
        this.props.rootStore.levelStore.changeTierSet(selectedTemplate.value);
    };

    componentDidUpdate() {
        // Enable popovers after update (they break otherwise)
        $('*[data-toggle="popover"]').popover({
            html: true
        });
    }

    render() {
        let helpIcon = null;
        if (this.props.rootStore.uiStore.tierLockStatus == "locked"){

            helpIcon = <a href="#"
                tabIndex="0"
                data-toggle="popover"
                data-trigger="focus"
                data-html="true"
                data-content={gettext('<span class="text-danger"><strong>The results framework template cannot be changed after levels are saved.</strong></span> To change templates, all saved levels first must be deleted.  A level can be deleted when it has no sub-levels and no linked indicators.')}>
                <i className="far fa-question-circle"></i></a>
        }
        else if (this.props.rootStore.uiStore.tierLockStatus == "primed"){
            helpIcon = <a href="#"
                tabIndex="0"
                data-toggle="popover"
                data-trigger="focus"
                data-html="true"
                data-content={gettext('<span class="text-danger"><strong>Choose your results framework template carefully!</strong></span> Once you begin building your framework, it will not be possible to change templates without first deleting all saved levels.')}>
                <i className="far fa-question-circle"></i></a>
        }


        const tierTemplates = this.props.rootStore.levelStore.tierTemplates;

        const options = Object.keys(tierTemplates).map(key => {
            return {value:key, label:tierTemplates[key]['name']};
        });

        const selectedOption = {value:this.props.rootStore.levelStore.chosenTierSetKey, label: this.props.rootStore.levelStore.chosenTierSetName};

        let classes = "leveltier-picker__selectbox ";
        classes += this.props.rootStore.uiStore.tierLockStatus == "locked" ? "leveltier-picker__selectbox--disabled" : "";

        return (
              <div className={classes}>
                <label>TEMPLATE</label><span>{helpIcon}</span>
                <Select
                    options={options}
                    value={selectedOption}
                    isDisabled={this.props.rootStore.uiStore.tierLockStatus == "locked" ? true : false}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}

class LevelTier extends React.Component {

    render() {
        return (
            <div className={'leveltier leveltier--level-' + this.props.tierLevel}>{this.props.tierName} </div>
    )}
}

@inject('rootStore')
@observer
class LevelTierList extends React.Component{

    render() {
        let apply_button = null
        if (this.props.rootStore.levelStore.levels.length == 0) {
            apply_button =
                <button
                    className="leveltier-button btn btn-primary btn-block"
                    onClick={this.props.rootStore.levelStore.createFirstLevel}>
                    {/* #Translators: this refers to an imperative verb on a button ("Apply filters")*/}
                    {gettext("Apply")}
                </button>
        }

        return (
            <React.Fragment>
                <div id="leveltier-list" className="leveltier-list">
                    {
                        this.props.rootStore.levelStore.chosenTierSet.length > 0 ?
                            this.props.rootStore.levelStore.chosenTierSet.map((tier, index) => {
                                return <LevelTier key={index} tierLevel={index} tierName={tier}/>
                            })
                            : null
                    }


                </div>
                {
                    apply_button ?
                        <div className="leveltier-list__actions">
                            {apply_button}
                        </div>
                    : null
                }
            </React.Fragment>
        )
    }
}

export const LevelTierPicker = inject("rootStore")(observer(function (props) {

    return (
        <div id="leveltier-picker" className="leveltier-picker">
            <Picker />
            <LevelTierList />
        </div>
    )
}));
