import React from 'react';
import classNames from 'classnames';
import { observer } from "mobx-react"
import eventBus from '../../../eventbus';
import {IndicatorFilterType} from "../models";
import {localDateFromISOString} from "../../../date_utils";


@observer
class GaugeTank extends React.Component {

    handleClick = (e) => {
        e.preventDefault();
        if (! this.props.disabled && this.unfilledPercent != 0) {
            eventBus.emit('nav-apply-gauge-tank-filter', this.props.filterType);
        }
    };

    render() {
        const tickCount = 10;

        const {allIndicatorsLength, filteredIndicatorsLength, title, filledLabel, unfilledLabel, cta, emptyLabel, disabled} = this.props;

        const filterType = this.props.filterType;
        const currentIndicatorFilter = this.props.currentIndicatorFilter;

        const isHighlighted = filterType === currentIndicatorFilter;

        // Gauge should only show 100%/0% if filtered == all/0 (absolute 100%, not rounding to 100%)
        // to accomplish this, added a Math.max and Math.min to prevent rounding to absolute values:
        const unfilledPercent = (allIndicatorsLength <= 0 || allIndicatorsLength == filteredIndicatorsLength) ? 100 :
            (filteredIndicatorsLength == 0 ? 0 :
                Math.max(1, Math.min(Math.round((filteredIndicatorsLength / allIndicatorsLength) * 100), 99)));
        this.unfilledPercent = unfilledPercent;
        const filledPercent = 100 - unfilledPercent;

        return <div className={classNames('gauge', {'filter-trigger': unfilledPercent > 0 && !disabled, 'is-highlighted': isHighlighted})}
                    onClick={this.handleClick} >
            <h6 className="gauge__title">{title}</h6>
            <div className="gauge__overview">
                <div
                    className="gauge__graphic gauge__graphic--tank{% if filled_percent == 0 %} gauge__graphic--empty{% endif %}">
                    <div className="graphic__tick-marks">
                        {[...Array(tickCount)].map((e, i) => <div key={i} className="graphic__tick"/>)}
                    </div>
                    <div className="graphic__tank--unfilled" style={{'flexBasis': `${unfilledPercent}%`}}/>
                    <div className="graphic__tank--filled" style={{'flexBasis': `${filledPercent}%`}}/>
                </div>
                <div className="gauge__labels">
                    {filledPercent > 0 ?

                        <React.Fragment>
                            <div className="gauge__label text-muted">
                                {unfilledPercent}% {unfilledLabel}
                            </div>
                            <div className="gauge__label">
                                <span className="gauge__value">{filledPercent}% {filledLabel}</span>
                            </div>
                        </React.Fragment>

                        :

                        <div className="gauge__label">
                            <span className="text-danger"><strong>{emptyLabel}</strong></span>
                        </div>
                    }
                </div>
            </div>
            { unfilledPercent > 0 && !disabled &&
            <div className="gauge__cta">
                <span className="btn-link btn-inline"><i className="fas fa-exclamation-triangle text-warning"/> {cta}</span>
                &nbsp;
            </div>
            }
        </div>;
    }
}


@observer
class GaugeBand extends React.Component {
    constructor(props) {
        super(props);

        this.handledFilterTypes = new Set([
            IndicatorFilterType.aboveTarget,
            IndicatorFilterType.belowTarget,
            IndicatorFilterType.onTarget,
        ]);
    }

    onFilterLinkClick = (e, filterType) => {
        e.preventDefault();
        eventBus.emit('nav-apply-gauge-tank-filter', filterType);
    };

    componentDidUpdate() {
        // Enable popovers after update (they break otherwise)
        $(this.el).find('[data-toggle="popover"]').popover({
            html: true
        });
    }


    render() {
        const tickCount = 10;

        const {indicatorStore, program} = this.props;

        const currentIndicatorFilter = this.props.currentIndicatorFilter;

        const isHighlighted = this.handledFilterTypes.has(currentIndicatorFilter);

        const totalIndicatorCount = indicatorStore.indicators.length;
        const nonReportingCount = indicatorStore.getIndicatorsNotReporting.length;
        const highCount = indicatorStore.getIndicatorsAboveTarget.length;
        const lowCount = indicatorStore.getIndicatorsBelowTarget.length;
        const onTargetCount = indicatorStore.getIndicatorsOnTarget.length;

        //100 and 0 should only represent absolute "all" and "none" values respectively (no round to 100 or to 0)
        const makePercent = totalIndicatorCount > 0 ?
            (x) => (x == totalIndicatorCount ? 100 :
                    (x == 0 ? 0 : Math.max(1, Math.min(Math.round((x / totalIndicatorCount) * 100), 99)))) : (x) => 0;

        const percentHigh = makePercent(highCount);
        const percentOnTarget = makePercent(onTargetCount);
        const percentBelow = makePercent(lowCount);
        const percentNonReporting = makePercent(nonReportingCount);

        const marginPercent = this.props.indicatorOnScopeMargin * 100;

        let programPeriodStartDate = localDateFromISOString(program.reporting_period_start);

        let gaugeHasErrors = (indicatorStore.getIndicatorsReporting.length === 0) || (indicatorStore.getTotalResultsCount === 0);


        // Top level wrapper of component
        let Gauge = (props) => {
            return <div className={classNames('gauge', {'is-highlighted': isHighlighted})} ref={el => this.el = el}>
                <h6 className="gauge__title">{gettext('Indicators on track')}</h6>
                <div className="gauge__overview">
                    {props.children}
                </div>
            </div>
        };

        let GaugeLabels = (props) => { // success case
            return <div className="gauge__labels">
                <div className="gauge__label">
                    <span className="text-muted">
                        {
                            /* # Translators: variable %s shows what percentage of indicators have no targets reporting data. Example: 31% unavailable */
                            interpolate(gettext('%(percentNonReporting)s% unavailable'), {percentNonReporting}, true)
                        }
                    </span>
                    {' '}
                    <a href="#"
                       tabIndex="0"
                       data-toggle="popover"
                       data-placement="right"
                       data-trigger="focus"
                       data-content={
                           /* # Translators: help text for the percentage of indicators with no targets reporting data. */
                           gettext("The indicator has no targets, no completed target periods, or no results reported.")
                       }
                       onClick={e => e.preventDefault()}
                    ><i className="far fa-question-circle"/></a>
                </div>
                <div className="gauge__label">
                    <span className="gauge__value--above filter-trigger--band"
                        onClick={ e => this.onFilterLinkClick(e, IndicatorFilterType.aboveTarget) }
                        dangerouslySetInnerHTML={ aboveTargetMarkup() }>
                    </span>
                </div>
                <div className="gauge__label">
                    <span className="gauge__value filter-trigger--band"
                        onClick={ e => this.onFilterLinkClick(e, IndicatorFilterType.onTarget) }
                        dangerouslySetInnerHTML={ onTargetMarkup() }>
                    </span>
                    {' '}
                    <a href="#"
                       tabIndex="0"
                       data-toggle="popover"
                       data-placement="right"
                       data-trigger="focus"
                       data-content={
                           /* # Translators: Help text explaining what an "on track" indicator is. */
                           gettext("The actual value matches the target value, plus or minus 15%. So if your target is 100 and your result is 110, the indicator is 10% above target and on track.  <br><br>Please note that if your indicator has a decreasing direction of change, then “above” and “below” are switched. In that case, if your target is 100 and your result is 200, your indicator is 50% below target and not on track.<br><br><a href='https://docs.google.com/document/d/1Gl9bxJJ6hdhCXeoOCoR1mnVKZa2FlEOhaJcjexiHzY0' target='_blank'>See our documentation for more information.</a>")
                       }
                       onClick={e => e.preventDefault()}
                    ><i className="far fa-question-circle"/></a>
                </div>
                <div className="gauge__label">
                    <span className="gauge__value--below filter-trigger--band"
                        onClick={ e => this.onFilterLinkClick(e, IndicatorFilterType.belowTarget) }
                        dangerouslySetInnerHTML={belowTargetMarkup()}>
                    </span>
                </div>
            </div>
        }


        // Handle strings containing HTML markup

        const aboveTargetMarkup = () => {
            /* # Translators: variable %(percentHigh)s shows what percentage of indicators are a certain percentage above target percent %(marginPercent)s. Example: 31% are >15% above target */
            let s = gettext('<strong>%(percentHigh)s%</strong> are >%(marginPercent)s% above target');
            return {__html: interpolate(s, {percentHigh, marginPercent}, true)};
        };

        const onTargetMarkup = () => {
            /* # Translators: variable %s shows what percentage of indicators are within a set range of target. Example: 31%  are on track */
            let s = gettext('<strong>%s%</strong> are on track');
            return {__html: interpolate(s, [percentOnTarget])};
        };

        const belowTargetMarkup = () => {
            /* # Translators: variable %(percentBelow)s shows what percentage of indicators are a certain percentage below target. The variable %(marginPercent)s is that percentage. Example: 31% are >15% below target */
            let s = gettext('<strong>%(percentBelow)s%</strong> are >%(marginPercent)s% below target');
            return {__html: interpolate(s, {percentBelow, marginPercent}, true)};
        };


        return <Gauge>
            <div className="gauge__graphic gauge__graphic--performance-band">
                <div className="graphic__tick-marks">
                    {[...Array(tickCount)].map((e, i) => <div key={i} className="graphic__tick" />)}
                </div>
                <div className="graphic__performance-band--above-target"
                     style={{'flexBasis': `${percentHigh}%`}}/>
                <div className="graphic__performance-band--on-target"
                     style={{'flexBasis': `${percentOnTarget}%`}}/>
                <div className="graphic__performance-band--below-target"
                     style={{'flexBasis': `${percentBelow}%`}}/>
            </div>
            { gaugeHasErrors ?
                <div className="gauge__labels">
                    <div className="gauge__label">
                        {
                            /* # Translators: message describing why this display does not show any data. # */}
                        <p className="text-muted">{gettext("Unavailable until the first target period ends with results reported.")}</p>
                    </div>
                </div>
            : <GaugeLabels />}
        </Gauge>;
    }
}


export const ProgramMetrics = observer(function (props) {
    const program = props.rootStore.program;
    const indicatorStore = props.rootStore.indicatorStore;
    const indicators = indicatorStore.indicators;

    const currentIndicatorFilter = props.uiStore.currentIndicatorFilter;

    const indicatorOnScopeMargin = this.props.indicatorOnScopeMargin;

    // Use objs for labels below to allow for translator notes to be added

    const targetLabels = {
        /* # Translators: title of a graphic showing indicators with targets */
        title: gettext("Indicators with targets"),

        /* # Translators: a label in a graphic. Example: 31% have targets */
        filledLabel: gettext("have targets"),

        /* # Translators: a label in a graphic. Example: 31% no targets */
        unfilledLabel: gettext("no targets"),

        /* # Translators: a link that displays a filtered list of indicators which are missing targets */
        cta: gettext("Indicators missing targets"),

        emptyLabel: gettext("No targets"),
    };

    const resultsLabels = {
        /* # Translators: title of a graphic showing indicators with results */
        title: gettext("Indicators with results"),

        /* # Translators: a label in a graphic. Example: 31% have results */
        filledLabel: gettext("have results"),

        /* # Translators: a label in a graphic. Example: 31% no results */
        unfilledLabel: gettext("no results"),

        /* # Translators: a link that displays a filtered list of indicators which are missing results */
        cta: gettext("Indicators missing results"),

        emptyLabel: gettext("No results"),
    };

    const evidenceLabels = {
        /* # Translators: title of a graphic showing results with evidence */
        title: gettext("Results with evidence"),

        /* # Translators: a label in a graphic. Example: 31% have evidence */
        filledLabel: gettext("have evidence"),

        /* # Translators: a label in a graphic. Example: 31% no evidence */
        unfilledLabel: gettext("no evidence"),

        /* # Translators: a link that displays a filtered list of indicators which are missing evidence */
        cta: gettext("Indicators missing evidence"),

        emptyLabel: gettext("No evidence"),
    };

    // Are some targets defined on any indicators?
    // all_targets_defined is an int (1,0) instead of bool
    const someTargetsDefined = indicators.map(i => i.all_targets_defined === 1).some(b => b);

    // Do any indicators have results?
    const someResults = indicators.map(i => i.results_count).some(count => count > 0);

    // Do not display on pages with no indicators
    if (indicators.length === 0) return null;

    return <div className="status__gauges">

            <GaugeBand currentIndicatorFilter={currentIndicatorFilter}
                       indicatorOnScopeMargin={indicatorOnScopeMargin}
                       indicatorStore={indicatorStore}
                       program={program}
            />

            <GaugeTank filterType={IndicatorFilterType.missingTarget}
                       currentIndicatorFilter={currentIndicatorFilter}

                       allIndicatorsLength={indicators.length}
                       filteredIndicatorsLength={indicatorStore.getIndicatorsNeedingTargets.length}
                       {...targetLabels}

                       />

            <GaugeTank filterType={IndicatorFilterType.missingResults}
                       currentIndicatorFilter={currentIndicatorFilter}

                       allIndicatorsLength={indicators.length}
                       filteredIndicatorsLength={indicatorStore.getIndicatorsNeedingResults.length}

                       disabled={! someTargetsDefined}

                       {...resultsLabels}

                       />

            <GaugeTank filterType={IndicatorFilterType.missingEvidence}
                       currentIndicatorFilter={currentIndicatorFilter}
                       // The names below are misleading as this gauge is measuring *results*, not indicators
                       allIndicatorsLength={indicatorStore.getTotalResultsCount}
                       filteredIndicatorsLength={indicatorStore.getTotalResultsCount - indicatorStore.getTotalResultsWithEvidenceCount}

                       disabled={! someTargetsDefined || ! someResults}

                       {...evidenceLabels}
                       />

        </div>
});
